package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a subscription plan that can be managed by admin
 * Production-ready with proper validation and audit fields
 */
@Entity
@Table(name = "subscription_plans", indexes = {
    @Index(name = "idx_plan_name", columnList = "name"),
    @Index(name = "idx_plan_code", columnList = "plan_code", unique = true),
    @Index(name = "idx_is_active", columnList = "is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique plan code (e.g., "MONTHLY", "QUARTERLY", "YEARLY")
     */
    @NotBlank(message = "Plan code is mandatory")
    @Column(name = "plan_code", nullable = false, unique = true, length = 50)
    private String planCode;

    /**
     * Display name for the plan
     */
    @NotBlank(message = "Plan name is mandatory")
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /**
     * Detailed description of the plan
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Plan duration in days
     */
    @NotNull(message = "Duration is mandatory")
    @Positive(message = "Duration must be positive")
    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    /**
     * Plan price in smallest currency unit (paise for INR, cents for USD)
     * Using Long as recommended for monetary values in APIs
     */
    @NotNull(message = "Price is mandatory")
    @Positive(message = "Price must be positive")
    @Column(name = "price", nullable = false)
    private Long price;

    /**
     * Currency code (ISO 4217)
     */
    @NotBlank(message = "Currency is mandatory")
    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "INR";

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
     * Display order for sorting plans
     */
    @Column(name = "display_order")
    private Integer displayOrder = 0;

    /**
     * Whether this plan is currently active and available for purchase
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * Whether this plan is featured/recommended
     */
    @Column(name = "is_featured", nullable = false)
    private Boolean isFeatured = false;

    /**
     * Badge text (e.g., "Best Value", "Most Popular")
     */
    @Column(name = "badge_text", length = 50)
    private String badgeText;

    /**
     * Admin notes (internal use)
     */
    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

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
     * Who created this plan
     */
    @Column(name = "created_by", length = 100)
    private String createdBy;

    /**
     * Who last updated this plan
     */
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    /**
     * Calculate price in major currency units (e.g., rupees, dollars)
     * For display purposes
     */
    public Double getPriceInMajorUnits() {
        return price / 100.0;
    }

    /**
     * Calculate monthly equivalent price in major units
     */
    public Double getMonthlyEquivalentPrice() {
        if (durationDays == null || durationDays == 0) {
            return 0.0;
        }
        double monthlyDays = 30.0;
        return (price / 100.0) / (durationDays / monthlyDays);
    }

    /**
     * Calculate savings compared to a monthly plan price
     */
    public Long calculateSavings(Long monthlyPlanPrice) {
        if (monthlyPlanPrice == null || durationDays == null || durationDays == 0) {
            return 0L;
        }
        int months = durationDays / 30;
        Long monthlyTotal = monthlyPlanPrice * months;
        return monthlyTotal - price;
    }
}
