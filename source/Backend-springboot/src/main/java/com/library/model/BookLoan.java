package com.library.model;

import com.library.domain.BookLoanStatus;
import com.library.domain.BookLoanType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a book loan (checkout/check-in).
 * Tracks the complete lifecycle of a book loan from checkout to return.
 */
@Entity
@Table(name = "book_loans", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_book_id", columnList = "book_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_due_date", columnList = "due_date"),
    @Index(name = "idx_checkout_date", columnList = "checkout_date")
})
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BookLoan {

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

    @NotNull(message = "Loan type is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookLoanType type;

    @NotNull(message = "Loan status is mandatory")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookLoanStatus status;

    @NotNull(message = "Checkout date is mandatory")
    @Column(name = "checkout_date", nullable = false)
    private LocalDate checkoutDate;

    @NotNull(message = "Due date is mandatory")
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Column(name = "renewal_count", nullable = false)
    private Integer renewalCount = 0;

    @Column(name = "max_renewals", nullable = false)
    private Integer maxRenewals = 2; // Default: allow 2 renewals

    // ==================== FINE TRACKING ====================
    // New approach: Separate Fine entities for better financial tracking
    @OneToMany(mappedBy = "bookLoan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Fine> fines = new ArrayList<>();


    @Column(length = 500)
    private String notes;

    @Column(name = "is_overdue", nullable = false)
    private Boolean isOverdue = false;

    @Column(name = "overdue_days")
    private Integer overdueDays = 0;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * Check if the loan can be renewed
     */
    public boolean canRenew() {
        return status == BookLoanStatus.CHECKED_OUT
               && !isOverdue
               && renewalCount < maxRenewals;
    }

    /**
     * Check if the loan is currently active (book is with user)
     */
    public boolean isActive() {
        return status == BookLoanStatus.CHECKED_OUT
               || status == BookLoanStatus.OVERDUE;
    }

    /**
     * Calculate days until due date (negative if overdue)
     */
    public long getDaysUntilDue() {
        return LocalDate.now().datesUntil(dueDate).count();
    }

    // ==================== FINE-RELATED HELPER METHODS ====================

    /**
     * Get total fine amount from all fines
     * @return Total fine amount
     */
    public long getTotalFineAmount() {
        return fines.stream()
                .mapToLong(Fine::getAmount)
                .sum();
    }

    /**
     * Get total outstanding (unpaid) fine amount
     * @return Total unpaid fine amount
     */
    long totalOutstanding = fines.stream()
            .filter(Fine::isPending)
            .mapToLong(Fine::getAmountOutstanding)
            .sum();




}
