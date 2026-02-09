package com.library.repository;

import com.library.model.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Wishlist entity operations.
 */
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    /**
     * Find all wishlist items for a specific user
     */
    Page<Wishlist> findByUserId(Long userId, Pageable pageable);

    /**
     * Find a specific wishlist item by user and book
     */
    Optional<Wishlist> findByUserIdAndBookId(Long userId, Long bookId);

    /**
     * Check if a book is already in user's wishlist
     */
    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    /**
     * Delete a wishlist item by user and book
     */
    void deleteByUserIdAndBookId(Long userId, Long bookId);

    /**
     * Count total wishlist items for a user
     */
    @Query("SELECT COUNT(w) FROM Wishlist w WHERE w.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    /**
     * Count how many users have added a specific book to their wishlist
     */
    @Query("SELECT COUNT(w) FROM Wishlist w WHERE w.book.id = :bookId")
    Long countByBookId(@Param("bookId") Long bookId);
}
