package com.library.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.library.domain.PaymentGateway;
import com.stripe.exception.StripeException;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.library.domain.PaymentStatus;
import com.library.domain.PaymentType;
import com.library.exception.PaymentException;
import com.library.exception.SubscriptionException;
import com.library.exception.UserException;
import com.library.mapper.SubscriptionMapper;
import com.library.model.Payment;
import com.library.model.Subscription;
import com.library.model.SubscriptionPlan;
import com.library.model.User;
import com.library.payload.dto.SubscriptionDTO;
import com.library.payload.request.PaymentInitiateRequest;
import com.library.payload.request.SubscribeRequest;
import com.library.payload.response.PaymentInitiateResponse;
import com.library.repository.PaymentRepository;
import com.library.repository.SubscriptionRepository;
import com.library.repository.UserRepository;
import com.library.service.PaymentService;
import com.library.service.SubscriptionService;
import com.library.service.UserService;
import com.library.service.gateway.RazorpayService;
import com.library.service.gateway.StripeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of SubscriptionService
 * Handles subscription creation, renewal, cancellation with payment integration
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final RazorpayService razorpayService;
    private final StripeService stripeService;
    private final UserService userService;
    private final PaymentService paymentService;
    private final com.library.repository.SubscriptionPlanRepository subscriptionPlanRepository;


    @Override
    @Transactional
    public void createSubscriptionFromStripe(Long userId, Long planId) throws SubscriptionException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SubscriptionException("User not found"));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                .orElseThrow(() -> new SubscriptionException("Subscription plan not found"));

        // Deactivate existing subscription if exists
        subscriptionRepository.findActiveSubscriptionByUserId(userId, LocalDate.now())
                .ifPresent(existing -> {
                    existing.setIsActive(false);
                    existing.setCancelledAt(LocalDateTime.now());
                    existing.setCancellationReason("Upgraded via Stripe");
                    subscriptionRepository.save(existing);
                });

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setIsActive(true);
        subscription.setAutoRenew(true);
        subscription.setStartDate(LocalDate.now());
        subscription.calculateEndDate(); // YOU ALREADY HAVE THIS METHOD

        subscriptionRepository.save(subscription);
    }




//    @Override
//    @Transactional
//    public PaymentInitiateResponse subscribe(SubscribeRequest request)
//            throws SubscriptionException, UserException, PaymentException {
//
//        log.info("Processing subscription request for user: {}, plan ID: {}",
//            request.getUserId(), request.getPlanId());
//
//        // 1. Get current user
//
//
//        User user = getCurrentAuthenticatedUser();
//
//
//        // 2. Get subscription plan
//        SubscriptionPlan plan = subscriptionPlanRepository
//                .findById(request.getPlanId())
//            .orElseThrow(() -> new SubscriptionException("Subscription plan not found with ID: " + request.getPlanId()));
//
//        // Validate plan is active
//        if (!plan.getIsActive()) {
//            throw new SubscriptionException("Subscription plan is not currently available: " + plan.getName());
//        }
//
//        // 3. Check if user already has an active subscription
//        Optional<Subscription> existingSubscription = subscriptionRepository
//            .findActiveSubscriptionByUserId(user.getId(), LocalDate.now());
//
//        if (existingSubscription.isPresent()) {
//            throw new SubscriptionException(
//                "User already has an active subscription. Please cancel it before subscribing to a new plan.");
//        }
//
//        // 4. Create new subscription entity
//        Subscription subscription = new Subscription();
//        subscription.setUser(user);
//        subscription.setPlan(plan);
//        subscription.setAutoRenew(request.getAutoRenew() != null ? request.getAutoRenew() : false);
//
//        // Initialize from plan (sets price, maxBooks, maxDays, dates)
//        subscription.initializeFromPlan();
//
//        // Subscription starts as inactive until payment is confirmed
//        subscription.setIsActive(false);
//
//        subscription = subscriptionRepository.save(subscription);
//        log.info("Subscription created with ID: {}", subscription.getId());
//
//        // 5. Create payment entity
//        PaymentInitiateRequest paymentInitiateRequest = PaymentInitiateRequest
//                .builder()
//                .userId(user.getId())
//                .subscriptionId(subscription.getId())
//                .paymentType(PaymentType.MEMBERSHIP)
//                .gateway(request.getPaymentGateway())
//                .amount(subscription.getPrice())
//                .currency(subscription.getCurrency())
//                .description("Library Subscription - " + plan.getName())
//                .build();
//
//        return paymentService
//                .initiatePayment(paymentInitiateRequest);
//    }

    @Override
    public SubscriptionDTO activateSubscription(Long subscriptionId, Long paymentId)
            throws SubscriptionException {

        log.info("Activating subscription: {} after payment: {}", subscriptionId, paymentId);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
            .orElseThrow(() -> new SubscriptionException("Subscription not found with ID: " + subscriptionId));

        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new SubscriptionException("Payment not found with ID: " + paymentId));

        // Verify payment is successful
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new SubscriptionException(
                "Cannot activate subscription. Payment status is: " + payment.getStatus());
        }

        // Verify payment belongs to this subscription
        if (!payment.getSubscription().getId().equals(subscriptionId)) {
            throw new SubscriptionException("Payment does not belong to this subscription");
        }

        // Activate subscription
        subscription.setIsActive(true);

        // Ensure start date is set
        if (subscription.getStartDate() == null 
        || subscription.getStartDate().isBefore(LocalDate.now())) {
            subscription.setStartDate(LocalDate.now());
            subscription.calculateEndDate();
        }

        subscription = subscriptionRepository.save(subscription);

        log.info("Subscription activated successfully: {}", subscriptionId);
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    public SubscriptionDTO getUsersActiveSubscription(Long userId)
            throws SubscriptionException, UserException {

        if(userId!=null){
            if (!userRepository.existsById(userId)) {
                throw new SubscriptionException("User not found with ID: " + userId);
            }
        }
        else{
            User user=userService.getCurrentUser();
            userId=user.getId();
        }

        Subscription subscription = subscriptionRepository
            .findActiveSubscriptionByUserId(userId, LocalDate.now())
            .orElseThrow(() -> new SubscriptionException(
                "No active subscription found for user ID: "));
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    public List<SubscriptionDTO> getUserSubscriptions(Long userId)
            throws SubscriptionException, UserException {



        if(userId!=null){
            if (!userRepository.existsById(userId)) {
                throw new SubscriptionException("User not found with ID: " + userId);
            }
        }else{
            User user=userService.getCurrentUser();
            userId=user.getId();
        }


        List<Subscription> subscriptions = subscriptionRepository
            .findByUserIdOrderByCreatedAtDesc(userId);

        return subscriptions.stream().map(subscriptionMapper::toDTO).toList();
    }

    @Override
    public PaymentInitiateResponse renewSubscription(Long subscriptionId, SubscribeRequest request)
            throws SubscriptionException, UserException, PaymentException {

        Subscription oldSubscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new SubscriptionException("Subscription not found"));

        if (request.getPlanId() == null) {
            request.setPlanId(oldSubscription.getPlan().getId());
        }

        return subscribe(request);
    }


