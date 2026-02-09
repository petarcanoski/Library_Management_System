import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CircularProgress, Box, Typography } from '@mui/material';
import { setCredentials } from '../store/features/auth/authSlice';
import { fetchCurrentUser } from '../store/features/auth/authThunk';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const fullName = searchParams.get('fullName');
    const role = searchParams.get('role');

    if (token) {
      // Store the token and user info
      const user = {
        user: {
          email,
          fullName,
          role
        }
      };

      // Store token in localStorage
      localStorage.setItem('jwt', token);
      localStorage.setItem('token', token);

      // Update Redux store
      dispatch(setCredentials({ token, user }));

      // Fetch full user profile
      dispatch(fetchCurrentUser());

      // Redirect based on role
      setTimeout(() => {
        if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } else {
      // If no token, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={60} sx={{ color: '#4F46E5', mb: 3 }} />
      <Typography variant="h6" sx={{ color: '#374151', fontWeight: 500 }}>
        Completing Google Sign In...
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
        Please wait while we redirect you
      </Typography>
    </Box>
  );
};

export default OAuth2Callback;
