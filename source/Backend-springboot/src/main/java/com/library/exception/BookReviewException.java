package com.library.exception;

/**
 * Custom exception for book review related errors
 */
public class BookReviewException extends RuntimeException {

    public BookReviewException(String message) {
        super(message);
    }

    public BookReviewException(String message, Throwable cause) {
        super(message, cause);
    }
}
