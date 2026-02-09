package com.library.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.exception.PaymentException;
import com.library.exception.SubscriptionException;
import com.library.exception.UserException;
import com.library.payload.dto.SubscriptionDTO;
import com.library.payload.request.SubscribeRequest;
import com.library.payload.response.ApiResponse;
import com.library.payload.response.PaymentInitiateResponse;
import com.library.service.SubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST Controller for subscription operations
 */
@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /**
     * Create new subscription with payment
     * POST /api/subscriptions/subscribe
     */
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscribeRequest request) {
        try {
            log.info("Subscription request received for user: {}", request.getPlanId());
            PaymentInitiateResponse response = subscriptionService.subscribe(request);
            return ResponseEntity.ok(response);
        } catch (SubscriptionException e) {
            log.error("Subscription creation failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(),false));
        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(),false));
        } catch (PaymentException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Get active and past subscriptions for current user
     * GET /api/subscriptions/my?page=0&size=10
     */
    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMySubscriptions(
            @RequestParam(required = false) Long userId) {
        try {

            List<SubscriptionDTO> subscriptions = subscriptionService
                    .getUserSubscriptions(userId);
            return ResponseEntity.ok(subscriptions);
        } catch (SubscriptionException | UserException e) {
            log.error("Failed to fetch user subscriptions", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse( e.getMessage(),false));
        }
    }

    /**
     * Get active subscription for user
     * GET /api/subscriptions/active?userId={userId}
     */
    @GetMapping("/user/active")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getActiveSubscription(
            @RequestParam(required = false) Long userId
    ) {
        try {
            SubscriptionDTO subscription = subscriptionService.getUsersActiveSubscription(userId);
            return ResponseEntity.ok(subscription);
        } catch (SubscriptionException | UserException e) {
            log.error("Failed to fetch active subscription", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(),false));
        }
    }

    /**
     * Check if user has valid subscription
     * GET /api/subscriptions/check?userId={userId}
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkValidSubscription(@RequestParam Long userId) {
        boolean hasValidSubscription = subscriptionService.hasValidSubscription(userId);
        return ResponseEntity.ok(new ApiResponse(

            hasValidSubscription
                    ? "User has valid subscription" : "No valid subscription found",
                hasValidSubscription));
    }

    /**
     * Get subscription by ID
     * GET /api/subscriptions/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getSubscriptionById(@PathVariable Long id) {
        try {
            SubscriptionDTO subscription = subscriptionService.getSubscriptionById(id);
            return ResponseEntity.ok(subscription);
        } catch (SubscriptionException e) {
            log.error("Subscription not found: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(),false));
        }
    }

    /**
     * Renew expired subscription
     * POST /api/subscriptions/renew/{subscriptionId}
     */
    @PostMapping("/renew/{subscriptionId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> renewSubscription(
            @PathVariable Long subscriptionId,
            @Valid @RequestBody SubscribeRequest request) {
        try {
            log.info("Renewing subscription: {}", subscriptionId);
            PaymentInitiateResponse response = subscriptionService.renewSubscription(subscriptionId, request);
            return ResponseEntity.ok(response);
        } catch (SubscriptionException | UserException e) {
            log.error("Subscription renewal failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse( e.getMessage(),false));
        } catch (PaymentException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Cancel active subscription
     * POST /api/subscriptions/cancel/{subscriptionId}
     */
    @PostMapping("/cancel/{subscriptionId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> cancelSubscription(
            @PathVariable Long subscriptionId,
            @RequestParam(required = false) String reason) {
        try {
            log.info("Cancelling subscription: {}", subscriptionId);
            SubscriptionDTO subscription = subscriptionService.cancelSubscription(subscriptionId, reason);
            return ResponseEntity.ok(subscription);
        } catch (SubscriptionException e) {
            log.error("Subscription cancellation failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(),false));
        }
    }

    /**
     * Activate subscription after successful payment (webhook callback)
     * POST /api/subscriptions/activate
     */
    @PostMapping("/activate")
    public ResponseEntity<?> activateSubscription(
            @RequestParam Long subscriptionId,
            @RequestParam Long paymentId) {
        try {
            log.info("Activating subscription: {} for payment: {}", subscriptionId, paymentId);
            SubscriptionDTO subscription = subscriptionService
            
        .activateSubscription(subscriptionId, paymentId);
            return ResponseEntity.ok(subscription);
        } catch (SubscriptionException e) {
            log.error("Subscription activation failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse( e.getMessage(),false));
        }
    }

    // ================ ADMIN ENDPOINTS ================

    /**
     * Get all active subscriptions (Admin)
     * GET /api/subscriptions/admin/active?page=0&size=20
     */
    @GetMapping("/admin/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllActiveSubscriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<SubscriptionDTO> subscriptions = subscriptionService
                .getAllActiveSubscriptions(pageable);
        return ResponseEntity.ok(subscriptions);
    }

    /**
     * Manually deactivate expired subscriptions (Admin/Scheduler)
     * POST /api/subscriptions/admin/deactivate-expired
     */
    @PostMapping("/admin/deactivate-expired")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateExpiredSubscriptions() {
        try {
            log.info("Admin triggered subscription expiry check");
            subscriptionService.deactivateExpiredSubscriptions();
            return ResponseEntity.ok(new ApiResponse(
                    "Expired subscriptions deactivated successfully"
                    ,false));
        } catch (Exception e) {
            log.error("Failed to deactivate expired subscriptions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(
                        "Failed to deactivate subscriptions: " + e.getMessage()
                        ,false));
        }
    }
}
