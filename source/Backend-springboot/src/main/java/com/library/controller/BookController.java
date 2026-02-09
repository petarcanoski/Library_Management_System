package com.library.controller;

import com.library.exception.BookException;
import com.library.exception.UserException;
import com.library.payload.response.ApiResponse;
import com.library.payload.dto.BookDTO;
import com.library.payload.request.BookSearchRequest;
import com.library.payload.response.PageResponse;
import com.library.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PRODUCTION-GRADE REST Controller for Book Catalog operations.
 * Uses unified search approach with minimal endpoints.
 *
 * DESIGN PHILOSOPHY:
 * - Single responsibility per endpoint
 * - Unified search endpoint instead of multiple specialized ones
 * - GET for retrieval, POST for complex queries with body
 * - Consistent response patterns
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // ==================== CRUD OPERATIONS ====================

    /**
     * Create a new book
     * POST /api/books
     */
    @PostMapping
    public ResponseEntity<BookDTO> createBook(
        @Valid @RequestBody BookDTO bookDTO) {
        try {
            BookDTO createdBook = bookService.createBook(bookDTO);
            return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Create multiple books in bulk
     * POST /api/books/bulk
     *
     * Example request body:
     * [
     *   {
     *     "isbn": "978-0-13-468599-1",
     *     "title": "Effective Java",
     *     "author": "Joshua Bloch",
     *     "genreId": 13,
     *     "publisher": "Addison-Wesley",
     *     "publicationDate": "2018-01-06",
     *     "language": "English",
     *     "pages": 416,
     *     "description": "The Definitive Guide to Java Platform Best Practices",
     *     "totalCopies": 10,
     *     "availableCopies": 10,
     *     "price": 54.99,
     *     "coverImageUrl": "https://example.com/effective-java.jpg"
     *   },
     *   {
     *     "isbn": "978-0-13-468599-2",
     *     "title": "Clean Code",
     *     "author": "Robert C. Martin",
     *     "genreId": 13,
     *     "publisher": "Prentice Hall",
     *     "publicationDate": "2008-08-01",
     *     "language": "English",
     *     "pages": 464,
     *     "description": "A Handbook of Agile Software Craftsmanship",
     *     "totalCopies": 15,
     *     "availableCopies": 15,
     *     "price": 49.99
     *   }
     * ]
     */
    @PostMapping("/bulk")
    public ResponseEntity<?> createBooksBulk(@Valid @RequestBody List<BookDTO> bookDTOs) {
        try {
            List<BookDTO> createdBooks = bookService.createBooksBulk(bookDTOs);
            return new ResponseEntity<>(createdBooks, HttpStatus.CREATED);
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get a book by ID
     * GET /api/books/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) throws BookException, UserException {
        BookDTO book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    /**
     * Get a book by ISBN (alternate identifier)
     * GET /api/books/isbn/{isbn}
     */
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookDTO> getBookByIsbn(@PathVariable String isbn) throws BookException {
        BookDTO book = bookService.getBookByIsbn(isbn);
        return ResponseEntity.ok(book);
    }

    /**
     * Update a book
     * PUT /api/books/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookDTO bookDTO) {
        try {
            BookDTO updatedBook = bookService.updateBook(id, bookDTO);
            return ResponseEntity.ok(updatedBook);
        } catch (BookException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Soft delete a book (mark as inactive)
     * DELETE /api/books/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteBook(@PathVariable Long id) throws BookException {
        bookService.deleteBook(id);
        return ResponseEntity.ok(new ApiResponse("Book deleted successfully",true));
    }

    /**
     * Permanently delete a book
     * DELETE /api/books/{id}/permanent
     */
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse> hardDeleteBook(@PathVariable Long id) throws BookException {
        bookService.hardDeleteBook(id);
        return ResponseEntity.ok(new ApiResponse("Book permanently deleted",true));
    }

    // ==================== UNIFIED SEARCH & LIST ====================

    /**
     * Get/Search books with optional filters via query parameters
     * GET /api/books?genreId=1&availableOnly=true&page=0&size=20
     *
     * This is the PRIMARY endpoint for listing/searching books.
     * Use query parameters for simple filters.
     *
     * Examples:
     * - GET /api/books                                    → All books
     * - GET /api/books?genreId=1                          → Books by genre ID 1
     * - GET /api/books?availableOnly=true                 → Available books
     * - GET /api/books?genreId=1&availableOnly=true       → Available books by genre ID 1
     */
    @GetMapping
    public ResponseEntity<PageResponse<BookDTO>> searchBooks(
            @RequestParam(required = false) Long genreId,
            @RequestParam(required = false) Boolean availableOnly,
            @RequestParam(defaultValue = "true") boolean activeOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        // Build search request from query parameters
        BookSearchRequest searchRequest = new BookSearchRequest();
        searchRequest.setGenreId(genreId);
        searchRequest.setAvailableOnly(availableOnly);
        searchRequest.setPage(page);
        searchRequest.setSize(size);
        searchRequest.setSortBy(sortBy);
        searchRequest.setSortDirection(sortDirection);

        PageResponse<BookDTO> books = bookService.searchBooksWithFilters(searchRequest);
        return ResponseEntity.ok(books);
    }

    /**
     * Advanced search with multiple filters (complex queries)
     * POST /api/books/search
     *
     * Use this endpoint when you need to combine text search with filters.
     * POST is used because complex search criteria are better in request body.
     *
     * Example request body:
     * {
     *   "searchTerm": "Java Programming",     // Searches title, author, ISBN
     *   "genreId": 1,
     *   "availableOnly": true,
     *   "page": 0,
     *   "size": 20,
     *   "sortBy": "title",
     *   "sortDirection": "ASC"
     * }
     */
    @PostMapping("/search")
    public ResponseEntity<PageResponse<BookDTO>> advancedSearch(
            @RequestBody BookSearchRequest searchRequest) {

        PageResponse<BookDTO> books = bookService.searchBooksWithFilters(searchRequest);
        return ResponseEntity.ok(books);
    }

    // ==================== STATISTICS ====================

    /**
     * Get book catalog statistics
     * GET /api/books/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<BookStatsResponse> getBookStats() {
        long totalActive = bookService.getTotalActiveBooks();
        long totalAvailable = bookService.getTotalAvailableBooks();

        BookStatsResponse stats = new BookStatsResponse(totalActive, totalAvailable);
        return ResponseEntity.ok(stats);
    }

    /**
     * Statistics response DTO
     */
    public static class BookStatsResponse {
        public long totalActiveBooks;
        public long totalAvailableBooks;

        public BookStatsResponse(long totalActiveBooks, long totalAvailableBooks) {
            this.totalActiveBooks = totalActiveBooks;
            this.totalAvailableBooks = totalAvailableBooks;
        }
    }
}
