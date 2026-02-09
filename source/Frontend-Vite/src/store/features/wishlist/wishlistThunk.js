import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/wishlist';

// ==================== WISHLIST CRUD OPERATIONS ====================

/**
 * Add a book to the current user's wishlist
 * POST /api/wishlist/add/{bookId}?notes=...
 */
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ bookId, notes }, { rejectWithValue }) => {
    try {
      const params = notes ? `?notes=${encodeURIComponent(notes)}` : '';
      const response = await api.post(`${API_URL}/add/${bookId}${params}`, null, {
        headers: getHeaders(),
      });
      console.log("add to wishlist -- ",response.data);
      return response.data;
    } catch (error) {
      console.log("add to wishlist error -- ",error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add book to wishlist');
    }
  }
);

/**
 * Remove a book from the current user's wishlist
 * DELETE /api/wishlist/remove/{bookId}
 */
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/remove/${bookId}`, {
        headers: getHeaders(),
      });
      console.log("remove from wishlist -- ",response.data);
      return { bookId, message: response.data };
    } catch (error) {
      console.log("remove from wishlist error -- ",error);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove book from wishlist');
    }
  }
);

/**
 * Update notes for a wishlist item
 * PUT /api/wishlist/update-notes/{bookId}?notes=...
 */
export const updateWishlistNotes = createAsyncThunk(
  'wishlist/updateWishlistNotes',
  async ({ bookId, notes }, { rejectWithValue }) => {
    try {
      const params = notes ? `?notes=${encodeURIComponent(notes)}` : '';
      const response = await api.put(`${API_URL}/update-notes/${bookId}${params}`, null, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist notes');
    }
  }
);

// ==================== GET WISHLIST ====================

/**
 * Get all wishlist items for the current authenticated user
 * GET /api/wishlist/my-wishlist?page=0&size=10
 */
export const getMyWishlist = createAsyncThunk(
  'wishlist/getMyWishlist',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      const response = await api.get(`${API_URL}/my-wishlist?${params}`, {
        headers: getHeaders(),
      });
      console.log("get my wishlist -- ",response.data);
      return response.data;
    } catch (error) {
      console.log("get my wishlist error -- ",error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

/**
 * Get all wishlist items for a specific user
 * GET /api/wishlist/user/{userId}?page=0&size=10
 */
export const getUserWishlist = createAsyncThunk(
  'wishlist/getUserWishlist',
  async ({ userId, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      const response = await api.get(`${API_URL}/user/${userId}?${params}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user wishlist');
    }
  }
);

// ==================== WISHLIST CHECKS ====================

/**
 * Check if a book is in the current user's wishlist
 * GET /api/wishlist/check/{bookId}
 */
export const checkIfInWishlist = createAsyncThunk(
  'wishlist/checkIfInWishlist',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/check/${bookId}`, {
        headers: getHeaders(),
      });
      console.log("check if in wishlist -- ",response.data);
      return { bookId, isInWishlist: response.data.isInWishlist };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check wishlist status');
    }
  }
);

/**
 * Get total count of wishlist items for current user
 * GET /api/wishlist/my-count
 */
export const getMyWishlistCount = createAsyncThunk(
  'wishlist/getMyWishlistCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/my-count`, {
        headers: getHeaders(),
      });
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist count');
    }
  }
);

/**
 * Get count of how many users have wishlisted a specific book
 * GET /api/wishlist/book/{bookId}/count
 */
export const getBookWishlistCount = createAsyncThunk(
  'wishlist/getBookWishlistCount',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/book/${bookId}/count`, {
        headers: getHeaders(),
      });
      return { bookId, count: response.data.count };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch book wishlist count');
    }
  }
);
