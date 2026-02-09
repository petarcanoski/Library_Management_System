import React from 'react';
import { Card, CardContent, Button, Chip, Box, Typography, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { getDurationText } from '../../utils/getDuration';
import { useSelector } from 'react-redux';

/**
 * PlanCard Component
 * Displays a subscription plan with features and action button
 *
 * @param {Object} plan - Subscription plan object
 * @param {Object} activeSubscription - User's current subscription
 * @param {Function} onSubscribe - Callback when subscribe/upgrade is clicked
 * @param {boolean} loading - Loading state
 */
const PlanCard = ({ plan, onSubscribe, loading = false }) => {
  const { activeSubscription } = useSelector((state) => state.subscriptions);
  const isCurrentPlan = activeSubscription?.planId === plan.id;
  const canUpgrade = activeSubscription && plan.price > activeSubscription.subscriptionPlan?.price;
  const isFeatured = plan.isFeatured || plan.name?.toLowerCase().includes('premium');

  // Plan tier colors - Enhanced gradient themes
  const getPlanColor = () => {
    const planName = plan.name?.toLowerCase() || '';
    if (planName.includes('premium') || planName.includes('pro')) {
      return {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        lightGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        primary: '#667eea',
        secondary: '#764ba2',
        icon: '#7C3AED',
      };
    } else if (planName.includes('standard') || planName.includes('plus')) {
      return {
        gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        lightGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        primary: '#2563EB',
        secondary: '#3B82F6',
        icon: '#2563EB',
      };
    } else if (planName.includes('basic')) {
      return {
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        lightGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
        primary: '#10B981',
        secondary: '#059669',
        icon: '#10B981',
      };
    }
    return {
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      primary: '#6366F1',
      secondary: '#8B5CF6',
      icon: '#6366F1',
    };
  };

  const colors = getPlanColor();
  //   const showRenewButton = subscriptionStatus?.isExpiringSoon || subscriptionStatus?.isExpired;
  // const showCancelButton = subscriptionStatus?.isActive && subscription.status !== 'CANCELLED';

  const getButtonText = () => {
    if (isCurrentPlan) return 'Current Plan';
    if (canUpgrade) return 'Upgrade';
    if (activeSubscription) return 'Switch Plan';
    return 'Subscribe';
  };

  const getButtonIcon = () => {
    if (isCurrentPlan) return <CheckCircleIcon />;
    if (canUpgrade) return <TrendingUpIcon />;
    return null;
  };

  // Format duration text

  console.log("plan", plan)


  return (
    <Card
      elevation={isFeatured ? 8 : 2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isFeatured ? `2px solid ${colors.primary}` : '1px solid rgba(0,0,0,0.08)',
        transform: isFeatured ? 'scale(1.05)' : 'scale(1)',
        '&:hover': {
          transform: isCurrentPlan ? 'translateY(0)' : 'translateY(-8px)',
          boxShadow: isCurrentPlan ? 4 : 12,
        },
      }}
    >
      {/* Gradient Header */}
      <Box
        sx={{
          background: colors.gradient,
          py: 3,
          px: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
          },
        }}
      >
        {/* Badges Container */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {isFeatured && (
            <Chip
              icon={<StarIcon sx={{ fontSize: 14 }} />}
              label={plan.badgeText || "Most Popular"}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.25)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          )}
          {!isFeatured && plan.badgeText && (
            <Chip
              icon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
              label={plan.badgeText}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.25)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          )}
          {isCurrentPlan && (
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
              label="Active"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.9)',
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          )}
        </Box>

        {/* Plan Name & Duration */}
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 700,
            mb: 0.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {plan.name}
        </Typography>

        <Chip
          label={getDurationText(plan)}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      </Box>

      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Description */}
        {plan.description && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 3,
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            {plan.description}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: colors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {plan.currency} {plan.price}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              /{plan.durationDays === 365 ? 'year' : plan.durationDays === 30 ? 'mo' : `${plan.durationDays}d`}
            </Typography>
          </Box>
          {plan.monthlyEquivalentPrice && plan.durationDays !== 30 && (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              Equivalent to {plan.currency} {plan.monthlyEquivalentPrice?.toFixed(2)}/month
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Key Features with Icons */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              background: colors.lightGradient,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: colors.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoStoriesIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                Borrow Limit
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary }}>
                {plan.maxBooksAllowed} Books
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              background: colors.lightGradient,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: colors.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AccessTimeIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                Loan Duration
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary }}>
                {plan.maxDaysPerBook} Days/Book
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Additional Features List */}
        {plan.features && (
          <Box sx={{ mb: 3, flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
              What's Included:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {plan.features?.split(',').map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 18, color: colors.icon, mt: 0.2, flexShrink: 0 }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                    {feature.trim()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Action Button */}
        <Button
          fullWidth
          variant={isCurrentPlan ? 'outlined' : 'contained'}
          size="large"
          disabled={isCurrentPlan || loading}
          startIcon={getButtonIcon()}
          onClick={() => onSubscribe(plan)}
          sx={{
            py: 1.75,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: 2,
            textTransform: 'none',
            background: isCurrentPlan ? 'transparent' : colors.gradient,
            borderColor: isCurrentPlan ? colors.primary : 'transparent',
            color: isCurrentPlan ? colors.primary : 'white',
            boxShadow: isCurrentPlan ? 'none' : `0 4px 12px ${colors.primary}40`,
            '&:hover': {
              background: isCurrentPlan ? colors.lightGradient : colors.gradient,
              transform: 'translateY(-2px)',
              boxShadow: isCurrentPlan ? 'none' : `0 6px 20px ${colors.primary}60`,
            },
            '&:disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {getButtonText()}
        </Button>

              

        {canUpgrade && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'success.lighter',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: 'success.dark', fontWeight: 600 }}>
              💰 Save {plan.currency} {((plan.price - activeSubscription.subscriptionPlan.price) / 100).toFixed(2)} by upgrading!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;
