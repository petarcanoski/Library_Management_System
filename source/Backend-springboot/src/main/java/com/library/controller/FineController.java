package com.library.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.domain.FineStatus;
import com.library.domain.FineType;
import com.library.exception.FineException;
import com.library.exception.PaymentException;
import com.library.payload.dto.FineDTO;
import com.library.payload.request.CreateFineRequest;
import com.library.payload.request.WaiveFineRequest;
import com.library.payload.response.ApiResponse;
import com.library.payload.response.PageResponse;
import com.library.payload.response.PaymentInitiateResponse;
import com.library.service.FineService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST Controller for Fine operations.
 * Handles fine creation, payment, waiving, and queries.
 */
@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
@Slf4j
public class FineController {

    private final FineService fineService;

    // ==================== CREATE OPERATIONS ====================

    /**
     * Create a new fine manually (Admin only)
     * POST /api/fines
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFine(@Valid @RequestBody CreateFineRequest createRequest) {
        try {
            log.info("Admin creating fine for book loan: {}", createRequest.getBookLoanId());
            FineDTO fine = fineService.createFine(createRequest);
            return new ResponseEntity<>(fine, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Failed to create fine", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== PAYMENT OPERATIONS ====================

    /**
     * Pay a fine fully
     * POST /api/fines/{id}/pay
     */
    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payFineFully(
        @PathVariable Long id, 
        @RequestParam(required = false) String transactionId) {
        try {
            log.info("Full payment request for fine: {}", id);
            PaymentInitiateResponse response = fineService
                    .payFineFully(id, transactionId);
            return ResponseEntity.ok(response);
        } catch (FineException e) {
            log.error("Payment failed for fine: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== WAIVER OPERATIONS ====================

    /**
     * Waive a fine (Admin only)
     * POST /api/fines/waive
     */
    @PostMapping("/waive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> waiveFine(@Valid @RequestBody WaiveFineRequest waiveRequest) {
        try {
            log.info("Admin waiving fine: {}", waiveRequest.getFineId());
            FineDTO fine = fineService.waiveFine(waiveRequest);
            return ResponseEntity.ok(fine);
        } catch (FineException e) {
            log.error("Failed to waive fine: {}", waiveRequest.getFineId(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== QUERY OPERATIONS ====================

    /**
     * Get fine by ID
     * GET /api/fines/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getFineById(@PathVariable Long id) {
        try {
            FineDTO fine = fineService.getFineById(id);
            return ResponseEntity.ok(fine);
        } catch (FineException e) {
            log.error("Fine not found: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get fines for a book loan
     * GET /api/fines/book-loan/{bookLoanId}
     */
    @GetMapping("/book-loan/{bookLoanId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getFinesByBookLoanId(@PathVariable Long bookLoanId) {
        try {
            List<FineDTO> fines = fineService.getFinesByBookLoanId(bookLoanId);
            return ResponseEntity.ok(fines);
        } catch (Exception e) {
            log.error("Failed to fetch fines for book loan: {}", bookLoanId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to fetch fines: " + e.getMessage(), false));
        }
    }

    /**
     * Get my fines (current user) with optional filters
     * GET /api/fines/my?status=PENDING&type=OVERDUE
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMyFines(
            @RequestParam(required = false) FineStatus status,
            @RequestParam(required = false) FineType type) {
        try {
            List<FineDTO> fines = fineService.getMyFines(status, type);
            return ResponseEntity.ok(fines);
        } catch (Exception e) {
            log.error("Failed to fetch my fines", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to fetch fines: " + e.getMessage(), false));
        }
    }

    /**
     * Get all fines with filtering (Admin only)
     * GET /api/fines?status=PENDING&type=OVERDUE&userId=123&page=0&size=20
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllFines(
            @RequestParam(required = false) FineStatus status,
            @RequestParam(required = false) FineType type,
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            PageResponse<FineDTO> fines = fineService.getAllFines(status, type, userId, page, size);
            return ResponseEntity.ok(fines);
        } catch (Exception e) {
            log.error("Failed to fetch fines", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to fetch fines: " + e.getMessage(), false));
        }
    }

    // ==================== AGGREGATION OPERATIONS ====================

    /**
     * Get my total unpaid fines (current user)
     * GET /api/fines/my/total-unpaid
     */
    @GetMapping("/my/total-unpaid")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMyTotalUnpaidFines() {
        try {
            Long total = fineService.getMyTotalUnpaidFines();
            return ResponseEntity.ok(new TotalFinesResponse(total));
        } catch (Exception e) {
            log.error("Failed to fetch total unpaid fines", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to fetch total: " + e.getMessage(), false));
        }
    }

    /**
     * Get total unpaid fines for a user (Admin only)
     * GET /api/fines/statistics/user/{userId}/unpaid
     */
    @GetMapping("/statistics/user/{userId}/unpaid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTotalUnpaidFinesByUserId(@PathVariable Long userId) {
        try {
            Long total = fineService.getTotalUnpaidFinesByUserId(userId);
            return ResponseEntity.ok(new TotalFinesResponse(total));
        } catch (Exception e) {
            log.error("Failed to fetch total unpaid fines for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to fetch total: " + e.getMessage(), false));
        }
    }

    /**
     * Get total collected fines (Admin only)
     * GET /api/fines/statistics/collected
     */
    @GetMapping("/statistics/collected")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTotalCollectedFines() {
        try {
            Long total = fineService.getTotalCollectedFines();
            return ResponseEntity.ok(new TotalFinesResponse(total));
        } catch (Exception e) {
            log.error("Failed to fetch total collected fines", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to fetch total: " + e.getMessage(), false));
        }
    }

    /**
     * Get total outstanding fines (Admin only)
     * GET /api/fines/statistics/outstanding
     */
    @GetMapping("/statistics/outstanding")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTotalOutstandingFines() {
        try {
            Long total = fineService.getTotalOutstandingFines();
            return ResponseEntity.ok(new TotalFinesResponse(total));
        } catch (Exception e) {
            log.error("Failed to fetch total outstanding fines", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to fetch total: " + e.getMessage(), false));
        }
    }

    /**
     * Check if user has unpaid fines (Admin only)
     * GET /api/fines/statistics/user/{userId}/has-unpaid
     */
    @GetMapping("/statistics/user/{userId}/has-unpaid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> hasUnpaidFines(@PathVariable Long userId) {
        try {
            boolean hasUnpaid = fineService.hasUnpaidFines(userId);
            return ResponseEntity.ok(new HasUnpaidFinesResponse(hasUnpaid));
        } catch (Exception e) {
            log.error("Failed to check unpaid fines for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Failed to check fines: " + e.getMessage(), false));
        }
    }

    /**
     * Delete a fine (Admin only - use with caution)
     * DELETE /api/fines/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFine(@PathVariable Long id) {
        try {
            log.warn("Admin deleting fine: {}", id);
            fineService.deleteFine(id);
            return ResponseEntity.ok(new ApiResponse("Fine deleted successfully", true));
        } catch (FineException e) {
            log.error("Failed to delete fine: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== RESPONSE DTOs ====================

    public static class TotalFinesResponse {
        public Long total;

        public TotalFinesResponse(Long total) {
            this.total = total;
        }
    }

    public static class HasUnpaidFinesResponse {
        public boolean hasUnpaidFines;

        public HasUnpaidFinesResponse(boolean hasUnpaidFines) {
            this.hasUnpaidFines = hasUnpaidFines;
        }
    }
}
