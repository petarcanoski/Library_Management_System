package com.library.controller;

import com.library.exception.BookException;
import com.library.exception.BookReviewException;
import com.library.exception.UserException;
import com.library.payload.dto.BookRatingStatisticsDTO;
import com.library.payload.dto.BookReviewDTO;
import com.library.payload.request.CreateReviewRequest;
import com.library.payload.request.UpdateReviewRequest;
import com.library.payload.response.ApiResponse;
import com.library.payload.response.PageResponse;
import com.library.service.BookReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Book Review and Rating operations.
 * Handles all review-related endpoints with validation to ensure only users who have read the book can review.
 *
 * DESIGN PHILOSOPHY:
 * - Reviews and ratings are combined in one entity
 * - Only verified readers (users who have completed a book loan) can write reviews
 * - RESTful endpoint design with proper HTTP methods
 */
@RestController
@RequestMapping("/api/reviews")
public class BookReviewController {

    private final BookReviewService bookReviewService;

    public BookReviewController(BookReviewService bookReviewService) {
        this.bookReviewService = bookReviewService;
    }

    // ==================== REVIEW CRUD OPERATIONS ====================

    /**
     * Create a new review for a book
     * POST /api/reviews
     *
     * IMPORTANT: Only users who have read the book (completed a loan) can review
     *
     * Example request body:
     * {
     *   "bookId": 1,
     *   "rating": 5,
     *   "title": "Excellent book!",
     *   "reviewText": "This book was fantastic. I learned so much about Java programming."
     * }
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> createReview(@Valid @RequestBody CreateReviewRequest request) {
        try {
            BookReviewDTO createdReview = bookReviewService.createReview(request);
            return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
        } catch (BookReviewException | BookException | UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Update an existing review
     * PUT /api/reviews/{reviewId}
     *
     * Users can only update their own reviews
     */
    @PutMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody UpdateReviewRequest request) {
        try {
            BookReviewDTO updatedReview = bookReviewService.updateReview(reviewId, request);
            return ResponseEntity.ok(updatedReview);
        } catch (BookReviewException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Delete a review (soft delete)
     * DELETE /api/reviews/{reviewId}
     *
     * Users can only delete their own reviews
     */
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId) {
        try {
            bookReviewService.deleteReview(reviewId);
            return ResponseEntity.ok(new ApiResponse("Review deleted successfully", true));
        } catch (BookReviewException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get a specific review by ID
     * GET /api/reviews/{reviewId}
     */
    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReviewById(@PathVariable Long reviewId) {
        try {
            BookReviewDTO review = bookReviewService.getReviewById(reviewId);
            return ResponseEntity.ok(review);
        } catch (BookReviewException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== GET REVIEWS BY BOOK ====================

    /**
     * Get reviews for a specific book with optional filters
     * GET /api/reviews/book/{bookId}
     *
     * Query Parameters:
     * - filter: Filter type (ALL, BY_RATING, VERIFIED_ONLY, TOP_HELPFUL) - default: ALL
     * - rating: Rating value (1-5) - required only when filter=BY_RATING
     * - page: Page number - default: 0
     * - size: Page size - default: 10
     *
     * Examples:
     * - GET /api/reviews/book/1?page=0&size=10 (all reviews)
     * - GET /api/reviews/book/1?filter=BY_RATING&rating=5&page=0&size=10 (5-star reviews only)
     * - GET /api/reviews/book/1?filter=VERIFIED_ONLY&page=0&size=10 (verified readers only)
     * - GET /api/reviews/book/1?filter=TOP_HELPFUL&page=0&size=10 (most helpful first)
     */
    @GetMapping("/book/{bookId}")
    public ResponseEntity<PageResponse<BookReviewDTO>> getReviewsByBook(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "ALL") com.library.domain.ReviewFilterType filter,
            @RequestParam(required = false) Integer rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<BookReviewDTO> reviews = bookReviewService.getReviewsByBookWithFilter(
                bookId, filter, rating, page, size);
        return ResponseEntity.ok(reviews);
    }

    // ==================== GET REVIEWS BY USER ====================

    /**
     * Get all reviews by the current authenticated user
     * GET /api/reviews/my-reviews
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<PageResponse<BookReviewDTO>> getMyReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<BookReviewDTO> reviews = bookReviewService.getMyReviews(page, size);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get all reviews by a specific user
     * GET /api/reviews/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<PageResponse<BookReviewDTO>> getReviewsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<BookReviewDTO> reviews = bookReviewService.getReviewsByUser(userId, page, size);
        return ResponseEntity.ok(reviews);
    }

    // ==================== RATING STATISTICS ====================

    /**
     * Get rating statistics for a book
     * GET /api/reviews/book/{bookId}/statistics
     *
     * Returns:
     * - Average rating
     * - Total number of reviews
     * - Rating distribution (count of 1-star, 2-star, etc.)
     * - Number of verified reader reviews
     *
     * Example response:
     * {
     *   "bookId": 1,
     *   "bookTitle": "Effective Java",
     *   "averageRating": 4.5,
     *   "totalReviews": 120,
     *   "ratingDistribution": {
     *     "5": 80,
     *     "4": 30,
     *     "3": 8,
     *     "2": 2,
     *     "1": 0
     *   },
     *   "verifiedReaderReviews": 95
     * }
     */
    @GetMapping("/book/{bookId}/statistics")
    public ResponseEntity<?> getRatingStatistics(@PathVariable Long bookId) {
        try {
            BookRatingStatisticsDTO statistics = bookReviewService.getRatingStatistics(bookId);
            return ResponseEntity.ok(statistics);
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== HELPFUL ACTIONS ====================

    /**
     * Mark a review as helpful
     * POST /api/reviews/{reviewId}/helpful
     *
     * Increments the helpful count for the review
     */
    @PostMapping("/{reviewId}/helpful")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> markReviewAsHelpful(@PathVariable Long reviewId) {
        try {
            BookReviewDTO updatedReview = bookReviewService.markReviewAsHelpful(reviewId);
            return ResponseEntity.ok(updatedReview);
        } catch (BookReviewException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== ELIGIBILITY CHECK ====================

    /**
     * Check if the current user can review a specific book
     * GET /api/reviews/can-review/{bookId}
     *
     * Returns true if user has read the book and hasn't already reviewed it
     *
     * Example response:
     * {
     *   "canReview": true
     * }
     */
    @GetMapping("/can-review/{bookId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CanReviewResponse> canReviewBook(@PathVariable Long bookId) {
        boolean canReview = bookReviewService.canUserReviewBook(bookId);
        return ResponseEntity.ok(new CanReviewResponse(canReview));
    }

    // ==================== ADMIN STATISTICS ====================

    /**
     * Get total review statistics (Admin only)
     * GET /api/reviews/statistics
     *
     * Returns total number of reviews in the system
     *
     * Example response:
     * {
     *   "totalReviews": 892
     * }
     */
    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewStatisticsResponse> getReviewStatistics() {
        long totalReviews = bookReviewService.getTotalReviewCount();
        return ResponseEntity.ok(new ReviewStatisticsResponse(totalReviews));
    }

    // ==================== RESPONSE DTOs ====================

    /**
     * Response DTO for can-review endpoint
     */
    public static class CanReviewResponse {
        public boolean canReview;

        public CanReviewResponse(boolean canReview) {
            this.canReview = canReview;
        }
    }

    /**
     * Response DTO for review statistics endpoint
     */
    public static class ReviewStatisticsResponse {
        public long totalReviews;

        public ReviewStatisticsResponse(long totalReviews) {

            this.totalReviews = totalReviews;
        }
    }
}
