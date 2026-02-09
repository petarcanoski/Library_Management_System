package com.library.payload.dto;

import lombok.*;

import java.util.Map;

/**
 * DTO for book rating statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRatingStatisticsDTO {

    private Long bookId;

    private String bookTitle;

    private Double averageRating;

    private Long totalReviews;

    // Rating distribution: key = rating (1-5), value = count
    private Map<Integer, Long> ratingDistribution;

    private Long verifiedReaderReviews;
}
