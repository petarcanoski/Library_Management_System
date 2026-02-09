import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  registerPushToken,
  deletePushToken,
} from './notificationThunk';

const initialState = {
  notifications: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,
  unreadCount: 0,
  loading: false,
  error: null,
  success: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetNotifications: () => initialState,
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.number || 0;
        state.pageSize = action.payload.size || 20;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload || 0;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updatedNotification = action.payload;

        // Update in notifications list
        const notificationIndex = state.notifications.findIndex(
          (n) => n.id === updatedNotification.id
        );
        if (notificationIndex !== -1) {
          state.notifications[notificationIndex] = updatedNotification;
        }

        // Decrement unread count if it was unread
        if (!updatedNotification.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }

        state.success = true;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        // Mark all as read in notifications list
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));

        // Reset unread count
        state.unreadCount = 0;
        state.success = true;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedId = action.payload;

        // Find the notification before removing it
        const deletedNotification = state.notifications.find(n => n.id === deletedId);

        // Remove from notifications list
        state.notifications = state.notifications.filter(
          (n) => n.id !== deletedId
        );

        // Decrement unread count if it was unread
        if (deletedNotification && !deletedNotification.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }

        state.totalElements -= 1;
        state.success = true;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete all notifications
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.totalElements = 0;
        state.unreadCount = 0;
        state.success = true;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Push token operations
      .addCase(registerPushToken.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(registerPushToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deletePushToken.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(deletePushToken.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetNotifications, incrementUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
