package com.library.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.domain.ReservationStatus;
import com.library.exception.BookException;
import com.library.exception.ReservationException;
import com.library.exception.UserException;
import com.library.payload.dto.ReservationDTO;
import com.library.payload.request.ReservationRequest;
import com.library.payload.request.ReservationSearchRequest;
import com.library.payload.response.ApiResponse;
import com.library.payload.response.PageResponse;
import com.library.service.ReservationService;

import jakarta.validation.Valid;

/**
 * REST Controller for Reservation/Hold operations.
 * Handles book reservations, cancellations, and reservation history.
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // ==================== RESERVATION OPERATIONS ====================

    /**
     * Create a reservation for current authenticated user
     * POST /api/reservations
     */
    @PostMapping
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationRequest reservationRequest) {
        try {
            ReservationDTO reservation = reservationService.createReservation(reservationRequest);
            return new ResponseEntity<>(reservation, HttpStatus.CREATED);
        } catch (ReservationException | BookException | UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse(e.getMessage(), false)
            );
        }
    }

    /**
     * Create a reservation for a specific user (admin operation)
     * POST /api/reservations/user/{userId}
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createReservationForUser(
            @PathVariable Long userId,
            @Valid @RequestBody ReservationRequest reservationRequest) {
        try {
            ReservationDTO reservation = reservationService.createReservationForUser(userId, reservationRequest);
            return new ResponseEntity<>(reservation, HttpStatus.CREATED);
        } catch (ReservationException | BookException | UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse(e.getMessage(), false)
            );
        }
    }

    /**
     * Cancel a reservation
     * DELETE /api/reservations/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {
            ReservationDTO reservation = reservationService.cancelReservation(id);
            return ResponseEntity.ok(reservation);
        } catch (ReservationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse(e.getMessage(), false)
            );
        }
    }

    /**
     * Fulfill a reservation (mark as checked out)
     * POST /api/reservations/{id}/fulfill
     */
    @PostMapping("/{id}/fulfill")
    public ResponseEntity<?> fulfillReservation(@PathVariable Long id)
            throws BookException, UserException {
        try {
            ReservationDTO reservation = reservationService
            .fulfillReservation(id);
            return ResponseEntity.ok(reservation);
        } catch (ReservationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse(e.getMessage(), false)
            );
        }
    }

    // ==================== QUERY OPERATIONS (UNIFIED SEARCH) ====================

    /**
     * Get reservation by ID
     * GET /api/reservations/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id) {
        try {
            ReservationDTO reservation = reservationService.getReservationById(id);
            return ResponseEntity.ok(reservation);
        } catch (ReservationException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse(e.getMessage(), false)
            );
        }
    }

    /**
     * Search my reservations (current user) with filters
     * GET /api/reservations/my
     *
     * Query params:
     * - status: Filter by status (PENDING, AVAILABLE, FULFILLED, CANCELLED, EXPIRED)
     * - activeOnly: Show only active reservations (PENDING or AVAILABLE)
     * - page: Page number (default: 0)
     * - size: Page size (default: 20)
     * - sortBy: Sort field (default: reservedAt)
     * - sortDirection: ASC or DESC (default: DESC)
     */
    @GetMapping("/my")
    public ResponseEntity<PageResponse<ReservationDTO>> getMyReservations(
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "reservedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        ReservationSearchRequest searchRequest = new ReservationSearchRequest();
        searchRequest.setStatus(status);
        searchRequest.setActiveOnly(activeOnly);
        searchRequest.setPage(page);
        searchRequest.setSize(size);
        searchRequest.setSortBy(sortBy);
        searchRequest.setSortDirection(sortDirection);

        PageResponse<ReservationDTO> reservations = reservationService.getMyReservations(searchRequest);
        return ResponseEntity.ok(reservations);
    }

    /**
     * Advanced search for my reservations (POST with request body)
     * POST /api/reservations/my/search
     */
    @PostMapping("/my/search")
    public ResponseEntity<PageResponse<ReservationDTO>> searchMyReservations(
            @RequestBody ReservationSearchRequest searchRequest) {
        PageResponse<ReservationDTO> reservations = reservationService.getMyReservations(searchRequest);
        return ResponseEntity.ok(reservations);
    }

    /**
     * Search all reservations with filters (admin operation)
     * GET /api/reservations
     *
     * Query params:
     * - userId: Filter by user ID
     * - bookId: Filter by book ID
     * - status: Filter by status
     * - activeOnly: Show only active reservations
     * - page, size, sortBy, sortDirection
     */
    @GetMapping
    public ResponseEntity<PageResponse<ReservationDTO>> searchReservations(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) Boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "reservedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        ReservationSearchRequest searchRequest = new ReservationSearchRequest();
        searchRequest.setUserId(userId);
        searchRequest.setBookId(bookId);
        searchRequest.setStatus(status);
        searchRequest.setActiveOnly(activeOnly);
        searchRequest.setPage(page);
        searchRequest.setSize(size);
        searchRequest.setSortBy(sortBy);
        searchRequest.setSortDirection(sortDirection);

        PageResponse<ReservationDTO> reservations = reservationService.searchReservations(searchRequest);
        return ResponseEntity.ok(reservations);
    }

    /**
     * Advanced search with request body (admin operation)
     * POST /api/reservations/search
     */
    @PostMapping("/search")
    public ResponseEntity<PageResponse<ReservationDTO>> advancedSearchReservations(
            @RequestBody ReservationSearchRequest searchRequest) {
        PageResponse<ReservationDTO> reservations = reservationService.searchReservations(searchRequest);
        return ResponseEntity.ok(reservations);
    }

    /**
     * Get queue position for a reservation
     * GET /api/reservations/{id}/queue-position
     */
    @GetMapping("/{id}/queue-position")
    public ResponseEntity<?> getQueuePosition(@PathVariable Long id) {
        try {
            int position = reservationService.getQueuePosition(id);
            return ResponseEntity.ok(new QueuePositionResponse(position));
        } catch (ReservationException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ApiResponse(e.getMessage(), false)
            );
        }
    }

    // ==================== RESPONSE DTOs ====================

    /**
     * Response DTO for queue position
     */
    public static class QueuePositionResponse {
        public int queuePosition;
        public String message;

        public QueuePositionResponse(int queuePosition) {
            this.queuePosition = queuePosition;
            if (queuePosition == 0) {
                this.message = "Reservation is not in queue";
            } else if (queuePosition == 1) {
                this.message = "You are next in line!";
            } else {
                this.message = "There are " + (queuePosition - 1) + " person(s) ahead of you";
            }
        }
    }
}
