package com.library.payload.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for paying a fine
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayFineRequest {

    @NotNull(message = "Fine ID is mandatory")
    private Long fineId;

    @Positive(message = "Payment amount must be positive")
    private Long amount; // If null, pay full amount

    private String transactionId;

    private String notes;
}
