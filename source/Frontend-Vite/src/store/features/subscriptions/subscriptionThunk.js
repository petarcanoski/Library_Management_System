import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';
import axios from "axios";

const API_URL = '/api/subscriptions';

// ================ SUBSCRIPTION OPERATIONS ================

/**
 * Create new subscription with payment
 * POST /api/subscriptions/subscribe
 */
// export const subscribe = createAsyncThunk(
//   'subscriptions/subscribe',
//   async (subscribeRequest, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`${API_URL}/subscribe`, subscribeRequest, {
//         headers: getHeaders(),
//       });
//       console.log("subscribe response", response)
//       window.location.href = response.data?.checkoutUrl; // Redirect to payment URL
//       return response.data;
//     } catch (error) {
//       console.log("error ",error)
//       return rejectWithValue(error.response?.data?.message || 'Subscription failed');
//     }
//   }
// );

export const subscribe = createAsyncThunk(
    "subscriptions/subscribe",
    async ({ planId, paymentGateway }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/subscriptions/subscribe",
                {
                    planId: Number(planId),     // ✅ FORCE LONG
                    paymentGateway
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


/**
 * Get active and past subscriptions for current user
 * GET /api/subscriptions/history?userId={userId}
 */
export const fetchUserSubscriptions = createAsyncThunk(
  'subscriptions/fetchUserSubscriptions',
  async (userId, { rejectWithValue }) => {
    try {
      const params = userId ? `?userId=${userId}` : '';
      const response = await api.get(`${API_URL}/history${params}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

/**
 * Get active subscription for user
 * GET /api/subscriptions/user/active?userId={userId}
 */
export const fetchActiveSubscription = createAsyncThunk(
  'subscriptions/fetchActive',
  async (userId, { rejectWithValue }) => {
    try {
      const params = userId ? `?userId=${userId}` : '';
      const response = await api.get(`${API_URL}/user/active${params}`, {
        headers: getHeaders(),
      });
      console.log("response active subscription", response)
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

/**
 * Check if user has valid subscription
 * GET /api/subscriptions/check?userId={userId}
 */
export const checkValidSubscription = createAsyncThunk(
  'subscriptions/checkValid',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/check`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check subscription');
    }
  }
);

/**
 * Get subscription by ID
 * GET /api/subscriptions/{id}
 */
export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

/**
 * Renew expired subscription
 * POST /api/subscriptions/renew/{subscriptionId}
 */
export const renewSubscription = createAsyncThunk(
  'subscriptions/renew',
  async ({ subscriptionId, subscribeRequest }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_URL}/renew/${subscriptionId}`,
        subscribeRequest,
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Renewal failed');
    }
  }
);

/**
 * Cancel active subscription
 * POST /api/subscriptions/cancel/{subscriptionId}
 */
export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancel',
  async ({ subscriptionId, reason }, { rejectWithValue }) => {
    try {
      const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
      const response = await api.post(
        `${API_URL}/cancel/${subscriptionId}${params}`,
        {},
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cancellation failed');
    }
  }
);

/**
 * Activate subscription after successful payment (webhook callback)
 * POST /api/subscriptions/activate
 */
export const activateSubscription = createAsyncThunk(
  'subscriptions/activate',
  async ({ subscriptionId, paymentId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/activate`, null, {
        params: { subscriptionId, paymentId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Activation failed');
    }
  }
);

// ================ ADMIN ENDPOINTS ================

/**
 * Get all active subscriptions (Admin)
 * GET /api/subscriptions/admin/active?page=0&size=20
 */
export const fetchAllActiveSubscriptions = createAsyncThunk(
  'subscriptions/fetchAllActive',
  async ({ page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/admin/active`, {
        params: { page, size },
        headers: getHeaders(),
      });
      console.log("all active subscriptions", response)
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message 
        || 'Failed to fetch subscriptions');
    }
  }
);

/**
 * Manually deactivate expired subscriptions (Admin/Scheduler)
 * POST /api/subscriptions/admin/deactivate-expired
 */
export const deactivateExpiredSubscriptions = createAsyncThunk(
  'subscriptions/deactivateExpired',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/admin/deactivate-expired`, {}, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate expired subscriptions');
    }
  }
);
