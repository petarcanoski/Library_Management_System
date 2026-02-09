import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (but NOT redirect)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401, clear the token but let Redux handle the redirect
    if (error.response?.status === 401) {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      // Only clear tokens if they exist (avoid unnecessary operations)
      if (token) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('token');
        // Dispatch logout action would be better, but we can't access Redux store here
        // The app will handle redirect based on auth state
      }
    }
    return Promise.reject(error);
  }
);

export default api;
