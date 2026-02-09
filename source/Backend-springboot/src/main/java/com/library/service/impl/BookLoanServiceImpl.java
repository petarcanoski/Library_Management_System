package com.library.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.library.domain.BookLoanStatus;
import com.library.domain.BookLoanType;
import com.library.exception.BookException;
import com.library.exception.BookLoanException;
import com.library.exception.SubscriptionException;
import com.library.exception.UserException;
import com.library.mapper.BookLoanMapper;
import com.library.model.Book;
import com.library.model.BookLoan;
import com.library.model.User;
import com.library.payload.CheckoutStatistics;
import com.library.payload.dto.BookLoanDTO;
import com.library.payload.dto.SubscriptionDTO;
import com.library.payload.request.BookLoanSearchRequest;
import com.library.payload.request.CheckinRequest;
import com.library.payload.request.CheckoutRequest;
import com.library.payload.request.RenewalRequest;
import com.library.payload.response.PageResponse;
import com.library.repository.BookLoanRepository;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import com.library.service.BookLoanService;
import com.library.service.ReservationService;
import com.library.service.SubscriptionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * Implementation of BookLoanService interface.
 * Handles all business logic for checkout/check-in operations.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class BookLoanServiceImpl implements BookLoanService {

    private final BookLoanRepository bookLoanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookLoanMapper bookLoanMapper;
    private final FineCalculationService fineCalculationService;
    private final SubscriptionService subscriptionService;

    private ReservationService reservationService; // Lazy injection to avoid circular dependency

    // Business rules constants - now overridden by subscription limits
    private static final int MAX_ACTIVE_CHECKOUTS = 5;
    private static final int DEFAULT_CHECKOUT_DAYS = 14;



    // Setter injection for ReservationService to avoid circular dependency
    public void setReservationService(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // ==================== CHECKOUT OPERATIONS ====================

    @Override
    public BookLoanDTO checkoutBook(CheckoutRequest checkoutRequest)
            throws BookLoanException, BookException, UserException {
        User currentUser = getCurrentAuthenticatedUser();
        return checkoutBookForUser(currentUser.getId(), checkoutRequest);
    }

    @Override
    public BookLoanDTO checkoutBookForUser(Long userId,
                                           CheckoutRequest checkoutRequest)
            throws BookLoanException, BookException, UserException {

        // 1. Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found with id: " + userId));

        // 2. Validate user has active subscription
        SubscriptionDTO subscription;
        try {
            subscription = subscriptionService.getUsersActiveSubscription(userId);
        } catch (SubscriptionException e) {
            throw new BookLoanException(
                "No active subscription found. Please subscribe to checkout books. " +
                "Visit /api/subscriptions/subscribe to get started.", e);
        }



        // 3. Validate book exists and is available
        Book book = bookRepository.findById(checkoutRequest.getBookId())
                .orElseThrow(() -> new BookException("Book not found with id: " + checkoutRequest.getBookId()));

        if (!book.getActive()) {
            throw new BookLoanException("Book is not active and cannot be checked out");
        }

        if (book.getAvailableCopies() <= 0) {
            throw new BookLoanException("Book is not available for checkout. No copies available.");
        }

        // 4. Check if user already has this book checked out
        if (bookLoanRepository.hasActiveCheckout(userId, book.getId())) {
            throw new BookLoanException("User already has this book checked out");
        }

        // 5. Check user's active checkout limit (enforced by subscription)
        long activeCheckouts = bookLoanRepository.countActiveBookLoansByUser(userId);
        int maxBooksAllowed = subscription.getMaxBooksAllowed();

        if (activeCheckouts >= maxBooksAllowed) {
            throw new BookLoanException(
                "You have reached your subscription limit of " + maxBooksAllowed + " active checkouts. " +
                "Your current plan: " + subscription.getPlanName() + ". " +
                "Please return books or upgrade your subscription for more checkouts.");
        }

        // 6. Check for overdue books
        long overdueCount = bookLoanRepository.countOverdueBookLoansByUser(userId);
        if (overdueCount > 0) {
            throw new BookLoanException(
                    "User has " + overdueCount + " overdue book(s). Cannot checkout until books are returned.");
        }

        // 7. Check for unpaid fines


        // 8. Create book loan
        BookLoan bookLoan = new BookLoan();
        bookLoan.setUser(user);
        bookLoan.setBook(book);
        bookLoan.setType(BookLoanType.CHECKOUT);
        bookLoan.setStatus(BookLoanStatus.CHECKED_OUT);
        bookLoan.setCheckoutDate(LocalDate.now());

        // Use subscription's maxDaysPerBook if no specific checkout days requested
        int checkoutDays = checkoutRequest.getCheckoutDays() != null
                ? Math.min(checkoutRequest.getCheckoutDays(), subscription.getMaxDaysPerBook())
                : subscription.getMaxDaysPerBook();
        bookLoan.setDueDate(LocalDate.now().plusDays(checkoutDays));

        bookLoan.setRenewalCount(0);
        bookLoan.setMaxRenewals(2);

        bookLoan.setNotes(checkoutRequest.getNotes());
        bookLoan.setIsOverdue(false);
        bookLoan.setOverdueDays(0);

        // 9. Update book available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // 10. Save book loan
        BookLoan savedBookLoan = bookLoanRepository.save(bookLoan);

        return bookLoanMapper.toDTO(savedBookLoan);
    }

    // ==================== CHECKIN OPERATIONS ====================

    @Override
    public BookLoanDTO checkinBook(CheckinRequest checkinRequest) throws BookLoanException {

        // 1. Validate book loan exists
        BookLoan bookLoan = bookLoanRepository.findById(checkinRequest.getBookLoanId())
                .orElseThrow(() -> new BookLoanException(
                        "Book loan not found with id: " + checkinRequest.getBookLoanId()));

        // 2. Check if already returned
        if (!bookLoan.isActive()) {
            throw new BookLoanException("Book has already been returned");
        }

        // 3. Set return date
        bookLoan.setReturnDate(LocalDate.now());

        // 4. Update status based on condition
        BookLoanStatus condition = checkinRequest.getCondition();
        if (condition == null) {
            condition = BookLoanStatus.RETURNED;
        }

        // Validate condition is a valid return status
        if (condition != BookLoanStatus.RETURNED
            && condition != BookLoanStatus.LOST
            && condition != BookLoanStatus.DAMAGED) {
            throw new BookLoanException("Invalid return condition. Must be RETURNED, LOST, or DAMAGED");
        }

        bookLoan.setStatus(condition);

        // 5. Calculate and apply fines
        BigDecimal fine = BigDecimal.ZERO;

        // Overdue fine
        if (LocalDate.now().isAfter(bookLoan.getDueDate())) {
            fine = fineCalculationService.calculateOverdueFine(bookLoan);
            int overdueDays = fineCalculationService.calculateOverdueDays(
                    bookLoan.getDueDate(), LocalDate.now());
            bookLoan.setOverdueDays(overdueDays);
        }

        // Additional penalties
        boolean isLost = (condition == BookLoanStatus.LOST);
        boolean isDamaged = (condition == BookLoanStatus.DAMAGED);


        bookLoan.setIsOverdue(false); // No longer overdue once returned

        // 6. Update notes
        if (checkinRequest.getNotes() != null) {
            String existingNotes = bookLoan.getNotes() != null ? bookLoan.getNotes() + "\n" : "";
            bookLoan.setNotes(existingNotes + "Return: " + checkinRequest.getNotes());
        }

        // 7. Update book available copies (only if not lost)
        if (condition != BookLoanStatus.LOST) {
            Book book = bookLoan.getBook();
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);

            // 7a. Process next reservation if book became available
            processNextReservation(book.getId());
        }

        // 8. Save book loan
        BookLoan savedBookLoan = bookLoanRepository.save(bookLoan);

        return bookLoanMapper.toDTO(savedBookLoan);
    }

    // ==================== RENEWAL OPERATIONS ====================

    @Override
    public BookLoanDTO renewCheckout(RenewalRequest renewalRequest) throws BookLoanException {

        // 1. Validate book loan exists
        BookLoan bookLoan = bookLoanRepository.findById(renewalRequest.getBookLoanId())
                .orElseThrow(() -> new BookLoanException(
                        "Book loan not found with id: " + renewalRequest.getBookLoanId()));

        // 2. Check if can be renewed
        if (!bookLoan.canRenew()) {
            if (bookLoan.getIsOverdue()) {
                throw new BookLoanException("Cannot renew overdue book. Please return it.");
            }
            if (bookLoan.getRenewalCount() >= bookLoan.getMaxRenewals()) {
                throw new BookLoanException(
                        "Maximum renewal limit reached (" + bookLoan.getMaxRenewals() + ")");
            }
            throw new BookLoanException("Book cannot be renewed");
        }

        // 3. Update due date
        int extensionDays = renewalRequest.getExtensionDays() != null
                ? renewalRequest.getExtensionDays()
                : DEFAULT_CHECKOUT_DAYS;
        bookLoan.setDueDate(bookLoan.getDueDate().plusDays(extensionDays));

        // 4. Increment renewal count
        bookLoan.setRenewalCount(bookLoan.getRenewalCount() + 1);

        // 5. Update notes
        if (renewalRequest.getNotes() != null) {
            String existingNotes = bookLoan.getNotes() != null ? bookLoan.getNotes() + "\n" : "";
            bookLoan.setNotes(existingNotes + "Renewal: " + renewalRequest.getNotes());
        }

        // 6. Save book loan
        BookLoan savedBookLoan = bookLoanRepository.save(bookLoan);

        return bookLoanMapper.toDTO(savedBookLoan);
    }

    // ==================== QUERY OPERATIONS ====================

    @Override
    public BookLoanDTO getBookLoanById(Long bookLoanId) throws BookLoanException {
        BookLoan bookLoan = bookLoanRepository.findById(bookLoanId)
                .orElseThrow(() -> new BookLoanException("Book loan not found with id: " + bookLoanId));
        return bookLoanMapper.toDTO(bookLoan);
    }

    @Override
    public PageResponse<BookLoanDTO> getMyBookLoans(BookLoanStatus status, int page, int size) {
        User currentUser = getCurrentAuthenticatedUser();
        return getUserBookLoans(currentUser.getId(), status, page, size);
    }

    @Override
    public PageResponse<BookLoanDTO> getUserBookLoans(Long userId,
                                                      BookLoanStatus status,
                                                      int page, int size) {
        User currentUser = getCurrentAuthenticatedUser();
        Page<BookLoan> bookLoanPage;

        if (status!=null) {
            // Return only active checkouts, sorted by due date
            Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
            bookLoanPage = bookLoanRepository.findByStatusAndUser(
                    status, currentUser, pageable);
        } else {
            // Return all history (both active and returned), sorted by creation date descending
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            bookLoanPage = bookLoanRepository.findByUserId(userId, pageable);
        }

        return convertToPageResponse(bookLoanPage);
    }






    @Override
    public PageResponse<BookLoanDTO> getBookLoans(BookLoanSearchRequest searchRequest) {

        // 1️⃣ Build pageable with sorting, size, etc.
        Pageable pageable = createPageable(
                searchRequest.getPage(),
                searchRequest.getSize(),
                searchRequest.getSortBy(),
                searchRequest.getSortDirection()
        );

        Page<BookLoan> bookLoanPage;

        // 2️⃣ Apply filtering logic dynamically
        if (Boolean.TRUE.equals(searchRequest.getOverdueOnly())) {
            // Fetch overdue loans
            bookLoanPage = bookLoanRepository.findOverdueBookLoans(LocalDate.now(), pageable);
        }

        else if (searchRequest.getUserId() != null) {
            // Fetch loans by specific user
            bookLoanPage = bookLoanRepository.findByUserId(searchRequest.getUserId(), pageable);
        }
        else if (searchRequest.getBookId() != null) {
            // Fetch loans by specific book
            bookLoanPage = bookLoanRepository.findByBookId(searchRequest.getBookId(), pageable);
        }
        else if (searchRequest.getStatus() != null) {
            // Fetch loans by loan status
            bookLoanPage = bookLoanRepository.findByStatus(searchRequest.getStatus(), pageable);
        }
        else if (searchRequest.getStartDate() != null && searchRequest.getEndDate() != null) {
            // Fetch loans within date range
            bookLoanPage = bookLoanRepository.findBookLoansByDateRange(
                    searchRequest.getStartDate(),
                    searchRequest.getEndDate(),
                    pageable
            );
        }
        else {
            // Default: return all loans
            bookLoanPage = bookLoanRepository.findAll(pageable);
        }

        // 3️⃣ Convert entities to DTOs and wrap in response object
        return convertToPageResponse(bookLoanPage);
    }



    // ==================== ADMIN OPERATIONS ====================

    @Override
    public BookLoanDTO updateBookLoan(Long bookLoanId, com.library.payload.request.UpdateBookLoanRequest updateRequest) throws BookLoanException {
        // 1. Validate book loan exists
        BookLoan bookLoan = bookLoanRepository.findById(bookLoanId)
                .orElseThrow(() -> new BookLoanException("Book loan not found with id: " + bookLoanId));

        // 2. Update fields if provided (null values are ignored)
        if (updateRequest.getStatus() != null) {
            bookLoan.setStatus(updateRequest.getStatus());
        }

        if (updateRequest.getDueDate() != null) {
            bookLoan.setDueDate(updateRequest.getDueDate());
        }

        if (updateRequest.getReturnDate() != null) {
            bookLoan.setReturnDate(updateRequest.getReturnDate());
        }

        if (updateRequest.getMaxRenewals() != null) {
            bookLoan.setMaxRenewals(updateRequest.getMaxRenewals());
        }



        if (updateRequest.getNotes() != null) {
            String existingNotes = bookLoan.getNotes() != null ? bookLoan.getNotes() + "\n" : "";
            bookLoan.setNotes(existingNotes + "Admin update: " + updateRequest.getNotes());
        }

        // 3. Save and return
        BookLoan savedBookLoan = bookLoanRepository.save(bookLoan);
        return bookLoanMapper.toDTO(savedBookLoan);
    }

    @Override
    public int updateOverdueBookLoans() {
        Pageable pageable = PageRequest.of(0, 1000); // Process in batches
        Page<BookLoan> overduePage = bookLoanRepository.findOverdueBookLoans(LocalDate.now(), pageable);

        int updateCount = 0;
        for (BookLoan bookLoan : overduePage.getContent()) {
            if (bookLoan.getStatus() == BookLoanStatus.CHECKED_OUT) {
                bookLoan.setStatus(BookLoanStatus.OVERDUE);
                bookLoan.setIsOverdue(true);

                // Calculate overdue days
                int overdueDays = fineCalculationService.calculateOverdueDays(
                        bookLoan.getDueDate(), LocalDate.now());
                bookLoan.setOverdueDays(overdueDays);

                // Calculate fine
                BigDecimal fine = fineCalculationService.calculateOverdueFine(bookLoan);


                bookLoanRepository.save(bookLoan);
                updateCount++;
            }
        }

        return updateCount;
    }

    @Override
    public CheckoutStatistics getCheckoutStatistics() {
        long totalCheckouts = bookLoanRepository.count();

        long activeCheckouts = bookLoanRepository.findAll().stream()
                .filter(BookLoan::isActive)
                .count();

        long overdueCheckouts = bookLoanRepository
                .findOverdueBookLoans(LocalDate.now(), PageRequest.of(0, Integer.MAX_VALUE))
                .getTotalElements();

        long totalReturns = bookLoanRepository.findByStatus(
                BookLoanStatus.RETURNED, PageRequest.of(0, Integer.MAX_VALUE))
                .getTotalElements();

        return new CheckoutStatistics(
                totalCheckouts,
                activeCheckouts,
                overdueCheckouts,
                totalReturns,
               null,
                0
        );
    }

    // ==================== HELPER METHODS ====================

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Authenticated user not found");
        }
        return user;
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDirection) {
        size = Math.min(size, 100);
        size = Math.max(size, 1);

        Sort sort = sortDirection.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return PageRequest.of(page, size, sort);
    }

    private PageResponse<BookLoanDTO> convertToPageResponse(Page<BookLoan> bookLoanPage) {
        List<BookLoanDTO> bookLoanDTOs = bookLoanPage.getContent()
                .stream()
                .map(bookLoanMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                bookLoanDTOs,
                bookLoanPage.getNumber(),
                bookLoanPage.getSize(),
                bookLoanPage.getTotalElements(),
                bookLoanPage.getTotalPages(),
                bookLoanPage.isLast(),
                bookLoanPage.isFirst(),
                bookLoanPage.isEmpty()
        );
    }

    /**
     * Process next reservation when book becomes available
     */
    private void processNextReservation(Long bookId) {
        if (reservationService != null) {
            try {
                reservationService.processNextReservation(bookId);
            } catch (Exception e) {
                // Log but don't fail the check-in process
                System.err.println("Failed to process reservation for book " + bookId + ": " + e.getMessage());
            }
        }
    }
}