//    @Override
//    public PaymentInitiateResponse renewSubscription(Long subscriptionId, SubscribeRequest request)
//            throws SubscriptionException, UserException, PaymentException {
//
//        log.info("Renewing subscription: {}", subscriptionId);
//
//        Subscription oldSubscription = subscriptionRepository.findById(subscriptionId)
//            .orElseThrow(() -> new SubscriptionException(
//                "Subscription not found with ID: " + subscriptionId));
//
//        // Cancel old subscription if still active
//        if (oldSubscription.getIsActive()) {
//            oldSubscription.setIsActive(false);
//            oldSubscription.setCancelledAt(LocalDateTime.now());
//            oldSubscription.setCancellationReason("Renewed to new subscription");
//            subscriptionRepository.save(oldSubscription);
//        }
//
//        // Create new subscription with same or different plan
//        request.setUserId(oldSubscription.getUser().getId());
//        if (request.getPlanId() == null) {
//            request.setPlanId(oldSubscription.getPlan().getId());
//        }
//
//        return subscribe(request);
//    }

    @Override
    public SubscriptionDTO cancelSubscription(Long subscriptionId, String reason)
            throws SubscriptionException {

        log.info("Cancelling subscription: {} with reason: {}", subscriptionId, reason);

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
            .orElseThrow(() -> new SubscriptionException(
                "Subscription not found with ID: " + subscriptionId));

        if (!subscription.getIsActive()) {
            throw new SubscriptionException("Subscription is already inactive");
        }

        // Mark as cancelled
        subscription.setIsActive(false);
        subscription.setCancelledAt(LocalDateTime.now());
        subscription.setCancellationReason(reason != null ? reason : "Cancelled by user");

        subscription = subscriptionRepository.save(subscription);

        log.info("Subscription cancelled successfully: {}", subscriptionId);
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    public SubscriptionDTO getSubscriptionById(Long id) throws SubscriptionException {
        Subscription subscription = subscriptionRepository.findById(id)
            .orElseThrow(() -> new SubscriptionException("Subscription not found with ID: " + id));

        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    public List<SubscriptionDTO> getAllActiveSubscriptions(Pageable pageable) {
        List<Subscription> subscriptions = subscriptionRepository
            .findAll();

        return subscriptions.stream().map(
                subscriptionMapper::toDTO
        ).toList();
    }

    @Override
    public void deactivateExpiredSubscriptions() {
        log.info("Running subscription expiry check at {}", LocalDateTime.now());

        List<Subscription> expiredSubscriptions = subscriptionRepository
            .findExpiredActiveSubscriptions(LocalDate.now());

        int deactivatedCount = 0;
        for (Subscription subscription : expiredSubscriptions) {
            subscription.setIsActive(false);
            subscription.setNotes(
                (subscription.getNotes() != null ? subscription.getNotes() + "\n" : "") +
                "Auto-deactivated on " + LocalDate.now() + " due to expiry");
            subscriptionRepository.save(subscription);
            deactivatedCount++;

            log.debug("Deactivated expired subscription ID: {} for user: {}",
                subscription.getId(), subscription.getUser().getEmail());
        }

        log.info("Deactivated {} expired subscriptions", deactivatedCount);
    }

    @Override
    public boolean hasValidSubscription(Long userId) {
        return subscriptionRepository
        .hasActiveSubscription(userId, LocalDate.now());
    }

    // ==================== EVENT LISTENERS ====================

    /**
     * Event listener for payment success events.
     * Automatically activates subscription when a subscription payment succeeds.
     * This decouples payment processing from subscription activation.
     *
     * @param event Payment success event containing payment details
     */
//    @EventListener
//    @Async
//    @Transactional
//    public void handlePaymentSuccess(PaymentSuccessEvent event) {
//        log.info("Received PaymentSuccessEvent for payment ID: {}, type: {}",
//            event.getPaymentId(), event.getPaymentType());
//
//        // Only process subscription payments
//        if (event.getPaymentType() == PaymentType.MEMBERSHIP && event.getSubscriptionId() != null) {
//            try {
//                log.info("Activating subscription {} after payment success",
//                    event.getSubscriptionId());
//
//                activateSubscription(
//                        event.getSubscriptionId(),
//                        event.getPaymentId()
//                );
//
//                log.info("Subscription {} activated successfully via event",
//                    event.getSubscriptionId());
//
//            } catch (SubscriptionException e) {
//                log.error("Failed to activate subscription {} via event: {}",
//                    event.getSubscriptionId(), e.getMessage(), e);
//                // Event handling failure - could trigger compensation logic here
//            }
//        }
//    }

    // ==================== HELPER METHODS ====================

    /**
     * Get currently authenticated user
     */
    private User getCurrentAuthenticatedUser() throws UserException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserException("User not authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new UserException("Authenticated user not found");
        }

        return user;
    }

//    @Override
//    @Transactional
//    public PaymentInitiateResponse subscribe(SubscribeRequest request)
//            throws SubscriptionException, UserException, PaymentException {
//
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new UserException("User not found"));
//
//        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getPlanId())
//                .orElseThrow(() -> new SubscriptionException("Plan not found"));
//
//        // Create inactive subscription FIRST
//        Subscription subscription = new Subscription();
//        subscription.setUser(user);
//        subscription.setPlan(plan);
//        subscription.setPrice(plan.getPrice());
//        subscription.setCurrency("USD");
//        subscription.setStartDate(LocalDate.now());
//        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
//        subscription.setIsActive(false);
//        subscription.setAutoRenew(true);
//
//        subscription = subscriptionRepository.save(subscription);
//
//        // Stripe checkout
//        String checkoutUrl;
//        try {
//            checkoutUrl = stripeService.createCheckoutSession(user, subscription);
//        } catch (StripeException e) {
//            throw new PaymentException("Stripe checkout failed");
//        }
//
//        return PaymentInitiateResponse.builder()
//                .success(true)
//                .gateway(PaymentGateway.STRIPE)
//                .checkoutUrl(checkoutUrl)
//                .message("Redirect to Stripe")
//                .build();
//    }

    @Override
    @Transactional
    public PaymentInitiateResponse subscribe(SubscribeRequest request)
            throws SubscriptionException, UserException, PaymentException {

        // ✅ Get authenticated user
        User user = getCurrentAuthenticatedUser();

        // ✅ Get plan
        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getPlanId())
                .orElseThrow(() -> new SubscriptionException("Plan not found"));

        // ✅ Deactivate existing subscription if exists
        subscriptionRepository.findActiveSubscriptionByUserId(user.getId(), LocalDate.now())
                .ifPresent(existing -> {
                    existing.setIsActive(false);
                    existing.setCancelledAt(LocalDateTime.now());
                    existing.setCancellationReason("Upgraded");
                    subscriptionRepository.save(existing);
                });

        // ✅ Create inactive subscription (activated by webhook)
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);

// 💡 INHERIT PLAN LIMITS (THIS FIXES YOUR ERROR)
        subscription.setMaxBooksAllowed(plan.getMaxBooksAllowed());
        subscription.setMaxDaysPerBook(plan.getMaxDaysPerBook());

        subscription.setPrice(plan.getPrice());
        subscription.setCurrency("USD");
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        subscription.setIsActive(true);
        subscription.setAutoRenew(
                request.getAutoRenew() != null && request.getAutoRenew()
        );


        subscription = subscriptionRepository.save(subscription);

        // ✅ Create Stripe Checkout
        String checkoutUrl;
        try {
            checkoutUrl = stripeService.createCheckoutSession(user, subscription);
        } catch (StripeException e) {
            throw new PaymentException("Stripe checkout failed", e);
        }

        return PaymentInitiateResponse.builder()
                .success(true)
                .gateway(PaymentGateway.STRIPE)
                .checkoutUrl(checkoutUrl)
                .message("Redirect to Stripe")
                .build();
    }


}
