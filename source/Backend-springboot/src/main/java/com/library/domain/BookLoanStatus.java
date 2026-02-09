package com.library.domain;

/**
 * Enum representing the status of a book loan
 */
public enum BookLoanStatus {
    /**
     * Book is currently checked out by user
     */
    CHECKED_OUT,

    /**
     * Book has been returned and loan is complete
     */
    RETURNED,

    /**
     * Loan is overdue (past due date and not returned)
     */
    OVERDUE,

    /**
     * Book was lost by the user
     */
    LOST,

    /**
     * Book was damaged during loan period
     */
    DAMAGED
}
