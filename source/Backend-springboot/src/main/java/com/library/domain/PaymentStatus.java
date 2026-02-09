package com.library.domain;

/**
 * Enum representing the status of a payment transaction
 */
public enum PaymentStatus {
    /**
     * Payment has been initiated but not yet completed
     */
    PENDING,

    /**
     * Payment was successfully processed
     */
    SUCCESS,

    /**
     * Payment failed due to insufficient funds, card decline, etc.
     */
    FAILED,

    /**
     * Payment was cancelled by user
     */
    CANCELLED,

    /**
     * Payment was refunded
     */
    REFUNDED,

    /**
     * Payment is being processed by gateway
     */
    PROCESSING
}
