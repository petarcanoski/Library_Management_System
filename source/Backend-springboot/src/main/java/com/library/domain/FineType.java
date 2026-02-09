package com.library.domain;

/**
 * Enum representing different types of fines in the library system
 */
public enum FineType {
    /**
     * Fine for overdue books (calculated daily)
     */
    OVERDUE,

    /**
     * Fine for damaged books
     */
    DAMAGE,

    /**
     * Fine for lost books (replacement cost)
     */
    LOSS,

    /**
     * Processing or administrative fees
     */
    PROCESSING
}
