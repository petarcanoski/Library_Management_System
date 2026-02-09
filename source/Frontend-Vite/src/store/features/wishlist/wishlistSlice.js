import { createSlice } from '@reduxjs/toolkit';
import {
  // CRUD operations
  addToWishlist,
  removeFromWishlist,
  updateWishlistNotes,
  // Get wishlist
  getMyWishlist,
  getUserWishlist,
  // Wishlist checks
  checkIfInWishlist,
  getMyWishlistCount,
  getBookWishlistCount,
} from './wishlistThunk';

// Initial state
const initialState = {
  // User's wishlist
  myWishlist: [],
  userWishlist: [],

  // Wishlist checks
  wishlistStatus: {}, // { bookId: isInWishlist }
  myWishlistCount: 0,
  bookWishlistCounts: {}, // { bookId: count }

  // Pagination
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,

  // Loading & error states
  loading: false,
  error: null,
};

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.myWishlist = [];
      state.userWishlist = [];
    },
    clearWishlistStatus: (state) => {
      state.wishlistStatus = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== ADD TO WISHLIST ====================
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.myWishlist.unshift(action.payload);
        state.myWishlistCount += 1;
        // Update wishlist status for this book
        if (action.payload.book?.id) {
          state.wishlistStatus[action.payload.book.id] = true;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== REMOVE FROM WISHLIST ====================
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const bookId = action.payload.bookId;
        // Remove from myWishlist
        state.myWishlist = state.myWishlist.filter(
          (item) => item.book?.id !== bookId
        );
        state.myWishlistCount = Math.max(0, state.myWishlistCount - 1);
        // Update wishlist status
        state.wishlistStatus[bookId] = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== UPDATE WISHLIST NOTES ====================
      .addCase(updateWishlistNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWishlistNotes.fulfilled, (state, action) => {
        state.loading = false;
        // Update in myWishlist
        const index = state.myWishlist.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.myWishlist[index] = action.payload;
        }
      })
      .addCase(updateWishlistNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET MY WISHLIST ====================
      .addCase(getMyWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.myWishlist = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
        // Update wishlist status for all fetched books
        action.payload.content.forEach((item) => {
          if (item.book?.id) {
            state.wishlistStatus[item.book.id] = true;
          }
        });
      })
      .addCase(getMyWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET USER WISHLIST ====================
      .addCase(getUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.userWishlist = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== CHECK IF IN WISHLIST ====================
      .addCase(checkIfInWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIfInWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const { bookId, isInWishlist } = action.payload;
        state.wishlistStatus[bookId] = isInWishlist;
        
      })
      .addCase(checkIfInWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET MY WISHLIST COUNT ====================
      .addCase(getMyWishlistCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyWishlistCount.fulfilled, (state, action) => {
        state.loading = false;
        state.myWishlistCount = action.payload;
      })
      .addCase(getMyWishlistCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== GET BOOK WISHLIST COUNT ====================
      .addCase(getBookWishlistCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookWishlistCount.fulfilled, (state, action) => {
        state.loading = false;
        const { bookId, count } = action.payload;
        state.bookWishlistCounts[bookId] = count;
      })
      .addCase(getBookWishlistCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearWishlist, clearWishlistStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer;
