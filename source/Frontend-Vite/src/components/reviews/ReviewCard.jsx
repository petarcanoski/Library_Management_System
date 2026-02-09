import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Rating,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { markReviewAsHelpful, deleteReview } from '../../store/features/reviews/bookReviewThunk';

export default function ReviewCard({ review, onEdit, showBookInfo = false }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);

  const isMyReview = user?.id === review.userId;
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkHelpful = () => {
    if (!hasMarkedHelpful) {
      dispatch(markReviewAsHelpful(review.id));
      setHasMarkedHelpful(true);
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit && onEdit(review);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(review.id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            src={review.userProfilePicture}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              mr: 2,
            }}
          >
            {review.userName?.charAt(0)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {review.userName}
              </Typography>
              {review.verifiedReader && (
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                  label="Verified Reader"
                  size="small"
                  color="success"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              )}
              {isMyReview && (
                <Chip
                  label="You"
                  size="small"
                  color="primary"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating value={review.rating} readOnly size="small" precision={0.5} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(review.createdDate)}
              </Typography>
            </Box>
          </Box>

          {/* Menu */}
          {isMyReview && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Review
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Delete Review
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Book Info (if needed) */}
        {showBookInfo && review.bookTitle && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: 'action.hover',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {review.bookCoverImage && (
              <img
                src={review.bookCoverImage}
                alt={review.bookTitle}
                style={{
                  width: 40,
                  height: 56,
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
              />
            )}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {review.bookTitle}
              </Typography>
              {review.bookAuthor && (
                <Typography variant="caption" color="text.secondary">
                  by {review.bookAuthor}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Review Title */}
        {review.title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
              fontSize: '1.1rem',
            }}
          >
            {review.title}
          </Typography>
        )}

        {/* Review Text */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {review.reviewText}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleMarkHelpful}
              disabled={isMyReview || hasMarkedHelpful}
              color={hasMarkedHelpful ? 'primary' : 'default'}
            >
              {hasMarkedHelpful ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {review.helpfulCount || 0} found this helpful
            </Typography>
          </Box>

          {review.updatedDate && review.updatedDate !== review.createdDate && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Edited on {formatDate(review.updatedDate)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
