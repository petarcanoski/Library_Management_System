import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import StarIcon from '@mui/icons-material/Star';

/**
 * ReviewDialog Component
 * Dialog for users to write and submit book reviews
 * Only shown to users who have returned (read) the book
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close dialog callback
 * @param {Function} onSubmit - Submit review callback
 * @param {Object} book - Book object being reviewed
 * @param {Object} existingReview - User's existing review (for editing)
 * @param {boolean} loading - Loading state during submission
 */
const ReviewDialog = ({
  open,
  onClose,
  onSubmit,
  book,
  existingReview = null,
  loading = false,
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [hoverRating, setHoverRating] = useState(-1);
  const [error, setError] = useState('');

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const handleSubmit = () => {
    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    if (comment.trim().length > 1000) {
      setError('Review must not exceed 1000 characters');
      return;
    }

    setError('');
    onSubmit({
      bookId: book.id,
      rating,
      comment: comment.trim(),
    });
  };

  const handleClose = () => {
    if (!loading) {
      setRating(existingReview?.rating || 0);
      setComment(existingReview?.comment || '');
      setError('');
      onClose();
    }
  };

  const getRatingText = () => {
    return ratingLabels[hoverRating !== -1 ? hoverRating : rating] || 'No rating';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <div className="flex items-center space-x-2">
          <RateReviewIcon sx={{ color: '#4F46E5', fontSize: 28 }} />
          <span className="font-bold text-gray-900">
            {existingReview ? 'Edit Your Review' : 'Write a Review'}
          </span>
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="space-y-4 mt-2">
          {/* Book Info */}
          {book && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-1">{book.title}</h4>
              <p className="text-sm text-gray-600">by {book.author}</p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Rating Section */}
          <div>
            <Typography component="legend" className="font-semibold text-gray-900 mb-2">
              How would you rate this book? *
            </Typography>
            <Box className="flex items-center space-x-3">
              <Rating
                name="book-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                  setError('');
                }}
                onChangeActive={(event, newHover) => {
                  setHoverRating(newHover);
                }}
                size="large"
                disabled={loading}
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#F59E0B',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#FBBF24',
                  },
                }}
              />
              <Typography
                className="text-lg font-semibold"
                sx={{
                  color: rating > 0 ? '#4F46E5' : '#9CA3AF',
                  minWidth: 100,
                }}
              >
                {getRatingText()}
              </Typography>
            </Box>
            <p className="text-sm text-gray-500 mt-1">
              Click on the stars to rate
            </p>
          </div>

          {/* Review Text Area */}
          <div>
            <Typography component="legend" className="font-semibold text-gray-900 mb-2">
              Share your thoughts about this book *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
              placeholder="What did you like or dislike about this book? Would you recommend it to others? Share your experience..."
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
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-500">
                Minimum 10 characters
              </p>
              <p className={`text-sm ${comment.length > 1000 ? 'text-red-600' : 'text-gray-500'}`}>
                {comment.length} / 1000
              </p>
            </div>
          </div>

          {/* Guidelines */}
          <Alert severity="info">
            <strong>Review Guidelines:</strong>
            <ul className="mt-2 ml-4 text-sm space-y-1">
              <li>Be honest and constructive in your feedback</li>
              <li>Avoid spoilers - keep the plot twists a secret!</li>
              <li>Focus on the content, writing style, and your experience</li>
              <li>Respect other readers - no offensive language</li>
            </ul>
          </Alert>

          {/* Editing Notice */}
          {existingReview && (
            <Alert severity="warning">
              You are editing your existing review. Click "Update Review" to save changes.
            </Alert>
          )}
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
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || rating === 0 || !comment.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <RateReviewIcon />}
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
          {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDialog;
