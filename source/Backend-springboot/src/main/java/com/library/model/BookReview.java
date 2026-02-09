package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a book review with rating.
 * Only users who have read the book (completed a loan) can write reviews.
 */
@Entity
@Table(name = "book_reviews",
    indexes = {
        @Index(name = "idx_book_id", columnList = "book_id"),
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_rating", columnList = "rating")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_book_review", columnNames = {"user_id", "book_id"})
    }
)
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BookReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User is mandatory")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Book is mandatory")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @NotNull(message = "Rating is mandatory")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    @Column(nullable = false)
    private Integer rating;

    @NotBlank(message = "Review text is mandatory")
    @Size(min = 10, max = 2000, message = "Review must be between 10 and 2000 characters")
    @Column(nullable = false, length = 2000)
    private String reviewText;

    @Size(max = 200, message = "Review title must not exceed 200 characters")
    @Column(length = 200)
    private String title;

    @Column(nullable = false)
    private Boolean isVerifiedReader = false; // True if user has completed a loan for this book

    @Column(nullable = false)
    private Boolean isActive = true; // For soft delete/moderation

    @Column(name = "helpful_count", nullable = false)
    private Integer helpfulCount = 0; // Number of users who found this review helpful

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
