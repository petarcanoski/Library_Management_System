package com.library.exception;

/**
 * Custom exception for book-related operations
 */
public class BookException extends Exception {

    public BookException(String message) {
        super(message);
    }

    public BookException(String message, Throwable cause) {
        super(message, cause);
    }
}
