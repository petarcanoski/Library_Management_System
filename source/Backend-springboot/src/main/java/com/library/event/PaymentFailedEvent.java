package com.library.event;

import com.library.domain.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Domain event published when a payment fails.
 * This event allows services to react to payment failures
 * (e.g., notify users, log failures, trigger compensation logic).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentFailedEvent {

    /**
     * ID of the payment that failed
     */
    private Long paymentId;

    /**
     * ID of the user who attempted the payment
     */
    private Long userId;

    /**
     * Type of payment (SUBSCRIPTION, FINE, BOOK_LOAN, etc.)
     */
    private PaymentType paymentType;

    /**
     * Amount attempted
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
     * Reason for failure
     */
    private String failureReason;

    /**
     * Gateway payment ID for reference (if available)
     */
    private String gatewayPaymentId;

    /**
     * Transaction ID
     */
    private String transactionId;

    /**
     * Timestamp when payment failed
     */
    private LocalDateTime failedAt;

    /**
     * Description of the payment
     */
    private String description;

    /**
     * User email for notifications
     */
    private String userEmail;

    /**
     * User name for notifications
     */
    private String userName;
}
