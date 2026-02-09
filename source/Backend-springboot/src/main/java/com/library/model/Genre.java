package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a book genre in the library catalog.
 * Supports hierarchical genre structure and dynamic genre management.
 */
@Entity
@Table(name = "genres", indexes = {
    @Index(name = "idx_genre_code", columnList = "code", unique = true),
    @Index(name = "idx_genre_name", columnList = "name"),
    @Index(name = "idx_genre_active", columnList = "active")
})
@EqualsAndHashCode(exclude = {"parentGenre", "subGenres", "books"})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Genre code is mandatory")
    @Size(min = 2, max = 50, message = "Genre code must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Z_]+$", message = "Genre code must contain only uppercase letters and underscores")
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @NotBlank(message = "Genre name is mandatory")
    @Size(min = 2, max = 100, message = "Genre name must be between 2 and 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(length = 500)
    private String description;

    @Min(value = 0, message = "Display order cannot be negative")
    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_genre_id")
    private Genre parentGenre;

    @OneToMany(mappedBy = "parentGenre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Genre> subGenres = new ArrayList<>();

    @OneToMany(mappedBy = "genre", cascade = CascadeType.PERSIST)
    private List<Book> books = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;


}
