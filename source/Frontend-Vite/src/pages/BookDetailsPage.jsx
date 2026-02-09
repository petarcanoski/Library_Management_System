import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Chip,
  Rating,
  Divider,
  Tab,
  Tabs,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import PrintIcon from "@mui/icons-material/Print";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import Layout from "../components/layout/Layout";
import CheckoutDialog from "../components/books/CheckoutDialog";
import ReservationDialog from "../components/books/ReservationDialog";

import { fetchBookById, fetchBooks } from "../store/features/books/bookThunk";
import { checkoutBook } from "../store/features/bookLoans/bookLoanThunk";
import {
  createReview,
  deleteReview,
  updateReview,
  fetchReviewsByBook,
  fetchRatingStatistics,
  checkCanReview,
  fetchMyReviews,
} from "../store/features/reviews/bookReviewThunk";
import { createReservation } from "../store/features/reservations/reservationThunk";
import {
  addToWishlist,
  checkIfInWishlist,
  removeFromWishlist,
} from "../store/features/wishlist/wishlistThunk";
import ReviewDialog from "../components/reviews/ReviewDialog";
import { fetchActiveSubscription } from "../store/features/subscriptions/subscriptionThunk";
import { Check, TaskAlt } from "@mui/icons-material";

/**
 * BookDetailsPage Component
 * Displays comprehensive book details with reviews, recommendations, and actions
 */
