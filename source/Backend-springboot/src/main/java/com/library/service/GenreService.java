package com.library.service;

import com.library.exception.GenreException;
import com.library.payload.dto.GenreDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for genre management operations.
 * Defines business logic for CRUD operations and genre management.
 */
public interface GenreService {

    // ==================== CRUD OPERATIONS ====================

    /**
     * Create a new genre
     * @param genreDTO Genre data
     * @return Created genre DTO
     * @throws GenreException if genre code already exists or validation fails
     */
    GenreDTO createGenre(GenreDTO genreDTO) throws GenreException;

    /**
     * Create multiple genres in bulk
     * @param genreDTOs List of genre data
     * @return List of created genre DTOs
     * @throws GenreException if any genre code already exists or validation fails
     */
    List<GenreDTO> createGenresBulk(List<GenreDTO> genreDTOs) throws GenreException;

    /**
     * Get a genre by ID
     * @param genreId Genre ID
     * @return Genre DTO
     * @throws GenreException if genre not found
     */
    GenreDTO getGenreById(Long genreId) throws GenreException;

    /**
     * Get a genre by code
     * @param code Genre code
     * @return Genre DTO
     * @throws GenreException if genre not found
     */
    GenreDTO getGenreByCode(String code) throws GenreException;

    /**
     * Update an existing genre
     * @param genreId Genre ID
     * @param genreDTO Updated genre data
     * @return Updated genre DTO
     * @throws GenreException if genre not found or validation fails
     */
    GenreDTO updateGenre(Long genreId, GenreDTO genreDTO) throws GenreException;

    /**
     * Delete a genre (soft delete - marks as inactive)
     * @param genreId Genre ID
     * @throws GenreException if genre not found or genre is in use
     */
    void deleteGenre(Long genreId) throws GenreException;

    /**
     * Permanently delete a genre from the database
     * @param genreId Genre ID
     * @throws GenreException if genre not found or genre is in use
     */
    void hardDeleteGenre(Long genreId) throws GenreException;

    // ==================== QUERY OPERATIONS ====================

    /**
     * Get all active genres (ordered by display order)
     * @return List of active genres
     */
    List<GenreDTO> getAllActiveGenres();

    /**
     * Get all active genres with sub-genres
     * @return List of active genres with hierarchical structure
     */
    List<GenreDTO> getAllActiveGenresWithSubGenres();

    /**
     * Get all top-level genres (genres with no parent)
     * @return List of top-level genres
     */
    List<GenreDTO> getTopLevelGenres();

    /**
     * Get all sub-genres of a specific parent genre
     * @param parentGenreId Parent genre ID
     * @return List of sub-genres
     * @throws GenreException if parent genre not found
     */
    List<GenreDTO> getSubGenresByParentId(Long parentGenreId) throws GenreException;



    /**
     * Search genres by name or code
     * @param searchTerm Search term
     * @param pageable Pagination parameters
     * @return Page of matching genres
     */
    Page<GenreDTO> searchGenres(String searchTerm, Pageable pageable);

    // ==================== STATISTICS ====================

    /**
     * Get total count of active genres
     * @return Total active genres count
     */
    long getTotalActiveGenres();

    /**
     * Get book count for a specific genre
     * @param genreId Genre ID
     * @return Number of books in this genre
     * @throws GenreException if genre not found
     */
    long getBookCountByGenre(Long genreId) throws GenreException;

    /**
     * Check if a genre is being used by any books
     * @param genreId Genre ID
     * @return True if genre is in use
     * @throws GenreException if genre not found
     */
    boolean isGenreInUse(Long genreId) throws GenreException;
}
