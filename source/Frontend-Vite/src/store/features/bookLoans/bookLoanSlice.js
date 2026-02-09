import { createSlice } from '@reduxjs/toolkit';
import {
  // Checkout operations
  checkoutBook,
  checkoutBookForUser,
  // Checkin operations
  checkinBook,
  // Renewal operations
  renewCheckout,
  // Query operations
  getBookLoanById,
  fetchMyBookLoans,
  getUserBookLoans,

  // Fine operations
  payFine,
  fetchUnpaidFines,
  getUserUnpaidFines,
  // Admin operations
  updateBookLoan,
  updateOverdueBookLoans,
  getCheckoutStatistics,
  getAllBookLoans,
} from './bookLoanThunk';

// Initial state
const initialState = {
  // User's loans
  myLoans: [],
  activeLoans: [],
  currentLoan: null,

  // Admin data
  allLoans: [],
  userLoans: [],
  bookHistory: [],
  overdueLoans: [],
  unpaidFinesLoans: [],
  statistics: null,

  // Pagination
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,

  // Loading & error states
  loading: false,
  error: null,

  // Fines
  unpaidFines: 0,
  userUnpaidFines: 0,
};

// Book loans slice
const bookLoanSlice = createSlice({
  name: 'bookLoans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLoan: (state) => {
      state.currentLoan = null;
    },
    clearAllLoans: (state) => {
      state.allLoans = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== CHECKOUT OPERATIONS ====================
      // Checkout book (user)
      .addCase(checkoutBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutBook.fulfilled, (state, action) => {
        state.loading = false;
        state.activeLoans.unshift(action.payload);
      })
      .addCase(checkoutBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Checkout book for user (admin)
      .addCase(checkoutBookForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutBookForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.allLoans.unshift(action.payload);
      })
      .addCase(checkoutBookForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== CHECKIN OPERATIONS ====================
      .addCase(checkinBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkinBook.fulfilled, (state, action) => {
        state.loading = false;
        state.activeLoans = state.activeLoans.filter((loan) => loan.id !== action.payload.id);
        state.myLoans.unshift(action.payload);
        // Update in allLoans if exists
        const allIndex = state.allLoans.findIndex((loan) => loan.id === action.payload.id);
        if (allIndex !== -1) {
          state.allLoans[allIndex] = action.payload;
        }
      })
      .addCase(checkinBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== RENEWAL OPERATIONS ====================
      .addCase(renewCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renewCheckout.fulfilled, (state, action) => {
        state.loading = false;
        // Update in activeLoans
        const activeIndex = state.activeLoans.findIndex((loan) => loan.id === action.payload.id);
        if (activeIndex !== -1) {
          state.activeLoans[activeIndex] = action.payload;
        }
        // Update in myLoans
        const myIndex = state.myLoans.findIndex((loan) => loan.id === action.payload.id);
        if (myIndex !== -1) {
          state.myLoans[myIndex] = action.payload;
        }
        // Update in allLoans
        const allIndex = state.allLoans.findIndex((loan) => loan.id === action.payload.id);
        if (allIndex !== -1) {
          state.allLoans[allIndex] = action.payload;
        }
      })
      .addCase(renewCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== QUERY OPERATIONS ====================
      // Get book loan by ID
      .addCase(getBookLoanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookLoanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLoan = action.payload;
      })
      .addCase(getBookLoanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my book loans
      .addCase(fetchMyBookLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookLoans.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === true) {
          state.activeLoans = action.payload.data.content;
        } else {
          state.myLoans = action.payload.data.content;
        }
        state.totalElements = action.payload.data.totalElements;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.number;
      })
      .addCase(fetchMyBookLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user book loans (admin)
      .addCase(getUserBookLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.userLoans = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(getUserBookLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     

      // Get all book loans (admin)
      .addCase(getAllBookLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.allLoans = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(getAllBookLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      

      // ==================== FINE OPERATIONS ====================
      // Pay fine
      .addCase(payFine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payFine.fulfilled, (state, action) => {
        state.loading = false;
        // Update in myLoans
        const myIndex = state.myLoans.findIndex((loan) => loan.id === action.payload.id);
        if (myIndex !== -1) {
          state.myLoans[myIndex] = action.payload;
        }
        // Update in activeLoans
        const activeIndex = state.activeLoans.findIndex((loan) => loan.id === action.payload.id);
        if (activeIndex !== -1) {
          state.activeLoans[activeIndex] = action.payload;
        }
        // Update in allLoans
        const allIndex = state.allLoans.findIndex((loan) => loan.id === action.payload.id);
        if (allIndex !== -1) {
          state.allLoans[allIndex] = action.payload;
        }
        // Reduce unpaid fines
        if (action.payload.fineAmount) {
          state.unpaidFines = Math.max(0, state.unpaidFines - action.payload.fineAmount);
        }
      })
      .addCase(payFine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch unpaid fines (user)
      .addCase(fetchUnpaidFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnpaidFines.fulfilled, (state, action) => {
        state.loading = false;
        state.unpaidFines = action.payload;
      })
      .addCase(fetchUnpaidFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user unpaid fines (admin)
      .addCase(getUserUnpaidFines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserUnpaidFines.fulfilled, (state, action) => {
        state.loading = false;
        state.userUnpaidFines = action.payload;
      })
      .addCase(getUserUnpaidFines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== ADMIN OPERATIONS ====================
      // Update book loan (admin)
      .addCase(updateBookLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookLoan.fulfilled, (state, action) => {
        state.loading = false;
        // Update in allLoans
        const allIndex = state.allLoans.findIndex((loan) => loan.id === action.payload.id);
        if (allIndex !== -1) {
          state.allLoans[allIndex] = action.payload;
        }
        // Update in myLoans
        const myIndex = state.myLoans.findIndex((loan) => loan.id === action.payload.id);
        if (myIndex !== -1) {
          state.myLoans[myIndex] = action.payload;
        }
        // Update in activeLoans
        const activeIndex = state.activeLoans.findIndex((loan) => loan.id === action.payload.id);
        if (activeIndex !== -1) {
          state.activeLoans[activeIndex] = action.payload;
        }
        // Update current loan if it's the same
        if (state.currentLoan && state.currentLoan.id === action.payload.id) {
          state.currentLoan = action.payload;
        }
      })
      .addCase(updateBookLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update overdue book loans
      .addCase(updateOverdueBookLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOverdueBookLoans.fulfilled, (state) => {
        state.loading = false;
        // Response contains bookLoansUpdated count
      })
      .addCase(updateOverdueBookLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get checkout statistics
      .addCase(getCheckoutStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCheckoutStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getCheckoutStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentLoan, clearAllLoans } = bookLoanSlice.actions;
export default bookLoanSlice.reducer;
