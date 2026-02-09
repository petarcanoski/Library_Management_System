import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Grid,
  Chip,
  Rating,
  Avatar,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../components/DataTable';
import { fetchMyReviews, deleteReview } from '../../../store/features/reviews/bookReviewThunk';

export default function AdminBookReviewsPage() {
  const dispatch = useDispatch();
  const { myReviews, loading, pagination } = useSelector((state) => state.bookReviews);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterVerified, setFilterVerified] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadReviews();
  }, [page, rowsPerPage]);

  const loadReviews = () => {
    dispatch(fetchMyReviews({ page, size: rowsPerPage }));
  };

  const handleDelete = async (review) => {
    if (window.confirm(`Delete review by ${review.userName} for "${review.bookTitle}"?`)) {
      try {
        await dispatch(deleteReview(review.id)).unwrap();
        loadReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const filteredReviews = (myReviews || []).filter((review) => {
    const matchesSearch =
      searchQuery === '' ||
      review.bookTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = filterRating === '' || review.rating === parseInt(filterRating);
    const matchesVerified =
      filterVerified === '' ||
      (filterVerified === 'true' && review.verifiedReader) ||
      (filterVerified === 'false' && !review.verifiedReader);

    return matchesSearch && matchesRating && matchesVerified;
  });

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 60,
    },
    {
      field: 'userName',
      headerName: 'User',
      minWidth: 150,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>{row.userName?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body2">{row.userName}</Typography>
            {row.verifiedReader && (
              <Chip icon={<VerifiedIcon />} label="Verified" size="small" color="success" />
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: 'bookTitle',
      headerName: 'Book',
      minWidth: 200,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      renderCell: (row) => <Rating value={row.rating} readOnly size="small" />,
    },
    {
      field: 'title',
      headerName: 'Review Title',
      minWidth: 200,
    },
    {
      field: 'reviewText',
      headerName: 'Review',
      minWidth: 250,
      renderCell: (row) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {row.reviewText}
        </Typography>
      ),
    },
    {
      field: 'helpfulCount',
      headerName: 'Helpful',
      align: 'center',
      renderCell: (row) => (
        <Chip label={row.helpfulCount || 0} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: 'createdDate',
      headerName: 'Date',
      type: 'date',
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Book Reviews Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and moderate customer reviews
          </Typography>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {myReviews?.length || 0}
            </Typography>
            <Typography variant="body2">Total Reviews</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {myReviews?.filter((r) => r.verifiedReader).length || 0}
            </Typography>
            <Typography variant="body2">Verified Readers</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {myReviews?.length > 0
                ? (
                    myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length
                  ).toFixed(1)
                : '0.0'}
            </Typography>
            <Typography variant="body2">Average Rating</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
              {myReviews?.filter((r) => r.rating === 5).length || 0}
            </Typography>
            <Typography variant="body2">5-Star Reviews</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by book, user, or review text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Rating</InputLabel>
              <Select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                label="Filter by Rating"
              >
                <MenuItem value="">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Verified Readers</InputLabel>
              <Select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                label="Verified Readers"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Verified Only</MenuItem>
                <MenuItem value="false">Not Verified</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchQuery('');
                setFilterRating('');
                setFilterVerified('');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredReviews}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredReviews.length}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onDelete={handleDelete}
        onEdit={null}
        onView={null}
      />
    </Box>
  );
}
