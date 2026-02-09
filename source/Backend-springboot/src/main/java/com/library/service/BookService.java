package com.library.service;

import com.library.exception.BookException;
import com.library.exception.UserException;
import com.library.payload.dto.BookDTO;
import com.library.payload.request.BookSearchRequest;
import com.library.payload.response.PageResponse;

import java.util.List;

/**
 * Service interface for book catalog operations.
 * Defines business logic for CRUD operations and book management.
 *
 * SIMPLIFIED VERSION - Uses unified search approach
 */
public interface BookService {

    // ==================== CRUD OPERATIONS ====================

    /**
     * Create a new book in the catalog
     * @param bookDTO Book data
     * @return Created book DTO
     * @throws BookException if ISBN already exists or validation fails
     */
    BookDTO createBook(BookDTO bookDTO) throws BookException;

    /**
     * Create multiple books in bulk
     * @param bookDTOs List of book data
     * @return List of created book DTOs
     * @throws BookException if any ISBN already exists or validation fails
     */
    List<BookDTO> createBooksBulk(List<BookDTO> bookDTOs) throws BookException;

    /**
     * Get a book by ID
     * @param bookId Book ID
     * @return Book DTO
     * @throws BookException if book not found
     */
    BookDTO getBookById(Long bookId) throws BookException, UserException;

    /**
     * Get a book by ISBN
     * @param isbn Book ISBN
     * @return Book DTO
     * @throws BookException if book not found
     */
    BookDTO getBookByIsbn(String isbn) throws BookException;

    /**
     * Update an existing book
     * @param bookId Book ID
     * @param bookDTO Updated book data
     * @return Updated book DTO
     * @throws BookException if book not found or validation fails
     */
    BookDTO updateBook(Long bookId, BookDTO bookDTO) throws BookException;

    /**
     * Delete a book (soft delete - marks as inactive)
     * @param bookId Book ID
     * @throws BookException if book not found
     */
    void deleteBook(Long bookId) throws BookException;

    /**
     * Permanently delete a book from the database
     * @param bookId Book ID
     * @throws BookException if book not found
     */
    void hardDeleteBook(Long bookId) throws BookException;

    // ==================== UNIFIED SEARCH ====================

    /**
     * Search and filter books with multiple criteria.
     * This is the PRIMARY search method that handles all filtering scenarios.
     *
     * Supports:
     * - Text search (title, author, ISBN)
     * - Genre filtering
     * - Availability filtering
     * - Pagination and sorting
     *
     * @param searchRequest Search request with filters
     * @return Paginated search results
     */
    PageResponse<BookDTO> searchBooksWithFilters(
        BookSearchRequest searchRequest);

    // ==================== STATISTICS ====================

    /**
     * Get total count of active books
     * @return Total active books count
     */
    long getTotalActiveBooks();

    /**
     * Get total count of available books
     * @return Total available books count
     */
    long getTotalAvailableBooks();
}
