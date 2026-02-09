package com.library.exception;

/**
 * Custom exception for payment-related operations
 */
public class PaymentException extends Exception {

    public PaymentException(String message) {
        super(message);
    }

    public PaymentException(String message, Throwable cause) {
        super(message, cause);
    }
}
