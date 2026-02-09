import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';
import axios from 'axios';

const API_URL = '/auth';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/login`, { email, password });
      const { jwt, ...user } = response.data;
      // Store token consistently
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('token', jwt); // Also store as 'token' for consistency
      return { token: jwt, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/signup`, userData);
      const { jwt, ...user } = response.data;
      // Store token consistently
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('token', jwt); // Also store as 'token' for consistency
      return { token: jwt, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const  token  = localStorage.getItem('jwt');
      const response = await api.get(`/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetch current user -- ",response.data);
      return response.data;
    } catch (error) {
      console.log("fetch current user error -- ",error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/forgot-password`, { email });
      console.log("forgot password", response)
      return response.data;
    } catch (error) {
      console.log("error ", error)
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset link');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/reset-password`, { token, password });
       console.log("reset password", response)
      return response.data;
    } catch (error) {
      console.log("error ",error)
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

/**
 * Get all users list (Admin only)
 * GET /users/list
 */
export const getUsersList = createAsyncThunk(
  'auth/getUsersList',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axios.get('http://localhost:5000/users/list');
      console.log("users list", response.data)
      return response.data;
    } catch (error) {
      console.log("error ",error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users list');
    }
  }
);
