package com.library.service;

import com.library.exception.PaymentException;
import com.library.exception.SubscriptionException;
import com.library.payload.dto.PaymentDTO;
import com.library.payload.request.PaymentInitiateRequest;
import com.library.payload.request.PaymentVerifyRequest;
import com.library.payload.response.PaymentInitiateResponse;
import com.library.payload.response.RevenueStatisticsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for payment operations
 * Handles payment initiation, verification, and management
 */
public interface PaymentService {

    /**
     * Initiate a new payment (creates order with payment gateway)
     */
    PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request) throws PaymentException;

    /**
     * Verify payment after gateway callback
     */
    PaymentDTO verifyPayment(PaymentVerifyRequest request) throws PaymentException;

    /**
     * Get payment by ID
     */
    PaymentDTO getPaymentById(Long paymentId) throws PaymentException;

    /**
     * Get payment by transaction ID
     */
    PaymentDTO getPaymentByTransactionId(String transactionId) throws PaymentException;

    /**
     * Get all payments for a user
     */
    Page<PaymentDTO> getUserPayments(Long userId, Pageable pageable) throws PaymentException;

    /**
     * Get all payments (admin)
     */
    Page<PaymentDTO> getAllPayments(Pageable pageable);

    /**
     * Cancel a pending payment
     */
    PaymentDTO cancelPayment(Long paymentId) throws PaymentException;

    /**
     * Retry a failed payment
     */
    PaymentInitiateResponse retryPayment(Long paymentId) throws PaymentException;

    /**
     * Get monthly revenue statistics (Admin only)
     */
    RevenueStatisticsResponse getMonthlyRevenue();

    PaymentInitiateResponse createStripeCheckoutSession(String planName, Double amount) throws PaymentException;


    void handleStripeWebhook(String payload, String sigHeader) throws PaymentException, SubscriptionException;

}
