import { createSlice } from '@reduxjs/toolkit';
import { verifyPayment, fetchUserPayments, fetchMonthlyRevenue, getAllPayments } from './paymentThunk';

// Initial state
const initialState = {
  payments: [],
  allPayments: [],
  currentPayment: null,
  loading: false,
  error: null,
  revenue: null,
  // Pagination for admin payments
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  },
};

// Payments slice
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch monthly revenue
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.revenue = action.payload;
      })
      // Fetch user payments
      .addCase(fetchUserPayments.fulfilled, (state, action) => {
        state.payments = action.payload.content;
      })
      // Get all payments (Admin)
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayments = action.payload.content;
        state.pagination = {
          currentPage: action.payload.number || 0,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
          pageSize: action.payload.size || 10,
        };
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
