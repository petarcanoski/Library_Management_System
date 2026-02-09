package com.library.repository;

import com.library.model.Genre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Genre entity.
 * Provides CRUD operations and custom query methods for managing genres.
 */
@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {

    /**
     * Find a genre by its unique code
     */
    Optional<Genre> findByCode(String code);

    /**
     * Check if a genre exists with the given code
     */
    boolean existsByCode(String code);


    /**
     * Find all active genres
     */
    List<Genre> findByActiveTrueOrderByDisplayOrderAsc();


    /**
     * Find all top-level genres (genres with no parent)
     */
    List<Genre> findByParentGenreIsNullAndActiveTrueOrderByDisplayOrderAsc();

    /**
     * Find all sub-genres of a specific parent genre
     */
    List<Genre> findByParentGenreIdAndActiveTrueOrderByDisplayOrderAsc(Long parentGenreId);

    /**
     * Count active genres
     */
    long countByActiveTrue();

    /**
     * Search genres by name or code
     */
    @Query("SELECT g FROM Genre g WHERE " +
           "LOWER(g.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(g.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Genre> searchGenres(@Param("searchTerm") String searchTerm, Pageable pageable);


    /**
     * Check if any books are using this genre
     */
    @Query("SELECT COUNT(b) > 0 FROM Book b WHERE b.genre.id = :genreId")
    boolean isGenreInUse(@Param("genreId") Long genreId);

    /**
     * Count books by genre
     */
    @Query("SELECT COUNT(b) FROM Book b WHERE b.genre.id = :genreId")
    long countBooksByGenre(@Param("genreId") Long genreId);
}
