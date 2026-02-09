package com.library.domain;

/**
 * Enum representing the payment gateway used for processing
 */
public enum PaymentGateway {
    /**
     * Razorpay payment gateway (India-focused)
     */
    RAZORPAY,

    /**
     * Stripe payment gateway (Global)
     */
    STRIPE,

    /**
     * Cash payment at library counter
     */
    CASH,

    /**
     * Admin manual adjustment
     */
    MANUAL
}
