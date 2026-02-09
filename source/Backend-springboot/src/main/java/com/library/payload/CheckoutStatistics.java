package com.library.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for checkout/transaction statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutStatistics {
    private long totalCheckouts;
    private long activeCheckouts;
    private long overdueCheckouts;
    private long totalReturns;
    private BigDecimal totalUnpaidFines;
    private long transactionsWithFines;
}
