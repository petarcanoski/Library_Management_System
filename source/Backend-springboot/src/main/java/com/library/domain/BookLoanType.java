package com.library.domain;

/**
 * Enum representing the type of book loan action
 */
public enum BookLoanType {
    /**
     * Regular checkout (book loan initiated)
     */
    CHECKOUT,

    /**
     * Book renewal (extending due date)
     */
    RENEWAL,

    /**
     * Book return (check-in)
     */
    RETURN
}
