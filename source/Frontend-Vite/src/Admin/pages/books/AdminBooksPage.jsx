import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Paper,

  FormControl,
  InputLabel,
  Select,
  Grid,

} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/DataTable";
import {
  fetchBooks,
  searchBooks,
  deleteBook,
} from "../../../store/features/books/bookThunk";
import { fetchActiveGenres } from "../../../store/features/genres/genreThunk";
import BookForm from "./BookForm";
import { columns } from "./TableColumns";

export default function AdminBooksPage() {
  const dispatch = useDispatch();

  // Redux State
  const { books, loading, totalElements } = useSelector((state) => state.books);
  const { activeGenres, loading: genresLoading } = useSelector((state) => state.genres);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenreId, setSelectedGenreId] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("DESC");

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // UI State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

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
      dispatch(
        searchBooks({
          searchTerm: searchTerm,
          genreId: selectedGenreId || null,
          availableOnly:
            availabilityFilter === "AVAILABLE"
              ? true
              : availabilityFilter === "CHECKED_OUT"
              ? false
              : null,
          page: page,
          size: rowsPerPage,
          sortBy: sortBy,
          sortDirection: sortDirection,
        })
      );
    } else {
      // Use simple GET endpoint with filters
      dispatch(
        fetchBooks({
          genreId: selectedGenreId || null,
          availableOnly:
            availabilityFilter === "AVAILABLE"
              ? true
              : availabilityFilter === "CHECKED_OUT"
              ? false
              : null,
          page: page,
          size: rowsPerPage,
          sortBy: sortBy,
          sortDirection: sortDirection,
        })
      );
    }
  }, [
    dispatch,
    searchTerm,
    selectedGenreId,
    availabilityFilter,
    page,
    rowsPerPage,
    sortBy,
    sortDirection,
  ]);

  /**
   * Fetch books when filters change (excluding search term)
   */
  useEffect(() => {
    if (!searchTerm) {
      loadBooks();
    }
  }, [selectedGenreId, availabilityFilter, page, rowsPerPage, sortBy, sortDirection, loadBooks, searchTerm]);

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
   * Handle sort change
   */
  const handleSortChange = (value) => {
    const [field, direction] = value.split("-");
    setSortBy(field);
    setSortDirection(direction.toUpperCase());
  };

  /**
   * Get current sort value
   */
  const getCurrentSortValue = () => {
    return `${sortBy}-${sortDirection.toLowerCase()}`;
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setEditingBook(book);

     
    } else {
      setEditingBook(null);
    
    }
    setDialogOpen(true);
  };




  const handleDelete = async (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await dispatch(deleteBook(book.id)).unwrap();
        loadBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

 

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Books Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your library's book collection
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #5568d3 30%, #6a4292 90%)",
            },
          }}
        >
          Add New Book
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Genre</InputLabel>
              <Select
                value={selectedGenreId}
                onChange={(e) => setSelectedGenreId(e.target.value)}
                label="Filter by Genre"
              >
                <MenuItem value="">All Genres</MenuItem>
                {genresLoading ? (
                  <MenuItem disabled>Loading genres...</MenuItem>
                ) : (
                  activeGenres?.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                label="Availability"
              >
                <MenuItem value="">All Books</MenuItem>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="CHECKED_OUT">Checked Out</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={getCurrentSortValue()}
                onChange={(e) => handleSortChange(e.target.value)}
                label="Sort By"
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon sx={{ fontSize: 18, ml: -0.5 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="title-asc">Title (A-Z)</MenuItem>
                <MenuItem value="title-desc">Title (Z-A)</MenuItem>
                <MenuItem value="author-asc">Author (A-Z)</MenuItem>
                <MenuItem value="author-desc">Author (Z-A)</MenuItem>
                <MenuItem value="createdAt-desc">Newest First</MenuItem>
                <MenuItem value="createdAt-asc">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 1.5 }}>
            <Button
              sx={{ py: 1.8 }}
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchTerm("");
                setSelectedGenreId("");
                setAvailabilityFilter("");
                setPage(0);
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {(searchTerm || selectedGenreId || availabilityFilter) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {searchTerm && (
                <Box
                  component="span"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "primary.50",
                    color: "primary.700",
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Search: {searchTerm}
                </Box>
              )}
              {selectedGenreId && (
                <Box
                  component="span"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "secondary.50",
                    color: "secondary.700",
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Genre:{" "}
                  {activeGenres?.find((g) => g.id === selectedGenreId)?.name || "Selected"}
                </Box>
              )}
              {availabilityFilter && (
                <Box
                  component="span"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "success.50",
                    color: "success.700",
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {availabilityFilter === "AVAILABLE" ? "Available" : "Checked Out"}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={books}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalElements}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog */}
      <BookForm
        dialogOpen={dialogOpen}
        editingBook={editingBook}
        setEditingBook={setEditingBook}
        setDialogOpen={setDialogOpen}
        book={editingBook}
      />
    </Box>
  );
}
