import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * CheckoutDialog Component
 * Dialog for checking out a book with configurable checkout period and notes
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close dialog callback
 * @param {Function} onConfirm - Confirm checkout callback
 * @param {Object} book - Book object to checkout
 * @param {boolean} loading - Loading state during checkout
 */
const CheckoutDialog = ({ open, onClose, onConfirm, book, loading = false }) => {
  const [checkoutDays, setCheckoutDays] = useState(14);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const checkoutOptions = [
    { value: 7, label: '1 Week (7 days)' },
    { value: 14, label: '2 Weeks (14 days)' },
    { value: 21, label: '3 Weeks (21 days)' },
    { value: 30, label: '1 Month (30 days)' },
  ];

  const handleConfirm = () => {
    if (!book) {
      setError('Book information is missing');
      return;
    }

    if (checkoutDays < 1) {
      setError('Please select a valid checkout period');
      return;
    }

    setError('');
    onConfirm({
      bookId: book.id,
      checkoutDays,
      notes: notes.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!loading) {
      setCheckoutDays(14);
      setNotes('');
      setError('');
      onClose();
    }
  };

  const calculateDueDate = () => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + checkoutDays);
    return dueDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <div className="flex items-center space-x-2">
          <LocalLibraryIcon sx={{ color: '#4F46E5', fontSize: 28 }} />
          <span className="font-bold text-gray-900">Checkout Book</span>
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="space-y-4 mt-2">
          {/* Book Info */}
          {book && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-1">{book.title}</h4>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                <span className="font-medium">Available:</span>
                <span className="text-green-600 font-semibold">
                  {book.availableCopies} of {book.totalCopies} copies
                </span>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Checkout Period Selector */}
          <div>
            <FormControl fullWidth>
            <InputLabel id="checkout-period-label">Checkout Period</InputLabel>
            <Select
              labelId="checkout-period-label"
              value={checkoutDays}
              onChange={(e) => setCheckoutDays(e.target.value)}
              label="Checkout Period"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4F46E5',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4F46E5',
                },
              }}
            >
              {checkoutOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>

          {/* Due Date Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <CalendarTodayIcon sx={{ fontSize: 18, color: '#10B981' }} />
              <span className="font-semibold text-green-900">Due Date</span>
            </div>
            <p className="text-green-800 font-medium">{calculateDueDate()}</p>
            <p className="text-sm text-green-700 mt-1">
              Please return the book by this date to avoid late fees.
            </p>
          </div>

          {/* Notes Field */}
          <div>
            <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special notes about this checkout..."
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#4F46E5',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4F46E5',
                },
              },
            }}
          />
          </div>

          {/* Important Information */}
          <Alert severity="info">
            <strong>Checkout Policy:</strong>
            <ul className="mt-2 ml-4 text-sm space-y-1">
              <li>Books can be renewed up to 2 times if no one has reserved them</li>
              <li>Late returns incur a fine of $0.50 per day</li>
              <li>Please handle the book with care to avoid damage fees</li>
            </ul>
          </Alert>
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: '#6B7280',
            '&:hover': {
              bgcolor: '#F3F4F6',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <LocalLibraryIcon />}
          sx={{
            bgcolor: '#4F46E5',
            px: 3,
            '&:hover': {
              bgcolor: '#4338CA',
            },
            '&:disabled': {
              bgcolor: '#E5E7EB',
            },
          }}
        >
          {loading ? 'Processing...' : 'Confirm Checkout'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog;
