package com.library.service.impl;

import com.library.model.BookLoan;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Service for calculating fines for overdue books
 */
@Service
public class FineCalculationService {

    // Configuration constants - can be moved to application.properties
    private static final BigDecimal FINE_PER_DAY = new BigDecimal("1.00"); // $1 per day
    private static final BigDecimal MAXIMUM_FINE = new BigDecimal("50.00"); // Max $50
    private static final BigDecimal LOST_BOOK_PENALTY = new BigDecimal("100.00"); // $100 for lost book
    private static final BigDecimal DAMAGED_BOOK_PENALTY = new BigDecimal("25.00"); // $25 for damage
    private static final int GRACE_PERIOD_DAYS = 0; // No grace period

    /**
     * Calculate fine for an overdue book loan
     * @param bookLoan The book loan to calculate fine for
     * @return The calculated fine amount
     */
    public BigDecimal calculateOverdueFine(BookLoan bookLoan) {
        if (bookLoan.getReturnDate() == null) {
            // Book not returned yet - calculate from current date
            return calculateFine(bookLoan.getDueDate(), LocalDate.now());
        } else {
            // Book already returned - calculate from return date
            return calculateFine(bookLoan.getDueDate(), bookLoan.getReturnDate());
        }
    }

    /**
     * Calculate fine between two dates
     * @param dueDate The due date
     * @param actualDate The actual return date or current date
     * @return The calculated fine amount
     */
    public BigDecimal calculateFine(LocalDate dueDate, LocalDate actualDate) {
        if (actualDate.isBefore(dueDate) || actualDate.isEqual(dueDate)) {
            return BigDecimal.ZERO; // No fine if returned on time
        }

        long overdueDays = ChronoUnit.DAYS.between(dueDate, actualDate);

        // Apply grace period
        overdueDays = overdueDays - GRACE_PERIOD_DAYS;
        if (overdueDays <= 0) {
            return BigDecimal.ZERO;
        }

        // Calculate fine
        BigDecimal fine = FINE_PER_DAY.multiply(BigDecimal.valueOf(overdueDays));

        // Cap at maximum fine
        if (fine.compareTo(MAXIMUM_FINE) > 0) {
            fine = MAXIMUM_FINE;
        }

        return fine;
    }

    /**
     * Calculate overdue days
     * @param dueDate The due date
     * @param actualDate The actual return date or current date
     * @return Number of overdue days
     */
    public int calculateOverdueDays(LocalDate dueDate, LocalDate actualDate) {
        if (actualDate.isBefore(dueDate) || actualDate.isEqual(dueDate)) {
            return 0;
        }
        return (int) ChronoUnit.DAYS.between(dueDate, actualDate);
    }

    /**
     * Get penalty for lost book
     * @return Lost book penalty amount
     */
    public BigDecimal getLostBookPenalty() {
        return LOST_BOOK_PENALTY;
    }

    /**
     * Get penalty for damaged book
     * @return Damaged book penalty amount
     */
    public BigDecimal getDamagedBookPenalty() {
        return DAMAGED_BOOK_PENALTY;
    }

    /**
     * Calculate total fine including penalties
     * @param overdueFine The overdue fine amount
     * @param isLost Whether the book is lost
     * @param isDamaged Whether the book is damaged
     * @return Total fine amount
     */
    public BigDecimal calculateTotalFine(BigDecimal overdueFine, boolean isLost, boolean isDamaged) {
        BigDecimal totalFine = overdueFine;

        if (isLost) {
            totalFine = totalFine.add(LOST_BOOK_PENALTY);
        }

        if (isDamaged) {
            totalFine = totalFine.add(DAMAGED_BOOK_PENALTY);
        }

        return totalFine;
    }

    /**
     * Get fine per day rate
     * @return Fine per day amount
     */
    public BigDecimal getFinePerDay() {
        return FINE_PER_DAY;
    }

    /**
     * Get maximum fine cap
     * @return Maximum fine amount
     */
    public BigDecimal getMaximumFine() {
        return MAXIMUM_FINE;
    }
}
