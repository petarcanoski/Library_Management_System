import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/fines';

// ==================== CREATE OPERATIONS ====================

/**
 * Create a fine (Admin only)
 * POST /api/fines
 */
export const createFine = createAsyncThunk(
  'fines/createFine',
  async (createRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, createRequest, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create fine');
    }
  }
);

// ==================== PAYMENT OPERATIONS ====================

/**
 * Pay a fine fully
 * POST /api/fines/{id}/pay
 */
export const payFine = createAsyncThunk(
  'fines/payFine',
  async ({ fineId, transactionId }, { rejectWithValue }) => {
    try {
      const url = transactionId
        ? `${API_URL}/${fineId}/pay?transactionId=${transactionId}`
        : `${API_URL}/${fineId}/pay`;
      const response = await api.post(url, {}, {
        headers: getHeaders(),
      });
      console.log("payFine response", response)
      window.location.href = response.data?.checkoutUrl; 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed');
    }
  }
);

// ==================== WAIVER OPERATIONS ====================

/**
 * Waive a fine (Admin only)
 * POST /api/fines/waive
 */
export const waiveFine = createAsyncThunk(
  'fines/waiveFine',
  async (waiveRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/waive`, waiveRequest, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to waive fine');
    }
  }
);

// ==================== QUERY OPERATIONS ====================

/**
 * Get fine by ID
 * GET /api/fines/{id}
 */
export const getFineById = createAsyncThunk(
  'fines/getFineById',
  async (fineId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${fineId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fine');
    }
  }
);

/**
 * Get fines for a book loan
 * GET /api/fines/book-loan/{bookLoanId}
 */
export const getFinesByBookLoan = createAsyncThunk(
  'fines/getFinesByBookLoan',
  async (bookLoanId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/book-loan/${bookLoanId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fines');
    }
  }
);

/**
 * Get my fines (current user)
 * GET /api/fines/my?status=PENDING&type=OVERDUE
 */
export const getMyFines = createAsyncThunk(
  'fines/getMyFines',
  async ({ status, type } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (type) params.append('type', type);

      const url = params.toString() ? `${API_URL}/my?${params}` : `${API_URL}/my`;
      const response = await api.get(url, {
        headers: getHeaders(),
      });
      console.log("getMyFines response", response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fines');
    }
  }
);

/**
 * Get all fines with filters (Admin only)
 * GET /api/fines?status=PENDING&type=OVERDUE&userId=123&page=0&size=20
 */
export const getAllFines = createAsyncThunk(
  'fines/getAllFines',
  async ({ status, type, userId, page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      if (userId) params.append('userId', userId.toString());

      const response = await api.get(`${API_URL}?${params}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch fines');
    }
  }
);

// ==================== AGGREGATION OPERATIONS ====================

/**
 * Get my total unpaid fines
 * GET /api/fines/my/total-unpaid
 */
export const getMyTotalUnpaid = createAsyncThunk(
  'fines/getMyTotalUnpaid',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/my/total-unpaid`, {
        headers: getHeaders(),
      });
      return response.data.total;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total');
    }
  }
);

/**
 * Get total unpaid fines for a user (Admin only)
 * GET /api/fines/statistics/user/{userId}/unpaid
 */
export const getUserTotalUnpaid = createAsyncThunk(
  'fines/getUserTotalUnpaid',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/statistics/user/${userId}/unpaid`, {
        headers: getHeaders(),
      });
      return response.data.total;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total');
    }
  }
);

/**
 * Get total collected fines (Admin only)
 * GET /api/fines/statistics/collected
 */
export const getTotalCollected = createAsyncThunk(
  'fines/getTotalCollected',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/statistics/collected`, {
        headers: getHeaders(),
      });
      return response.data.total;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total');
    }
  }
);

/**
 * Get total outstanding fines (Admin only)
 * GET /api/fines/statistics/outstanding
 */
export const getTotalOutstanding = createAsyncThunk(
  'fines/getTotalOutstanding',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/statistics/outstanding`, {
        headers: getHeaders(),
      });
      return response.data.total;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch total');
    }
  }
);

/**
 * Check if user has unpaid fines (Admin only)
 * GET /api/fines/statistics/user/{userId}/has-unpaid
 */
export const checkUserHasUnpaid = createAsyncThunk(
  'fines/checkUserHasUnpaid',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/statistics/user/${userId}/has-unpaid`, {
        headers: getHeaders(),
      });
      return response.data.hasUnpaidFines;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check fines');
    }
  }
);

// ==================== DELETE OPERATIONS ====================

/**
 * Delete a fine (Admin only)
 * DELETE /api/fines/{id}
 */
export const deleteFine = createAsyncThunk(
  'fines/deleteFine',
  async (fineId, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${fineId}`, {
        headers: getHeaders(),
      });
      return fineId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete fine');
    }
  }
);
