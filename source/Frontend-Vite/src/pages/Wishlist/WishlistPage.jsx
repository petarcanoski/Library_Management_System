import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import Layout from "../../components/layout/Layout";
import {
  getMyWishlist,
  removeFromWishlist,
} from "../../store/features/wishlist/wishlistThunk";
import { createReservation } from "../../store/features/reservations/reservationThunk";
import WishlistCard from "./WishlistCard";

/**
 * WishlistPage Component
 * Manage user's wishlist with sorting, filtering, and bulk actions
 */
const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { myWishlist, loading, error } = useSelector((state) => state.wishlist);

  // Local state
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState("dateAdded");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      await dispatch(getMyWishlist({ page: 0, size: 100 })).unwrap();
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      showSnackbar(err || "Failed to load wishlist", "error");
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await dispatch(removeFromWishlist(bookId)).unwrap();
      showSnackbar("Removed from wishlist", "success");
    } catch (err) {
      showSnackbar(err || "Failed to remove item", "error");
    }
  };

  const handleReserveBook = async (bookId) => {
    try {
      await dispatch(createReservation(bookId)).unwrap();
      showSnackbar("Book reserved successfully!", "success");
      loadWishlist();
    } catch (err) {
      showSnackbar(err || "Failed to reserve book", "error");
    }
  };

  const handleClearWishlist = async () => {
    try {
      // Remove all wishlist items one by one
      const removePromises = myWishlist.map((item) =>
        dispatch(removeFromWishlist(item.book.id)).unwrap()
      );
      await Promise.all(removePromises);

      setClearDialogOpen(false);
      showSnackbar("Wishlist cleared", "success");
    } catch (err) {
      showSnackbar(err || "Failed to clear wishlist", "error");
    }
  };

  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedItems.map((item) => item.id)));
    }
  };

  const handleBulkRemove = async () => {
    try {
      const selectedBookIds = Array.from(selectedItems)
        .map((id) => {
          const item = myWishlist.find((item) => item.id === id);
          return item?.book?.id;
        })
        .filter(Boolean);

      const promises = selectedBookIds.map((bookId) =>
        dispatch(removeFromWishlist(bookId)).unwrap()
      );
      await Promise.all(promises);

      setSelectedItems(new Set());
      showSnackbar(`${selectedBookIds.length} items removed`, "success");
    } catch (err) {
      showSnackbar("Failed to remove items", "error");
    }
  };

  const handleBulkReserve = async () => {
    try {
      const availableItems = Array.from(selectedItems)
        .map((id) => myWishlist.find((item) => item.id === id))
        .filter((item) => item && item.book.availableCopies > 0);

      const promises = availableItems.map((item) =>
        dispatch(createReservation(item.book.id)).unwrap()
      );
      await Promise.all(promises);

      showSnackbar(`${availableItems.length} books reserved!`, "success");
      setSelectedItems(new Set());
      loadWishlist();
    } catch (err) {
      console.log(err);
      showSnackbar("Failed to reserve books", "error");
    }
  };

  const handleShare = () => {
    const wishlistText = myWishlist
      .map((item) => `${item.book.title} by ${item.book.author}`)
      .join("\n");

    if (navigator.share) {
      navigator.share({
        title: "My Wishlist",
        text: wishlistText,
      });
    } else {
      navigator.clipboard.writeText(wishlistText);
      showSnackbar("Wishlist copied to clipboard!", "success");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtering and Sorting
  const filteredAndSortedItems = myWishlist
    .filter((item) => {
      if (filterAvailability === "available") {
        return item.book.availableCopies > 0;
      }
      if (filterAvailability === "unavailable") {
        return item.book.availableCopies === 0;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dateAdded":
          return new Date(b.addedAt) - new Date(a.addedAt);
        case "title":
          return a.book.title.localeCompare(b.book.title);
        case "author":
          return a.book.author.localeCompare(b.book.author);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  My{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Wishlist
                  </span>
                </h1>
                <p className="text-lg text-gray-600">
                  {myWishlist.length}{" "}
                  {myWishlist.length === 1 ? "book" : "books"} saved
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <Button
                    variant="outlined"
                    startIcon={<ShareIcon />}
                    onClick={handleShare}
                    sx={{ borderColor: "#4F46E5", color: "#4F46E5" }}
                    disabled={myWishlist.length === 0}
                  >
                    Share
                  </Button>
                </div>
                {myWishlist.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setClearDialogOpen(true)}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <Alert severity="error" className="mb-6">
              {error}
            </Alert>
          )}

          {myWishlist.length === 0 ? (
            // Empty State
            <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
              <div className="text-gray-400 mb-4">
                <FavoriteIcon sx={{ fontSize: 80 }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding books you'd like to read!
              </p>
              <Button
                variant="contained"
                onClick={() => navigate("/books")}
                sx={{ bgcolor: "#4F46E5", px: 4, py: 1.5 }}
              >
                Browse Books
              </Button>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-6 animate-fade-in-up animation-delay-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Selection Info */}
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={
                        selectedItems.size === filteredAndSortedItems.length &&
                        filteredAndSortedItems.length > 0
                      }
                      indeterminate={
                        selectedItems.size > 0 &&
                        selectedItems.size < filteredAndSortedItems.length
                      }
                      onChange={handleSelectAll}
                      sx={{
                        color: "#4F46E5",
                        "&.Mui-checked": { color: "#4F46E5" },
                      }}
                    />
                    <span className="text-gray-700 font-medium">
                      {selectedItems.size > 0
                        ? `${selectedItems.size} selected`
                        : "Select all"}
                    </span>

                    {selectedItems.size > 0 && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={handleBulkRemove}
                        >
                          Remove
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={handleBulkReserve}
                          sx={{ bgcolor: "#4F46E5" }}
                        >
                          Reserve
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Filter and Sort */}
                  <div className="flex items-center space-x-2">
                    {/* Availability Filter */}
                    <div>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="availability-label">
                          Availability
                        </InputLabel>
                        <Select
                          labelId="availability-label"
                          value={filterAvailability}
                          onChange={(e) =>
                            setFilterAvailability(e.target.value)
                          }
                          label="Availability"
                        >
                          <MenuItem value="all">All Books</MenuItem>
                          <MenuItem value="available">Available</MenuItem>
                          <MenuItem value="unavailable">Unavailable</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    {/* Sort */}
                    <div>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="sortby-label">Sort By</InputLabel>
                        <Select
                          labelId="sortby-label"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          label="Sort By"
                        >
                          <MenuItem value="dateAdded">Date Added</MenuItem>
                          <MenuItem value="title">Title</MenuItem>
                          <MenuItem value="author">Author</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wishlist Items */}
              <div className="space-y-4 animate-fade-in-up animation-delay-400">
                {filteredAndSortedItems.map((item) => {
                  const isAvailable = item.book.availableCopies > 0;
                  const isSelected = selectedItems.has(item.id);

                  return (
                    <WishlistCard
                      item={item}
                      isAvailable={isAvailable}
                      isSelected={isSelected}
                      handleRemoveItem={handleRemoveItem}
                      handleReserveBook={handleReserveBook}
                      handleSelectItem={handleSelectItem}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clear All Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Clear Wishlist?</DialogTitle>
        <DialogContent>
          Are you sure you want to remove all {myWishlist.length} books from
          your wishlist? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleClearWishlist}
            color="error"
            variant="contained"
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WishlistPage;
