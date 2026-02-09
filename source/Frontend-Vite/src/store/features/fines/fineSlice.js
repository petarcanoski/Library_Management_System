import { createSlice } from '@reduxjs/toolkit';
import {
  createFine,
  payFine,
  waiveFine,
  getFineById,
  getFinesByBookLoan,
  getMyFines,
  getAllFines,
  getMyTotalUnpaid,
  getUserTotalUnpaid,
  getTotalCollected,
  getTotalOutstanding,
  checkUserHasUnpaid,
  deleteFine,
} from './fineThunk';

// Initial state
const initialState = {
  // Fine lists
  myFines: [],
  allFines: [],
  bookLoanFines: [],
  currentFine: null,

  // Statistics
  myTotalUnpaid: 0,
  totalCollected: 0,
  totalOutstanding: 0,

  // Pagination
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,

  // Loading & error states
  loading: false,
  error: null,
};

// Fine slice
const fineSlice = createSlice({
  name: 'fines',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFine: (state) => {
      state.currentFine = null;
    },
    clearAllFines: (state) => {
      state.allFines = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== CREATE FINE ====================
      .addCase(createFine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFine.fulfilled, (state, action) => {
        state.loading = false;
        state.allFines.unshift(action.payload);
      })
      .addCase(createFine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== PAY FINE ====================
      .addCase(payFine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payFine.fulfilled, (state, action) => {
        state.loading = false;
        // Update in all lists
        const updateFine = (list) => {
          const index = list.findIndex((f) => f.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };
        updateFine(state.allFines);
        updateFine(state.myFines);
        updateFine(state.bookLoanFines);
        if (state.currentFine?.id === action.payload.id) {
          state.currentFine = action.payload;
        }
      })
      .addCase(payFine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== WAIVE FINE ====================
      .addCase(waiveFine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(waiveFine.fulfilled, (state, action) => {
        state.loading = false;
        // Update in all lists
        const updateFine = (list) => {
          const index = list.findIndex((f) => f.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };
        updateFine(state.allFines);
        updateFine(state.myFines);
        updateFine(state.bookLoanFines);
        if (state.currentFine?.id === action.payload.id) {
          state.currentFine = action.payload;
        }
      })
      .addCase(waiveFine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET FINE BY ID ====================
      .addCase(getFineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFineById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFine = action.payload;
      })
      .addCase(getFineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET FINES BY BOOK LOAN ====================
      .addCase(getFinesByBookLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFinesByBookLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.bookLoanFines = action.payload;
      })
      .addCase(getFinesByBookLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET MY FINES ====================
      .addCase(getMyFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyFines.fulfilled, (state, action) => {
        state.loading = false;
        state.myFines = action.payload;
      })
      .addCase(getMyFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET ALL FINES ====================
      .addCase(getAllFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFines.fulfilled, (state, action) => {
        state.loading = false;
        state.allFines = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(getAllFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET MY TOTAL UNPAID ====================
      .addCase(getMyTotalUnpaid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTotalUnpaid.fulfilled, (state, action) => {
        state.loading = false;
        state.myTotalUnpaid = action.payload;
      })
      .addCase(getMyTotalUnpaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET USER TOTAL UNPAID ====================
      .addCase(getUserTotalUnpaid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserTotalUnpaid.fulfilled, (state, action) => {
        state.loading = false;
        // Can store this if needed
      })
      .addCase(getUserTotalUnpaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET TOTAL COLLECTED ====================
      .addCase(getTotalCollected.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalCollected.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCollected = action.payload;
      })
      .addCase(getTotalCollected.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET TOTAL OUTSTANDING ====================
      .addCase(getTotalOutstanding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalOutstanding.fulfilled, (state, action) => {
        state.loading = false;
        state.totalOutstanding = action.payload;
      })
      .addCase(getTotalOutstanding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== CHECK USER HAS UNPAID ====================
      .addCase(checkUserHasUnpaid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserHasUnpaid.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkUserHasUnpaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== DELETE FINE ====================
      .addCase(deleteFine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFine.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from all lists
        state.allFines = state.allFines.filter((f) => f.id !== action.payload);
        state.myFines = state.myFines.filter((f) => f.id !== action.payload);
        state.bookLoanFines = state.bookLoanFines.filter((f) => f.id !== action.payload);
        if (state.currentFine?.id === action.payload) {
          state.currentFine = null;
        }
      })
      .addCase(deleteFine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentFine, clearAllFines } = fineSlice.actions;
export default fineSlice.reducer;
