import { createSlice } from '@reduxjs/toolkit';
import {
  fetchActivePlans,
  fetchActivePlansPaginated,
  fetchFeaturedPlans,
  fetchPlanById,
  fetchPlanByCode,
  fetchPlansByCurrency,
  searchPlans,
  createPlan,
  updatePlan,
  deletePlan,

  fetchAllPlans,
  checkPlanCode,
} from './subscriptionPlanThunk';

// Initial state
const initialState = {
  // Plan lists
  activePlans: [],
  featuredPlans: [],
  allPlans: [],
  searchResults: [],
  currencyPlans: [],

  // Single plan
  selectedPlan: null,

  // Pagination
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  },

  // Loading states
  loading: false,
  searchLoading: false,
  planLoading: false,

  // Error handling
  error: null,

  // Admin
  codeCheckResult: null,
};

// Subscription Plans slice
const subscriptionPlanSlice = createSlice({
  name: 'subscriptionPlans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCodeCheckResult: (state) => {
      state.codeCheckResult = null;
    },
    resetPlanState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch active plans
      .addCase(fetchActivePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.activePlans = action.payload;
      })
      .addCase(fetchActivePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch active plans paginated
      .addCase(fetchActivePlansPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePlansPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.activePlans = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.number || 0,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
          pageSize: action.payload.size || 10,
        };
      })
      .addCase(fetchActivePlansPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch featured plans
      .addCase(fetchFeaturedPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredPlans = action.payload;
      })
      .addCase(fetchFeaturedPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch plan by ID
      .addCase(fetchPlanById.pending, (state) => {
        state.planLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.planLoading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.planLoading = false;
        state.error = action.payload;
      })

      // Fetch plan by code
      .addCase(fetchPlanByCode.pending, (state) => {
        state.planLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanByCode.fulfilled, (state, action) => {
        state.planLoading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(fetchPlanByCode.rejected, (state, action) => {
        state.planLoading = false;
        state.error = action.payload;
      })

      // Fetch plans by currency
      .addCase(fetchPlansByCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlansByCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyPlans = action.payload;
      })
      .addCase(fetchPlansByCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search plans
      .addCase(searchPlans.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchPlans.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.number || 0,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
          pageSize: action.payload.size || 10,
        };
      })
      .addCase(searchPlans.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Create plan (Admin)
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.allPlans = [action.payload, ...state.allPlans];
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update plan (Admin)
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.loading = false;
        // Update in all relevant arrays
        const updatePlanInArray = (array) => {
          const index = array.findIndex((plan) => plan.id === action.payload.id);
          if (index !== -1) {
            array[index] = action.payload;
          }
        };
        updatePlanInArray(state.activePlans);
        updatePlanInArray(state.featuredPlans);
        updatePlanInArray(state.allPlans);
        if (state.selectedPlan?.id === action.payload.id) {
          state.selectedPlan = action.payload;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete plan (Admin)
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.loading = false;
        const planId = action.payload.id;
        state.activePlans = state.activePlans.filter((plan) => plan.id !== planId);
        state.featuredPlans = state.featuredPlans.filter((plan) => plan.id !== planId);
        state.allPlans = state.allPlans.filter((plan) => plan.id !== planId);
        if (state.selectedPlan?.id === planId) {
          state.selectedPlan = null;
        }
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Fetch all plans (Admin)
      .addCase(fetchAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.allPlans = action.payload.content || action.payload;
        state.pagination = {
          currentPage: action.payload.number || 0,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
          pageSize: action.payload.size || 20,
        };
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check plan code (Admin)
      .addCase(checkPlanCode.fulfilled, (state, action) => {
        state.codeCheckResult = action.payload;
      });
  },
});

export const {
  clearError,
  clearSelectedPlan,
  clearSearchResults,
  clearCodeCheckResult,
  resetPlanState,
} = subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
