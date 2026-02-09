package com.library.domain;

/**
 * Enum representing the type/purpose of a payment
 */
public enum PaymentType {
    /**
     * Payment for overdue book fine
     */
    FINE,

    /**
     * Payment for library membership fee
     */
    MEMBERSHIP,

    /**
     * Payment for lost book penalty
     */
    LOST_BOOK_PENALTY,

    /**
     * Payment for damaged book penalty
     */
    DAMAGED_BOOK_PENALTY,

    /**
     * Refund issued to user
     */
    REFUND,

    /**
     * Other miscellaneous payments
     */
    OTHER
}
