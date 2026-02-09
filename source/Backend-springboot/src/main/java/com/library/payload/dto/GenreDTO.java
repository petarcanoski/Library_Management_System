package com.library.payload.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for Genre entity.
 * Used for API requests and responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenreDTO {

    private Long id;

    @NotBlank(message = "Genre code is mandatory")
    @Size(min = 2, max = 50, message = "Genre code must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Z_]+$", message = "Genre code must contain only uppercase letters and underscores")
    private String code;

    @NotBlank(message = "Genre name is mandatory")
    @Size(min = 2, max = 100, message = "Genre name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder;

    private Boolean active;

    private Long parentGenreId;

    private String parentGenreName;

    private List<GenreDTO> subGenres;

    private Long bookCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
