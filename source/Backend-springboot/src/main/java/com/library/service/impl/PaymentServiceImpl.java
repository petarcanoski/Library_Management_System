package com.library.service.impl;

import com.library.domain.PaymentGateway;
import com.library.domain.PaymentStatus;
import com.library.domain.PaymentType;
import com.library.event.PaymentFailedEvent;
import com.library.event.PaymentInitiatedEvent;
import com.library.event.PaymentSuccessEvent;
import com.library.event.publisher.PaymentEventPublisher;
import com.library.exception.PaymentException;
import com.library.exception.SubscriptionException;
import com.library.mapper.PaymentMapper;
import com.library.model.*;
import com.library.payload.dto.PaymentDTO;
import com.library.payload.request.PaymentInitiateRequest;
import com.library.payload.request.PaymentVerifyRequest;
import com.library.payload.response.PaymentInitiateResponse;
import com.library.payload.response.RevenueStatisticsResponse;
import com.library.repository.*;
import com.library.service.PaymentService;
import com.library.service.SubscriptionService;
import com.library.service.gateway.RazorpayService;
import com.library.service.gateway.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.library.payload.response.PaymentLinkResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Value;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;

/**
 * Implementation of PaymentService
 * Handles payment processing with Razorpay and Stripe
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final BookLoanRepository bookLoanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentMapper paymentMapper;
    private final RazorpayService razorpayService;
    private final StripeService stripeService;
    private final FineRepository fineRepository;
    private final PaymentEventPublisher paymentEventPublisher;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;





    @Override
    public PaymentInitiateResponse initiatePayment(
            PaymentInitiateRequest request) throws PaymentException {
        log.info("Initiating payment for user: {}, type: {}, gateway: {}",
                request.getUserId(), request.getPaymentType(), request.getGateway());

        // 1. Validate user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new PaymentException("User not found with ID: " + request.getUserId()));

        // 2. Create payment record
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPaymentType(request.getPaymentType());
        payment.setGateway(request.getGateway());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        payment.setDescription(request.getDescription());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId("TXN_" + UUID.randomUUID());
        payment.setInitiatedAt(LocalDateTime.now());

        // 3. Link associations (if provided)
        if (request.getSubscriptionId() != null) {
            Subscription sub = subscriptionRepository
                    .findById(request.getSubscriptionId())
                    .orElseThrow(() -> new PaymentException("Subscription not found"));
            payment.setSubscription(sub);
        }

        if (request.getBookLoanId() != null) {
            BookLoan loan = bookLoanRepository.findById(request.getBookLoanId())
                    .orElseThrow(() -> new PaymentException("Book loan not found"));
            payment.setBookLoan(loan);
        }

        if (request.getFineId() != null) {
            Fine fine = fineRepository.findById(request.getFineId())
                    .orElseThrow(() -> new PaymentException("Fine not found"));
            payment.setFine(fine);
        }

        payment = paymentRepository.save(payment);

        // 4. Initiate payment with gateway
        PaymentInitiateResponse response;
        if (request.getGateway() == PaymentGateway.RAZORPAY) {
            PaymentLinkResponse linkResponse = razorpayService.createPaymentLink(
                    user,
                    payment
            );

            response= PaymentInitiateResponse.builder()
                    .paymentId(payment.getId())
                    .gateway(payment.getGateway())
                    .checkoutUrl(linkResponse.getPayment_link_url())
                    .transactionId(linkResponse.getPayment_link_id())
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .description(payment.getDescription())
                    .success(true)
                    .message("Payment initiated successfully")
                    .build();


            payment.setGatewayOrderId(linkResponse.getPayment_link_id());
        } else if (request.getGateway() == PaymentGateway.STRIPE) {
            if (payment.getSubscription() == null) {
                throw new PaymentException("Stripe subscription payment requires subscription");
            }

            try {
                String checkoutUrl = stripeService.createCheckoutSession(
                        user,
                        payment.getSubscription()
                );

                response = PaymentInitiateResponse.builder()
                        .paymentId(payment.getId())
                        .gateway(PaymentGateway.STRIPE)
                        .checkoutUrl(checkoutUrl)
                        .amount(payment.getAmount())
                        .currency(payment.getCurrency())
                        .success(true)
                        .message("Stripe checkout session created")
                        .build();

            } catch (StripeException e) {
                throw new PaymentException("Stripe checkout failed", e);
            }
        } else {
            throw new PaymentException("Unsupported payment gateway: " + request.getGateway());
        }

        payment.setStatus(PaymentStatus.PROCESSING);
        payment = paymentRepository.save(payment);

        // Publish payment initiated event
        publishPaymentInitiatedEvent(payment, response.getCheckoutUrl());

        return response;
    }

    @Override
    public PaymentDTO verifyPayment(PaymentVerifyRequest request) throws PaymentException {



        // gatway payment
        JSONObject paymentDetails = razorpayService
                .fetchPaymentDetails(request.getRazorpayPaymentId());

        System.out.println("gatway payment details: " + paymentDetails);

        long amount = paymentDetails.getLong("amount");


        // Extract 'notes' object
        JSONObject notes = paymentDetails.getJSONObject("notes");

        // Access specific fields inside 'notes'

        Long paymentId = Long.parseLong(notes.optString("payment_id"));


        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new PaymentException("Payment not found with ID: " + paymentId));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            log.warn("Payment already completed: {}", payment.getId());
            return paymentMapper.toDTO(payment);
        }

        boolean isValid = razorpayService.isValidPayment(
                request.getRazorpayPaymentId());

        if (payment.getGateway() == PaymentGateway.RAZORPAY) {

            if (isValid) {
                payment.setGatewayPaymentId(request.getRazorpayPaymentId());
                payment.setGatewayOrderId(request.getRazorpayOrderId());
                payment.setGatewaySignature(request.getRazorpaySignature());
            }
        } else if (payment.getGateway() == PaymentGateway.STRIPE) {
            isValid = stripeService.verifyPayment(request.getStripePaymentIntentId());

            if (isValid) {
                payment.setGatewayPaymentId(request.getStripePaymentIntentId());
            }
        }

        if (isValid) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setCompletedAt(LocalDateTime.now());
            log.info("Payment verified successfully: {}", payment.getId());

            // Save payment first
            payment = paymentRepository.save(payment);

            // Publish payment success event (instead of direct service calls)
            publishPaymentSuccessEvent(payment);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Payment verification failed");
            log.error("Payment verification failed: {}", payment.getId());
            payment = paymentRepository.save(payment);

            // Publish payment failed event
            publishPaymentFailedEvent(payment);
        }

        return paymentMapper.toDTO(payment);
    }

    @Override
    public PaymentDTO getPaymentById(Long paymentId) throws PaymentException {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new PaymentException("Payment not found with ID: " + paymentId));
        return paymentMapper.toDTO(payment);
    }

    @Override
    public PaymentDTO getPaymentByTransactionId(String transactionId) throws PaymentException {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new PaymentException("Payment not found with transaction ID: " + transactionId));
        return paymentMapper.toDTO(payment);
    }

    @Override
    public Page<PaymentDTO> getUserPayments(Long userId, Pageable pageable) throws PaymentException {
        if (!userRepository.existsById(userId)) {
            throw new PaymentException("User not found with ID: " + userId);
        }
        Page<Payment> payments = paymentRepository.findByUserIdAndActiveTrue(userId, pageable);
        return payments.map(paymentMapper::toDTO);
    }

    @Override
    public Page<PaymentDTO> getAllPayments(Pageable pageable) {
        Page<Payment> payments = paymentRepository.findAll(pageable);
        return payments.map(paymentMapper::toDTO);
    }

    @Override
    public PaymentDTO cancelPayment(Long paymentId) throws PaymentException {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new PaymentException("Payment not found with ID: " + paymentId));

        if (!payment.isPending()) {
            throw new PaymentException("Only pending payments can be cancelled");
        }

        payment.setStatus(PaymentStatus.CANCELLED);
        payment = paymentRepository.save(payment);

        log.info("Payment cancelled: {}", paymentId);
        return paymentMapper.toDTO(payment);
    }

    @Override
    public PaymentInitiateResponse retryPayment(Long paymentId) throws PaymentException {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new PaymentException("Payment not found with ID: " + paymentId));

        if (!payment.canRetry()) {
            throw new PaymentException("Payment cannot be retried. Max retry attempts reached or payment is not in failed/cancelled state");
        }

        // Create new payment initiate request from existing payment
        PaymentInitiateRequest request = new PaymentInitiateRequest();
        request.setUserId(payment.getUser().getId());
        request.setBookLoanId(payment.getBookLoan() != null ? payment.getBookLoan().getId() : null);
        request.setPaymentType(payment.getPaymentType());
        request.setGateway(payment.getGateway());
        request.setAmount(payment.getAmount());
        request.setCurrency(payment.getCurrency());
        request.setDescription(payment.getDescription());

        // Increment retry count
        payment.setRetryCount(payment.getRetryCount() + 1);
        paymentRepository.save(payment);

        log.info("Retrying payment: {}, Retry count: {}", paymentId, payment.getRetryCount());
        return initiatePayment(request);
    }

    @Override
    public RevenueStatisticsResponse getMonthlyRevenue() {
        List<Payment> payments=paymentRepository.findAll();

        int currentYear = LocalDateTime.now().getYear();
        int currentMonth = LocalDateTime.now().getMonthValue();

        // Filter only successful payments of this month
        double totalRevenue = payments.stream()
                .filter(Payment::isSuccessful)
                .filter(p -> p.getCreatedAt() != null &&
                        p.getCreatedAt().getYear() == currentYear &&
                        p.getCreatedAt().getMonthValue() == currentMonth)
                .mapToDouble(p -> p.getAmount().doubleValue())
                .sum();

        // Determine currency (default to INR if mixed/null)
        String currency = payments.stream()
                .filter(Payment::isSuccessful)
                .map(Payment::getCurrency)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("INR");

        // Build response
        RevenueStatisticsResponse response = new RevenueStatisticsResponse();
        response.setMonthlyRevenue(totalRevenue);
        response.setCurrency(currency);
        response.setYear(currentYear);
        response.setMonth(currentMonth);

        return response;
    }


    /**
     * Handle Razorpay webhook for payment updates
     * Called when Razorpay sends webhook notifications for payment events
     */
    public void handleRazorpayWebhook(JSONObject webhookPayload) {
        try {
            String event = webhookPayload.getString("event");
            log.info("Processing Razorpay webhook event: {}", event);

            if ("payment.captured".equals(event) || "payment_link.paid".equals(event)) {
                JSONObject payload = webhookPayload.getJSONObject("payload");
                JSONObject paymentEntity = payload.getJSONObject("payment").getJSONObject("entity");

                String gatewayPaymentId = paymentEntity.getString("id");

                // Try to find payment by transaction ID or notes
                Payment payment = null;

                if (paymentEntity.has("notes")) {
                    JSONObject notes = paymentEntity.getJSONObject("notes");
                    if (notes.has("payment_id")) {
                        Long paymentId = notes.getLong("payment_id");
                        payment = paymentRepository.findById(paymentId).orElse(null);
                    }
                }

                if (payment != null && payment.getStatus() != PaymentStatus.SUCCESS) {
                    payment.setStatus(PaymentStatus.SUCCESS);
                    payment.setCompletedAt(LocalDateTime.now());
                    payment.setGatewayPaymentId(gatewayPaymentId);

                    // Extract payment method
                    if (paymentEntity.has("method")) {
                        payment.setPaymentMethod(paymentEntity.getString("method"));
                    }

                    payment = paymentRepository.save(payment);
                    log.info("Payment {} marked as successful via webhook", payment.getId());

                    // Publish payment success event (instead of direct service calls)
                    publishPaymentSuccessEvent(payment);
                }
            } else if ("payment.failed".equals(event)) {
                // Handle failed payment
                JSONObject payload = webhookPayload.getJSONObject("payload");
                JSONObject paymentEntity = payload.getJSONObject("payment").getJSONObject("entity");

                if (paymentEntity.has("notes")) {
                    JSONObject notes = paymentEntity.getJSONObject("notes");
                    if (notes.has("payment_id")) {
                        Long paymentId = notes.getLong("payment_id");
                        Payment payment = paymentRepository.findById(paymentId).orElse(null);

                        if (payment != null && payment.isPending()) {
                            payment.setStatus(PaymentStatus.FAILED);
                            payment.setFailureReason(paymentEntity.optString("error_description", "Payment failed"));
                            payment = paymentRepository.save(payment);
                            log.info("Payment {} marked as failed via webhook", payment.getId());

                            // Publish payment failed event
                            publishPaymentFailedEvent(payment);
                        }
                    }
                }
            }

        } catch (Exception e) {
            log.error("Error processing Razorpay webhook: {}", e.getMessage(), e);
        }
    }

    /**
     * Publish payment initiated event to notify other services.
     * This can be used for tracking and sending initial notifications.
     *
     * @param payment The initiated payment
     * @param checkoutUrl The URL for user to complete payment
     */
    private void publishPaymentInitiatedEvent(Payment payment, String checkoutUrl) {
        PaymentInitiatedEvent event = PaymentInitiatedEvent.builder()
            .paymentId(payment.getId())
            .userId(payment.getUser().getId())
            .paymentType(payment.getPaymentType())
            .gateway(payment.getGateway())
            .amount(payment.getAmount())
            .currency(payment.getCurrency())
            .subscriptionId(payment.getSubscription() != null ? payment.getSubscription().getId() : null)
            .fineId(payment.getFine() != null ? payment.getFine().getId() : null)
            .bookLoanId(payment.getBookLoan() != null ? payment.getBookLoan().getId() : null)
            .transactionId(payment.getTransactionId())
            .initiatedAt(payment.getInitiatedAt())
            .description(payment.getDescription())
            .checkoutUrl(checkoutUrl)
            .userEmail(payment.getUser().getEmail())
            .userName(payment.getUser().getFullName())
            .build();

        paymentEventPublisher.publishPaymentInitiated(event);
    }

    /**
     * Publish payment success event to notify other services.
     * This decouples payment processing from domain-specific actions.
     *
     * @param payment The successful payment
     */
    private void publishPaymentSuccessEvent(Payment payment) {
        PaymentSuccessEvent event = PaymentSuccessEvent.builder()
            .paymentId(payment.getId())
            .userId(payment.getUser().getId())
            .paymentType(payment.getPaymentType())
            .amount(payment.getAmount())
            .currency(payment.getCurrency())
            .subscriptionId(payment.getSubscription() != null ? payment.getSubscription().getId() : null)
            .fineId(payment.getFine() != null ? payment.getFine().getId() : null)
            .bookLoanId(payment.getBookLoan() != null ? payment.getBookLoan().getId() : null)
            .gatewayPaymentId(payment.getGatewayPaymentId())
            .transactionId(payment.getTransactionId())
            .completedAt(payment.getCompletedAt())
            .description(payment.getDescription())
            .build();

        paymentEventPublisher.publishPaymentSuccess(event);
    }

    /**
     * Publish payment failed event to notify other services.
     * This allows services to react to failures (e.g., send notifications, log errors).
     *
     * @param payment The failed payment
     */
    private void publishPaymentFailedEvent(Payment payment) {
        PaymentFailedEvent event = PaymentFailedEvent.builder()
            .paymentId(payment.getId())
            .userId(payment.getUser().getId())
            .paymentType(payment.getPaymentType())
            .amount(payment.getAmount())
            .currency(payment.getCurrency())
            .subscriptionId(payment.getSubscription() != null ? payment.getSubscription().getId() : null)
            .fineId(payment.getFine() != null ? payment.getFine().getId() : null)
            .bookLoanId(payment.getBookLoan() != null ? payment.getBookLoan().getId() : null)
            .failureReason(payment.getFailureReason())
            .gatewayPaymentId(payment.getGatewayPaymentId())
            .transactionId(payment.getTransactionId())
            .failedAt(LocalDateTime.now())
            .description(payment.getDescription())
            .userEmail(payment.getUser().getEmail())
            .userName(payment.getUser().getFullName())
            .build();

        paymentEventPublisher.publishPaymentFailed(event);
    }


    @Override
    public PaymentInitiateResponse createStripeCheckoutSession(String planName, Double amount) throws PaymentException {

        try {
            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl("http://localhost:5173/subscriptions?success=true")
                            .setCancelUrl("http://localhost:5173/subscriptions?cancel=true")
                            .addLineItem(
                                    SessionCreateParams.LineItem.builder()
                                            .setQuantity(1L)
                                            .setPriceData(
                                                    SessionCreateParams.LineItem.PriceData.builder()
                                                            .setCurrency("usd")
                                                            .setUnitAmount((long) (amount * 100))
                                                            .setProductData(
                                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                            .setName(planName)
                                                                            .build()
                                                            )
                                                            .build()
                                            )
                                            .build()
                            )
                            .build();

            Session session = Session.create(params);

            return PaymentInitiateResponse.builder()
                    .checkoutUrl(session.getUrl())
                    .gateway(PaymentGateway.STRIPE)
                    .success(true)
                    .message("Stripe checkout session created")
                    .build();


        }catch (StripeException e) {
            log.error("Stripe error message: {}", e.getMessage(), e);
            throw new PaymentException("Stripe checkout failed: " + e.getMessage());
        }

    }


    public void handleStripeWebhook(String payload, String sigHeader) throws PaymentException {

        Event event;

        try {
            event = Webhook.constructEvent(
                    payload,
                    sigHeader,
                    stripeWebhookSecret
            );
        } catch (Exception e) {
            throw new PaymentException("Invalid Stripe webhook signature");
        }

        if (!"checkout.session.completed".equals(event.getType())) {
            return;
        }

        Session session = (Session) event.getDataObjectDeserializer()
                .getObject()
                .orElseThrow();


        log.error("🔥 STRIPE METADATA = {}",session.getMetadata());
        Long userId = Long.valueOf(session.getMetadata().get("userId"));
        Long planId = Long.valueOf(session.getMetadata().get("planId"));
        Long amount = (long) ((long)session.getAmountTotal() / 100.0);

        User user = userRepository.findById(userId)
                .orElseThrow();

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow();

        // ✅ CREATE SUBSCRIPTION
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setPrice(plan.getPrice());
        subscription.setCurrency("USD");
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        subscription.setIsActive(true);
        subscription.setAutoRenew(true);

        subscription = subscriptionRepository.save(subscription);

        // ✅ CREATE PAYMENT
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setSubscription(subscription);
        payment.setPaymentType(PaymentType.MEMBERSHIP);
        payment.setGateway(PaymentGateway.STRIPE);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setAmount(amount);
        payment.setCurrency("USD");
        payment.setGatewayPaymentId(session.getPaymentIntent());
        payment.setCompletedAt(LocalDateTime.now());

        paymentRepository.save(payment);

        // ✅ PUBLISH EVENT (ADMIN PANEL UPDATES)
        publishPaymentSuccessEvent(payment);

        log.info("✅ Subscription {} activated for user {}", subscription.getId(), userId);
        log.info("Stripe payment processed successfully for user {}", userId);
    }




}
