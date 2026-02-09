package com.library.exception;

/**
 * Custom exception for wishlist-related errors
 */
public class WishlistException extends Exception {

    public WishlistException(String message) {
        super(message);
    }

    public WishlistException(String message, Throwable cause) {
        super(message, cause);
    }
}
