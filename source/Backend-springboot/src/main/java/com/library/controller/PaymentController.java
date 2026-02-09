package com.library.controller;

import com.library.exception.PaymentException;
import com.library.payload.dto.PaymentDTO;
import com.library.payload.request.PaymentInitiateRequest;
import com.library.payload.request.PaymentVerifyRequest;
import com.library.payload.response.ApiResponse;
import com.library.payload.response.PaymentInitiateResponse;
import com.library.payload.response.RevenueStatisticsResponse;
import com.library.service.PaymentService;
import com.library.service.impl.PaymentServiceImpl;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for Payment operations
 * Handles payment initiation, verification, and management
 * Supports both Razorpay and Stripe payment gateways
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentServiceImpl paymentServiceImpl;

    /**
     * Initiate a new payment
     * POST /api/payments/initiate
     *
     * Request body example:
     * {
     *   "userId": 1,
     *   "bookLoanId": 5,
     *   "paymentType": "FINE",
     *   "gateway": "RAZORPAY",
     *   "amount": 100.00,
     *   "currency": "INR",
     *   "description": "Overdue fine for book loan #5"
     * }
     */
    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@Valid @RequestBody PaymentInitiateRequest request) {
        try {
            PaymentInitiateResponse response = paymentService.initiatePayment(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Verify payment after gateway callback
     * POST /api/payments/verify
     *
     * Razorpay request body example:
     * {
     *   "paymentId": 123,
     *   "gateway": "RAZORPAY",
     *   "razorpayPaymentId": "pay_xxxxx",
     *   "razorpayOrderId": "order_xxxxx",
     *   "razorpaySignature": "signature_xxxxx",
     *   "transactionId": "TXN_xxxxx"
     * }
     *
     * Stripe request body example:
     * {
     *   "paymentId": 123,
     *   "gateway": "STRIPE",
     *   "stripePaymentIntentId": "pi_xxxxx",
     *   "transactionId": "TXN_xxxxx"
     * }
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {
        try {
            PaymentDTO payment = paymentService.verifyPayment(request);
            return ResponseEntity.ok(payment);
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get payment by ID
     * GET /api/payments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            PaymentDTO payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get payment by transaction ID
     * GET /api/payments/transaction/{transactionId}
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<?> getPaymentByTransactionId(@PathVariable String transactionId) {
        try {
            PaymentDTO payment = paymentService.getPaymentByTransactionId(transactionId);
            return ResponseEntity.ok(payment);
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get all payments for a user
     * GET /api/payments/user/{userId}?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPayments(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<PaymentDTO> payments = paymentService.getUserPayments(userId, pageable);
            return ResponseEntity.ok(payments);
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get all payments (Admin only)
     * GET /api/payments?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<PaymentDTO>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("DESC")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PaymentDTO> payments = paymentService.getAllPayments(pageable);
        return ResponseEntity.ok(payments);
    }

    /**
     * Cancel a pending payment
     * PUT /api/payments/{id}/cancel
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPayment(@PathVariable Long id) {
        try {
            PaymentDTO payment = paymentService.cancelPayment(id);
            return ResponseEntity.ok(payment);
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Retry a failed payment
     * POST /api/payments/{id}/retry
     */
    @PostMapping("/{id}/retry")
    public ResponseEntity<?> retryPayment(@PathVariable Long id) {
        try {
            PaymentInitiateResponse response = paymentService.retryPayment(id);
            return ResponseEntity.ok(response);
        } catch (PaymentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Razorpay webhook endpoint
     * POST /api/payments/webhook/razorpay
     *
     * Razorpay sends payment notifications to this endpoint
     * Events: payment.captured, payment_link.paid, payment.failed
     */
    @PostMapping("/webhook/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(@RequestBody String webhookBody) {
        try {
            log.info("Received Razorpay webhook");

            // Parse webhook payload
            JSONObject webhookPayload = new JSONObject(webhookBody);

            // Process webhook
            paymentServiceImpl.handleRazorpayWebhook(webhookPayload);

            log.info("Razorpay webhook processed successfully");
            return ResponseEntity.ok("Webhook processed successfully");

        } catch (Exception e) {
            log.error("Error processing Razorpay webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Webhook processing failed");
        }
    }

    /**
     * Get revenue statistics for current month (Admin only)
     * GET /api/payments/statistics/monthly-revenue
     *
     * Returns total revenue for the current month from completed payments
     *
     * Example response:
     * {
     *   "monthlyRevenue": 15250.50,
     *   "currency": "USD",
     *   "year": 2025,
     *   "month": 10
     * }
     */
    @GetMapping("/statistics/monthly-revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevenueStatisticsResponse> getMonthlyRevenue() {
        RevenueStatisticsResponse stats = paymentService.getMonthlyRevenue();
        return ResponseEntity.ok(stats);
    }


    @PostMapping("/stripe/checkout")
    public ResponseEntity<?> createStripeCheckout(@RequestBody Map<String, Object> payload) {
        try {
            String planName = (String) payload.get("planName");
            Double amount = Double.valueOf(payload.get("amount").toString());

            PaymentInitiateResponse response =
                    paymentService.createStripeCheckoutSession(planName, amount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Stripe checkout error", e);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @Transactional
    @PostMapping("/webhook/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            paymentService.handleStripeWebhook(payload, sigHeader);
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error");
        }
    }



}
