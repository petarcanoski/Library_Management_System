package com.library.service;

import com.library.exception.PaymentException;
import com.library.exception.SubscriptionException;
import com.library.exception.UserException;
import com.library.payload.dto.SubscriptionDTO;
import com.library.payload.request.SubscribeRequest;
import com.library.payload.response.PaymentInitiateResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for subscription operations
 */
public interface SubscriptionService {

    void createSubscriptionFromStripe(Long userId, Long planId) throws SubscriptionException;

    /**
     * Create new subscription with payment
     */
    PaymentInitiateResponse subscribe(SubscribeRequest request) throws SubscriptionException, UserException, PaymentException;

    /**
     * Get active subscription for user
     */
    SubscriptionDTO getUsersActiveSubscription(Long userId) throws SubscriptionException, UserException;

    /**
     * Get all subscriptions for user
     */
    List<SubscriptionDTO> getUserSubscriptions(Long userId) throws SubscriptionException, UserException;

    /**
     * Renew subscription
     */
    PaymentInitiateResponse renewSubscription(Long subscriptionId, SubscribeRequest request) throws SubscriptionException, UserException, PaymentException;

    /**
     * Cancel subscription
     */
    SubscriptionDTO cancelSubscription(Long subscriptionId, String reason) throws SubscriptionException;

    /**
     * Get subscription by ID
     */
    SubscriptionDTO getSubscriptionById(Long id) throws SubscriptionException;

    /**
     * Verify and activate subscription after successful payment
     */
    SubscriptionDTO activateSubscription(Long subscriptionId, Long paymentId) throws SubscriptionException;

    /**
     * Get all active subscriptions (Admin)
     */
    List<SubscriptionDTO> getAllActiveSubscriptions(Pageable pageable);

    /**
     * Deactivate expired subscriptions (Scheduler)
     */
    void deactivateExpiredSubscriptions();

    /**
     * Check if user has valid subscription
     */
    boolean hasValidSubscription(Long userId);
}
