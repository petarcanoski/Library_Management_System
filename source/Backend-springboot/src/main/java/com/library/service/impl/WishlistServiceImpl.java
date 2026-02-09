package com.library.service.impl;

import com.library.exception.BookException;
import com.library.exception.UserException;
import com.library.exception.WishlistException;
import com.library.mapper.WishlistMapper;
import com.library.model.Book;
import com.library.model.User;
import com.library.model.Wishlist;
import com.library.payload.dto.WishlistDTO;
import com.library.payload.response.PageResponse;
import com.library.repository.BookRepository;
import com.library.repository.WishlistRepository;
import com.library.service.UserService;
import com.library.service.WishlistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of WishlistService interface.
 * Handles all business logic for user wishlists.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;
    private final UserService userService ;
    private final WishlistMapper wishlistMapper;




    @Override
    public WishlistDTO addToWishlist(Long bookId, String notes) throws BookException, WishlistException, UserException {

        User currentUser = userService.getCurrentUser();

        // 1. Validate book exists and is active
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookException("Book not found with id: " + bookId));

        if (!book.getActive()) {
            throw new BookException("Cannot add inactive book to wishlist");
        }

        // 2. Check if book is already in wishlist
        if (wishlistRepository.existsByUserIdAndBookId(currentUser.getId(), bookId)) {
            throw new WishlistException("Book is already in your wishlist");
        }

        // 3. Create wishlist item
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(currentUser);
        wishlist.setBook(book);
        wishlist.setNotes(notes);

        // 4. Save wishlist item
        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toDTO(savedWishlist);
    }

    @Override
    public void removeFromWishlist(Long bookId) throws WishlistException, UserException {

        User currentUser = userService.getCurrentUser();

        // 1. Check if book is in wishlist
        if (!wishlistRepository.existsByUserIdAndBookId(currentUser.getId(), bookId)) {
            throw new WishlistException("Book is not in your wishlist");
        }

        // 2. Remove from wishlist
        wishlistRepository.deleteByUserIdAndBookId(currentUser.getId(), bookId);
    }

    @Override
    public PageResponse<WishlistDTO> getMyWishlist(int page, int size) throws UserException {
        User currentUser = userService.getCurrentUser();
        return getUserWishlist(currentUser.getId(), page, size);
    }

    @Override
    public PageResponse<WishlistDTO> getUserWishlist(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("addedAt").descending());
        Page<Wishlist> wishlistPage = wishlistRepository.findByUserId(userId, pageable);
        return convertToPageResponse(wishlistPage);
    }

    @Override
    public boolean isBookInWishlist(Long bookId) throws UserException {
        User currentUser = userService.getCurrentUser();
        return wishlistRepository.existsByUserIdAndBookId(currentUser.getId(), bookId);
    }

    @Override
    public WishlistDTO updateWishlistNotes(Long bookId, String notes) throws WishlistException, UserException {

        User currentUser = userService.getCurrentUser();

        // 1. Find wishlist item
        Wishlist wishlist = wishlistRepository.findByUserIdAndBookId(currentUser.getId(), bookId)
                .orElseThrow(() -> new WishlistException("Book is not in your wishlist"));

        // 2. Update notes
        wishlist.setNotes(notes);

        // 3. Save updated wishlist item
        Wishlist updatedWishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toDTO(updatedWishlist);
    }

    @Override
    public Long getMyWishlistCount() throws UserException {
        User currentUser = userService.getCurrentUser();
        return wishlistRepository.countByUserId(currentUser.getId());
    }

    @Override
    public Long getBookWishlistCount(Long bookId) {
        return wishlistRepository.countByBookId(bookId);
    }

    // ==================== HELPER METHODS ====================



    private PageResponse<WishlistDTO> convertToPageResponse(Page<Wishlist> wishlistPage) {
        List<WishlistDTO> wishlistDTOs = wishlistPage.getContent()
                .stream()
                .map(wishlistMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                wishlistDTOs,
                wishlistPage.getNumber(),
                wishlistPage.getSize(),
                wishlistPage.getTotalElements(),
                wishlistPage.getTotalPages(),
                wishlistPage.isLast(),
                wishlistPage.isFirst(),
                wishlistPage.isEmpty()
        );
    }
}
