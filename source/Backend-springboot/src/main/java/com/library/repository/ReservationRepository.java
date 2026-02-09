package com.library.repository;

import com.library.domain.ReservationStatus;
import com.library.model.Book;
import com.library.model.Reservation;
import com.library.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Reservation entity.
 * Provides CRUD operations and custom query methods for book reservations.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {


    boolean existsByUserAndBookAndStatusIn(
            User user,
            Book book,
            List<ReservationStatus> statuses
    );


    /**
     * Find pending reservations for a specific book (ordered by reservation date)
     */
    @Query("SELECT r FROM Reservation r WHERE r.book.id = :bookId " +
           "AND r.status = 'PENDING' ORDER BY r.reservedAt ASC")
    List<Reservation> findPendingReservationsByBook(@Param("bookId") Long bookId);

    /**
     * Get next pending reservation for a book (first in queue)
     */
    @Query("SELECT r FROM Reservation r WHERE r.book.id = :bookId " +
           "AND r.status = 'PENDING' ORDER BY r.reservedAt ASC LIMIT 1")
    Optional<Reservation> findNextPendingReservation(@Param("bookId") Long bookId);

    /**
     * Check if user already has an active reservation for a book
     */
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reservation r " +
           "WHERE r.user.id = :userId AND r.book.id = :bookId " +
           "AND (r.status = 'PENDING' OR r.status = 'AVAILABLE')")
    boolean hasActiveReservation(@Param("userId") Long userId, @Param("bookId") Long bookId);

    /**
     * Count active reservations for a user
     */
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.user.id = :userId " +
           "AND (r.status = 'PENDING' OR r.status = 'AVAILABLE')")
    long countActiveReservationsByUser(@Param("userId") Long userId);

    /**
     * Count pending reservations for a book
     */
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.book.id = :bookId " +
           "AND r.status = 'PENDING'")
    long countPendingReservationsByBook(@Param("bookId") Long bookId);

    /**
     * Find reservations that have expired (available but past pickup deadline)
     */
    @Query("SELECT r FROM Reservation r WHERE r.status = 'AVAILABLE' " +
           "AND r.availableUntil < :currentDateTime")
    List<Reservation> findExpiredReservations(@Param("currentDateTime") LocalDateTime currentDateTime);


    /**
     * Find active reservation for user and book
     */
    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.book.id = :bookId " +
           "AND (r.status = 'PENDING' OR r.status = 'AVAILABLE')")
    Optional<Reservation> findActiveReservationByUserAndBook(
        @Param("userId") Long userId,
        @Param("bookId") Long bookId
    );



    /**
     * Search reservations with dynamic filters
     */
    @Query("SELECT r FROM Reservation r WHERE " +
           "(:userId IS NULL OR r.user.id = :userId) AND " +
           "(:bookId IS NULL OR r.book.id = :bookId) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:activeOnly = false OR (r.status = 'PENDING' OR r.status = 'AVAILABLE'))")
    Page<Reservation> searchReservationsWithFilters(
        @Param("userId") Long userId,
        @Param("bookId") Long bookId,
        @Param("status") ReservationStatus status,
        @Param("activeOnly") boolean activeOnly,
        Pageable pageable
    );


}
