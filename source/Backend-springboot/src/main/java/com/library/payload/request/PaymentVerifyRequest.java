package com.library.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for verifying payment after gateway callback
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerifyRequest {





    // Razorpay specific fields
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;

    // Stripe specific fields
    private String stripePaymentIntentId;
    private String stripePaymentIntentStatus;

}
