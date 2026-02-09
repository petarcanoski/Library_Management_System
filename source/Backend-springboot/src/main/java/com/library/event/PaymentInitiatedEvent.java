package com.library.event;

import com.library.domain.PaymentGateway;
import com.library.domain.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Domain event published when a payment is initiated.
 * This event can be used for tracking, analytics, and notifications.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiatedEvent {

    /**
     * ID of the payment that was initiated
     */
    private Long paymentId;

    /**
     * ID of the user who initiated the payment
     */
    private Long userId;

    /**
     * Type of payment (SUBSCRIPTION, FINE, BOOK_LOAN, etc.)
     */
    private PaymentType paymentType;

    /**
     * Payment gateway being used
     */
    private PaymentGateway gateway;

    /**
     * Amount to be paid
     */
    private Long amount;

    /**
     * Currency of payment
     */
    private String currency;

    /**
     * ID of related subscription (if applicable)
     */
    private Long subscriptionId;

    /**
     * ID of related fine (if applicable)
     */
    private Long fineId;

    /**
     * ID of related book loan (if applicable)
     */
    private Long bookLoanId;

    /**
     * Transaction ID
     */
    private String transactionId;

    /**
     * Timestamp when payment was initiated
     */
    private LocalDateTime initiatedAt;

    /**
     * Description of the payment
     */
    private String description;

    /**
     * Checkout URL for user to complete payment
     */
    private String checkoutUrl;

    /**
     * User email for notifications
     */
    private String userEmail;

    /**
     * User name for notifications
     */
    private String userName;
}
