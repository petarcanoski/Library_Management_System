import React, { useState } from 'react';
// import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaymentIcon from '@mui/icons-material/Payment';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { getDurationText } from '../../utils/getDuration';

/**
 * SubscribeDialog Component
 * Modal dialog for subscribing to a new plan or upgrading
 *
 * @param {boolean} open - Dialog visibility
 * @param {Function} onClose - Close handler
 * @param {Function} onConfirm - Confirm subscription handler
 * @param {Object} plan - Selected subscription plan
 * @param {Object} currentSubscription - User's current active subscription
 * @param {boolean} loading - Loading state during subscription
 */
const SubscribeDialog = ({
  open,
  onClose,
  onConfirm,
  plan,
  currentSubscription = null,
  loading = false,
}) => {
  const [paymentGateway, setPaymentGateway] = useState('STRIPE');

  // Determine if this is an upgrade
  const isUpgrade = currentSubscription && plan?.price > currentSubscription.subscriptionPlan?.price;
  const isDowngrade = currentSubscription && plan?.price < currentSubscription.subscriptionPlan?.price;
  const isSwitchPlan = currentSubscription && !isUpgrade && !isDowngrade;

  // Calculate price difference
  const priceDifference = currentSubscription
    ? Math.abs(plan?.price - currentSubscription.subscriptionPlan?.price)
    : 0;



  // Get plan color
  const getPlanColor = () => {
    const planName = plan?.name?.toLowerCase() || '';
    if (planName.includes('premium') || planName.includes('platinum')) {
      return '#7C3AED'; // Purple
    } else if (planName.includes('standard') || planName.includes('gold')) {
      return '#2563EB'; // Blue
    }
    return '#6B7280'; // Gray
  };

  const handleConfirm = () => {
    if (!plan) return;
    onConfirm({
      planId: plan.id,
      paymentGateway:"STRIPE",
    });
  };

    // const handleConfirm = async () => {
    //     if (!plan) return;
    //
    //     try {
    //         const response = await fetch(
    //             "http://localhost:5000/api/payments/stripe",
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`, // if needed
    //                 },
    //                 body: JSON.stringify({
    //                     planName: plan.name,
    //                     amount: plan.price,
    //                 }),
    //             }
    //         );
    //
    //         const data = await response.json();
    //
    //         if (data.checkoutUrl) {
    //             window.location.href = data.checkoutUrl; // 🚀 STRIPE OPENS
    //         } else {
    //             console.error("No checkoutUrl returned", data);
    //         }
    //     } catch (err) {
    //         console.error("Stripe checkout failed", err);
    //     }
    // };



    const planColor = getPlanColor();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: `${planColor}10`,
          borderBottom: `2px solid ${planColor}30`,
          pr: 6,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUpgrade && <TrendingUpIcon sx={{ color: planColor }} />}
            {!isUpgrade && <PaymentIcon sx={{ color: planColor }} />}
            <Typography variant="h6" className="font-bold">
              {isUpgrade ? 'Upgrade Plan' : isSwitchPlan ? 'Switch Plan' : 'Subscribe to Plan'}
            </Typography>
          </div>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Upgrade Badge */}
        {isUpgrade && (
          <Alert severity="success" icon={<TrendingUpIcon />} sx={{ mb: 3 }}>
            <Typography variant="body2" className="font-semibold">
              You're upgrading! Get more features and save ${priceDifference.toFixed(2)}
            </Typography>
          </Alert>
        )}

        {/* Downgrade Warning */}
        {isDowngrade && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" className="font-semibold">
              Note: Switching to a lower-tier plan will reduce your benefits
            </Typography>
          </Alert>
        )}

        {/* Plan Summary */}
        <Box
          sx={{
            border: `2px solid ${planColor}30`,
            borderRadius: 2,
            p: 3,
            mb: 3,
            bgcolor: `${planColor}05`,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <Typography variant="h5" className="font-bold mb-1" sx={{ color: planColor }}>
                {plan?.name}
              </Typography>
              {plan?.description && (
                <Typography variant="body2" className="text-gray-600 mb-2">
                  {plan.description}
                </Typography>
              )}
            </div>
            <Chip
              label={getDurationText(plan)}
              size="small"
              sx={{
                bgcolor: planColor,
                color: 'white',
                fontWeight: 600,
              }}
            />
          </div>

          <Divider sx={{ my: 2 }} />

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <Typography variant="h4" className="font-bold text-gray-900">
              ${plan?.price?.toFixed(2)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              / {plan?.duration === 365 ? 'year' : 'month'}
            </Typography>
          </div>

          {/* Features */}
          <Typography variant="body2" className="font-semibold text-gray-900 mb-2">
            What you'll get:
          </Typography>
          <div className="space-y-2">
            {plan?.features?.split(',').map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircleIcon sx={{ fontSize: 18, color: planColor, mt: 0.2 }} />
                <Typography variant="body2" className="text-gray-700">
                  {feature.trim()}
                </Typography>
              </div>
            ))}
            {plan?.maxBooksAllowed > 0 && (
              <div className="flex items-start space-x-2">
                <CheckCircleIcon sx={{ fontSize: 18, color: planColor, mt: 0.2 }} />
                <Typography variant="body2" className="text-gray-700">
                  Borrow up to {plan.maxBooksAllowed} books at once
                </Typography>
              </div>
            )}
          </div>
        </Box>

        {/* Payment Gateway Selection */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" className="font-semibold text-gray-900 mb-2">
            Select Payment Method:
          </Typography>
          <RadioGroup
            value={paymentGateway}
            onChange={(e) => setPaymentGateway(e.target.value)}
          >
            <FormControlLabel
              value="STRIPE"
              control={<Radio sx={{ color: planColor, '&.Mui-checked': { color: planColor } }} />}
              label={<Typography variant="body2">Stripe</Typography>}
              sx={{
                border: '1px solid #E5E7EB',
                borderRadius: 1,
                px: 2,
                py: 1,
                mr: 0,
                bgcolor: paymentGateway === 'STRIPE' ? `${planColor}05` : 'transparent',
              }}
            />
          </RadioGroup>
        </Box>

        {/* Current Plan Comparison */}
        {currentSubscription && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="caption" className="text-gray-600 block mb-2">
                Current Plan
              </Typography>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <Typography variant="body2" className="font-semibold text-gray-900">
                    {currentSubscription.subscriptionPlan?.name}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600">
                    ${currentSubscription.subscriptionPlan?.price?.toFixed(2)} /{' '}
                    {currentSubscription.subscriptionPlan?.duration === 365 ? 'year' : 'month'}
                  </Typography>
                </div>
                {isUpgrade && (
                  <Chip
                    label={`Save $${priceDifference.toFixed(2)}`}
                    size="small"
                    color="success"
                  />
                )}
              </div>
            </Box>
          </>
        )}

        {/* Terms Notice */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="caption">
            By subscribing, you agree to our Terms of Service. Your subscription will auto-renew
            unless cancelled.
          </Typography>
        </Alert>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: '#F9FAFB',
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <Button onClick={onClose} disabled={loading} sx={{ color: '#6B7280' }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading || !plan}
          startIcon={isUpgrade ? <TrendingUpIcon /> : <PaymentIcon />}
          sx={{
            bgcolor: planColor,
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              bgcolor: planColor,
              filter: 'brightness(0.9)',
            },
          }}
        >
          {loading
            ? 'Processing...'
            : isUpgrade
            ? 'Upgrade Now'
            : isSwitchPlan
            ? 'Switch Plan'
            : 'Subscribe Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscribeDialog;
