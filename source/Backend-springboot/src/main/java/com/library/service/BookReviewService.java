package com.library.service;

import com.library.exception.BookException;
import com.library.exception.BookReviewException;
import com.library.exception.UserException;
import com.library.payload.dto.BookRatingStatisticsDTO;
import com.library.payload.dto.BookReviewDTO;
import com.library.payload.request.CreateReviewRequest;
import com.library.payload.request.UpdateReviewRequest;
import com.library.payload.response.PageResponse;

/**
 * Service interface for book review operations
 */
public interface BookReviewService {

    /**
     * Create a new review for a book (only if user has read the book)
     */
    BookReviewDTO createReview(CreateReviewRequest request) throws BookReviewException, BookException, UserException;

    /**
     * Update an existing review
     */
    BookReviewDTO updateReview(Long reviewId, UpdateReviewRequest request) throws BookReviewException;

    /**
     * Delete a review (soft delete)
     */
    void deleteReview(Long reviewId) throws BookReviewException;

    /**
     * Get review by ID
     */
    BookReviewDTO getReviewById(Long reviewId) throws BookReviewException;

    /**
     * Get reviews for a specific book with optional filters
     *
     * @param bookId Book ID
     * @param filterType Type of filter (ALL, BY_RATING, VERIFIED_ONLY, TOP_HELPFUL)
     * @param rating Rating value (1-5), required only when filterType is BY_RATING
     * @param page Page number
     * @param size Page size
     * @return Paginated response of book reviews
     */
    PageResponse<BookReviewDTO> getReviewsByBookWithFilter(
            Long bookId,
            com.library.domain.ReviewFilterType filterType,
            Integer rating,
            int page,
            int size);

    /**
     * Get all reviews by current authenticated user
     */
    PageResponse<BookReviewDTO> getMyReviews(int page, int size);

    /**
     * Get all reviews by a specific user
     */
    PageResponse<BookReviewDTO> getReviewsByUser(Long userId, int page, int size);

    /**
     * Get rating statistics for a book
     */
    BookRatingStatisticsDTO getRatingStatistics(Long bookId) throws BookException;

    /**
     * Mark a review as helpful
     */
    BookReviewDTO markReviewAsHelpful(Long reviewId) throws BookReviewException;

    /**
     * Check if current user can review a book
     */
    boolean canUserReviewBook(Long bookId);

    /**
     * Check if a specific user can review a book
     */
    boolean canUserReviewBook(Long userId, Long bookId);

    /**
     * Get total count of all active reviews (Admin only)
     */
    long getTotalReviewCount();
}
