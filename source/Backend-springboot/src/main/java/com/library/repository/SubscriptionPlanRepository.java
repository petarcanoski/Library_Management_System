package com.library.repository;

import com.library.model.SubscriptionPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for SubscriptionPlan entity
 */
@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {

    /**
     * Find plan by unique plan code
     */
    Optional<SubscriptionPlan> findByPlanCode(String planCode);

    /**
     * Check if plan code exists
     */
    boolean existsByPlanCode(String planCode);

    /**
     * Find all active plans
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true ORDER BY sp.displayOrder ASC, sp.durationDays ASC")
    List<SubscriptionPlan> findAllActivePlans();

    /**
     * Find all active plans with pagination
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true ORDER BY sp.displayOrder ASC, sp.durationDays ASC")
    Page<SubscriptionPlan> findAllActivePlans(Pageable pageable);

    /**
     * Find all plans (active and inactive) ordered by display order
     */
    @Query("SELECT sp FROM SubscriptionPlan sp ORDER BY sp.displayOrder ASC, sp.durationDays ASC")
    Page<SubscriptionPlan> findAllPlansOrdered(Pageable pageable);

    /**
     * Find featured plans
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true AND sp.isFeatured = true ORDER BY sp.displayOrder ASC")
    List<SubscriptionPlan> findFeaturedPlans();

    /**
     * Find plans by currency
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true AND sp.currency = :currency ORDER BY sp.displayOrder ASC")
    List<SubscriptionPlan> findActivePlansByCurrency(@Param("currency") String currency);

    /**
     * Find plans by duration range
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true " +
           "AND sp.durationDays BETWEEN :minDays AND :maxDays " +
           "ORDER BY sp.durationDays ASC")
    List<SubscriptionPlan> findPlansByDurationRange(
        @Param("minDays") Integer minDays,
        @Param("maxDays") Integer maxDays
    );

    /**
     * Find plans by price range
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true " +
           "AND sp.price BETWEEN :minPrice AND :maxPrice " +
           "ORDER BY sp.price ASC")
    List<SubscriptionPlan> findPlansByPriceRange(
        @Param("minPrice") Long minPrice,
        @Param("maxPrice") Long maxPrice
    );

    /**
     * Count active plans
     */
    @Query("SELECT COUNT(sp) FROM SubscriptionPlan sp WHERE sp.isActive = true")
    long countActivePlans();

    /**
     * Search plans by name or description
     */
    @Query("SELECT sp FROM SubscriptionPlan sp WHERE sp.isActive = true " +
           "AND (LOWER(sp.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(sp.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY sp.displayOrder ASC")
    Page<SubscriptionPlan> searchPlans(@Param("searchTerm") String searchTerm, Pageable pageable);

}
