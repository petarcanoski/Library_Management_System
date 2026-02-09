import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Alert, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import Layout from '../../components/layout/Layout';
import BookCard from '../../components/books/BookCard';
import GenreFilter from '../../components/books/GenreFilter';
import { BookSkeletonGrid } from '../../components/books/BookSkeleton';

import { fetchActiveGenres } from '../../store/features/genres/genreThunk';
import { fetchBooks, searchBooks } from '../../store/features/books/bookThunk';


/**
 * BooksPage Component
 * Main catalog page for browsing, searching, and filtering books
 */
const BooksPage = () => {
  const dispatch = useDispatch();

  // Redux State
  const { books, loading, error } = useSelector((state) => state.books);
  const { genres, loading: genresLoading } = useSelector((state) => state.genres);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('DESC');

  // UI State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debounce timer for search
  const [searchDebounce, setSearchDebounce] = useState(null);

  /**
   * Fetch genres on component mount
   */
  useEffect(() => {
    dispatch(fetchActiveGenres());
  }, [dispatch]);

  /**
   * Load books from API with current filters
   */
  const loadBooks = React.useCallback(() => {
    // If search term exists, use advanced search endpoint
    if (searchTerm) {
      dispatch(searchBooks({
        searchTerm: searchTerm,
        genreId: selectedGenreId,
        availableOnly: availabilityFilter === 'AVAILABLE' ? true : (availabilityFilter === 'CHECKED_OUT' ? false : null),
        page: 0,
        size: 20,
        sortBy: sortBy,
        sortDirection: sortDirection,
      }));
    } else {
      // Use simple GET endpoint with filters
      dispatch(fetchBooks({
        genreId: selectedGenreId,
        availableOnly: availabilityFilter === 'AVAILABLE' ? true : (availabilityFilter === 'CHECKED_OUT' ? false : null),
        page: 0,
        size: 20,
        sortBy: sortBy,
        sortDirection: sortDirection,
      }));
    }
  }, [dispatch, 
    searchTerm, 
    selectedGenreId, 
    availabilityFilter, 
    sortBy, 
    sortDirection]);

  /**
   * Fetch books when filters change (excluding search term)
   */
  useEffect(() => {
    if (!searchTerm) {
      loadBooks();
    }
  }, [
    selectedGenreId, 
    availabilityFilter, 
    sortBy, 
    sortDirection, 
    loadBooks, 
    searchTerm
  ]);

  /**
   * Debounced search effect
   */
  useEffect(() => {
    // Clear previous timeout
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    // Set new timeout for search
    const timeout = setTimeout(() => {
      if (searchTerm) {
        loadBooks();
      }
    }, 500); // 500ms debounce

    setSearchDebounce(timeout);

    // Cleanup
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

 

  /**
   * Handle genre selection
   */
  const handleGenreSelect = (genreId) => {
    setSelectedGenreId(genreId);
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (value) => {
    const [field, direction] = value.split('-');
    setSortBy(field);
    setSortDirection(direction.toUpperCase());
  };



  /**
   * Close snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Get current sort value
   */
  const getCurrentSortValue = () => {
    return `${sortBy}-${sortDirection.toLowerCase()}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white  border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Browse Our{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover thousands of books across all genres
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-72 space-y-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white rounded-lg shadow-md border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                <FilterListIcon />
                <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>

            {/* Filters Container */}
            <div className={`space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Genre Filter */}
              {genresLoading ? (
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <GenreFilter
                  genres={genres}
                  selectedGenreId={selectedGenreId}
                  onGenreSelect={handleGenreSelect}
                />
              )}

              {/* Availability Filter */}
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Availability
                </h3>
                <FormControl fullWidth>
                  <Select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
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
                    <MenuItem value="ALL">All Books</MenuItem>
                    <MenuItem value="AVAILABLE">Available Only</MenuItem>
                    <MenuItem value="CHECKED_OUT">Checked Out</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            {/* Search and Sort Bar */}
            <div className="  ">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <TextField
                    fullWidth
                    placeholder="Search by title, author, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon className="text-gray-400" />
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
                    }}
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="md:w-64">
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={getCurrentSortValue()}
                      onChange={(e) => handleSortChange(e.target.value)}
                      label="Sort By"
                      startAdornment={
                        <InputAdornment position="start">
                          <SortIcon className="text-gray-400" />
                        </InputAdornment>
                      }
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
                      <MenuItem value="title-asc">Title (A-Z)</MenuItem>
                      <MenuItem value="title-desc">Title (Z-A)</MenuItem>
                      <MenuItem value="author-asc">Author (A-Z)</MenuItem>
                      <MenuItem value="author-desc">Author (Z-A)</MenuItem>
                      <MenuItem value="createdAt-desc">Newest First</MenuItem>
                      <MenuItem value="createdAt-asc">Oldest First</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchTerm || selectedGenreId || availabilityFilter !== 'ALL') && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchTerm && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      Search: {searchTerm}
                    </span>
                  )}
                  {selectedGenreId && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      Genre selected
                    </span>
                  )}
                  {availabilityFilter !== 'ALL' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {availabilityFilter === 'AVAILABLE' ? 'Available' : 'Checked Out'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {/* Books Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <BookSkeletonGrid count={8} />
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="text-gray-400 mb-4">
                  <SearchIcon sx={{ fontSize: 64 }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Books Found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </div>
    </Layout>
  );
};

export default BooksPage;
