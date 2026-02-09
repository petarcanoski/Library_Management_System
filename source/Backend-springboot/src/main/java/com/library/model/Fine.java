package com.library.model;

import com.library.domain.FineStatus;
import com.library.domain.FineType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a fine in the library system.
 * Separate from BookLoan to allow detailed financial tracking,
 * multiple fines per loan, and comprehensive audit trails.
 */
@Entity
@Table(name = "fines", indexes = {
    @Index(name = "idx_fine_book_loan_id", columnList = "book_loan_id"),
    @Index(name = "idx_fine_user_id", columnList = "user_id"),
    @Index(name = "idx_fine_status", columnList = "status"),
    @Index(name = "idx_fine_type", columnList = "type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Book loan is mandatory")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_loan_id", nullable = false)
    private BookLoan bookLoan;

    @NotNull(message = "User is mandatory")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Fine type is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FineType type;

    @NotNull(message = "Fine amount is mandatory")
    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private Long amountPaid = 0L;

    @NotNull(message = "Fine status is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FineStatus status = FineStatus.PENDING;

    @Column(length = 500)
    private String reason;

    @Column(length = 1000)
    private String notes;

    // Waiver tracking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waived_by_user_id")
    private User waivedBy;

    @Column(name = "waived_at")
    private LocalDateTime waivedAt;

    @Column(name = "waiver_reason", length = 500)
    private String waiverReason;

    // Payment tracking
    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by_user_id")
    private User processedBy;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ==================== BUSINESS LOGIC METHODS ====================

    /**
     * Calculate the outstanding amount for this fine
     * @return Amount still owed
     */
    public Long getAmountOutstanding() {
        return amount - amountPaid;
    }


    /**
     * Check if the fine is pending (not paid or waived)
     * @return true if pending payment
     */
    public boolean isPending() {
        return status == FineStatus.PENDING || status == FineStatus.PARTIALLY_PAID;
    }

    /**
     * Apply a payment to this fine
     * @param paymentAmount Amount being paid
     */
    public void applyPayment(Long paymentAmount) {
        if (paymentAmount == null || paymentAmount <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }

        this.amountPaid = paymentAmount;

        // Update status based on amount paid
        if (this.amountPaid >= this.amount) {
            this.status = FineStatus.PAID;
            this.paidAt = LocalDateTime.now();
        } else if (this.amountPaid > 0) {
            this.status = FineStatus.PARTIALLY_PAID;
        }
    }

    /**
     * Waive this fine
     * @param admin Admin user waiving the fine
     * @param reason Reason for waiver
     */
    public void waive(User admin, String reason) {
        this.status = FineStatus.WAIVED;
        this.waivedBy = admin;
        this.waivedAt = LocalDateTime.now();
        this.waiverReason = reason;
    }
}
