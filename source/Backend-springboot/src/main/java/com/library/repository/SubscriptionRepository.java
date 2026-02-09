package com.library.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.library.model.Subscription;

/**
 * Repository for Subscription entity
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    /**
     * Find active subscription for a user
     */
    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId " +
           "AND s.isActive = true AND " +
           "s.startDate <= :today AND s.endDate >= :today " +
           "ORDER BY s.endDate DESC"
           )
    Optional<Subscription> findActiveSubscriptionByUserId(
        @Param("userId") Long userId,
        @Param("today") LocalDate today
    );

    /**
     * Find all subscriptions for a user (active and past)
     */
    List<Subscription> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find all active subscriptions
     */
    @Query("SELECT s FROM Subscription s WHERE s.isActive = true " +
           "AND s.startDate <= :today AND s.endDate >= :today")
    List<Subscription> findAllActiveSubscriptions(
        @Param("today") LocalDate today

    );

    /**
     * Find expired subscriptions that are still marked as active
     */
    @Query("SELECT s FROM Subscription s WHERE s.isActive = true " +
           "AND s.endDate < :today")
    List<Subscription> findExpiredActiveSubscriptions(
       @Param("today") LocalDate today);






    /**
     * Check if user has any active subscription
     */
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Subscription s " +
           "WHERE s.user.id = :userId AND s.isActive = true " +
           "AND s.startDate <= :today AND s.endDate >= :today")
    boolean hasActiveSubscription(
        @Param("userId") Long userId,
        @Param("today") LocalDate today
    );

}
