package com.library.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.library.domain.BookLoanStatus;
import com.library.exception.BookException;
import com.library.exception.BookReviewException;
import com.library.exception.UserException;
import com.library.mapper.BookReviewMapper;
import com.library.model.Book;
import com.library.model.BookLoan;
import com.library.model.BookReview;
import com.library.model.User;
import com.library.payload.dto.BookRatingStatisticsDTO;
import com.library.payload.dto.BookReviewDTO;
import com.library.payload.request.CreateReviewRequest;
import com.library.payload.request.UpdateReviewRequest;
import com.library.payload.response.PageResponse;
import com.library.repository.BookLoanRepository;
import com.library.repository.BookRepository;
import com.library.repository.BookReviewRepository;
import com.library.repository.UserRepository;
import com.library.service.BookReviewService;

import jakarta.transaction.Transactional;

/**
 * Implementation of BookReviewService interface.
 * Handles all business logic for book reviews and ratings.
 */
@Service
@Transactional
public class BookReviewServiceImpl implements BookReviewService {

    private final BookReviewRepository bookReviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookLoanRepository bookLoanRepository;
    private final BookReviewMapper bookReviewMapper;

    public BookReviewServiceImpl(
            BookReviewRepository bookReviewRepository,
            BookRepository bookRepository,
            UserRepository userRepository,
            BookLoanRepository bookLoanRepository,
            BookReviewMapper bookReviewMapper) {
        this.bookReviewRepository = bookReviewRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.bookLoanRepository = bookLoanRepository;
        this.bookReviewMapper = bookReviewMapper;
    }

    @Override
    public BookReviewDTO createReview(CreateReviewRequest request)
            throws BookReviewException, BookException, UserException {

        User currentUser = getCurrentAuthenticatedUser();

        // 1. Validate book exists
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new BookException("Book not found with id: " + request.getBookId()));

        // 2. Check if user has already reviewed this book
        if (bookReviewRepository.existsByUserIdAndBookId(currentUser.getId(), request.getBookId())) {
            throw new BookReviewException(
                    "You have already reviewed this book. You can update your existing review instead.");
        }

        // 3. IMPORTANT: Check if user has read the book (completed a loan)
        boolean hasReadBook = hasUserReadBook(currentUser.getId(), request.getBookId());
        if (!hasReadBook) {
            throw new BookReviewException(
                    "You can only review books you have read. Please checkout and return the book first.");
        }

        // 4. Create the review
        BookReview bookReview = new BookReview();
        bookReview.setUser(currentUser);
        bookReview.setBook(book);
        bookReview.setRating(request.getRating());
        bookReview.setReviewText(request.getReviewText());
        bookReview.setTitle(request.getTitle());
        bookReview.setIsVerifiedReader(true); // Verified because they have read the book
        bookReview.setIsActive(true);
        bookReview.setHelpfulCount(0);

        // 5. Save review
        BookReview savedReview = bookReviewRepository.save(bookReview);

