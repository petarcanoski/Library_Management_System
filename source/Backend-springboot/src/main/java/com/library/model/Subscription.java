package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing a user's library subscription
 */
@Entity
@Table(name = "subscriptions", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_is_active", columnList = "is_active"),
    @Index(name = "idx_end_date", columnList = "end_date"),
    @Index(name = "idx_plan_id", columnList = "plan_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User who owns this subscription
     */
    @NotNull(message = "User is mandatory")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Subscription plan (ManyToOne relationship)
     */
    @NotNull(message = "Subscription plan is mandatory")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private SubscriptionPlan plan;

    /**
     * Plan display name (cached for historical records)
     */
    @Column(name = "plan_name", length = 100)
    private String planName;

    /**
     * Plan code (cached for historical records)
     */
    @Column(name = "plan_code", length = 50)
    private String planCode;

    /**
     * Subscription price in smallest currency unit (cached at time of purchase)
     */
    @Column(name = "price")
    private Long price;

    /**
     * Currency code (cached at time of purchase)
     */
    @Column(name = "currency", length = 3)
    private String currency;

    /**
     * Subscription start date
     */
    @NotNull(message = "Start date is mandatory")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /**
     * Subscription end date (auto-calculated)
     */
    @NotNull(message = "End date is mandatory")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    /**
     * Whether subscription is currently active
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * Maximum books user can borrow concurrently
     */
    @NotNull(message = "Max books allowed is mandatory")
    @Positive(message = "Max books must be positive")
    @Column(name = "max_books_allowed", nullable = false)
    private Integer maxBooksAllowed;

    /**
     * Maximum days per book loan
     */
    @NotNull(message = "Max days per book is mandatory")
    @Positive(message = "Max days must be positive")
    @Column(name = "max_days_per_book", nullable = false)
    private Integer maxDaysPerBook;

    /**
     * Auto-renewal flag
     */
    @Column(name = "auto_renew", nullable = false)
    private Boolean autoRenew = false;

    /**
     * Cancellation date (if cancelled)
     */
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    /**
     * Cancellation reason
     */
    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    /**
     * Admin notes
     */
    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * Record creation timestamp
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Record last update timestamp
     */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Check if subscription is currently valid
     */
    public boolean isValid() {
        if (!isActive) {
            return false;
        }
        LocalDate today = LocalDate.now();
        return !today.isBefore(startDate) && !today.isAfter(endDate);
    }

    /**
     * Check if subscription has expired
     */
    public boolean isExpired() {
        return LocalDate.now().isAfter(endDate);
    }

    /**
     * Get days remaining in subscription
     */
    public long getDaysRemaining() {
        if (isExpired()) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), endDate);
    }

    /**
     * Calculate end date based on plan and start date
     */
    public void calculateEndDate() {
        if (plan != null && startDate != null) {
            this.endDate = startDate.plusDays(plan.getDurationDays());
        }
    }

    /**
     * Initialize subscription from plan
     * Caches plan details for historical records
     */
    public void initializeFromPlan() {
        if (plan != null) {
            this.planName = plan.getName();
            this.planCode = plan.getPlanCode();
            this.price = plan.getPrice();
            this.currency = plan.getCurrency();
            this.maxBooksAllowed = plan.getMaxBooksAllowed();
            this.maxDaysPerBook = plan.getMaxDaysPerBook();

            if (startDate == null) {
                this.startDate = LocalDate.now();
            }

            calculateEndDate();
        }
    }

    /**
     * Get price in major currency units (e.g., rupees, dollars)
     */
    public Double getPriceInMajorUnits() {
        if (price == null) {
            return 0.0;
        }
        return price / 100.0;
    }

    /**
     * Check if user can borrow more books
     */
    public boolean canBorrowMoreBooks(int currentBorrowedCount) {
        return isValid() && currentBorrowedCount < maxBooksAllowed;
    }
}
