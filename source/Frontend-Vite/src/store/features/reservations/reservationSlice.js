import { createSlice } from '@reduxjs/toolkit';
import {
  // Reservation operations
  createReservation,

  cancelReservation,
  fulfillReservation,
  // Query operations
  getReservationById,
  getMyReservations,

  searchReservations,

  getQueuePosition,
} from './reservationThunk';

// Initial state
const initialState = {
  // User's reservations
  reservations: [],
  activeReservations: [],
  currentReservation: null,

  // Admin data
  allReservations: [],

  // Queue positions
  queuePositions: {}, // { reservationId: { queuePosition, message } }

  // Pagination
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,

  // Loading & error states
  loading: false,
  error: null,
};

// Reservations slice
const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReservation: (state) => {
      state.currentReservation = null;
    },
    clearAllReservations: (state) => {
      state.allReservations = [];
    },
    clearQueuePositions: (state) => {
      state.queuePositions = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== CREATE RESERVATION ====================
      // Create reservation (user)
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.unshift(action.payload);
        // If it's active (PENDING or AVAILABLE), add to activeReservations
        if (action.payload.status === 'PENDING' || action.payload.status === 'AVAILABLE') {
          state.activeReservations.unshift(action.payload);
        }
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== CANCEL RESERVATION ====================
      .addCase(cancelReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.loading = false;
        const reservationId = action.payload.id;

        // Update in myReservations
        const myIndex = state.reservations.findIndex((res) => res.id === reservationId);
        if (myIndex !== -1) {
          state.reservations[myIndex] = action.payload;
        }

        // Remove from activeReservations
        state.activeReservations = state.activeReservations.filter(
          (res) => res.id !== reservationId
        );

        // Update in allReservations
        const allIndex = state.allReservations.findIndex((res) => res.id === reservationId);
        if (allIndex !== -1) {
          state.allReservations[allIndex] = action.payload;
        }
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== FULFILL RESERVATION ====================
      .addCase(fulfillReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fulfillReservation.fulfilled, (state, action) => {
        state.loading = false;
        const reservationId = action.payload.id;

        // Update in myReservations
        const myIndex = state.reservations.findIndex((res) => res.id === reservationId);
        if (myIndex !== -1) {
          state.reservations[myIndex] = action.payload;
        }

        // Remove from activeReservations (it's now fulfilled)
        state.activeReservations = state.activeReservations.filter(
          (res) => res.id !== reservationId
        );

        // Update in allReservations
        const allIndex = state.allReservations.findIndex((res) => res.id === reservationId);
        if (allIndex !== -1) {
          state.allReservations[allIndex] = action.payload;
        }
      })
      .addCase(fulfillReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET RESERVATION BY ID ====================
      .addCase(getReservationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReservationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReservation = action.payload;
      })
      .addCase(getReservationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET MY RESERVATIONS ====================
      .addCase(getMyReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyReservations.fulfilled, (state, action) => {
        state.loading = false;
        // Check if it's active reservations or all reservations based on content
        
          state.reservations = action.payload.content;
        

        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(getMyReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== SEARCH RESERVATIONS (ADMIN) ====================
      .addCase(searchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.allReservations = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(searchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET QUEUE POSITION ====================
      .addCase(getQueuePosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQueuePosition.fulfilled, (state, action) => {
        state.loading = false;
        const { reservationId, queuePosition, message } = action.payload;
        state.queuePositions[reservationId] = { queuePosition, message };
      })
      .addCase(getQueuePosition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentReservation,
  clearAllReservations,
  clearQueuePositions
} = reservationSlice.actions;

export default reservationSlice.reducer;
