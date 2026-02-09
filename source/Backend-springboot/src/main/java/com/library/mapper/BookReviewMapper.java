package com.library.mapper;

import com.library.model.BookReview;
import com.library.payload.dto.BookReviewDTO;
import org.springframework.stereotype.Component;

/**
 * Mapper for BookReview entity and DTO
 */
@Component
public class BookReviewMapper {

    public BookReviewDTO toDTO(BookReview bookReview) {
        if (bookReview == null) {
            return null;
        }

        return BookReviewDTO.builder()
                .id(bookReview.getId())
                .userId(bookReview.getUser().getId())
                .userName(bookReview.getUser().getFullName())
                .bookId(bookReview.getBook().getId())
                .bookTitle(bookReview.getBook().getTitle())
                .rating(bookReview.getRating())
                .reviewText(bookReview.getReviewText())
                .title(bookReview.getTitle())
                .isVerifiedReader(bookReview.getIsVerifiedReader())
                .isActive(bookReview.getIsActive())
                .helpfulCount(bookReview.getHelpfulCount())
                .createdAt(bookReview.getCreatedAt())
                .updatedAt(bookReview.getUpdatedAt())
                .build();
    }

    public BookReview toEntity(BookReviewDTO bookReviewDTO) {
        if (bookReviewDTO == null) {
            return null;
        }

        BookReview bookReview = new BookReview();
        bookReview.setId(bookReviewDTO.getId());
        bookReview.setRating(bookReviewDTO.getRating());
        bookReview.setReviewText(bookReviewDTO.getReviewText());
        bookReview.setTitle(bookReviewDTO.getTitle());
        bookReview.setIsVerifiedReader(bookReviewDTO.getIsVerifiedReader());
        bookReview.setIsActive(bookReviewDTO.getIsActive());
        bookReview.setHelpfulCount(bookReviewDTO.getHelpfulCount());

        return bookReview;
    }
}
