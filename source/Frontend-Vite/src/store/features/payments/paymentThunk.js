import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/payments';

// Async thunks
export const verifyPayment = createAsyncThunk(
  'payments/verify',
  async (verifyRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/verify`, verifyRequest, {
        headers: getHeaders(),
      });
      console.log("verify payment response", response)
      return response.data;
    } catch (error) {
      console.log("error ",error)
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

export const fetchUserPayments = createAsyncThunk(
  'payments/fetchUserPayments',
  async ({ userId, page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      const userParam = userId ? `/${userId}` : '';
      const response = await api.get(`${API_URL}/user${userParam}?${params}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const fetchMonthlyRevenue = createAsyncThunk(
  'payments/fetchMonthlyRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/statistics/monthly-revenue`, {
        headers: getHeaders(),
      });
      console.log("monthly revenue", response)
      return response.data;
    } catch (error) {
      console.log("error monthly revenue", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly revenue');
    }
  }
);

/**
 * Get all payments with pagination and sorting (Admin)
 * GET /api/payments?page=0&size=10&sortBy=createdAt&sortDir=DESC
 */
export const getAllPayments = createAsyncThunk(
  'payments/getAllPayments',
  async ({ page = 0, size = 10, sortBy = 'createdAt', sortDir = 'DESC' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}`, {
        params: { page, size, sortBy, sortDir },
        headers: getHeaders(),
      });
      console.log("all payments", response);
      return response.data;
    } catch (error) {
      console.log("error fetching all payments", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all payments');
    }
  }
);

