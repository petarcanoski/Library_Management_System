package com.library.model;

import com.library.domain.PaymentGateway;
import com.library.domain.PaymentStatus;
import com.library.domain.PaymentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a payment transaction in the library system.
 * Tracks all payment-related activities including fines, membership fees, and penalties.
 */
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_book_loan_id", columnList = "book_loan_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_payment_type", columnList = "payment_type"),
    @Index(name = "idx_gateway", columnList = "gateway"),
    @Index(name = "idx_transaction_id", columnList = "transaction_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User who made the payment
     */
    @NotNull(message = "User is mandatory for payment")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Related book loan (if payment is for a fine)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_loan_id")
    private BookLoan bookLoan;

    /**
     * Related subscription (if payment is for subscription)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @ManyToOne(fetch = FetchType.LAZY)
    private Fine fine;

    /**
     * Type of payment (FINE, MEMBERSHIP, etc.)
     */
    @NotNull(message = "Payment type is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 30)
    private PaymentType paymentType;

    /**
     * Current status of payment
     */
    @NotNull(message = "Payment status is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;

    /**
     * Payment gateway used
     */
    @NotNull(message = "Payment gateway is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentGateway gateway;

    /**
     * Payment amount
     */
    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be positive")
    @Column(nullable = false)
    private Long amount;

    /**
     * Currency code (INR, USD, etc.)
     */
    @Column(length = 3, nullable = false)
    private String currency = "INR";

    /**
     * Gateway transaction/order ID
     */
    @Column(name = "transaction_id", length = 255)
    private String transactionId;

    /**
     * Gateway payment ID (for successful payments)
     */
    @Column(name = "gateway_payment_id", length = 255)
    private String gatewayPaymentId;

    /**
     * Gateway order ID (Razorpay specific)
     */
    @Column(name = "gateway_order_id", length = 255)
    private String gatewayOrderId;

    /**
     * Gateway signature for verification (Razorpay specific)
     */
    @Column(name = "gateway_signature", length = 512)
    private String gatewaySignature;

    /**
     * Payment method used (card, upi, netbanking, etc.)
     */
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    /**
     * Additional metadata from gateway (JSON format)
     */
    @Column(columnDefinition = "TEXT")
    private String metadata;

    /**
     * Description of payment
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Failure reason (if payment failed)
     */
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    /**
     * Number of retry attempts
     */
    @Column(name = "retry_count", nullable = false)
    private Integer retryCount = 0;

    /**
     * Date and time when payment was initiated
     */
    @Column(name = "initiated_at", nullable = false)
    private LocalDateTime initiatedAt;

    /**
     * Date and time when payment was completed
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * Whether notification has been sent
     */
    @Column(name = "notification_sent", nullable = false)
    private Boolean notificationSent = false;

    /**
     * Soft delete flag
     */
    @Column(nullable = false)
    private Boolean active = true;

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
     * Check if payment is successful
     */
    public boolean isSuccessful() {
        return status == PaymentStatus.SUCCESS;
    }

    /**
     * Check if payment can be retried
     */
    public boolean canRetry() {
        return (status == PaymentStatus.FAILED || status == PaymentStatus.CANCELLED)
               && retryCount < 3;
    }

    /**
     * Check if payment is pending
     */
    public boolean isPending() {
        return status == PaymentStatus.PENDING || status == PaymentStatus.PROCESSING;
    }
}
