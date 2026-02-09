import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/reviews';

// ==================== REVIEW CRUD OPERATIONS ====================

/**
 * Create a new review for a book
 * POST /api/reviews
 */
export const createReview = createAsyncThunk(
  'bookReviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, reviewData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.log("error ",error)
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

/**
 * Update an existing review
 * PUT /api/reviews/{reviewId}
 */
export const updateReview = createAsyncThunk(
  'bookReviews/update',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${reviewId}`, reviewData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

/**
 * Delete a review (soft delete)
 * DELETE /api/reviews/{reviewId}
 */
export const deleteReview = createAsyncThunk(
  'bookReviews/delete',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${reviewId}`, {
        headers: getHeaders(),
      });
      return { reviewId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

/**
 * Get a specific review by ID
 * GET /api/reviews/{reviewId}
 */
export const fetchReviewById = createAsyncThunk(
  'bookReviews/fetchById',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${reviewId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch review');
    }
  }
);

// ==================== GET REVIEWS BY BOOK ====================

/**
 * Get reviews for a specific book with optional filters
 * GET /api/reviews/book/{bookId}
 *
 * @param {Object} params
 * @param {number} params.bookId - Book ID
 * @param {string} params.filter - Filter type (ALL, BY_RATING, VERIFIED_ONLY, TOP_HELPFUL)
 * @param {number} params.rating - Rating value (1-5)
 * @param {number} params.page - Page number
 * @param {number} params.size - Page size
 */
export const fetchReviewsByBook = createAsyncThunk(
  'bookReviews/fetchByBook',
  async ({ bookId, filter = 'ALL', rating, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const params = { filter, page, size };
      if (rating) params.rating = rating;

      const response = await api.get(`${API_URL}/book/${bookId}`, {
        params,
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

// ==================== GET REVIEWS BY USER ====================

/**
 * Get all reviews by the current authenticated user
 * GET /api/reviews/my-reviews
 */
export const fetchMyReviews = createAsyncThunk(
  'bookReviews/fetchMyReviews',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/my-reviews`, {
        params: { page, size },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your reviews');
    }
  }
);

/**
 * Get all reviews by a specific user
 * GET /api/reviews/user/{userId}
 */
export const fetchReviewsByUser = createAsyncThunk(
  'bookReviews/fetchByUser',
  async ({ userId, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/user/${userId}`, {
        params: { page, size },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }
);

// ==================== RATING STATISTICS ====================

/**
 * Get rating statistics for a book
 * GET /api/reviews/book/{bookId}/statistics
 */
export const fetchRatingStatistics = createAsyncThunk(
  'bookReviews/fetchStatistics',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/book/${bookId}/statistics`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchReviewStatistics = createAsyncThunk(
  'bookReviews/fetchReviewStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/admin/statistics`, {
        headers: getHeaders(),
      });
      console.log("review statistics", response)
      return response.data;
    } catch (error) {
      console.log("error review statistics", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

// ==================== HELPFUL ACTIONS ====================

/**
 * Mark a review as helpful
 * POST /api/reviews/{reviewId}/helpful
 */
export const markReviewAsHelpful = createAsyncThunk(
  'bookReviews/markHelpful',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/${reviewId}/helpful`, {}, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as helpful');
    }
  }
);

// ==================== ELIGIBILITY CHECK ====================

/**
 * Check if the current user can review a specific book
 * GET /api/reviews/can-review/{bookId}
 */
export const checkCanReview = createAsyncThunk(
  'bookReviews/checkCanReview',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/can-review/${bookId}`, {
        headers: getHeaders(),
      });
      return { bookId, canReview: response.data.canReview };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check eligibility');
    }
  }
);
