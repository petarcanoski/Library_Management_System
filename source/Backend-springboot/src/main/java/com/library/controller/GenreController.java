package com.library.controller;

import com.library.exception.GenreException;
import com.library.payload.dto.GenreDTO;
import com.library.payload.response.ApiResponse;
import com.library.service.GenreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Genre management operations.
 * Provides endpoints for CRUD operations and genre queries.
 */
@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    // ==================== CRUD OPERATIONS ====================

    /**
     * Create a new genre
     * POST /api/genres
     */
    @PostMapping
    public ResponseEntity<GenreDTO> createGenre(@Valid @RequestBody GenreDTO genreDTO) {
        try {
            GenreDTO createdGenre = genreService.createGenre(genreDTO);
            return new ResponseEntity<>(createdGenre, HttpStatus.CREATED);
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Create multiple genres in bulk
     * POST /api/genres/bulk
     *
     * Example request body:
     * [
     *   {
     *     "code": "DETECTIVE",
     *     "name": "Detective Fiction",
     *     "description": "Mystery novels featuring detective protagonists",
     *     "displayOrder": 1,
     *     "active": true,
     *     "parentGenreId": 5
     *   },
     *   {
     *     "code": "COZY_MYSTERY",
     *     "name": "Cozy Mystery",
     *     "description": "Light-hearted mystery novels",
     *     "displayOrder": 2,
     *     "active": true,
     *     "parentGenreId": 5
     *   }
     * ]
     */
    @PostMapping("/bulk")
    public ResponseEntity<?> createGenresBulk(@Valid @RequestBody List<GenreDTO> genreDTOs) {
        try {
            List<GenreDTO> createdGenres = genreService.createGenresBulk(genreDTOs);
            return new ResponseEntity<>(createdGenres, HttpStatus.CREATED);
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Get a genre by ID
     * GET /api/genres/{id}
     */
//    @GetMapping("/{id}")
//    public ResponseEntity<GenreDTO> getGenreById(@PathVariable Long id) throws GenreException {
//        GenreDTO genre = genreService.getGenreById(id);
//        return ResponseEntity.ok(genre);
//    }

    /**
     * Get a genre by code
     * GET /api/genres/code/{code}
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<GenreDTO> getGenreByCode(@PathVariable String code) throws GenreException {
        GenreDTO genre = genreService.getGenreByCode(code);
        return ResponseEntity.ok(genre);
    }

    /**
     * Update a genre
     * PUT /api/genres/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<GenreDTO> updateGenre(
            @PathVariable Long id,
            @Valid @RequestBody GenreDTO genreDTO) {
        try {
            GenreDTO updatedGenre = genreService.updateGenre(id, genreDTO);
            return ResponseEntity.ok(updatedGenre);
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Delete a genre (soft delete)
     * DELETE /api/genres/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteGenre(@PathVariable Long id) {
        try {
            genreService.deleteGenre(id);
            return ResponseEntity.ok(new ApiResponse("Genre deleted successfully", true));
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    /**
     * Permanently delete a genre
     * DELETE /api/genres/{id}/hard
     */
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse> hardDeleteGenre(@PathVariable Long id) {
        try {
            genreService.hardDeleteGenre(id);
            return ResponseEntity.ok(new ApiResponse("Genre permanently deleted", true));
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ==================== QUERY OPERATIONS ====================

    /**
     * Get all active genres (flat list, ordered by display order)
     * GET /api/genres/active
     *
     * Returns ALL genres including both parent and sub-genres in a flat list.
     * Does NOT include nested sub-genres structure.
     */
    @GetMapping("/active")
    public ResponseEntity<List<GenreDTO>> getAllActiveGenres() {
        List<GenreDTO> genres = genreService.getAllActiveGenres();
        return ResponseEntity.ok(genres);
    }

    /**
     * Get all active genres with full hierarchical structure (RECOMMENDED)
     * GET /api/genres/active/hierarchy
     *
     * Returns ONLY top-level genres (parentGenreId == null), each with their
     * complete nested sub-genres tree recursively included.
     *
     * Example output:
     * [
     *   {
     *     "id": 1,
     *     "name": "Fiction",
     *     "subGenres": [
     *       {
     *         "id": 2,
     *         "name": "Mystery",
     *         "subGenres": [
     *           {"id": 5, "name": "Detective Fiction", "subGenres": []},
     *           {"id": 6, "name": "Cozy Mystery", "subGenres": []}
     *         ]
     *       }
     *     ]
     *   }
     * ]
     */
    @GetMapping("/active/hierarchy")
    public ResponseEntity<List<GenreDTO>> getAllActiveGenresWithHierarchy() {
        List<GenreDTO> genres = genreService.getAllActiveGenresWithSubGenres();
        return ResponseEntity.ok(genres);
    }

    /**
     * Get all top-level genres with their immediate sub-genres (one level deep)
     * GET /api/genres/top-level
     *
     * Returns ONLY genres with no parent, including their direct children.
     * Note: This includes full nested hierarchy (same as /active/hierarchy).
     */
    @GetMapping("/top-level")
    public ResponseEntity<List<GenreDTO>> getTopLevelGenres() {
        List<GenreDTO> genres = genreService.getTopLevelGenres();
        return ResponseEntity.ok(genres);
    }

    /**
     * Get sub-genres of a specific parent genre
     * GET /api/genres/{parentId}/sub-genres
     */
    @GetMapping("/{parentId}/sub-genres")
    public ResponseEntity<List<GenreDTO>> getSubGenres(@PathVariable Long parentId) {
        try {
            List<GenreDTO> subGenres = genreService.getSubGenresByParentId(parentId);
            return ResponseEntity.ok(subGenres);
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }





    /**
     * Search genres by name or code
     * GET /api/genres/search?term=fiction&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<GenreDTO>> searchGenres(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("DESC")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<GenreDTO> genrePage = genreService.searchGenres(term, pageable);

        return ResponseEntity.ok(genrePage);
    }

    // ==================== STATISTICS ====================

    /**
     * Get total count of active genres
     * GET /api/genres/count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalActiveGenres() {
        long count = genreService.getTotalActiveGenres();
        return ResponseEntity.ok(count);
    }

    /**
     * Get book count for a specific genre
     * GET /api/genres/{id}/book-count
     */
    @GetMapping("/{id}/book-count")
    public ResponseEntity<Long> getBookCountByGenre(
        @PathVariable Long id) {
        try {
            long count = genreService.getBookCountByGenre(id);
            return ResponseEntity.ok(count);
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Check if a genre is being used by any books
     * GET /api/genres/{id}/in-use
     */
    @GetMapping("/{id}/in-use")
    public ResponseEntity<Boolean> isGenreInUse(@PathVariable Long id) {
        try {
            boolean inUse = genreService.isGenreInUse(id);
            return ResponseEntity.ok(inUse);
        } catch (GenreException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
