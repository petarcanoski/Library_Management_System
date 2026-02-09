import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import { getHeaders } from '../../../utils/getHeaders';

const API_URL = '/api/notifications';

// ==================== FETCH NOTIFICATIONS ====================

/**
 * Fetch all user notifications (paginated)
 * GET /api/notifications?page=0&size=20
 */
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}`, {
        params: { page, size },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

/**
 * Fetch unread notifications (paginated)
 * GET /api/notifications/unread?page=0&size=20
 */
export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnreadNotifications',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/unread`, {
        params: { page, size },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread notifications');
    }
  }
);

/**
 * Fetch unread notification count
 * GET /api/notifications/count
 */
export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/count`, {
        headers: getHeaders(),
      });
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

// ==================== UPDATE NOTIFICATIONS ====================

/**
 * Mark a notification as read
 * PUT /api/notifications/{id}/read
 */
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${notificationId}/read`, {}, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/read-all`, {}, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

// ==================== DELETE NOTIFICATIONS ====================

/**
 * Delete a notification
 * DELETE /api/notifications/{id}
 */
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${notificationId}`, {
        headers: getHeaders(),
      });
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

/**
 * Delete all notifications
 * DELETE /api/notifications/all
 */
export const deleteAllNotifications = createAsyncThunk(
  'notifications/deleteAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/all`, {
        headers: getHeaders(),
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete all notifications');
    }
  }
);

// ==================== PUSH TOKEN OPERATIONS ====================

/**
 * Register push notification token
 * POST /api/notifications/push-token
 */
export const registerPushToken = createAsyncThunk(
  'notifications/registerPushToken',
  async ({ token, platform = 'WEB' }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/push-token`,
        { token, platform },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register push token');
    }
  }
);

/**
 * Delete push notification token
 * DELETE /api/notifications/push-token
 */
export const deletePushToken = createAsyncThunk(
  'notifications/deletePushToken',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/push-token`, {
        data: { token },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete push token');
    }
  }
);
