import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { forgotPassword } from '../store/features/auth/authThunk';
import { resetPasswordFlags } from '../store/features/auth/authSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordSuccess } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Clean up on mount
    dispatch(resetPasswordFlags());
  }, [dispatch]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (formError) {
      setFormError('');
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="p-3 bg-indigo-600 rounded-xl group-hover:bg-indigo-700 transition-colors">
              <MenuBookIcon sx={{ fontSize: 32, color: 'white' }} />
            </div>
            <span className="text-3xl font-bold text-gray-900">Zosh Library</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up animation-delay-200">
          {forgotPasswordSuccess ? (
            <Box className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#10B981' }} />
                </div>
              </div>
              <div>
                <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                  Check Your Email
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-4">
                  We've sent a password reset link to <strong>{email}</strong>
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Please check your email and click on the link to reset your password.
                  The link will expire in 24 hours.
                </Typography>
              </div>
              <Link to="/login">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    bgcolor: '#4F46E5',
                    color: 'white',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '0.75rem',
                    '&:hover': {
                      bgcolor: '#4338CA',
                    },
                  }}
                >
                  Back to Login
                </Button>
              </Link>
            </Box>
          ) : (
            <>
              {error && (
                <Alert severity="error" className="mb-6">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    error={!!formError}
                    helperText={formError}
                    disabled={loading}
                    autoComplete="email"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon className="text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#4F46E5',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4F46E5',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#4F46E5',
                      },
                    }}
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      bgcolor: '#4F46E5',
                      color: 'white',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '0.75rem',
                      '&:hover': {
                        bgcolor: '#4338CA',
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#9CA3AF',
                        color: 'white',
                      },
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <CircularProgress size={20} color="inherit" />
                        <span>Sending Reset Link...</span>
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center space-x-1"
                  >
                    <ArrowBackIcon sx={{ fontSize: 16 }} />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Additional Help */}
        <p className="mt-6 text-center text-sm text-gray-600 animate-fade-in-up animation-delay-400">
          Need help?{' '}
          <Link to="/contact" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