        return bookReviewMapper.toDTO(savedReview);
    }

    @Override
    public BookReviewDTO updateReview(Long reviewId, UpdateReviewRequest request) throws BookReviewException {

        User currentUser = getCurrentAuthenticatedUser();

        // 1. Find the review
        BookReview bookReview = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new BookReviewException("Review not found with id: " + reviewId));

        // 2. Check if current user is the owner of the review
        if (!bookReview.getUser().getId().equals(currentUser.getId())) {
            throw new BookReviewException("You can only update your own reviews");
        }

        // 3. Update the review
        bookReview.setRating(request.getRating());
        bookReview.setReviewText(request.getReviewText());
        bookReview.setTitle(request.getTitle());

        // 4. Save updated review
        BookReview updatedReview = bookReviewRepository.save(bookReview);

        return bookReviewMapper.toDTO(updatedReview);
    }

    @Override
    public void deleteReview(Long reviewId) throws BookReviewException {

        User currentUser = getCurrentAuthenticatedUser();

        // 1. Find the review
        BookReview bookReview = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new BookReviewException("Review not found with id: " + reviewId));

        // 2. Check if current user is the owner of the review
        if (!bookReview.getUser().getId().equals(currentUser.getId())) {
            throw new BookReviewException("You can only delete your own reviews");
        }

        // 3. Soft delete (mark as inactive)
        bookReview.setIsActive(false);
        bookReviewRepository.save(bookReview);
    }

    @Override
    public BookReviewDTO getReviewById(Long reviewId) throws BookReviewException {
        BookReview bookReview = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new BookReviewException("Review not found with id: " + reviewId));
        return bookReviewMapper.toDTO(bookReview);
    }

    @Override
    public PageResponse<BookReviewDTO> getReviewsByBookWithFilter(
            Long bookId,
            com.library.domain.ReviewFilterType filterType,
            Integer rating,
            int page,
            int size) {

        Page<BookReview> reviewPage;
        Pageable pageable;

        switch (filterType) {
            case BY_RATING:
                if (rating == null) {
                    throw new IllegalArgumentException("Rating is required when filter type is BY_RATING");
                }
                if (rating < 1 || rating > 5) {
                    throw new IllegalArgumentException("Rating must be between 1 and 5");
                }
                pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
                reviewPage = bookReviewRepository.findByBookIdAndRatingAndIsActiveTrue(bookId, rating, pageable);
                break;

            case VERIFIED_ONLY:
                pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
                reviewPage = bookReviewRepository.findByBookIdAndIsVerifiedReaderTrueAndIsActiveTrue(bookId, pageable);
                break;

            case TOP_HELPFUL:
                pageable = PageRequest.of(page, size);
                reviewPage = bookReviewRepository.findTopHelpfulReviewsByBookId(bookId, pageable);
                break;

            case ALL:
            default:
                pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
                reviewPage = bookReviewRepository.findByBookIdAndIsActiveTrue(bookId, pageable);
                break;
        }

        return convertToPageResponse(reviewPage);
    }

    @Override
    public PageResponse<BookReviewDTO> getMyReviews(int page, int size) {
        User currentUser = getCurrentAuthenticatedUser();
        return getReviewsByUser(currentUser.getId(), page, size);
    }

    @Override
    public PageResponse<BookReviewDTO> getReviewsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BookReview> reviewPage = bookReviewRepository.findByUserIdAndIsActiveTrue(userId, pageable);
        return convertToPageResponse(reviewPage);
    }

    @Override
    public BookRatingStatisticsDTO getRatingStatistics(Long bookId) throws BookException {

        // 1. Validate book exists
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("Book not found with id: " + bookId));

        // 2. Get average rating
        Double averageRating = bookReviewRepository.getAverageRatingByBookId(bookId);

        // 3. Get total reviews count
        Long totalReviews = bookReviewRepository.countReviewsByBookId(bookId);

        // 4. Get rating distribution
        List<Object[]> ratingData = bookReviewRepository.countReviewsByRatingForBook(bookId);
        Map<Integer, Long> ratingDistribution = new HashMap<>();

        // Initialize all ratings with 0
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }

        // Fill in actual counts
        for (Object[] row : ratingData) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingDistribution.put(rating, count);
        }

        // 5. Count verified reader reviews
        Pageable pageable = PageRequest.of(0, 1);
        Long verifiedReaderReviews = bookReviewRepository
                .findByBookIdAndIsVerifiedReaderTrueAndIsActiveTrue(bookId, pageable)
                .getTotalElements();

        return BookRatingStatisticsDTO.builder()
                .bookId(bookId)
                .bookTitle(book.getTitle())
                .averageRating(averageRating != null ? averageRating : 0.0)
                .totalReviews(totalReviews)
                .ratingDistribution(ratingDistribution)
                .verifiedReaderReviews(verifiedReaderReviews)
                .build();
    }

    @Override
    public BookReviewDTO markReviewAsHelpful(Long reviewId) throws BookReviewException {

        // 1. Find the review
        BookReview bookReview = bookReviewRepository.findById(reviewId)
                .orElseThrow(() -> new BookReviewException("Review not found with id: " + reviewId));

        // 2. Increment helpful count
        bookReview.setHelpfulCount(bookReview.getHelpfulCount() + 1);

        // 3. Save updated review
        BookReview updatedReview = bookReviewRepository.save(bookReview);

        return bookReviewMapper.toDTO(updatedReview);
    }

    @Override
    public boolean canUserReviewBook(Long bookId) {
        User currentUser = getCurrentAuthenticatedUser();
        return canUserReviewBook(currentUser.getId(), bookId);
    }

    @Override
    public boolean canUserReviewBook(Long userId, Long bookId) {
        // User can review if they have not already reviewed AND have read the book
        boolean alreadyReviewed = bookReviewRepository.existsByUserIdAndBookId(userId, bookId);
        boolean hasReadBook = hasUserReadBook(userId, bookId);

        return !alreadyReviewed && hasReadBook;
    }

    @Override
    public long getTotalReviewCount() {
        return bookReviewRepository.countByIsActiveTrue();
    }

    // ==================== HELPER METHODS ====================

    /**
     * Check if user has read the book (completed at least one loan with RETURNED status)
     */
    private boolean hasUserReadBook(Long userId, Long bookId) {
        Pageable pageable = PageRequest.of(0, 1);
        Page<BookLoan> bookLoans = bookLoanRepository.findByBookId(bookId, 
        pageable);

        return bookLoans.stream()
                .anyMatch(loan -> loan.getUser().getId().equals(userId)
                        && loan.getStatus() == BookLoanStatus.RETURNED);
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Authenticated user not found");
        }
        return user;
    }

    private PageResponse<BookReviewDTO> convertToPageResponse(Page<BookReview> reviewPage) {
        List<BookReviewDTO> reviewDTOs = reviewPage.getContent()
                .stream()
                .map(bookReviewMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                reviewDTOs,
                reviewPage.getNumber(),
                reviewPage.getSize(),
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages(),
                reviewPage.isLast(),
                reviewPage.isFirst(),
                reviewPage.isEmpty()
        );
    }
}
