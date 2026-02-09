import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotifications,
  fetchUnreadNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  registerPushToken,
  deletePushToken,
} from './notificationThunk';

const initialState = {
  notifications: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  },
  unreadNotifications: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
  },
  unreadCount: 0,
  loading: false,
  error: null,
  success: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetNotifications: () => initialState,
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
        state.notifications = {
          content: action.payload.content,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch unread notifications
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadNotifications = {
          content: action.payload.content,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updatedNotification = action.payload;

        // Update in notifications list
        const notificationIndex = state.notifications.content.findIndex(
          (n) => n.id === updatedNotification.id
        );
        if (notificationIndex !== -1) {
          state.notifications.content[notificationIndex] = updatedNotification;
        }

        // Remove from unread list
        state.unreadNotifications.content = state.unreadNotifications.content.filter(
          (n) => n.id !== updatedNotification.id
        );

        // Decrement unread count
        if (state.unreadCount > 0) {
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
        state.notifications.content = state.notifications.content.map((n) => ({
          ...n,
          isRead: true,
        }));

        // Clear unread list
        state.unreadNotifications.content = [];
        state.unreadNotifications.totalElements = 0;

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

        // Remove from notifications list
        state.notifications.content = state.notifications.content.filter(
          (n) => n.id !== deletedId
        );

        // Remove from unread list
        state.unreadNotifications.content = state.unreadNotifications.content.filter(
          (n) => n.id !== deletedId
        );

        state.success = true;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete all notifications
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications.content = [];
        state.notifications.totalElements = 0;
        state.unreadNotifications.content = [];
        state.unreadNotifications.totalElements = 0;
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

export const { clearError, clearSuccess, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
