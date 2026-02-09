import { createSlice } from '@reduxjs/toolkit';
import {
  subscribe,
  fetchUserSubscriptions,
  fetchActiveSubscription,
  checkValidSubscription,
  fetchSubscriptionById,
  renewSubscription,
  cancelSubscription,
  activateSubscription,
  fetchAllActiveSubscriptions,
  deactivateExpiredSubscriptions,
} from './subscriptionThunk';

// Initial state
const initialState = {
  // User subscriptions
  activeSubscription: null,
  mySubscriptions: [],
  selectedSubscription: null,

  // Admin subscriptions
  allActiveSubscriptions: [],

  // Subscription status
  hasValidSubscription: false,

  // Pagination
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
  },

  // Loading states
  loading: false,
  subscribeLoading: false,

  // Error handling
  error: null,
};

// Subscriptions slice
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActiveSubscription: (state) => {
      state.activeSubscription = null;
    },
    clearSelectedSubscription: (state) => {
      state.selectedSubscription = null;
    },
    setHasValidSubscription: (state, action) => {
      state.hasValidSubscription = action.payload;
    },
    resetSubscriptionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Subscribe
      .addCase(subscribe.pending, (state) => {
        state.subscribeLoading = true;
        state.error = null;
      })
      .addCase(subscribe.fulfilled, (state) => {
        state.subscribeLoading = false;
      })
      .addCase(subscribe.rejected, (state, action) => {
        state.subscribeLoading = false;
        state.error = action.payload;
      })

      // Fetch user subscriptions
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubscriptions = action.payload;
      })
      .addCase(fetchUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch active subscription
      .addCase(fetchActiveSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubscription = action.payload;
        state.hasValidSubscription = true;
      })
      .addCase(fetchActiveSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.activeSubscription = null;
        state.hasValidSubscription = false;
      })

      // Check valid subscription
      .addCase(checkValidSubscription.fulfilled, (state, action) => {
        state.hasValidSubscription = action.payload.success || false;
      })

      // Fetch subscription by ID
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubscription = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Renew subscription
      .addCase(renewSubscription.pending, (state) => {
        state.subscribeLoading = true;
        state.error = null;
      })
      .addCase(renewSubscription.fulfilled, (state) => {
        state.subscribeLoading = false;
      })
      .addCase(renewSubscription.rejected, (state, action) => {
        state.subscribeLoading = false;
        state.error = action.payload;
      })

      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubscription = null;
        state.hasValidSubscription = false;
        const index = state.mySubscriptions.findIndex((sub) => sub.id === action.payload.id);
        if (index !== -1) {
          state.mySubscriptions[index] = action.payload;
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Activate subscription
      .addCase(activateSubscription.fulfilled, (state, action) => {
        state.activeSubscription = action.payload;
        state.hasValidSubscription = true;
      })

      // Fetch all active subscriptions (Admin)
      .addCase(fetchAllActiveSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllActiveSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.allActiveSubscriptions = action.payload;
        // state.pagination = {
        //   currentPage: action.payload.number || 0,
        //   totalPages: action.payload.totalPages || 0,
        //   totalElements: action.payload.totalElements || 0,
        //   pageSize: action.payload.size || 20,
        // };
      })
      .addCase(fetchAllActiveSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Deactivate expired subscriptions (Admin)
      .addCase(deactivateExpiredSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateExpiredSubscriptions.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deactivateExpiredSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearActiveSubscription,
  clearSelectedSubscription,
  setHasValidSubscription,
  resetSubscriptionState,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
