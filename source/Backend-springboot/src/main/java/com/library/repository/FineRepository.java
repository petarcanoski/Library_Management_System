package com.library.repository;

import com.library.domain.FineStatus;
import com.library.domain.FineType;
import com.library.model.Fine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Fine entity.
 * Provides CRUD operations and custom query methods for fine management.
 */
@Repository
public interface FineRepository extends JpaRepository<Fine, Long>, JpaSpecificationExecutor<Fine> {

    // ==================== FIND BY RELATIONSHIPS ====================

    /**
     * Find all fines for a specific book loan
     */
    List<Fine> findByBookLoanId(Long bookLoanId);

    @Query("""
        SELECT f FROM Fine f
        WHERE (:userId IS NULL OR f.user.id = :userId)
          AND (:status IS NULL OR f.status = :status)
          AND (:type IS NULL OR f.type = :type)
        ORDER BY f.createdAt DESC
    """)
    Page<Fine> findAllWithFilters(
            @Param("userId") Long userId,
            @Param("status") FineStatus status,
            @Param("type") FineType type,
            Pageable pageable
    );



    /**
     * Find all fines for a specific user
     */
    Page<Fine> findByUserId(Long userId, Pageable pageable);

    /**
     * Find all fines for a specific user with pagination
     */
    List<Fine> findByUserId(Long userId);

    // ==================== FIND BY STATUS ====================

    /**
     * Find all fines by status
     */
    Page<Fine> findByStatus(FineStatus status, Pageable pageable);



    // ==================== FIND BY TYPE ====================

    /**
     * Find all fines by type
     */
    Page<Fine> findByType(FineType type, Pageable pageable);

    /**
     * Find all fines for a user by type
     */
    List<Fine> findByUserIdAndType(Long userId, FineType type);

    // ==================== AGGREGATION QUERIES ====================

    /**
     * Get total unpaid fines for a user
     */
    @Query("SELECT COALESCE(SUM(f.amount - f.amountPaid), 0) FROM Fine f " +
           "WHERE f.user.id = :userId AND f.status IN ('PENDING', 'PARTIALLY_PAID')")
    Long getTotalUnpaidFinesByUserId(@Param("userId") Long userId);

    /**
     * Get total fines amount for a user (all statuses)
     */
    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM Fine f WHERE f.user.id = :userId")
    Long getTotalFinesByUserId(@Param("userId") Long userId);

    /**
     * Get total collected fines amount
     */
    @Query("SELECT COALESCE(SUM(f.amountPaid), 0) FROM Fine f WHERE f.status = 'PAID'")
    Long getTotalCollectedFines();

    /**
     * Get total outstanding fines amount (all users)
     */
    @Query("SELECT COALESCE(SUM(f.amount - f.amountPaid), 0) FROM Fine f " +
           "WHERE f.status IN ('PENDING', 'PARTIALLY_PAID')")
    Long getTotalOutstandingFines();

    // ==================== COUNT QUERIES ====================


    /**
     * Count fines by status
     */
    long countByStatus(FineStatus status);

    /**
     * Count fines by type
     */
    long countByType(FineType type);

    // ==================== DATE RANGE QUERIES ====================


    /**
     * Find fines paid within a date range
     */
    @Query("SELECT f FROM Fine f WHERE f.paidAt BETWEEN :startDate AND :endDate " +
           "AND f.status = 'PAID'")
    Page<Fine> findPaidFinesByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    // ==================== WAIVED FINES ====================

    /**
     * Find all waived fines
     */
    @Query("SELECT f FROM Fine f WHERE f.status = 'WAIVED'")
    Page<Fine> findWaivedFines(Pageable pageable);

    /**
     * Find fines waived by a specific admin
     */
    List<Fine> findByWaivedById(Long adminId);

    // ==================== COMPLEX QUERIES ====================

    /**
     * Find fines for a specific book loan and type
     */
    List<Fine> findByBookLoanIdAndType(Long bookLoanId, FineType type);


    /**
     * Check if a user has any unpaid fines
     */
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Fine f " +
           "WHERE f.user.id = :userId AND f.status IN ('PENDING', 'PARTIALLY_PAID')")
    boolean hasUnpaidFines(@Param("userId") Long userId);
}
