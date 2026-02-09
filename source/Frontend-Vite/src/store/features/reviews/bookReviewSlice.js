import { createSlice } from '@reduxjs/toolkit';
import {
  createReview,
  updateReview,
  deleteReview,
  fetchReviewById,
  fetchReviewsByBook,
  fetchMyReviews,
  fetchReviewsByUser,
  fetchRatingStatistics,
  markReviewAsHelpful,
  checkCanReview,
  fetchReviewStatistics,
} from './bookReviewThunk';

// Initial state
const initialState = {
  // Reviews lists
  bookReviews: [],
  myReviews: [],
  userReviews: [],

  // Single review
  selectedReview: null,

  // Rating statistics
  ratingStatistics: null,
  reviewStatistics:null,

  // Eligibility
  canReviewBook: {},

  // Pagination
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  },

  // Loading states
  loading: false,
  submitLoading: false,
  statisticsLoading: false,

  // Error handling
  error: null,

  // Filters
  currentFilter: {
    type: 'ALL',
    rating: null,
  },
};

// Book Review slice
const bookReviewSlice = createSlice({
  name: 'bookReviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedReview: (state) => {
      state.selectedReview = null;
    },
    clearBookReviews: (state) => {
      state.bookReviews = [];
    },
    setCurrentFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    resetReviewState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create review
      .addCase(createReview.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.bookReviews = [action.payload, ...state.bookReviews];
        state.myReviews = [action.payload, ...state.myReviews];
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })

      // Update review
      .addCase(updateReview.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.submitLoading = false;

        // Update in all relevant arrays
        const updateInArray = (array) => {
          const index = array.findIndex((review) => review.id === action.payload.id);
          if (index !== -1) {
            array[index] = action.payload;
          }
        };

        updateInArray(state.bookReviews);
        updateInArray(state.myReviews);
        updateInArray(state.userReviews);

        if (state.selectedReview?.id === action.payload.id) {
          state.selectedReview = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })

      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        const reviewId = action.payload.reviewId;

        state.bookReviews = state.bookReviews.filter((review) => review.id !== reviewId);
        state.myReviews = state.myReviews.filter((review) => review.id !== reviewId);
        state.userReviews = state.userReviews.filter((review) => review.id !== reviewId);

        if (state.selectedReview?.id === reviewId) {
          state.selectedReview = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch review by ID
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReview = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch reviews by book
      .addCase(fetchReviewsByBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByBook.fulfilled, (state, action) => {
        state.loading = false;
        state.bookReviews = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.page?.number || 0,
          totalPages: action.payload.page?.totalPages || 0,
          totalElements: action.payload.page?.totalElements || 0,
          pageSize: action.payload.page?.size || 10,
        };
      })
      .addCase(fetchReviewsByBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.page?.number || 0,
          totalPages: action.payload.page?.totalPages || 0,
          totalElements: action.payload.page?.totalElements || 0,
          pageSize: action.payload.page?.size || 10,
        };
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch reviews by user
      .addCase(fetchReviewsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.page?.number || 0,
          totalPages: action.payload.page?.totalPages || 0,
          totalElements: action.payload.page?.totalElements || 0,
          pageSize: action.payload.page?.size || 10,
        };
      })
      .addCase(fetchReviewsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch rating statistics
      .addCase(fetchRatingStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.error = null;
      })
      .addCase(fetchRatingStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.ratingStatistics = action.payload;
      })
      .addCase(fetchRatingStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReviewStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.reviewStatistics = action.payload;
      })

      // Mark review as helpful
      .addCase(markReviewAsHelpful.fulfilled, (state, action) => {
        // Update in all relevant arrays
        const updateHelpfulCount = (array) => {
          const index = array.findIndex((review) => review.id === action.payload.id);
          if (index !== -1) {
            array[index] = action.payload;
          }
        };

        updateHelpfulCount(state.bookReviews);
        updateHelpfulCount(state.myReviews);
        updateHelpfulCount(state.userReviews);

        if (state.selectedReview?.id === action.payload.id) {
          state.selectedReview = action.payload;
        }
      })

      // Check can review
      .addCase(checkCanReview.fulfilled, (state, action) => {
        state.canReviewBook[action.payload.bookId] = action.payload.canReview;
      });
  },
});

export const {
  clearError,
  clearSelectedReview,
  clearBookReviews,
  setCurrentFilter,
  resetReviewState,
} = bookReviewSlice.actions;

export default bookReviewSlice.reducer;
