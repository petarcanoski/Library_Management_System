package com.library.service;

import com.library.exception.BookException;
import com.library.exception.ReservationException;
import com.library.exception.UserException;
import com.library.payload.dto.ReservationDTO;
import com.library.payload.request.ReservationRequest;
import com.library.payload.request.ReservationSearchRequest;
import com.library.payload.response.PageResponse;

/**
 * Service interface for book reservation operations
 */
public interface ReservationService {

    // ==================== RESERVATION OPERATIONS ====================

    /**
     * Create a reservation for the current authenticated user
     * @param reservationRequest Reservation details
     * @return Created reservation DTO
     * @throws ReservationException if reservation fails (already reserved, max limit reached, etc.)
     * @throws BookException if book not found
     * @throws UserException if user not found
     */
    ReservationDTO createReservation(ReservationRequest reservationRequest)
        throws ReservationException, BookException, UserException;

    /**
     * Create a reservation for a specific user (admin operation)
     * @param userId User ID
     * @param reservationRequest Reservation details
     * @return Created reservation DTO
     * @throws ReservationException if reservation fails
     * @throws BookException if book not found
     * @throws UserException if user not found
     */
    ReservationDTO createReservationForUser(Long userId,
    ReservationRequest reservationRequest)
        throws ReservationException, BookException, UserException;

    /**
     * Cancel a reservation
     * @param reservationId Reservation ID
     * @return Updated reservation DTO
     * @throws ReservationException if reservation not found or cannot be cancelled
     */
    ReservationDTO cancelReservation(Long reservationId) throws ReservationException;

    /**
     * Fulfill a reservation (mark as checked out)
     * @param reservationId Reservation ID
     * @return Updated reservation DTO
     * @throws ReservationException if reservation not found or not available
     */
    ReservationDTO fulfillReservation(Long reservationId) throws ReservationException, BookException, UserException;

    // ==================== QUERY OPERATIONS ====================

    /**
     * Get reservation by ID
     * @param reservationId Reservation ID
     * @return Reservation DTO
     * @throws ReservationException if reservation not found
     */
    ReservationDTO getReservationById(Long reservationId) throws ReservationException;

    /**
     * Search reservations with filters (unified search method)
     * @param searchRequest Search criteria with filters
     * @return Paginated reservations
     */
    PageResponse<ReservationDTO> searchReservations(ReservationSearchRequest searchRequest);

    /**
     * Get my reservations (current user) with filters
     * @param searchRequest Search criteria
     * @return Paginated reservations
     */
    PageResponse<ReservationDTO> getMyReservations(ReservationSearchRequest searchRequest);

    /**
     * Get queue position for a reservation
     * @param reservationId Reservation ID
     * @return Queue position (1-based)
     * @throws ReservationException if reservation not found
     */
    int getQueuePosition(Long reservationId) throws ReservationException;

    // ==================== ADMIN OPERATIONS ====================

    /**
     * Process next reservation when book becomes available
     * Called automatically when a book is returned
     * @param bookId Book ID
     */
    void processNextReservation(Long bookId);

    /**
     * Expire reservations that have passed their pickup deadline
     * @return Number of reservations expired
     */
    int expireOldReservations();

    /**
     * Update queue positions for all pending reservations of a book
     * @param bookId Book ID
     */
    void updateQueuePositions(Long bookId);
}
