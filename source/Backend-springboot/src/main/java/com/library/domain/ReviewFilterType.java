package com.library.domain;

/**
 * Enum for filtering book reviews
 */
public enum ReviewFilterType {
    /**
     * Get all reviews without any special filtering (default sort by createdAt desc)
     */
    ALL,

    /**
     * Filter by specific rating (1-5 stars)
     */
    BY_RATING,

    /**
     * Get only verified reader reviews (users who have completed a loan)
     */
    VERIFIED_ONLY,

    /**
     * Sort by most helpful reviews (highest helpfulCount first)
     */
    TOP_HELPFUL
}
