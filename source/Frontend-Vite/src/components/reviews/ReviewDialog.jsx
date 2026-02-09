import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Close as CloseIcon, Star as StarIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  updateReview,
} from "../../store/features/reviews/bookReviewThunk";

const ratingLabels = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function ReviewDialog({
  open,
  onClose,
  book,
  bookTitle,
  existingReview = null,
}) {
  const dispatch = useDispatch();
  const { submitLoading, error } = useSelector((state) => state.bookReviews);

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hover, setHover] = useState(-1);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [reviewText, setReviewText] = useState(
    existingReview?.reviewText || ""
  );
  const [titleError, setTitleError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const isEditMode = Boolean(existingReview);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title || "");
      setReviewText(existingReview.reviewText || "");
    }
  }, [existingReview]);

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else if (title.trim().length < 5) {
      setTitleError("Title must be at least 5 characters");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!reviewText.trim()) {
      setReviewError("Review text is required");
      isValid = false;
    } else if (reviewText.trim().length < 20) {
      setReviewError("Review must be at least 20 characters");
      isValid = false;
    } else {
      setReviewError("");
    }

    if (rating === 0) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const reviewData = {
      bookId:book?.id,
      rating,
      title: title.trim(),
      reviewText: reviewText.trim(),
    };

    console.log("review Data", reviewData);

    try {
      if (isEditMode) {
        await dispatch(
          updateReview({
            reviewId: existingReview.id,
            reviewData: {
              rating,
              title: title.trim(),
              reviewText: reviewText.trim(),
            },
          })
        ).unwrap();
      } else {
        await dispatch(createReview(reviewData)).unwrap();
      }
      handleClose();
    } catch (err) {
      // Error is handled by Redux state
      console.error("Review submission error:", err);
    }
  };

  const handleClose = () => {
    if (!submitLoading) {
      setRating(0);
      setTitle("");
      setReviewText("");
      setTitleError("");
      setReviewError("");
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
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {submitLoading && <LinearProgress />}

      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {isEditMode ? "Edit Your Review" : "Write a Review"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {bookTitle}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={submitLoading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Rating Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Your Rating *
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              onChangeActive={(event, newHover) => setHover(newHover)}
              size="large"
              precision={1}
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: 80 }}
            >
              {ratingLabels[hover !== -1 ? hover : rating] || "Select rating"}
            </Typography>
          </Box>
          {rating === 0 && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, display: "block" }}
            >
              Please select a rating
            </Typography>
          )}
        </Box>

        {/* Title Field */}
        <TextField
          fullWidth
          label="Review Title"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={Boolean(titleError)}
          helperText={titleError || `${title.length} characters`}
          required
          disabled={submitLoading}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 100 }}
        />

        {/* Review Text Field */}
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Your Review"
          placeholder="Share your thoughts about this book. What did you like or dislike?"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          error={Boolean(reviewError)}
          helperText={
            reviewError || `${reviewText.length} characters (minimum 20)`
          }
          required
          disabled={submitLoading}
          inputProps={{ maxLength: 2000 }}
        />

        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "info.lighter",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "info.light",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            <strong>Note:</strong> Only verified readers who have completed
            reading this book can write reviews. Your review helps other readers
            make informed decisions.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={submitLoading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitLoading || rating === 0}
          sx={{
            px: 4,
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #5568d3 30%, #6a4292 90%)",
            },
          }}
        >
          {isEditMode ? "Update Review" : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
