import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  RateReview as RateReviewIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReviewsByBook,
  fetchRatingStatistics,
  checkCanReview,
} from '../../store/features/reviews/bookReviewThunk';
import { setCurrentFilter } from '../../store/features/reviews/bookReviewSlice';
import ReviewCard from './ReviewCard';
import ReviewDialog from './ReviewDialog';
import RatingStatistics from './RatingStatistics';

const FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Reviews', icon: <FilterIcon /> },
  { value: 'VERIFIED_ONLY', label: 'Verified Readers', icon: <VerifiedIcon /> },
  { value: 'TOP_HELPFUL', label: 'Most Helpful', icon: <TrendingUpIcon /> },
  { value: 'BY_RATING', label: 'By Rating', icon: <StarIcon /> },
];

export default function ReviewList({ bookId, bookTitle }) {
  const dispatch = useDispatch();
  const {
    bookReviews,
    ratingStatistics,
    loading,
    statisticsLoading,
    pagination,
    currentFilter,
    canReviewBook,
  } = useSelector((state) => state.bookReviews);

  const [page, setPage] = useState(0);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const canWrite = canReviewBook[bookId] || false;

  useEffect(() => {
    if (bookId) {
      // Fetch reviews
      dispatch(fetchReviewsByBook({
        bookId,
        filter: filterType,
        rating: selectedRating || undefined,
        page,
        size: 10,
      }));

      // Fetch statistics
      dispatch(fetchRatingStatistics(bookId));

      // Check if user can review
      dispatch(checkCanReview(bookId));
    }
  }, [dispatch, bookId, filterType, selectedRating, page]);

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
    setSelectedRating('');
    setPage(0);
    dispatch(setCurrentFilter({ type: newFilter, rating: null }));
  };

  const handleRatingFilterChange = (event) => {
    const rating = event.target.value;
    setSelectedRating(rating);
    setFilterType('BY_RATING');
    setPage(0);
    dispatch(setCurrentFilter({ type: 'BY_RATING', rating }));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWriteReview = () => {
    setEditingReview(null);
    setReviewDialogOpen(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setReviewDialogOpen(false);
    setEditingReview(null);
  };

  return (
    <Box>
      {/* Rating Statistics */}
      {statisticsLoading ? (
        <LinearProgress sx={{ mb: 3 }} />
      ) : ratingStatistics ? (
        <RatingStatistics statistics={ratingStatistics} />
      ) : null}

      {/* Header with Write Review Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Customer Reviews
        </Typography>

        {canWrite && (
          <Button
            variant="contained"
            startIcon={<RateReviewIcon />}
            onClick={handleWriteReview}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5568d3 30%, #6a4292 90%)',
              },
            }}
          >
            Write a Review
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: 80 }}>
            Filter by:
          </Typography>

          <ButtonGroup variant="outlined" size="small">
            {FILTER_OPTIONS.filter((opt) => opt.value !== 'BY_RATING').map((option) => (
              <Button
                key={option.value}
                onClick={() => handleFilterChange(option.value)}
                variant={filterType === option.value ? 'contained' : 'outlined'}
                startIcon={option.icon}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={selectedRating}
              onChange={handleRatingFilterChange}
              label="Rating"
            >
              <MenuItem value="">All Ratings</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </Select>
          </FormControl>

          {/* Active Filter Indicator */}
          {(filterType !== 'ALL' || selectedRating) && (
            <Chip
              label={`Active: ${
                selectedRating
                  ? `${selectedRating} Stars`
                  : FILTER_OPTIONS.find((f) => f.value === filterType)?.label
              }`}
              onDelete={() => handleFilterChange('ALL')}
              color="primary"
              size="small"
            />
          )}
        </Box>
      </Paper>

      {/* Reviews List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : bookReviews.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <Typography variant="body2">
            No reviews yet. {canWrite && 'Be the first to write a review!'}
          </Typography>
        </Alert>
      ) : (
        <>
          {/* Total Count */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {bookReviews.length} of {pagination.totalElements} reviews
          </Typography>

          {/* Review Cards */}
          {bookReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEditReview}
              showBookInfo={false}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Review Dialog */}
      <ReviewDialog
        open={reviewDialogOpen}
        onClose={handleCloseDialog}
        bookId={bookId}
        bookTitle={bookTitle}
        existingReview={editingReview}
      />
    </Box>
  );
}
