import { createSlice } from '@reduxjs/toolkit';
import {
  createGenre,
  createGenresBulk,
  fetchGenreById,
  fetchGenreByCode,
  updateGenre,
  deleteGenre,
  hardDeleteGenre,
  fetchActiveGenres,
  fetchActiveGenresWithHierarchy,
  fetchTopLevelGenres,
  fetchSubGenres,
 
  searchGenres,
  fetchGenreCount,
  fetchBookCountByGenre,
  checkGenreInUse,
} from './genreThunk';

// Initial state
const initialState = {
  genres: [],
  activeGenres: [],
  genreHierarchy: [],
  topLevelGenres: [],
  subGenres: [],
  currentGenre: null,
  paginatedGenres: {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
  },
  searchResults: {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
  },
  genreCount: 0,
  bookCountByGenre: {},
  genreInUse: {},
  loading: false,
  actionLoading: false,
  error: null,
};

// Genres slice
const genreSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGenre: (state) => {
      state.currentGenre = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = initialState.searchResults;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== CREATE OPERATIONS ====================
      // Create genre
      .addCase(createGenre.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.genres.push(action.payload);
      })
      .addCase(createGenre.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Create genres bulk
      .addCase(createGenresBulk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createGenresBulk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.genres.push(...action.payload);
      })
      .addCase(createGenresBulk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ==================== READ OPERATIONS ====================
      // Fetch genre by ID
      .addCase(fetchGenreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenreById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGenre = action.payload;
      })
      .addCase(fetchGenreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch genre by code
      .addCase(fetchGenreByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenreByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGenre = action.payload;
      })
      .addCase(fetchGenreByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch active genres
      .addCase(fetchActiveGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(fetchActiveGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch active genres with hierarchy
      .addCase(fetchActiveGenresWithHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveGenresWithHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.genreHierarchy = action.payload;
      })
      .addCase(fetchActiveGenresWithHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch top-level genres
      .addCase(fetchTopLevelGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopLevelGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.topLevelGenres = action.payload;
      })
      .addCase(fetchTopLevelGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch sub-genres
      .addCase(fetchSubGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.subGenres = action.payload;
      })
      .addCase(fetchSubGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ==================== SEARCH OPERATIONS ====================

      // Search genres
      .addCase(searchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        // Also update genres with search results content for direct access
        state.genres = action.payload.content || [];
      })
      .addCase(searchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== UPDATE OPERATIONS ====================
      // Update genre
      .addCase(updateGenre.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateGenre.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.genres.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.genres[index] = action.payload;
        }
        if (state.currentGenre?.id === action.payload.id) {
          state.currentGenre = action.payload;
        }
      })
      .addCase(updateGenre.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ==================== DELETE OPERATIONS ====================
      // Delete genre (soft delete)
      .addCase(deleteGenre.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteGenre.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.genres = state.genres.filter(g => g.id !== action.payload.id);
        state.activeGenres = state.activeGenres.filter(g => g.id !== action.payload.id);
      })
      .addCase(deleteGenre.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Hard delete genre
      .addCase(hardDeleteGenre.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(hardDeleteGenre.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.genres = state.genres.filter(g => g.id !== action.payload.id);
        state.activeGenres = state.activeGenres.filter(g => g.id !== action.payload.id);
      })
      .addCase(hardDeleteGenre.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ==================== STATISTICS ====================
      // Fetch genre count
      .addCase(fetchGenreCount.fulfilled, (state, action) => {
        state.genreCount = action.payload;
      })

      // Fetch book count by genre
      .addCase(fetchBookCountByGenre.fulfilled, (state, action) => {
        state.bookCountByGenre[action.payload.id] = action.payload.count;
      })

      // Check genre in use
      .addCase(checkGenreInUse.fulfilled, (state, action) => {
        state.genreInUse[action.payload.id] = action.payload.inUse;
      });
  },
});

export const { clearError, clearCurrentGenre, clearSearchResults } = genreSlice.actions;
export default genreSlice.reducer;
