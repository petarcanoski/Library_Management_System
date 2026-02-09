import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/genres';

// ==================== CRUD OPERATIONS ====================

/**
 * Create a new genre
 * POST /api/genres
 */
export const createGenre = createAsyncThunk(
  'genres/createGenre',
  async (genreData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}`, genreData, {
        headers: getHeaders(),
      });
      console.log('Created genre:', response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create genre');
    }
  }
);

/**
 * Create multiple genres in bulk
 * POST /api/genres/bulk
 */
export const createGenresBulk = createAsyncThunk(
  'genres/createGenresBulk',
  async (genresData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/bulk`, genresData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create genres in bulk');
    }
  }
);

/**
 * Get a genre by ID
 * GET /api/genres/{id}
 */
export const fetchGenreById = createAsyncThunk(
  'genres/fetchGenreById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch genre');
    }
  }
);

/**
 * Get a genre by code
 * GET /api/genres/code/{code}
 */
export const fetchGenreByCode = createAsyncThunk(
  'genres/fetchGenreByCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/code/${code}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch genre by code');
    }
  }
);

/**
 * Update a genre
 * PUT /api/genres/{id}
 */
export const updateGenre = createAsyncThunk(
  'genres/updateGenre',
  async ({ id, genreData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, genreData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update genre');
    }
  }
);

/**
 * Delete a genre (soft delete)
 * DELETE /api/genres/{id}
 */
export const deleteGenre = createAsyncThunk(
  'genres/deleteGenre',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      return { id, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete genre');
    }
  }
);

/**
 * Permanently delete a genre
 * DELETE /api/genres/{id}/hard
 */
export const hardDeleteGenre = createAsyncThunk(
  'genres/hardDeleteGenre',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${id}/hard`, {
        headers: getHeaders(),
      });
      return { id, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to permanently delete genre');
    }
  }
);

// ==================== QUERY OPERATIONS ====================

/**
 * Get all active genres (flat list)
 * GET /api/genres/active
 */
export const fetchActiveGenres = createAsyncThunk(
  'genres/fetchActiveGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/active`, {
        headers: getHeaders(),
      });
      console.log('Fetched active genres:', response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active genres');
    }
  }
);

/**
 * Get all active genres with full hierarchical structure (RECOMMENDED)
 * GET /api/genres/active/hierarchy
 */
export const fetchActiveGenresWithHierarchy = createAsyncThunk(
  'genres/fetchActiveGenresWithHierarchy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/active/hierarchy`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active genres hierarchy');
    }
  }
);

/**
 * Get all top-level genres with their sub-genres
 * GET /api/genres/top-level
 */
export const fetchTopLevelGenres = createAsyncThunk(
  'genres/fetchTopLevelGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/top-level`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top-level genres');
    }
  }
);

/**
 * Get sub-genres of a specific parent genre
 * GET /api/genres/{parentId}/sub-genres
 */
export const fetchSubGenres = createAsyncThunk(
  'genres/fetchSubGenres',
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${parentId}/sub-genres`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sub-genres');
    }
  }
);


/**
 * Search genres by name or code
 * GET /api/genres/search?term=fiction&page=0&size=10
 */
export const searchGenres = createAsyncThunk(
  'genres/searchGenres',
  async ({ term, page = 0, size = 10, sortBy = 'name', sortDir = 'ASC' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/search`, {
        params: { term, page, size, sortBy, sortDir },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search genres');
    }
  }
);

// ==================== STATISTICS ====================

/**
 * Get total count of active genres
 * GET /api/genres/count
 */
export const fetchGenreCount = createAsyncThunk(
  'genres/fetchGenreCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/count`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch genre count');
    }
  }
);

/**
 * Get book count for a specific genre
 * GET /api/genres/{id}/book-count
 */
export const fetchBookCountByGenre = createAsyncThunk(
  'genres/fetchBookCountByGenre',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}/book-count`, {
        headers: getHeaders(),
      });
      return { id, count: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch book count');
    }
  }
);

/**
 * Check if a genre is being used by any books
 * GET /api/genres/{id}/in-use
 */
export const checkGenreInUse = createAsyncThunk(
  'genres/checkGenreInUse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}/in-use`, {
        headers: getHeaders(),
      });
      return { id, inUse: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check genre usage');
    }
  }
);


