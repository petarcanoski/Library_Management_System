package com.library.service.impl;

import com.library.domain.BookLoanStatus;
import com.library.exception.BookException;
import com.library.exception.UserException;
import com.library.mapper.BookMapper;
import com.library.model.Book;
import com.library.model.User;
import com.library.payload.dto.BookDTO;
import com.library.payload.request.BookSearchRequest;
import com.library.payload.response.PageResponse;
import com.library.repository.BookLoanRepository;
import com.library.repository.BookRepository;
import com.library.repository.ReservationRepository;
import com.library.service.BookService;
import com.library.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of BookService interface.
 * Handles all business logic for book catalog operations.
 *
 * SIMPLIFIED VERSION - Uses unified search approach
 */
@Service
@Transactional
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final BookLoanRepository bookLoanRepository;
    private final UserService userService;
    private final ReservationRepository reservationRepository;


    // ==================== CRUD OPERATIONS ====================

    @Override
    public BookDTO createBook(BookDTO bookDTO) throws BookException {

        // Validate ISBN uniqueness
        if (bookRepository.existsByIsbn(bookDTO.getIsbn())) {
            throw new BookException("Book with ISBN " + bookDTO.getIsbn() + " already exists");
        }

        Book book = bookMapper.toEntity(bookDTO);

        // Validate available copies
        if(book.getAvailableCopies() > 0){
            throw new BookException("Available copies cannot exceed total copies");
        }

        Book savedBook = bookRepository.save(book);

        return bookMapper.toDTO(savedBook);
    }

    @Override
    public List<BookDTO> createBooksBulk(List<BookDTO> bookDTOs) throws BookException {
        if (bookDTOs == null || bookDTOs.isEmpty()) {
            throw new BookException("Book list cannot be null or empty");
        }

        // Validate all books before creating any
        for (BookDTO bookDTO : bookDTOs) {
            // Check for duplicate ISBNs in the input list
            long duplicateCount = bookDTOs.stream()
                .filter(b -> b.getIsbn().equals(bookDTO.getIsbn()))
                .count();

            if (duplicateCount > 1) {
                throw new BookException("Duplicate ISBN in request: " + bookDTO.getIsbn());
            }

            // Check if ISBN already exists in database
            if (bookRepository.existsByIsbn(bookDTO.getIsbn())) {
                throw new BookException("Book with ISBN " + bookDTO.getIsbn() + " already exists");
            }

            // Validate available copies
            if (bookDTO.getAvailableCopies() > bookDTO.getTotalCopies()) {
                throw new BookException("Available copies cannot exceed total copies for ISBN: " + bookDTO.getIsbn());
            }

            // Validate genre exists (will throw exception if not found)
            if (bookDTO.getGenreId() == null) {
                throw new BookException("Genre ID is required for ISBN: " + bookDTO.getIsbn());
            }
        }

        // All validations passed, now create all books
        List<Book> booksToSave = new ArrayList<>();
        for (BookDTO bookDTO : bookDTOs) {
            Book book = bookMapper.toEntity(bookDTO);
            book.setActive(true); // Ensure new books are active by default
            booksToSave.add(book);
        }

        // Save all books in a single batch
        List<Book> savedBooks = bookRepository.saveAll(booksToSave);

        // Convert to DTOs and return
        return savedBooks.stream()
            .map(bookMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public BookDTO getBookById(Long bookId) throws BookException, UserException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("Book not found with id: " + bookId));
        BookDTO bookDTO= bookMapper.toDTO(book);

        User currentUser=userService.getCurrentUser();
        boolean alreadyHasLoan = bookLoanRepository
                .existsByUserIdAndBookIdAndStatus(
                        currentUser.getId(), bookId,
                        BookLoanStatus.CHECKED_OUT);
        boolean alreadyHaveReservation=reservationRepository
                .findActiveReservationByUserAndBook(currentUser.getId(),bookId).isPresent();

        bookDTO.setAlreadyHaveLoan(alreadyHasLoan);
        bookDTO.setAlreadyHaveReservation(alreadyHaveReservation);
        return bookDTO;
    }

    @Override
    public BookDTO getBookByIsbn(String isbn) throws BookException {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new BookException("Book not found with ISBN: " + isbn));
        return bookMapper.toDTO(book);
    }

    @Override
    public BookDTO updateBook(Long bookId, BookDTO bookDTO) throws BookException {
        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("Book not found with id: " + bookId));

        // Validate available copies
        if (bookDTO.getAvailableCopies() > bookDTO.getTotalCopies()) {
            throw new BookException("Available copies cannot exceed total copies");
        }

        // Check if trying to update ISBN to a value that already exists for another book
        if (!existingBook.getIsbn().equals(bookDTO.getIsbn())) {
            throw new BookException("ISBN cannot be changed after book creation");
        }

        // Update the book
        bookMapper.updateEntityFromDTO(bookDTO, existingBook);

        Book updatedBook = bookRepository.save(existingBook);
        return bookMapper.toDTO(updatedBook);
    }

    @Override
    public void deleteBook(Long bookId) throws BookException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("Book not found with id: " + bookId));

        // Soft delete - mark as inactive
        book.setActive(false);
        bookRepository.save(book);
    }

    @Override
    public void hardDeleteBook(Long bookId) throws BookException {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("Book not found with id: " + bookId));

        // Hard delete - permanently remove from database
        bookRepository.delete(book);
    }

    // ==================== UNIFIED SEARCH ====================

    @Override
    public PageResponse<BookDTO> searchBooksWithFilters(BookSearchRequest searchRequest) {
        Pageable pageable = createPageable(
                searchRequest.getPage(),
                searchRequest.getSize(),
                searchRequest.getSortBy(),
                searchRequest.getSortDirection()
        );

        Page<Book> bookPage = bookRepository.searchBooksWithFilters(
                searchRequest.getSearchTerm(),
                searchRequest.getGenreId(),
                searchRequest.getAvailableOnly() != null ? searchRequest.getAvailableOnly() : false,
                pageable
        );

        return convertToPageResponse(bookPage);
    }

    // ==================== STATISTICS ====================

    @Override
    public long getTotalActiveBooks() {
        return bookRepository.countByActiveTrue();
    }

    @Override
    public long getTotalAvailableBooks() {
        return bookRepository.countAvailableBooks();
    }

    // ==================== HELPER METHODS ====================

    /**
     * Helper method to create Pageable object with sorting
     */
    private Pageable createPageable(int page, int size, String sortBy, String sortDirection) {
        // Validate and limit page size
        size = Math.min(size, 100); // Maximum 100 items per page
        size = Math.max(size, 1);   // Minimum 1 item per page

        Sort sort = sortDirection.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        return PageRequest.of(page, size, sort);
    }

    /**
     * Helper method to convert Page<Book> to PageResponse<BookDTO>
     */
    private PageResponse<BookDTO> convertToPageResponse(Page<Book> bookPage) {
        List<BookDTO> bookDTOs = bookPage.getContent()
                .stream()
                .map(bookMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                bookDTOs,
                bookPage.getNumber(),
                bookPage.getSize(),
                bookPage.getTotalElements(),
                bookPage.getTotalPages(),
                bookPage.isLast(),
                bookPage.isFirst(),
                bookPage.isEmpty()
        );
    }
}
