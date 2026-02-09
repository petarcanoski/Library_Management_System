package com.library.service.gateway;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.library.domain.PaymentType;
import com.library.exception.FineException;
import com.library.exception.PaymentException;
import com.library.model.Fine;
import com.library.model.Payment;
import com.library.model.SubscriptionPlan;
import com.library.model.User;
import com.library.payload.response.PaymentLinkResponse;
import com.library.repository.FineRepository;
import com.library.service.SubscriptionPlanService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Razorpay payment gateway integration
 * Handles payment link creation, order management, and signature verification
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class RazorpayService {

    private final FineRepository fineRepository;
    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:}")
    private String razorpayKeySecret;

    @Value("${razorpay.callback.base-url:http://localhost:5173}")
    private String callbackBaseUrl;

    private final SubscriptionPlanService subscriptionPlanService;


    /**
     * Create a Razorpay payment link for subscription
     *
     * @param user The user making the payment
     * @param payment The payment entity to track this transaction
     * @return PaymentLinkResponse containing the payment URL and link ID
     * @throws PaymentException if payment link creation fails
     */
    public PaymentLinkResponse createPaymentLink(
            User user,
            Payment payment) throws PaymentException {

        validateConfiguration();

        try {
            RazorpayClient razorpay = new RazorpayClient(
                razorpayKeyId, razorpayKeySecret);

            // Convert amount to paisa (1 INR = 100 paisa)
            Long amountInPaisa = payment
            .getAmount()*(new java.math.BigDecimal("100")).intValue();

            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", amountInPaisa);
            paymentLinkRequest.put("currency", payment.getCurrency());
            paymentLinkRequest.put("description", payment.getDescription());

            // Customer details
            JSONObject customer = new JSONObject();
            customer.put("name", user.getFullName());
            customer.put("email", user.getEmail());
            if (user.getPhone() != null) {
                customer.put("contact", user.getPhone());
            }
            paymentLinkRequest.put("customer", customer);

            // Notification settings
            JSONObject notify = new JSONObject();
            notify.put("email", true);
            notify.put("sms", user.getPhone() != null);
            paymentLinkRequest.put("notify", notify);

            // Enable reminders
            paymentLinkRequest.put("reminder_enable", true);

            // Callback configuration
            String successUrl = callbackBaseUrl + "/payment-success/" + payment.getId();
            String cancelUrl = callbackBaseUrl + "/payment-cancelled/" + payment.getId();

            paymentLinkRequest.put("callback_url", successUrl);
            paymentLinkRequest.put("callback_method", "get");

            // Additional metadata for tracking
            JSONObject notes = new JSONObject();
            notes.put("user_id", user.getId());
            notes.put("payment_id", payment.getId());

            if(payment.getPaymentType()== PaymentType.MEMBERSHIP){
                notes.put("subscription_id", payment.getSubscription().getId());
                notes.put("plan", payment.getSubscription().getPlan().getPlanCode());
                notes.put("type",PaymentType.MEMBERSHIP);
            }else if(payment.getPaymentType()==PaymentType.FINE){
                notes.put("fine_id", payment.getFine().getId());
                notes.put("type",PaymentType.FINE);
            }

            paymentLinkRequest.put("notes", notes);

            // Create payment link
            PaymentLink paymentLink = razorpay.paymentLink.create(paymentLinkRequest);

            String paymentUrl = paymentLink.get("short_url");
            String paymentLinkId = paymentLink.get("id");

            log.info("Razorpay payment link created successfully. Link ID: {}, Payment ID: {}",
                paymentLinkId, payment.getId());

            PaymentLinkResponse response = new PaymentLinkResponse();
            response.setPayment_link_url(paymentUrl);
            response.setPayment_link_id(paymentLinkId);

            return response;

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay payment link: {}", e.getMessage(), e);
            throw new PaymentException("Failed to create payment link: " + e.getMessage(), e);
        }
    }




    /**
     * Check if Razorpay is properly configured
     *
     * @return true if configured
     */
    public boolean isConfigured() {
        return razorpayKeyId != null && !razorpayKeyId.isEmpty()
               && razorpayKeySecret != null && !razorpayKeySecret.isEmpty();
    }

    /**
     * Validate Razorpay configuration
     *
     * @throws PaymentException if not configured
     */
    private void validateConfiguration() throws PaymentException {
        if (!isConfigured()) {
            throw new PaymentException(
                "Razorpay is not configured. Please set razorpay.key.id and razorpay.key.secret");
        }
    }


    /**
     * Fetch payment details from Razorpay
     *
     * @param paymentId Razorpay payment ID
     * @return Payment details as JSON
     * @throws PaymentException if fetch fails
     */
    public JSONObject fetchPaymentDetails(String paymentId) throws PaymentException {
        validateConfiguration();

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            com.razorpay.Payment payment = razorpay.payments.fetch(paymentId);

            return payment.toJson();

        } catch (RazorpayException e) {
            log.error("Failed to fetch payment details for {}: {}", paymentId, e.getMessage(), e);
            throw new PaymentException("Failed to fetch payment details: " + e.getMessage(), e);
        }
    }

    public boolean isValidPayment(String paymentId) {
        try {

            JSONObject paymentDetails =fetchPaymentDetails(paymentId);

            String status = paymentDetails.optString("status");
            long amount = paymentDetails.optLong("amount");
            long amountInRupees = amount / 100;

            JSONObject notes = paymentDetails.getJSONObject("notes");

            String paymentType=notes.optString("type");



            // 1️⃣ Check status
            if (!"captured".equalsIgnoreCase(status)) {
                log.warn("Payment not captured. Current status: {}", status);
                return false;
            }

            // 2️⃣ Check expected amount
            if(paymentType.equals(PaymentType.MEMBERSHIP.toString())){
                String planCode = notes.optString("plan");
                SubscriptionPlan subscriptionPlan = subscriptionPlanService
                        .getPlanByCode(planCode);
                return amountInRupees == subscriptionPlan.getPrice();
            }else if(paymentType.equals(PaymentType.FINE.toString())){
                Long fineId = notes.getLong("fine_id");
                Fine fine =fineRepository.findById(fineId).orElseThrow(
                        () -> new FineException("Fine not found with given id....")
                );
                return  fine.getAmount()==amountInRupees;
            }


            return false;
        } catch (Exception e) {
            log.error("❌ Error verifying Razorpay payment: {}", e.getMessage(), e);
            return false;
        }
    }
}
