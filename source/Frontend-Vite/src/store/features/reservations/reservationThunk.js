import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import { getHeaders } from "../../../utils/getHeaders";

const API_URL = "/api/reservations";

// ==================== RESERVATION OPERATIONS ====================

/**
 * Create a reservation for current authenticated user
 * POST /api/reservations
 */
export const createReservation = createAsyncThunk(
  "reservations/createReservation",
  async (reservationRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, reservationRequest, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
        console.log("reservation error", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || error.response?.data || "Failed to create reservation"
      );
    }
  }
);

/**
 * Cancel a reservation
 * DELETE /api/reservations/{id}
 */
export const cancelReservation = createAsyncThunk(
  "reservations/cancelReservation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel reservation"
      );
    }
  }
);

/**
 * Fulfill a reservation (mark as checked out)
 * POST /api/reservations/{id}/fulfill
 */
export const fulfillReservation = createAsyncThunk(
  "reservations/fulfillReservation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/${id}/fulfill`, null, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.log("fulfill reservation error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fulfill reservation"
      );
    }
  }
);

// ==================== QUERY OPERATIONS ====================

/**
 * Get reservation by ID
 * GET /api/reservations/{id}
 */
export const getReservationById = createAsyncThunk(
  "reservations/getReservationById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reservation"
      );
    }
  }
);

/**
 * Search my reservations (current user) with filters
 * GET /api/reservations/my?status=...&activeOnly=...&page=0&size=20
 * @param status - ReservationStatus: PENDING, AVAILABLE, FULFILLED, CANCELLED, EXPIRED
 * @param activeOnly - Boolean: Show only active reservations (PENDING or AVAILABLE)
 */
export const getMyReservations = createAsyncThunk(
  "reservations/getMyReservations",
  async (
    {
      status,
      activeOnly,
      page = 0,
      size = 20,
      sortBy = "reservedAt",
      sortDirection = "DESC",
    },
    { rejectWithValue }
  ) => {
    console.log("fetching my reservations with", {
      status,
      activeOnly,
      page,
      size,
      sortBy,
      sortDirection,
    });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDirection,
      });
      if (status) {
        params.append("status", status);
      }
      if (activeOnly !== undefined && activeOnly !== null) {
        params.append("activeOnly", activeOnly.toString());
      }
      const response = await api.get(`${API_URL}/my?${params}`, {
        headers: getHeaders(),
      });
      console.log("my reservations response", response);
      return response.data;
    } catch (error) {
      console.log("my reservations error", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my reservations"
      );
    }
  }
);

/**
 * Search all reservations with filters (admin operation)
 * GET /api/reservations?userId=...&bookId=...&status=...&activeOnly=...
 */
export const searchReservations = createAsyncThunk(
  "reservations/searchReservations",
  async (
    {
      userId,
      bookId,
      status,
      activeOnly,
      page = 0,
      size = 20,
      sortBy = "reservedAt",
      sortDirection = "DESC",
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDirection,
      });
      if (userId) {
        params.append("userId", userId.toString());
      }
      if (bookId) {
        params.append("bookId", bookId.toString());
      }
      if (status) {
        params.append("status", status);
      }
      if (activeOnly !== undefined && activeOnly !== null) {
        params.append("activeOnly", activeOnly.toString());
      }
      const response = await api.get(`${API_URL}?${params}`, {
        headers: getHeaders(),
      });
      console.log("search reservations response", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search reservations"
      );
    }
  }
);

/**
 * Get queue position for a reservation
 * GET /api/reservations/{id}/queue-position
 */
export const getQueuePosition = createAsyncThunk(
  "reservations/getQueuePosition",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/${id}/queue-position`, {
        headers: getHeaders(),
      });
      return { reservationId: id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch queue position"
      );
    }
  }
);


