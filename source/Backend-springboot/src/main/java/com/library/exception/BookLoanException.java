package com.library.exception;

/**
 * Custom exception for book loan-related operations
 */
public class BookLoanException extends RuntimeException {

    public BookLoanException(String message) {
        super(message);
    }

    public BookLoanException(String message, Throwable cause) {
        super(message, cause);
    }
}
