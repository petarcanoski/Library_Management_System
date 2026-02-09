import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/notification-settings';

/**
 * Fetch user notification settings
 * GET /api/notification-settings
 */
export const fetchNotificationSettings = createAsyncThunk(
  'notificationSettings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_URL, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notification settings');
    }
  }
);

/**
 * Update user notification settings
 * PUT /api/notification-settings
 */
export const updateNotificationSettings = createAsyncThunk(
  'notificationSettings/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await api.put(API_URL, settings, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update notification settings');
    }
  }
);
