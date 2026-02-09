import { createSlice } from '@reduxjs/toolkit';
import { fetchNotificationSettings, updateNotificationSettings } from './notificationSettingsThunk';

const initialState = {
  settings: {
    emailEnabled: true,
    pushEnabled: false,
    bookRemindersEnabled: true,
    dueDateAlertsEnabled: true,
    newArrivalsEnabled: true,
    recommendationsEnabled: true,
    marketingEmailsEnabled: false,
    reservationNotificationsEnabled: true,
    subscriptionNotificationsEnabled: true,
  },
  loading: false,
  error: null,
  success: false,
};

const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notification settings
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update notification settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.success = true;
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = notificationSettingsSlice.actions;
export default notificationSettingsSlice.reducer;
