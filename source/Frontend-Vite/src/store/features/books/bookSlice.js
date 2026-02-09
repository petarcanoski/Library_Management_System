import { createSlice } from "@reduxjs/toolkit";
import {
  createBook,
  createBooksBulk,
  fetchBookById,
  fetchBookByIsbn,
  updateBook,
  deleteBook,
  hardDeleteBook,
  fetchBooks,
  searchBooks,
  fetchBookStats,
} from "./bookThunk";
import { checkIfInWishlist } from "../wishlist/wishlistThunk";

// Initial state
const initialState = {
  books: [],
  currentBook: null,
  searchResults: {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 20,
    number: 0,
    first: true,
    last: false,
    empty: false,
  },
  stats: {
    totalActiveBooks: 0,
    totalAvailableBooks: 0,
  },
  loading: false,
  actionLoading: false,
  error: null,
  filters: {
    genreId: null,
    availableOnly: null,
    activeOnly: true,
    page: 0,
    size: 20,
    sortBy: "createdAt",
    sortDirection: "DESC",
  },
};

// Books slice
const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSearchResults: (state) => {
      state.searchResults = initialState.searchResults;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== CREATE OPERATIONS ====================
      // Create book
      .addCase(createBook.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.books.unshift(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Create books bulk
      .addCase(createBooksBulk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createBooksBulk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.books.unshift(...action.payload);
      })
      .addCase(createBooksBulk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ==================== READ OPERATIONS ====================
      // Fetch books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.content || [];
        state.searchResults = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search books
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.content || [];
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== CHECK IF IN WISHLIST ====================
      // .addCase(checkIfInWishlist.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(checkIfInWishlist.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const { bookId, isInWishlist } = action.payload;
      //   // state.wishlistStatus[bookId] = isInWishlist;
      // })
      // .addCase(checkIfInWishlist.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      // Fetch book by ISBN
      .addCase(fetchBookByIsbn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookByIsbn.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookByIsbn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================== UPDATE OPERATIONS ====================
      // Update book
      .addCase(updateBook.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.books.findIndex(
          (book) => book.id === action.payload.id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.currentBook?.id === action.payload.id) {
          state.currentBook = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ==================== DELETE OPERATIONS ====================
      // Delete book (soft delete)
      .addCase(deleteBook.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.books = state.books.filter(
          (book) => book.id !== action.payload.id
        );
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Hard delete book
      .addCase(hardDeleteBook.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(hardDeleteBook.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.books = state.books.filter(
          (book) => book.id !== action.payload.id
        );
      })
      .addCase(hardDeleteBook.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ==================== STATISTICS ====================
      // Fetch book stats
      .addCase(fetchBookStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  clearError,
  clearCurrentBook,
  setFilters,
  resetFilters,
  clearSearchResults,
} = bookSlice.actions;
export default bookSlice.reducer;
