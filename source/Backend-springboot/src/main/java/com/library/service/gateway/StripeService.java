package com.library.service.gateway;

import com.library.exception.PaymentException;
import com.library.model.Payment;
import com.library.model.Subscription;
import com.library.model.User;
import com.library.payload.response.PaymentInitiateResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Service for Stripe payment gateway integration
 * Handles payment intent creation and verification
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class StripeService {

    @Value("${stripe.api.key:}")
    private String stripeSecretKey;

    /**
     * -- GETTER --
     *  Get Stripe publishable key
     */
    @Getter
    @Value("${stripe.publishable.key:}")
    private String stripePublishableKey;

    /**
     * Create a Stripe PaymentIntent
     */
    public PaymentInitiateResponse createPaymentIntent(Payment payment) throws PaymentException {
        try {
            log.info("Creating Stripe PaymentIntent for payment ID: {}", payment.getId());

            // In production, use Stripe SDK:
            // Stripe.apiKey = stripeSecretKey;
            // PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            //     .setAmount(payment.getAmount().multiply(new BigDecimal("100")).longValue())
            //     .setCurrency(payment.getCurrency().toLowerCase())
            //     .setDescription(payment.getDescription())
            //     .putMetadata("payment_id", payment.getId().toString())
            //     .setAutomaticPaymentMethods(
            //         PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
            //             .setEnabled(true)
            //             .build()
            //     )
            //     .build();
            // PaymentIntent paymentIntent = PaymentIntent.create(params);

            // For demo purposes, generating mock values
            String clientSecret = "pi_" + System.currentTimeMillis() + "_secret_mock";

            PaymentInitiateResponse response = new PaymentInitiateResponse();
            response.setPaymentId(payment.getId());
            response.setGateway(payment.getGateway());

            response.setAmount(payment.getAmount());
            response.setCurrency(payment.getCurrency());
            response.setDescription(payment.getDescription());
            response.setSuccess(true);
            response.setMessage("Stripe PaymentIntent created successfully");

            log.info("Stripe PaymentIntent created successfully");
            return response;

        } catch (Exception e) {
            log.error("Error creating Stripe PaymentIntent", e);
            throw new PaymentException("Failed to create Stripe PaymentIntent: " + e.getMessage(), e);
        }
    }

    /**
     * Verify Stripe payment
     */
    public boolean verifyPayment(String paymentIntentId) throws PaymentException {
        try {
            log.info("Verifying Stripe payment: {}", paymentIntentId);

            // In production, use Stripe SDK:
            // Stripe.apiKey = stripeSecretKey;
            // PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            // return "succeeded".equals(paymentIntent.getStatus());

            // For demo purposes
            log.info("Stripe payment verification successful");
            return true;

        } catch (Exception e) {
            log.error("Error verifying Stripe payment", e);
            throw new PaymentException("Failed to verify Stripe payment: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieve payment intent details
     */
    public String getPaymentIntentStatus(String paymentIntentId) throws PaymentException {
        try {
            log.info("Retrieving Stripe PaymentIntent status: {}", paymentIntentId);

            // In production, use Stripe SDK:
            // Stripe.apiKey = stripeSecretKey;
            // PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            // return paymentIntent.getStatus();

            // For demo purposes
            return "succeeded";

        } catch (Exception e) {
            log.error("Error retrieving Stripe PaymentIntent status", e);
            throw new PaymentException("Failed to retrieve payment status: " + e.getMessage(), e);
        }
    }

    /**
     * Create subscription payment link for Stripe
     */
    public String createSubscriptionPaymentLink(User user, Subscription subscription, Payment payment)
            throws PaymentException {
        try {
            log.info("Creating Stripe payment link for subscription: {}", subscription.getId());

            // For demo, creating a mock checkout URL
            // In production, use Stripe Checkout Session API

            String checkoutUrl = "https://checkout.stripe.com/c/pay/mock_session_" +
                System.currentTimeMillis();

            log.info("Stripe checkout URL created successfully");
            return checkoutUrl;

        } catch (Exception e) {
            log.error("Error creating Stripe payment link", e);
            throw new PaymentException("Failed to create Stripe payment link: " + e.getMessage(), e);
        }
    }

    /**
     * Check if Stripe is configured
     */
    public boolean isConfigured() {
        return stripeSecretKey != null && !stripeSecretKey.isEmpty()
               && stripePublishableKey != null && !stripePublishableKey.isEmpty();
    }



    public String createCheckoutSession(
            User user,
            Subscription subscription
    ) throws StripeException {

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:5173/subscriptions?success=true")
                        .setCancelUrl("http://localhost:5173/subscriptions?cancel=true")
                        .putAllMetadata(Map.of(
                                "userId", user.getId().toString(),
                                "planId", subscription.getPlan().getId().toString(),
                                "subscriptionId", subscription.getId().toString()
                        ))
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(subscription.getPrice().longValue() * 100)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName(subscription.getPlan().getName())
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        Session session = Session.create(params);

        return session.getUrl();
    }

}
