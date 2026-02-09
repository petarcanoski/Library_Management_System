import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/subscription-plans';

// ================ PUBLIC ENDPOINTS ================

/**
 * Fetch all active subscription plans
 * GET /api/subscription-plans/active
 */
export const fetchActivePlans = createAsyncThunk(
  'subscriptionPlans/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/active`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active plans');
    }
  }
);

/**
 * Fetch active subscription plans with pagination
 * GET /api/subscription-plans/active/paginated?page=0&size=10
 */
export const fetchActivePlansPaginated = createAsyncThunk(
  'subscriptionPlans/fetchActivePaginated',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/active/paginated`, {
        params: { page, size },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch paginated plans');
    }
  }
);

/**
 * Fetch featured subscription plans
 * GET /api/subscription-plans/featured
 */
export const fetchFeaturedPlans = createAsyncThunk(
  'subscriptionPlans/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/featured`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured plans');
    }
  }
);

/**
 * Fetch subscription plan by ID
 * GET /api/subscription-plans/{id}
 */
export const fetchPlanById = createAsyncThunk(
  'subscriptionPlans/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plan');
    }
  }
);

/**
 * Fetch subscription plan by code
 * GET /api/subscription-plans/code/{planCode}
 */
export const fetchPlanByCode = createAsyncThunk(
  'subscriptionPlans/fetchByCode',
  async (planCode, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/code/${planCode}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plan by code');
    }
  }
);

/**
 * Fetch plans by currency
 * GET /api/subscription-plans/currency/{currency}
 */
export const fetchPlansByCurrency = createAsyncThunk(
  'subscriptionPlans/fetchByCurrency',
  async (currency, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/currency/${currency}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans by currency');
    }
  }
);

/**
 * Search plans by name or description
 * GET /api/subscription-plans/search?q=monthly&page=0&size=10
 */
export const searchPlans = createAsyncThunk(
  'subscriptionPlans/search',
  async ({ query, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/search`, {
        params: { q: query, page, size },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search plans');
    }
  }
);

// ================ ADMIN ENDPOINTS ================

/**
 * Create new subscription plan (Admin only)
 * POST /api/subscription-plans/admin/create
 */
export const createPlan = createAsyncThunk(
  'subscriptionPlans/create',
  async (planDTO, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/admin/create`, planDTO, {
        headers: getHeaders(),
      });
      console.log("create plan -- ",response.data);
      return response.data;
    } catch (error) {
      console.log("create plan error", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create plan');
    }
  }
);

/**
 * Update subscription plan (Admin only)
 * PUT /api/subscription-plans/admin/{id}
 */
export const updatePlan = createAsyncThunk(
  'subscriptionPlans/update',
  async ({ id, planDTO }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/admin/${id}`, planDTO, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update plan');
    }
  }
);

/**
 * Delete/deactivate subscription plan (Admin only)
 * DELETE /api/subscription-plans/admin/{id}
 */
export const deletePlan = createAsyncThunk(
  'subscriptionPlans/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/admin/${id}`, {
        headers: getHeaders(),
      });
      return { id, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete plan');
    }
  }
);



/**
 * Get all subscription plans including inactive (Admin only)
 * GET /api/subscription-plans/admin/all?page=0&size=20
 */
export const fetchAllPlans = createAsyncThunk(
  'subscriptionPlans/fetchAll',
  async ({ page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/admin/all`, {
        params: { page, size },
        headers: getHeaders(),
      });
      console.log("fetch all plans -- ",response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all plans');
    }
  }
);

/**
 * Check if plan code exists (Admin only)
 * GET /api/subscription-plans/admin/check-code?code=MONTHLY
 */
export const checkPlanCode = createAsyncThunk(
  'subscriptionPlans/checkCode',
  async (code, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/admin/check-code`, {
        params: { code },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check plan code');
    }
  }
);
