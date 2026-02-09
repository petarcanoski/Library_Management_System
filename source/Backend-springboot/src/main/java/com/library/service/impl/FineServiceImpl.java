package com.library.service.impl;

import com.library.domain.FineStatus;
import com.library.domain.FineType;
import com.library.domain.PaymentGateway;
import com.library.domain.PaymentType;
import com.library.exception.FineException;
import com.library.exception.BookLoanException;
import com.library.exception.PaymentException;
import com.library.mapper.FineMapper;
import com.library.model.BookLoan;
import com.library.model.Fine;
import com.library.model.User;
import com.library.payload.dto.FineDTO;
import com.library.payload.request.CreateFineRequest;
import com.library.payload.request.PaymentInitiateRequest;
import com.library.payload.request.WaiveFineRequest;
import com.library.payload.response.PageResponse;
import com.library.payload.response.PaymentInitiateResponse;
import com.library.repository.BookLoanRepository;
import com.library.repository.FineRepository;
import com.library.repository.UserRepository;
import com.library.service.FineService;
import com.library.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of FineService interface.
 * Handles all business logic for fine operations.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final BookLoanRepository bookLoanRepository;
    private final UserRepository userRepository;
    private final FineMapper fineMapper;
    private final PaymentService paymentService;


    // ==================== CREATE OPERATIONS ====================

    @Override
    public FineDTO createFine(CreateFineRequest createRequest) throws BookLoanException {
        // 1. Validate book loan exists
        BookLoan bookLoan = bookLoanRepository.findById(createRequest.getBookLoanId())
                .orElseThrow(() -> new BookLoanException(
                        "Book loan not found with id: " + createRequest.getBookLoanId()));

        // 2. Create fine
        Fine fine = Fine.builder()
                
                .bookLoan(bookLoan)
                .user(bookLoan.getUser())
                .type(createRequest.getType())
                .amount(createRequest.getAmount())
                .amountPaid(0L)
                .status(FineStatus.PENDING)
                .reason(createRequest.getReason())
                .notes(createRequest.getNotes()).build();

        // 3. Save and return
        Fine savedFine = fineRepository.save(fine);
        log.info("Created fine: {} for book loan: {}", savedFine.getId(), bookLoan.getId());
        return fineMapper.toDTO(savedFine);
    }






    // ==================== PAYMENT OPERATIONS ====================

    @Override
    public PaymentInitiateResponse payFineFully(Long fineId, String transactionId) throws FineException, PaymentException {
        // 1. Validate fine exists
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new FineException("Fine not found with id: " + fineId));

        // 2. Check if already paid
        if (fine.getStatus() == FineStatus.PAID) {
            throw new FineException("Fine is already fully paid");
        }

        if (fine.getStatus() == FineStatus.WAIVED) {
            throw new FineException("Fine has been waived and cannot be paid");
        }

        // 3. initiate payment
        User currentUser = getCurrentAuthenticatedUser();

        PaymentInitiateRequest context = PaymentInitiateRequest.builder()
                .userId(currentUser.getId())
                .fineId(fine.getId())
                .paymentType(PaymentType.FINE)
                .gateway(PaymentGateway.RAZORPAY)
                .amount(fine.getAmountOutstanding())
                .currency("INR")
                .description("Library fine payment for fine ID " + fine.getId())
                .build();

        // ✅ Delegate everything to PaymentService

        return paymentService.initiatePayment(context);
    }

    @Override
    @Transactional
    public void markFineAsPaid(Long fineId, Long amount, String transactionId) throws FineException {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new FineException(
                        "Fine not found with id: " + fineId));

        // Apply payment amount safely
        fine.applyPayment(amount);
        fine.setTransactionId(transactionId);
        fine.setStatus(FineStatus.PAID);
        fine.setUpdatedAt(LocalDateTime.now());

        fineRepository.save(fine);

        log.info("Fine {} marked as fully paid (txn: {})", fineId, transactionId);
    }


    // ==================== WAIVER OPERATIONS ====================

    @Override
    public FineDTO waiveFine(WaiveFineRequest waiveRequest) throws FineException {
        // 1. Validate fine exists
        Fine fine = fineRepository.findById(waiveRequest.getFineId())
                .orElseThrow(() -> new FineException("Fine not found with id: " + waiveRequest.getFineId()));

        // 2. Check if already waived or paid
        if (fine.getStatus() == FineStatus.WAIVED) {
            throw new FineException("Fine has already been waived");
        }

        if (fine.getStatus() == FineStatus.PAID) {
            throw new FineException("Fine has already been paid and cannot be waived");
        }

        // 3. Waive the fine
        User currentAdmin = getCurrentAuthenticatedUser();
        fine.waive(currentAdmin, waiveRequest.getReason());

        // 4. Save and return
        Fine savedFine = fineRepository.save(fine);
        log.info("Fine {} waived by admin: {}", fine.getId(), currentAdmin.getId());
        return fineMapper.toDTO(savedFine);
    }

    // ==================== QUERY OPERATIONS ====================

    @Override
    public FineDTO getFineById(Long fineId) throws FineException {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new FineException("Fine not found with id: " + fineId));
        return fineMapper.toDTO(fine);
    }

    @Override
    public List<FineDTO> getFinesByBookLoanId(Long bookLoanId) {
        List<Fine> fines = fineRepository.findByBookLoanId(bookLoanId);
        return fineMapper.toDTOList(fines);
    }

    @Override
    public List<FineDTO> getMyFines(FineStatus status, FineType type) {
        User currentUser = getCurrentAuthenticatedUser();
        List<Fine> fines;

        // Apply filters based on parameters
        if (status != null && type != null) {
            // Both filters
            fines = fineRepository.findByUserId(currentUser.getId()).stream()
                    .filter(f -> f.getStatus() == status && f.getType() == type)
                    .collect(Collectors.toList());
        } else if (status != null) {
            // Status filter only
            fines = fineRepository.findByUserId(currentUser.getId()).stream()
                    .filter(f -> f.getStatus() == status)
                    .collect(Collectors.toList());
        } else if (type != null) {
            // Type filter only
            fines = fineRepository.findByUserIdAndType(currentUser.getId(), type);
        } else {
            // No filter - all fines for user
            fines = fineRepository.findByUserId(currentUser.getId());
        }

        return fineMapper.toDTOList(fineRepository.findByUserId(currentUser.getId()));
    }

    @Override
    public PageResponse<FineDTO> getAllFines(FineStatus status,
                                             FineType type,
                                             Long userId,
                                             int page,
                                             int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending());

        Page<Fine> finePage = fineRepository.findAllWithFilters(
                userId,
                status,
                type,
                pageable
        );
        return convertToPageResponse(finePage);
    }

    // ==================== AGGREGATION OPERATIONS ====================

    @Override
    public Long getMyTotalUnpaidFines() {
        User currentUser = getCurrentAuthenticatedUser();
        return getTotalUnpaidFinesByUserId(currentUser.getId());
    }

    @Override
    public Long getTotalUnpaidFinesByUserId(Long userId) {
        return fineRepository.getTotalUnpaidFinesByUserId(userId);
    }

    @Override
    public Long getTotalCollectedFines() {
        return fineRepository.getTotalCollectedFines();
    }

    @Override
    public Long getTotalOutstandingFines() {
        return fineRepository.getTotalOutstandingFines();
    }

    // ==================== VALIDATION OPERATIONS ====================

    @Override
    public boolean hasUnpaidFines(Long userId) {
        return fineRepository.hasUnpaidFines(userId);
    }

    @Override
    public void deleteFine(Long fineId) throws FineException {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new FineException("Fine not found with id: " + fineId));
        fineRepository.delete(fine);
        log.warn("Fine {} deleted", fineId);
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

    private PageResponse<FineDTO> convertToPageResponse(Page<Fine> finePage) {
        List<FineDTO> fineDTOs = finePage.getContent()
                .stream()
                .map(fineMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                fineDTOs,
                finePage.getNumber(),
                finePage.getSize(),
                finePage.getTotalElements(),
                finePage.getTotalPages(),
                finePage.isLast(),
                finePage.isFirst(),
                finePage.isEmpty()
        );
    }
}
