package com.library.controller;

import com.library.exception.BookException;
import com.library.exception.UserException;
import com.library.exception.WishlistException;
import com.library.payload.dto.WishlistDTO;
import com.library.payload.response.ApiResponse;
import com.library.payload.response.PageResponse;
import com.library.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Wishlist operations.
 * Allows users to manage their favorite books wishlist.
 */
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // ==================== WISHLIST CRUD OPERATIONS ====================

    /**
     * Add a book to the current user's wishlist
     * POST /api/wishlist/add/{bookId}
     *
     * Query Parameters:
     * - notes: Optional notes about why the user is adding this book
     *
     * Example: POST /api/wishlist/add/1?notes=Want to read this book next
     */
    @PostMapping("/add/{bookId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> addToWishlist(
            @PathVariable Long bookId,
            @RequestParam(required = false) String notes) {
        try {
            WishlistDTO wishlist = wishlistService.addToWishlist(bookId, notes);
            return new ResponseEntity<>(wishlist, HttpStatus.CREATED);
        } catch (BookException | WishlistException | UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Remove a book from the current user's wishlist
     * DELETE /api/wishlist/remove/{bookId}
     *
     * Example: DELETE /api/wishlist/remove/1
     */
    @DeleteMapping("/remove/{bookId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse> removeFromWishlist(@PathVariable Long bookId) {
        try {
            wishlistService.removeFromWishlist(bookId);
            return ResponseEntity.ok(new ApiResponse("Book removed from wishlist successfully", true));
        } catch (WishlistException | UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Update notes for a wishlist item
     * PUT /api/wishlist/update-notes/{bookId}
     *
     * Query Parameters:
     * - notes: Updated notes for the wishlist item
     *
     * Example: PUT /api/wishlist/update-notes/1?notes=Updated notes here
     */
    @PutMapping("/update-notes/{bookId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> updateWishlistNotes(
            @PathVariable Long bookId,
            @RequestParam(required = false) String notes) {
        try {
            WishlistDTO wishlist = wishlistService.updateWishlistNotes(bookId, notes);
            return ResponseEntity.ok(wishlist);
        } catch (WishlistException | UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== GET WISHLIST ====================

    /**
     * Get all wishlist items for the current authenticated user
     * GET /api/wishlist/my-wishlist
     *
     * Query Parameters:
     * - page: Page number (default: 0)
     * - size: Page size (default: 10)
     *
     * Example: GET /api/wishlist/my-wishlist?page=0&size=10
     */
    @GetMapping("/my-wishlist")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<PageResponse<WishlistDTO>> getMyWishlist(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws UserException {

        PageResponse<WishlistDTO> wishlist = wishlistService.getMyWishlist(page, size);
        return ResponseEntity.ok(wishlist);
    }

    /**
     * Get all wishlist items for a specific user
     * GET /api/wishlist/user/{userId}
     *
     * This can be used by admins to view user wishlists or for public profiles
     *
     * Query Parameters:
     * - page: Page number (default: 0)
     * - size: Page size (default: 10)
     *
     * Example: GET /api/wishlist/user/1?page=0&size=10
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<PageResponse<WishlistDTO>> getUserWishlist(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<WishlistDTO> wishlist = wishlistService.getUserWishlist(userId, page, size);
        return ResponseEntity.ok(wishlist);
    }

    // ==================== WISHLIST CHECKS ====================

    /**
     * Check if a book is in the current user's wishlist
     * GET /api/wishlist/check/{bookId}
     *
     * Returns a boolean indicating if the book is wishlisted
     *
     * Example response:
     * {
     *   "isInWishlist": true
     * }
     */
    @GetMapping("/check/{bookId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<IsInWishlistResponse> checkIfInWishlist(@PathVariable Long bookId) throws UserException {
        boolean isInWishlist = wishlistService.isBookInWishlist(bookId);
        return ResponseEntity.ok(new IsInWishlistResponse(isInWishlist));
    }

    /**
     * Get total count of wishlist items for current user
     * GET /api/wishlist/my-count
     *
     * Example response:
     * {
     *   "count": 15
     * }
     */
    @GetMapping("/my-count")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CountResponse> getMyWishlistCount() throws UserException {
        Long count = wishlistService.getMyWishlistCount();
        return ResponseEntity.ok(new CountResponse(count));
    }

    /**
     * Get count of how many users have wishlisted a specific book
     * GET /api/wishlist/book/{bookId}/count
     *
     * Example response:
     * {
     *   "count": 42
     * }
     */
    @GetMapping("/book/{bookId}/count")
    public ResponseEntity<CountResponse> getBookWishlistCount(@PathVariable Long bookId) {
        Long count = wishlistService.getBookWishlistCount(bookId);
        return ResponseEntity.ok(new CountResponse(count));
    }

    // ==================== RESPONSE DTOs ====================

    /**
     * Response DTO for wishlist check endpoint
     */
    public static class IsInWishlistResponse {
        public boolean isInWishlist;

        public IsInWishlistResponse(boolean isInWishlist) {
            this.isInWishlist = isInWishlist;
        }
    }

    /**
     * Response DTO for count endpoints
     */
    public static class CountResponse {
        public Long count;

        public CountResponse(Long count) {
            this.count = count;
        }
    }
}
