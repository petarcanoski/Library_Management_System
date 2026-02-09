package com.library.event;

import com.library.domain.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Domain event published when a payment is successfully completed.
 * This event decouples PaymentService from other domain services,
 * allowing them to react to payment success independently.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSuccessEvent {

    /**
     * ID of the payment that succeeded
     */
    private Long paymentId;

    /**
     * ID of the user who made the payment
     */
    private Long userId;

    /**
     * Type of payment (SUBSCRIPTION, FINE, BOOK_LOAN, etc.)
     */
    private PaymentType paymentType;

    /**
     * Amount paid
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
     * Gateway payment ID for reference
     */
    private String gatewayPaymentId;

    /**
     * Transaction ID
     */
    private String transactionId;

    /**
     * Timestamp when payment was completed
     */
    private LocalDateTime completedAt;

    /**
     * Description of the payment
     */
    private String description;

    private Long planId;

}
