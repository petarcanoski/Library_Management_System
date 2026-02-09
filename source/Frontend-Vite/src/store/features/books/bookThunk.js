import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/books';

// ==================== CRUD OPERATIONS ====================

/**
 * Create a new book
 * POST /api/books
 */
export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}`, bookData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create book');
    }
  }
);

/**
 * Create multiple books in bulk
 * POST /api/books/bulk
 */
export const createBooksBulk = createAsyncThunk(
  'books/createBooksBulk',
  async (booksData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/bulk`, booksData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create books in bulk');
    }
  }
);

/**
 * Get a book by ID
 * GET /api/books/{id}
 */
export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${bookId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch book');
    }
  }
);

/**
 * Get a book by ISBN
 * GET /api/books/isbn/{isbn}
 */
export const fetchBookByIsbn = createAsyncThunk(
  'books/fetchBookByIsbn',
  async (isbn, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/isbn/${isbn}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch book by ISBN');
    }
  }
);

/**
 * Update a book
 * PUT /api/books/{id}
 */
export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, bookData, {
        headers: getHeaders(),
      });
       console.log("update book -- ",response.data);
      return response.data;
     
    } catch (error) {
      console.log("update book error -- ",error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update book');
    }
  }
);

/**
 * Soft delete a book (mark as inactive)
 * DELETE /api/books/{id}
 */
export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${bookId}`, {
        headers: getHeaders(),
      });
      return { id: bookId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete book');
    }
  }
);

/**
 * Permanently delete a book
 * DELETE /api/books/{id}/permanent
 */
export const hardDeleteBook = createAsyncThunk(
  'books/hardDeleteBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${bookId}/permanent`, {
        headers: getHeaders(),
      });
      return { id: bookId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to permanently delete book');
    }
  }
);

// ==================== UNIFIED SEARCH & LIST ====================

/**
 * Get/Search books with optional filters via query parameters
 * GET /api/books?genreId=1&availableOnly=true&page=0&size=20
 *
 * This is the PRIMARY endpoint for listing/searching books.
 * Use query parameters for simple filters.
 */
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({
    genreId = null,
    availableOnly = null,
    activeOnly = true,
    page = 0,
    size = 20,
    sortBy = 'createdAt',
    sortDirection = 'DESC'
  } = {}, { rejectWithValue }) => {
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDirection,
        activeOnly,
      };

      // Only add optional filters if they are provided
      if (genreId !== null && genreId !== undefined) {
        params.genreId = genreId;
      }
      if (availableOnly !== null && availableOnly !== undefined) {
        params.availableOnly = availableOnly;
      }

      const response = await api.get(`${API_URL}`, {
        params,
        headers: getHeaders(),
      });
      console.log("fetch book -- ",response.data);
      return response.data;
    } catch (error) {
      console.log("fetch book error -- ",error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
    }
  }
);

/**
 * Advanced search with multiple filters (complex queries)
 * POST /api/books/search
 *
 * Use this endpoint when you need to combine text search with filters.
 */
export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (searchRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/search`, 
        searchRequest, {
        headers: getHeaders(),
      });
      console.log("search book -- ",response.data);
      return response.data;
    } catch (error) {
      console.log("search book error -- ",error);
      return rejectWithValue(error.response?.data?.message 
        || 'Search failed');
    }
  }
);

// ==================== STATISTICS ====================

/**
 * Get book catalog statistics
 * GET /api/books/stats
 */
export const fetchBookStats = createAsyncThunk(
  'books/fetchBookStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/stats`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch book statistics');
    }
  }
);
