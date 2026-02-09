package com.library.repository;

import com.library.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Book entity.
 * Provides CRUD operations and custom query methods for searching and filtering books.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Find a book by ISBN
     */
    Optional<Book> findByIsbn(String isbn);

    /**
     * Check if a book exists with the given ISBN
     */
    boolean existsByIsbn(String isbn);


    /**
     * Advanced search with filters - search by title, author, ISBN and filter by genre
     */
    @Query("SELECT b FROM Book b WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:genreId IS NULL OR b.genre.id = :genreId) AND " +
           "(:availableOnly = false OR b.availableCopies > 0) AND " +
           "b.active = true")
    Page<Book> searchBooksWithFilters(
        @Param("searchTerm") String searchTerm,
        @Param("genreId") Long genreId,
        @Param("availableOnly") boolean availableOnly,
        Pageable pageable
    );


    /**
     * Count total active books
     */
    long countByActiveTrue();

    /**
     * Count available books
     */
    @Query("SELECT COUNT(b) FROM Book b WHERE b.availableCopies > 0 AND b.active = true")
    long countAvailableBooks();
}
