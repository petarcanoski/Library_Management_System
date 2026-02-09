package com.library.service.impl;

import com.library.exception.GenreException;
import com.library.mapper.GenreMapper;
import com.library.model.Genre;
import com.library.payload.dto.GenreDTO;
import com.library.repository.GenreRepository;
import com.library.service.GenreService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of GenreService interface.
 * Handles all business logic for genre management operations.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    // ==================== CRUD OPERATIONS ====================

    @Override
    public GenreDTO createGenre(GenreDTO genreDTO) throws GenreException {
        // Validate code uniqueness
        if (genreRepository.existsByCode(genreDTO.getCode())) {
            throw new GenreException("Genre with code " + genreDTO.getCode() + " already exists");
        }

        // Validate parent genre if provided
        if (genreDTO.getParentGenreId() != null) {
            Genre parentGenre = genreRepository.findById(genreDTO.getParentGenreId())
                .orElseThrow(() -> new GenreException("Parent genre with ID " + genreDTO.getParentGenreId() + " not found"));

            if (!parentGenre.getActive()) {
                throw new GenreException("Cannot set an inactive genre as parent");
            }
        }

        Genre genre = genreMapper.toEntity(genreDTO);
        Genre savedGenre = genreRepository.save(genre);

        return genreMapper.toDTO(savedGenre);
    }

    @Override
    public List<GenreDTO> createGenresBulk(List<GenreDTO> genreDTOs) throws GenreException {
        if (genreDTOs == null || genreDTOs.isEmpty()) {
            throw new GenreException("Genre list cannot be null or empty");
        }

        // Validate all genres before creating any
        for (GenreDTO genreDTO : genreDTOs) {
            // Check for duplicate codes in the input list
            long duplicateCount = genreDTOs.stream()
                .filter(g -> g.getCode().equals(genreDTO.getCode()))
                .count();

            if (duplicateCount > 1) {
                throw new GenreException("Duplicate genre code in request: " + genreDTO.getCode());
            }

            // Check if code already exists in database
            if (genreRepository.existsByCode(genreDTO.getCode())) {
                throw new GenreException("Genre with code " + genreDTO.getCode() + " already exists");
            }

            // Validate parent genre if provided
            if (genreDTO.getParentGenreId() != null) {
                Genre parentGenre = genreRepository.findById(genreDTO.getParentGenreId())
                    .orElseThrow(() -> new GenreException("Parent genre with ID " + genreDTO.getParentGenreId() + " not found"));

                if (!parentGenre.getActive()) {
                    throw new GenreException("Cannot set an inactive genre as parent");
                }
            }
        }

        // All validations passed, now create all genres
        List<Genre> genresToSave = new ArrayList<>();
        for (GenreDTO genreDTO : genreDTOs) {
            Genre genre = genreMapper.toEntity(genreDTO);
            genresToSave.add(genre);
        }

        // Save all genres in a single batch
        List<Genre> savedGenres = genreRepository.saveAll(genresToSave);

        // Convert to DTOs and return
        return savedGenres.stream()
            .map(genre -> genreMapper.toDTO(genre, false))
            .collect(Collectors.toList());
    }

    @Override
    public GenreDTO getGenreById(Long genreId) throws GenreException {
        Genre genre = genreRepository.findById(genreId)
            .orElseThrow(() -> new GenreException("Genre with ID " + genreId + " not found"));

        return genreMapper.toDTO(genre, true); // Include sub-genres
    }

    @Override
    public GenreDTO getGenreByCode(String code) throws GenreException {
        Genre genre = genreRepository.findByCode(code)
            .orElseThrow(() -> new GenreException("Genre with code " + code + " not found"));

        return genreMapper.toDTO(genre, true); // Include sub-genres
    }

    @Override
    public GenreDTO updateGenre(Long genreId, GenreDTO genreDTO) throws GenreException {
        Genre existingGenre = genreRepository.findById(genreId)
            .orElseThrow(() -> new GenreException("Genre with ID " + genreId + " not found"));

        // Check if code is being changed and if new code already exists
        if (!existingGenre.getCode().equals(genreDTO.getCode())) {
            if (genreRepository.existsByCode(genreDTO.getCode())) {
                throw new GenreException("Genre with code " + genreDTO.getCode() + " already exists");
            }
        }

        // Validate parent genre if provided
        if (genreDTO.getParentGenreId() != null) {
            // Cannot set self as parent
            if (genreDTO.getParentGenreId().equals(genreId)) {
                throw new GenreException("Genre cannot be its own parent");
            }

            Genre parentGenre = genreRepository.findById(genreDTO.getParentGenreId())
                .orElseThrow(() -> new GenreException("Parent genre with ID " + genreDTO.getParentGenreId() + " not found"));

            if (!parentGenre.getActive()) {
                throw new GenreException("Cannot set an inactive genre as parent");
            }

            // Check for circular reference (parent cannot be a child of this genre)
            if (isCircularReference(genreId, genreDTO.getParentGenreId())) {
                throw new GenreException("Circular reference detected: parent genre cannot be a descendant of this genre");
            }
        }

        genreMapper.updateEntityFromDTO(genreDTO, existingGenre);
        Genre updatedGenre = genreRepository.save(existingGenre);

        return genreMapper.toDTO(updatedGenre, true);
    }

    @Override
    public void deleteGenre(Long genreId) throws GenreException {
        Genre genre = genreRepository.findById(genreId)
            .orElseThrow(() -> new GenreException("Genre with ID " + genreId + " not found"));

        // Soft delete - mark as inactive
        genre.setActive(false);
        genreRepository.save(genre);
    }

    @Override
    public void hardDeleteGenre(Long genreId) throws GenreException {
        Genre genre = genreRepository.findById(genreId)
            .orElseThrow(() -> new GenreException("Genre with ID " + genreId + " not found"));

        // Check if genre is in use
        if (genreRepository.isGenreInUse(genreId)) {
            throw new GenreException("Cannot delete genre: it is currently assigned to one or more books");
        }

        // Check if genre has sub-genres
        if (!genre.getSubGenres().isEmpty()) {
            throw new GenreException("Cannot delete genre: it has sub-genres. Delete or reassign sub-genres first");
        }

        genreRepository.delete(genre);
    }

    // ==================== QUERY OPERATIONS ====================

    @Override
    public List<GenreDTO> getAllActiveGenres() {
        List<Genre> genres = genreRepository.findByActiveTrueOrderByDisplayOrderAsc();
        return genreMapper.toDTOList(genres, false);
    }

    @Override
    public List<GenreDTO> getAllActiveGenresWithSubGenres() {
        // Only fetch top-level genres (genres with no parent)
        List<Genre> topLevelGenres = genreRepository.findByParentGenreIsNullAndActiveTrueOrderByDisplayOrderAsc();
        // Convert to DTOs with sub-genres included (recursive)
        return genreMapper.toDTOList(topLevelGenres, true);
    }

    @Override
    public List<GenreDTO> getTopLevelGenres() {
        List<Genre> genres = genreRepository.findByParentGenreIsNullAndActiveTrueOrderByDisplayOrderAsc();
        return genreMapper.toDTOList(genres, true); // Include sub-genres for hierarchical view
    }

    @Override
    public List<GenreDTO> getSubGenresByParentId(Long parentGenreId) throws GenreException {
        // Validate parent genre exists
        if (!genreRepository.existsById(parentGenreId)) {
            throw new GenreException("Parent genre with ID " + parentGenreId + " not found");
        }

        List<Genre> subGenres = genreRepository.findByParentGenreIdAndActiveTrueOrderByDisplayOrderAsc(parentGenreId);
        return genreMapper.toDTOList(subGenres, false);
    }



    @Override
    public Page<GenreDTO> searchGenres(String searchTerm, Pageable pageable) {
        Page<Genre> genrePage = genreRepository.searchGenres(searchTerm, pageable);
        return genrePage.map(genre -> genreMapper.toDTO(genre, false));
    }

    // ==================== STATISTICS ====================

    @Override
    public long getTotalActiveGenres() {
        return genreRepository.countByActiveTrue();
    }

    @Override
    public long getBookCountByGenre(Long genreId) throws GenreException {
        if (!genreRepository.existsById(genreId)) {
            throw new GenreException("Genre with ID " + genreId + " not found");
        }

        return genreRepository.countBooksByGenre(genreId);
    }

    @Override
    public boolean isGenreInUse(Long genreId) throws GenreException {
        if (!genreRepository.existsById(genreId)) {
            throw new GenreException("Genre with ID " + genreId + " not found");
        }

        return genreRepository.isGenreInUse(genreId);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Check if setting a parent would create a circular reference
     */
    private boolean isCircularReference(Long genreId, Long parentGenreId) {
        Genre parent = genreRepository.findById(parentGenreId).orElse(null);

        while (parent != null) {
            if (parent.getId().equals(genreId)) {
                return true; // Circular reference found
            }
            parent = parent.getParentGenre();
        }

        return false;
    }
}
