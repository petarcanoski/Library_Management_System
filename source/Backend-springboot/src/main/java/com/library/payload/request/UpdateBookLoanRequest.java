package com.library.payload.request;

import com.library.domain.BookLoanStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for updating a book loan (admin only)
 * Allows admin to modify key book loan attributes
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookLoanRequest {

    private BookLoanStatus status;

    private LocalDate dueDate;

    private LocalDate returnDate;

    private Integer maxRenewals;

    private BigDecimal fineAmount;

    private Boolean finePaid;

    private String notes;
}