const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const { activeSubscription } = useSelector((state) => state.subscriptions);

  // Redux State
  const {
    currentBook: book,
    loading,
    error,
  } = useSelector((state) => state.books);
  const {
    bookReviews: reviews,
    ratingStatistics,
    canReviewBook,
    loading: reviewsLoading,
  } = useSelector((state) => state.bookReviews);
  const { books: relatedBooks } = useSelector((state) => state.books);

  // Local State
  const [activeTab, setActiveTab] = useState(0);

  const { wishlistStatus } = useSelector((state) => state.wishlist);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [checkoutDialog, setCheckoutDialog] = useState({
    open: false,
    loading: false,
  });
  const [reservationDialog, setReservationDialog] = useState({
    open: false,
    loading: false,
  });
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    loading: false,
  });
  const [userReview, setUserReview] = useState(null);
  const [hasRead, setHasRead] = useState(false);

  console.log("wishlistStatus -- ",wishlistStatus);

  useEffect(() => {
    loadBookDetails();
    loadReviews();
    loadRatingStats();
    checkUserReadStatus();
    loadUserReview();
  }, [id, dispatch]);

  // Load book details and related books from same genre
  useEffect(() => {
    if (book && book.genreId) {
      dispatch(
        fetchBooks({
          genreId: book.genreId,
          size: 5,
          sortBy: "createdAt",
          sortDirection: "DESC",
        })
      );
    }
  }, [book, dispatch]);

  const loadBookDetails = () => {
    dispatch(fetchBookById(id));
  };

  const loadReviews = () => {
    dispatch(
      fetchReviewsByBook({ bookId: id, filter: "ALL", page: 0, size: 10 })
    );
  };

  const loadRatingStats = () => {
    dispatch(fetchRatingStatistics(id));
  };

  const checkUserReadStatus = async () => {
    try {
      const result = await dispatch(checkCanReview(id)).unwrap();
      setHasRead(result.canReview);
    } catch (err) {
      console.error("Failed to check read status:", err);
      setHasRead(false);
    }
  };

  const loadUserReview = async () => {
    try {
      const result = await dispatch(
        fetchMyReviews({ page: 0, size: 100 })
      ).unwrap();
      // Find user's review for this specific book
      const myReviewForThisBook = result.content?.find(
        (review) => review.bookId === parseInt(id)
      );
      setUserReview(myReviewForThisBook || null);
    } catch (err) {
      console.error("Failed to load user review:", err);
      setUserReview(null);
    }
  };

  const handleOpenCheckout = () => {
    if(activeSubscription?.planId){
      setCheckoutDialog({ open: true, loading: false });
    }else{
      navigate("/subscriptions");
    }
    
  };

  const handleCloseCheckout = () => {
    setCheckoutDialog({ open: false, loading: false });
  };

  const handleConfirmCheckout = async (checkoutRequest) => {
    try {
      setCheckoutDialog({ ...checkoutDialog, loading: true });
      await dispatch(checkoutBook(checkoutRequest)).unwrap();
      showSnackbar(
        'Book checked out successfully! Check "My Loans" to view your loan.',
        "success"
      );
      setCheckoutDialog({ open: false, loading: false });
      loadBookDetails(); // Reload to update availability

      // Navigate to My Loans after a short delay
      setTimeout(() => {
        navigate("/my-loans");
      }, 2000);
    } catch (err) {
      setCheckoutDialog({ ...checkoutDialog, loading: false });
      showSnackbar(err.message || "Failed to checkout book", "error");
    }
  };

  const handleOpenReservation = () => {
    setReservationDialog({ open: true, loading: false });
  };

  const handleCloseReservation = () => {
    setReservationDialog({ open: false, loading: false });
  };

  const handleConfirmReservation = async (reservationRequest) => {
    console.log("reservationRequest -- ",reservationRequest);
    try {
      setReservationDialog({ ...reservationDialog, loading: true });
      await dispatch(createReservation(reservationRequest)).unwrap();
      showSnackbar(
        "Book reserved successfully! We'll notify you when it becomes available.",
        "success"
      );
      setReservationDialog({ open: false, loading: false });
      loadBookDetails(); // Reload to update availability
    } catch (err) {
      setReservationDialog({ ...reservationDialog, loading: false });
      showSnackbar(err.message || "Failed to reserve book", "error");
    }
  };

  const handleOpenReview = () => {
    if (!hasRead) {
      showSnackbar(
        "You can only review books you have read (returned)",
        "warning"
      );
      return;
    }
    setReviewDialog({ open: true, loading: false });
  };

  const handleCloseReview = () => {
    setReviewDialog({ open: false, loading: false });
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      setReviewDialog({ ...reviewDialog, loading: true });

      if (userReview) {
        // Update existing review
        await dispatch(
          updateReview({ reviewId: userReview.id, reviewData })
        ).unwrap();
        showSnackbar("Review updated successfully!", "success");
      } else {
        // Create new review - reviewData should include bookId
        await dispatch(
          createReview({ ...reviewData, bookId: parseInt(id) })
        ).unwrap();
        showSnackbar("Thank you for your review!", "success");
      }

      setReviewDialog({ open: false, loading: false });
      loadUserReview(); // Reload user's review
      loadReviews(); // Reload all reviews
      loadRatingStats(); // Reload rating statistics
    } catch (err) {
      setReviewDialog({ ...reviewDialog, loading: false });
      showSnackbar(err.message || "Failed to submit review", "error");
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    if (
      window.confirm(
        "Are you sure you want to delete your review? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteReview(userReview.id)).unwrap();
        showSnackbar("Review deleted successfully", "success");
        setUserReview(null);
        loadReviews(); // Reload all reviews
        loadRatingStats(); // Reload rating statistics
      } catch (err) {
        showSnackbar(err.message || "Failed to delete review", "error");
      }
    }
  };

  const handleToggleWishlist = () => {
    
    wishlistStatus[book.id]
      ? dispatch(removeFromWishlist(book.id))
      : dispatch(addToWishlist({bookId:book.id}));
    showSnackbar(
      wishlistStatus[book.id] ? "Removed from wishlist" : "Added to wishlist",
      "success"
    );
  };

  useEffect(()=>{
    if(book?.id){
      dispatch(checkIfInWishlist(book?.id))
    }
  },[book?.id,dispatch])

     useEffect(() => {
    dispatch(fetchActiveSubscription());
  }, [dispatch]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.title,
        text: `Check out "${book?.title}" by ${book?.author}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSnackbar("Link copied to clipboard!", "success");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateAverageRating = () => {
    // Use API rating statistics if available
    if (ratingStatistics && ratingStatistics.averageRating) {
      return ratingStatistics.averageRating.toFixed(1);
    }
    // Fallback to calculating from reviews
    if (reviews && reviews.length === 0) return 0;
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / reviews.length).toFixed(1);
    }
    return 0;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <CircularProgress size={60} sx={{ color: "#4F46E5" }} />
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert severity="error" className="mb-6">
            {error || "Book not found"}
          </Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/books")}
            variant="contained"
            sx={{ bgcolor: "#4F46E5" }}
          >
            Back to Books
          </Button>
        </div>
      </Layout>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const averageRating = calculateAverageRating();

  return (
    <Layout>
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        {/* Header with Back Button */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/books")}
              sx={{ color: "#4F46E5", fontWeight: 600 }}
            >
              Back to Books
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Book Overview Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Book Cover */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden shadow-lg">
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <LocalLibraryIcon
                          sx={{ fontSize: 120, color: "#4F46E5", opacity: 0.3 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">

                    {book.alreadyHaveLoan?
                    <div>
                      <Button
                          fullWidth
                          variant="contained"
                          size="large"
                        color="success"
                          startIcon={<TaskAlt/>}
                          sx={{
                          
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": {
                              
                              transform: "scale(1.02)",
                            },
                            transition: "all 0.2s",
                          }}
                        >
                          Borrowed
                        </Button>
                    </div>: book.alreadyHaveReservation?<div>
                         <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<Check />}
                        sx={{
                          // bgcolor: "#F59E0B",
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "#D97706",
                            transform: "scale(1.02)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        Reserved
                      </Button>
                    </div> : isAvailable ? (
                      <div>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={handleOpenCheckout}
                          startIcon={<LocalLibraryIcon />}
                          sx={{
                            // bgcolor: "#4F46E5",
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": {
                              bgcolor: "#4338CA",
                              transform: "scale(1.02)",
                            },
                            transition: "all 0.2s",
                          }}
                        >
                          Checkout This Book
                        </Button>
                      </div>
                    ) : (
                    <div>
                        <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={handleOpenReservation}
                        sx={{
                        
                          py: 1.5,
                          fontSize: "1rem",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "#D97706",
                            transform: "scale(1.02)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        Reserve This Book
                      </Button>
                    </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outlined"
                        onClick={handleToggleWishlist}
                        sx={{
                          borderColor: "#E5E7EB",
                          color: wishlistStatus[book.id] ? "#DC2626" : "#6B7280",
                        }}
                      >
                        {wishlistStatus[book.id] ? (
                          <FavoriteIcon sx={{ color: "#DC2626" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleShare}
                        sx={{ borderColor: "#E5E7EB", color: "#6B7280" }}
                      >
                        <ShareIcon />
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handlePrint}
                        sx={{ borderColor: "#E5E7EB", color: "#6B7280" }}
                      >
                        <PrintIcon />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Information */}
              <div className="lg:col-span-2">
                {/* Title and Author */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {book.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-lg text-gray-600 mb-4">
                    <PersonIcon sx={{ fontSize: 20 }} />
                    <span>by {book.author}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Rating
                        value={parseFloat(averageRating)}
                        precision={0.1}
                        readOnly
                      />
                      <span className="text-lg font-semibold text-gray-900">
                        {averageRating}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      ({ratingStatistics?.totalReviews || reviews?.length || 0}{" "}
                      reviews)
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="mb-4">
                    {isAvailable ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={`${book.availableCopies} of ${book.totalCopies} copies available`}
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : (
                      <Chip
                        icon={<CancelIcon />}
                        label="Currently Checked Out"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </div>
                </div>

                <Divider className="my-6" />

                {/* Book Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CategoryIcon className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Genre</p>
                        <p className="font-semibold text-gray-900">
                          {book.genreName || "General"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CalendarTodayIcon className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">ISBN</p>
                        <p className="font-semibold text-gray-900">
                          {book.isbn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <LocalLibraryIcon className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Publisher</p>
                        <p className="font-semibold text-gray-900">
                          {book.publisher || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CalendarTodayIcon className="text-indigo-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Publication Date
                        </p>
                        <p className="font-semibold text-gray-900">
                          {book.publicationDate
                            ? new Date(
                                book.publicationDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider className="my-6" />

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    About This Book
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description ||
                      "No description available for this book."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up animation-delay-200">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  },
                  "& .Mui-selected": {
                    color: "#4F46E5",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#4F46E5",
                  },
                }}
              >
                <Tab label="Reviews" />
                <Tab label="Related Books" />
                <Tab label="Loan History" />
              </Tabs>
            </Box>

            {/* Reviews Tab */}
            {activeTab === 0 && (
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Reader Reviews
                    </h3>
                    <p className="text-gray-600">
                      See what others are saying about this book
                    </p>
                  </div>
                  <Button
                    variant="contained"
                    startIcon={<StarIcon />}
                    onClick={handleOpenReview}
                    disabled={!hasRead}
                    sx={{
                      bgcolor: hasRead ? "#4F46E5" : "#E5E7EB",
                      color: hasRead ? "white" : "#9CA3AF",
                      "&:hover": {
                        bgcolor: hasRead ? "#4338CA" : "#E5E7EB",
                      },
                    }}
                  >
                    {userReview ? "Edit Review" : "Write a Review"}
                  </Button>
                </div>

                {/* Info message if user hasn't read the book */}
                {!hasRead && (
                  <Alert severity="info" className="mb-6">
                    <strong>Want to write a review?</strong> You can review this
                    book after you've checked it out and returned it.
                  </Alert>
                )}

                {/* User's own review (if exists) */}
                {userReview && (
                  <div className="mb-6">
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-indigo-900 flex items-center space-x-2">
                          <StarIcon sx={{ color: "#4F46E5" }} />
                          <span>Your Review</span>
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleOpenReview}
                            sx={{
                              borderColor: "#4F46E5",
                              color: "#4F46E5",
                              fontSize: "0.875rem",
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={handleDeleteReview}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <Rating
                          value={userReview.rating}
                          readOnly
                          size="small"
                        />
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {userReview.reviewText}
                      </p>
                      <p className="text-sm text-indigo-600 mt-3">
                        Reviewed on{" "}
                        {new Date(userReview.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Community Reviews (
                    {ratingStatistics?.totalReviews || reviews?.length || 0})
                  </h4>
                </div>

                {reviewsLoading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-xl p-6 animate-pulse"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar
                              sx={{
                                bgcolor: "#4F46E5",
                                width: 48,
                                height: 48,
                              }}
                            >
                              {review.userName
                                ? review.userName.charAt(0).toUpperCase()
                                : "U"}
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {review.userName || "Anonymous User"}
                                </h4>
                                <span className="text-sm text-gray-600">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center mb-3">
                                <Rating
                                  value={review.rating}
                                  readOnly
                                  size="small"
                                />
                              </div>

                              <p className="text-gray-700 leading-relaxed">
                                {review.reviewText}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {ratingStatistics?.totalReviews > 10 && (
                      <div className="mt-8 text-center">
                        <Button
                          variant="outlined"
                          onClick={() => loadReviews()}
                          sx={{
                            borderColor: "#4F46E5",
                            color: "#4F46E5",
                            fontWeight: 600,
                            px: 4,
                          }}
                        >
                          Load More Reviews
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      No reviews yet. Be the first to review this book!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Related Books Tab */}
            {activeTab === 1 && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    You Might Also Like
                  </h3>
                  <p className="text-gray-600">Books from the same genre</p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : relatedBooks && relatedBooks.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedBooks
                      .filter((relatedBook) => relatedBook.id !== parseInt(id))
                      .slice(0, 4)
                      .map((relatedBook) => (
                        <div
                          key={relatedBook.id}
                          onClick={() => navigate(`/books/${relatedBook.id}`)}
                          className="group cursor-pointer"
                        >
                          <div className="aspect-[3/4] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow">
                            {relatedBook.coverImageUrl ||
                            relatedBook.coverImage ? (
                              <img
                                src={
                                  relatedBook.coverImageUrl ||
                                  relatedBook.coverImage
                                }
                                alt={relatedBook.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <LocalLibraryIcon
                                  sx={{
                                    fontSize: 60,
                                    color: "#4F46E5",
                                    opacity: 0.3,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {relatedBook.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {relatedBook.author}
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LocalLibraryIcon
                      sx={{ fontSize: 64, color: "#9CA3AF", mb: 2 }}
                    />
                    <p className="text-gray-600">No related books found</p>
                  </div>
                )}
              </div>
            )}

            {/* Loan History Tab */}
            {activeTab === 2 && (
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Loan History
                  </h3>
                  <p className="text-gray-600">
                    Recent borrowing activity for this book
                  </p>
                </div>

                <div className="text-center py-12">
                  <LocalLibraryIcon
                    sx={{ fontSize: 64, color: "#9CA3AF", mb: 2 }}
                  />
                  <p className="text-gray-600">
                    Loan history is only visible to library staff
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={checkoutDialog.open}
        onClose={handleCloseCheckout}
        onConfirm={handleConfirmCheckout}
        book={book}
        loading={checkoutDialog.loading}
      />

      {/* Reservation Dialog */}
      <ReservationDialog
        open={reservationDialog.open}
        onClose={handleCloseReservation}
        onConfirm={handleConfirmReservation}
        book={book}
        loading={reservationDialog.loading}
      />

      {/* Review Dialog */}
      <ReviewDialog
        open={reviewDialog.open}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
        book={book}
        existingReview={userReview}
        loading={reviewDialog.loading}
      />

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
          sx={{ width: "100%", boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default BookDetailsPage;
