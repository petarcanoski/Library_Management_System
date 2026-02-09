import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  LinearProgress,
  Chip,
  Grid,
} from '@mui/material';
import {
  Star as StarIcon,
  Verified as VerifiedIcon,
  RateReview as RateReviewIcon,
} from '@mui/icons-material';

export default function RatingStatistics({ statistics }) {
  if (!statistics) return null;

  const {
    averageRating,
    totalReviews,
    ratingDistribution,
    verifiedReaderReviews,
  } = statistics;

  // Calculate percentages for each rating
  const getRatingPercentage = (rating) => {
    if (!totalReviews) return 0;
    const count = ratingDistribution?.[rating] || 0;
    return (count / totalReviews) * 100;
  };

  const verifiedPercentage = totalReviews
    ? ((verifiedReaderReviews / totalReviews) * 100).toFixed(0)
    : 0;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #667eea08 0%, #764ba208 100%)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Grid container spacing={3}>
        {/* Overall Rating */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              py: 2,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1,
              }}
            >
              {averageRating.toFixed(1)}
            </Typography>
            <Rating
              value={averageRating}
              precision={0.1}
              readOnly
              size="large"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </Typography>
            {verifiedReaderReviews > 0 && (
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                label={`${verifiedPercentage}% Verified Readers`}
                color="success"
                size="small"
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        </Grid>

        {/* Rating Distribution */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Rating Breakdown
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution?.[rating] || 0;
              const percentage = getRatingPercentage(rating);

              return (
                <Box
                  key={rating}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: 70,
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, minWidth: 12 }}
                    >
                      {rating}
                    </Typography>
                    <StarIcon
                      sx={{
                        fontSize: 18,
                        color: 'warning.main',
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg,
                            ${rating >= 4 ? '#4caf50' : rating >= 3 ? '#ff9800' : '#f44336'} 0%,
                            ${rating >= 4 ? '#66bb6a' : rating >= 3 ? '#ffa726' : '#ef5350'} 100%
                          )`,
                        },
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: 60, textAlign: 'right' }}
                  >
                    {count} ({percentage.toFixed(0)}%)
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Summary Stats */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RateReviewIcon color="action" sx={{ fontSize: 20 }} />
              <Typography variant="body2">
                <strong>{totalReviews}</strong> Total Reviews
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedIcon color="success" sx={{ fontSize: 20 }} />
              <Typography variant="body2">
                <strong>{verifiedReaderReviews}</strong> Verified
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
