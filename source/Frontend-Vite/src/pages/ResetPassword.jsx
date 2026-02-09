import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { resetPassword } from '../store/features/auth/authThunk';
import { resetPasswordFlags } from '../store/features/auth/authSlice';

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { loading, error, resetPasswordSuccess } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Clean up on mount
    dispatch(resetPasswordFlags());

    // Check if token exists
    if (!token) {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(resetPassword({ token, password: formData.password })).unwrap();
    } catch (err) {
      console.error('Reset password failed:', err);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up animation-delay-200">
          {resetPasswordSuccess ? (
            <Box className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#10B981' }} />
                </div>
              </div>
              <div>
                <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                  Password Reset Successful
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-4">
                  Your password has been successfully reset. You can now login with your new
                  password.
                </Typography>
              </div>
              <Button
                fullWidth
                variant="contained"
                onClick={handleLoginRedirect}
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
                Go to Login
              </Button>
            </Box>
          ) : (
            <>
              {error && (
                <Alert severity="error" className="mb-6">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Field */}
                <div>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    disabled={loading}
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon className="text-gray-400" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
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

                {/* Confirm Password Field */}
                <div>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon className="text-gray-400" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
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

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <Typography variant="caption" className="text-gray-700 font-semibold">
                    Password Requirements:
                  </Typography>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span
                        className={
                          formData.password.length >= 6 ? 'text-green-600' : 'text-gray-400'
                        }
                      >
                        •
                      </span>
                      <span>At least 6 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span
                        className={
                          formData.password === formData.confirmPassword &&
                          formData.password.length > 0
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }
                      >
                        •
                      </span>
                      <span>Passwords match</span>
                    </li>
                  </ul>
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
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Back to Login
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

export default ResetPassword;
