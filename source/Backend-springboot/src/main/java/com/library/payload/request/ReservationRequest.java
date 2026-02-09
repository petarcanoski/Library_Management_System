package com.library.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a book reservation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {

//    @NotNull(message = "Book ID is mandatory")
//    private Long bookId;

    @NotBlank(message = "ISBN is required")
    private String isbn;

    private String notes;
}
