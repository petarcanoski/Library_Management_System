package com.library.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.library.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.library.domain.BookLoanStatus;
import com.library.domain.ReservationStatus;
import com.library.domain.UserRole;
import com.library.exception.BookException;
import com.library.exception.ReservationException;
import com.library.exception.UserException;
import com.library.mapper.ReservationMapper;
import com.library.model.Book;
import com.library.model.Reservation;
import com.library.model.User;
import com.library.payload.dto.ReservationDTO;
import com.library.payload.request.CheckoutRequest;
import com.library.payload.request.ReservationRequest;
import com.library.payload.request.ReservationSearchRequest;
import com.library.payload.response.PageResponse;
import com.library.repository.BookLoanRepository;
import com.library.repository.BookRepository;
import com.library.repository.ReservationRepository;
import com.library.repository.UserRepository;
import com.library.service.BookLoanService;
import com.library.service.EmailService;
import com.library.service.ReservationService;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of ReservationService for managing book reservations
 */
@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private static final Logger logger = LoggerFactory.getLogger(ReservationServiceImpl.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    private static final int MAX_ACTIVE_RESERVATIONS = 5; // Max active reservations per user
    private static final int HOLD_PERIOD_HOURS = 48; // Hours to hold book after becoming available

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;
    private final EmailService emailService;
    private final BookLoanRepository bookLoanRepository;
    private final BookLoanService bookLoanService;
    private final UserService userService;


    @Override
    @Transactional
    public ReservationDTO createReservation(ReservationRequest request)
            throws ReservationException, BookException, UserException {

        // 1️⃣ Get current user
        User user = userService.getCurrentUser();

        // 2️⃣ Find book by ISBN (THIS IS THE KEY)
        Book book = bookRepository.findByIsbn(request.getIsbn())
                .orElseThrow(() ->
                        new BookException("Book with ISBN " + request.getIsbn() + " not found")
                );

        // 3️⃣ Business rules (example)
        if (book.getAvailableCopies() > 0) {
            throw new ReservationException("Book is currently available, reservation not required");
        }

        // 4️⃣ Prevent duplicate reservations
        if (reservationRepository.existsByUserAndBookAndStatusIn(
                user,
                book,
                List.of(ReservationStatus.PENDING, ReservationStatus.AVAILABLE)
        )) {
            throw new ReservationException("You already have a reservation for this book");
        }

        // 5️⃣ Create reservation
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setNotes(request.getNotes());

// ✅ REQUIRED FIELDS
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setNotificationSent(false);

// queue position
        long pendingCount =
                reservationRepository.countPendingReservationsByBook(book.getId());
        reservation.setQueuePosition((int) pendingCount + 1);

        reservationRepository.save(reservation);


        return reservationMapper.toDTO(reservation);
    }


//    @Override
//    @Transactional
//    public ReservationDTO createReservation(ReservationRequest reservationRequest)
//        throws ReservationException, BookException, UserException {
//        User user = getCurrentUser();
//        return createReservationForUser(user.getId(), reservationRequest);
//    }

    @Override
    @Transactional
    public ReservationDTO createReservationForUser(
            Long userId,
            ReservationRequest reservationRequest)
        throws ReservationException, BookException, UserException {


        Book book1 = bookRepository.findByIsbn(reservationRequest.getIsbn()).get();

        boolean alreadyHasLoan = bookLoanRepository
                .existsByUserIdAndBookIdAndStatus(
                        userId, book1.getId(),
                        BookLoanStatus.CHECKED_OUT);

        if(alreadyHasLoan) {
            throw new BookException("You already have loan On this book!");
        }


        // 1. Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserException("User not found with ID: " + userId));

        // 2. Validate book exists
        Book book = bookRepository.findById(book1.getId())
            .orElseThrow(() -> new BookException("Book not found with ID: " + book1.getId()));

        if (!book.getActive()) {
            throw new BookException("Book is not active");
        }

        // 3. Check if user already has active reservation for this book
        if (reservationRepository.hasActiveReservation(userId, book.getId())) {
            throw new ReservationException("You already have an active reservation for this book");
        }

        // 4. Check if book is already available (has copies)
        if (book.getAvailableCopies() > 0) {
            throw new ReservationException("Book is currently available. Please check it out directly instead of reserving.");
        }

        // 5. Check user's active reservation limit
        long activeReservations = reservationRepository.countActiveReservationsByUser(userId);
        if (activeReservations >= MAX_ACTIVE_RESERVATIONS) {
            throw new ReservationException("Maximum active reservations limit reached (" + MAX_ACTIVE_RESERVATIONS + ")");
        }

        // 6. Create reservation
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setNotificationSent(false);
        reservation.setNotes(reservationRequest.getNotes());

        // Calculate queue position
        long pendingCount = reservationRepository
        .countPendingReservationsByBook(book.getId());
        reservation.setQueuePosition((int) (pendingCount + 1));

        Reservation savedReservation = reservationRepository.save(reservation);

        logger.info("Reservation created for user {} and book {} (Queue position: {})",
            userId, book.getId(), reservation.getQueuePosition());

        return reservationMapper.toDTO(savedReservation);
    }

    @Override
    @Transactional
    public ReservationDTO cancelReservation(Long reservationId) throws ReservationException {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new ReservationException("Reservation not found with ID: " + reservationId));

        // Verify current user owns this reservation (unless admin)
        User currentUser = getCurrentUser();
        if (
                !reservation.getUser().getId().equals(currentUser.getId())
                        && currentUser.getRole()!= UserRole.ROLE_ADMIN
        ) {

            throw new ReservationException("You can only cancel your own reservations");
        }

        if (!reservation.canBeCancelled()) {
            throw new ReservationException("Reservation cannot be cancelled (current status: " + reservation.getStatus() + ")");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancelledAt(LocalDateTime.now());

        Reservation savedReservation = reservationRepository.save(reservation);

        // Update queue positions for remaining reservations
        updateQueuePositions(reservation.getBook().getId());

        logger.info("Reservation {} cancelled by user {}", reservationId, currentUser.getId());

        return reservationMapper.toDTO(savedReservation);
    }

    @Override
    @Transactional
    public ReservationDTO fulfillReservation(Long reservationId) throws ReservationException, BookException, UserException {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new ReservationException("Reservation not found with ID: " + reservationId));

        if (reservation.getBook().getAvailableCopies()<=0) {
            throw new ReservationException("Reservation is not available for pickup (current status: " + reservation.getStatus() + ")");
        }

        reservation.setStatus(ReservationStatus.FULFILLED);
        reservation.setFulfilledAt(LocalDateTime.now());

        Reservation savedReservation = reservationRepository.save(reservation);

        logger.info("Reservation {} fulfilled", reservationId);

        CheckoutRequest request = new CheckoutRequest();
        request.setBookId(reservation.getBook().getId());
        request.setNotes("Assign Booked by Admin");

        bookLoanService.checkoutBookForUser(reservation.getUser().getId(),request);

        return reservationMapper.toDTO(savedReservation);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationDTO getReservationById(Long reservationId) throws ReservationException {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new ReservationException("Reservation not found with ID: " + reservationId));

        return reservationMapper.toDTO(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReservationDTO> searchReservations(ReservationSearchRequest searchRequest) {
        Pageable pageable = createPageable(searchRequest);

        Page<Reservation> reservationPage = reservationRepository.searchReservationsWithFilters(
            searchRequest.getUserId(),
            searchRequest.getBookId(),
            searchRequest.getStatus(),
            searchRequest.getActiveOnly() != null ? searchRequest.getActiveOnly() : false,
            pageable
        );

        return buildPageResponse(reservationPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReservationDTO> getMyReservations(ReservationSearchRequest searchRequest) {
        User user = getCurrentUser();
        searchRequest.setUserId(user.getId()); // Override userId with current user
        return searchReservations(searchRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public int getQueuePosition(Long reservationId) throws ReservationException {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new ReservationException("Reservation not found with ID: " + reservationId));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            return 0; // Not in queue
        }

        return reservation.getQueuePosition() != null ? reservation.getQueuePosition() : 0;
    }

    @Override
    @Transactional
    public void processNextReservation(Long bookId) {
        logger.info("Processing next reservation for book ID: {}", bookId);

        // Get next pending reservation
        var nextReservationOpt = reservationRepository.findNextPendingReservation(bookId);

        if (nextReservationOpt.isEmpty()) {
            logger.info("No pending reservations for book ID: {}", bookId);
            return;
        }

        Reservation reservation = nextReservationOpt.get();

        // Mark as available
        reservation.setStatus(ReservationStatus.AVAILABLE);
        reservation.setAvailableAt(LocalDateTime.now());
        reservation.setAvailableUntil(LocalDateTime.now().plusHours(HOLD_PERIOD_HOURS));
        reservation.setNotificationSent(false);

        reservationRepository.save(reservation);

        // Send notification email
        sendAvailabilityNotification(reservation);

        // Update queue positions
        updateQueuePositions(bookId);

        logger.info("Reservation {} marked as available for user {}", reservation.getId(), reservation.getUser().getId());
    }

    @Override
    @Transactional
    public int expireOldReservations() {
        logger.info("Starting to expire old reservations");

        List<Reservation> expiredReservations = reservationRepository.findExpiredReservations(LocalDateTime.now());

        for (Reservation reservation : expiredReservations) {
            reservation.setStatus(ReservationStatus.EXPIRED);
            reservation.setCancelledAt(LocalDateTime.now());
            reservationRepository.save(reservation);

            // Process next reservation for this book
            processNextReservation(reservation.getBook().getId());
        }

        logger.info("Expired {} reservation(s)", expiredReservations.size());
        return expiredReservations.size();
    }

    @Override
    @Transactional
    public void updateQueuePositions(Long bookId) {
        List<Reservation> pendingReservations = reservationRepository.findPendingReservationsByBook(bookId);

        int position = 1;
        for (Reservation reservation : pendingReservations) {
            reservation.setQueuePosition(position++);
            reservationRepository.save(reservation);
        }

        logger.info("Updated queue positions for {} reservation(s) of book ID: {}", pendingReservations.size(), bookId);
    }

    // ==================== HELPER METHODS ====================

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Authenticated user not found");
        }
        return user;
    }

    private PageResponse<ReservationDTO> buildPageResponse(Page<Reservation> reservationPage) {
        List<ReservationDTO> dtos = reservationPage.getContent().stream()
            .map(reservationMapper::toDTO)
            .toList();

        PageResponse<ReservationDTO> response = new PageResponse<>();
        response.setContent(dtos);
        response.setPageNumber(reservationPage.getNumber());
        response.setPageSize(reservationPage.getSize());
        response.setTotalElements(reservationPage.getTotalElements());
        response.setTotalPages(reservationPage.getTotalPages());
        response.setLast(reservationPage.isLast());

        return response;
    }

    private Pageable createPageable(ReservationSearchRequest searchRequest) {
        Sort sort = "ASC".equalsIgnoreCase(searchRequest.getSortDirection())
                ? Sort.by(searchRequest.getSortBy()).ascending()
                : Sort.by(searchRequest.getSortBy()).descending();

        return PageRequest.of(searchRequest.getPage(), searchRequest.getSize(), sort);
    }

    private void sendAvailabilityNotification(Reservation reservation) {
        try {
            String userEmail = reservation.getUser().getEmail();
            String userName = reservation.getUser().getFullName();
            String bookTitle = reservation.getBook().getTitle();
            String availableUntil = reservation.getAvailableUntil().format(DATE_FORMATTER);

            emailService.sendReservationAvailableNotification(
                userEmail,
                userName,
                bookTitle,
                availableUntil,
                HOLD_PERIOD_HOURS
            );

            reservation.setNotificationSent(true);
            reservationRepository.save(reservation);

            logger.info("Availability notification sent to {} for book: {}", userEmail, bookTitle);
        } catch (Exception e) {
            logger.error("Failed to send availability notification for reservation: {}", reservation.getId(), e);
        }
    }
}
