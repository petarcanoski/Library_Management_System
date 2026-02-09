import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

/**
 * ReservationDialog Component
 * Dialog for reserving a book that is currently unavailable
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close dialog callback
 * @param {Function} onConfirm - Confirm reservation callback
 * @param {Object} book - Book object to reserve
 * @param {boolean} loading - Loading state during reservation
 */
const ReservationDialog = ({ open, 
  onClose, 
  onConfirm, book, loading = false }) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!book) {
      setError('Book information is missing');
      return;
    }

    setError('');
    onConfirm({
          isbn: book.isbn,
          notes: notes.trim() || undefined,
      });
  };

  const handleClose = () => {
    if (!loading) {
      setNotes('');
      setError('');
      onClose();
    }
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
          <BookmarkAddIcon sx={{ color: '#F59E0B', fontSize: 28 }} />
          <span className="font-bold text-gray-900">Reserve Book</span>
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="space-y-4 mt-2">
          {/* Book Info */}
          {book && (
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-1">{book.title}</h4>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <div className="flex items-center space-x-2 mt-2 text-sm">
                <span className="font-medium text-gray-600">Status:</span>
                <span className="text-red-600 font-semibold">
                  Currently Unavailable
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

          {/* Reservation Information */}
          <Alert severity="info" icon={<NotificationsActiveIcon />}>
            <strong>How Reservations Work:</strong>
            <ul className="mt-2 ml-4 text-sm space-y-1">
              <li>You'll be notified when the book becomes available</li>
              <li>The book will be held for you for 48 hours</li>
              <li>You can cancel your reservation anytime</li>
              <li>Reservations are processed in the order they're received</li>
            </ul>
          </Alert>

          {/* Notes Field */}
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special notes about this reservation..."
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#F59E0B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#F59E0B',
                },
              },
            }}
          />

          {/* Notification Alert */}
          <Alert severity="success">
            <strong>You will receive notifications via:</strong>
            <ul className="mt-2 ml-4 text-sm space-y-1">
              <li>Email to your registered email address</li>
              <li>In-app notification in your dashboard</li>
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
          startIcon={loading ? <CircularProgress size={20} /> : <BookmarkAddIcon />}
          sx={{
            bgcolor: '#F59E0B',
            px: 3,
            '&:hover': {
              bgcolor: '#D97706',
            },
            '&:disabled': {
              bgcolor: '#E5E7EB',
            },
          }}
        >
          {loading ? 'Processing...' : 'Confirm Reservation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;
