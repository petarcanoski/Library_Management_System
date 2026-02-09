import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  Box,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

/**
 * CancelSubscriptionDialog Component
 * Modal dialog for cancelling active subscription with reason
 *
 * @param {boolean} open - Dialog visibility
 * @param {Function} onClose - Close handler
 * @param {Function} onConfirm - Confirm cancellation handler
 * @param {Object} subscription - Active subscription to cancel
 * @param {boolean} loading - Loading state during cancellation
 */
const CancelSubscriptionDialog = ({
  open,
  onClose,
  onConfirm,
  subscription,
  loading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  // Predefined cancellation reasons
  const cancellationReasons = [
    'Too expensive',
    'Not using enough features',
    'Found a better alternative',
    'Temporarily not reading books',
    'Technical issues',
    'Other',
  ];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!subscription) return 0;
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const remaining = endDate - now;
    return Math.ceil(remaining / (1000 * 60 * 60 * 24));
  };

  const handleConfirm = () => {
    // Validate reason
    if (!selectedReason) {
      setError('Please select a reason for cancellation');
      return;
    }

    if (selectedReason === 'Other' && customReason.trim().length < 5) {
      setError('Please provide a reason (minimum 5 characters)');
      return;
    }

    setError('');

    // Determine final reason
    const reason = selectedReason === 'Other' ? customReason.trim() : selectedReason;

    onConfirm({
      subscriptionId: subscription.id,
      reason,
    });
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: '#FEE2E2',
          borderBottom: '2px solid #FECACA',
          pr: 6,
        }}
      >
        <div className="flex items-center gap-2">
          <ErrorOutlineIcon sx={{ color: '#EF4444' }} />
          <Typography variant="h6" className="font-bold">
            Cancel Subscription
          </Typography>
        </div>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Warning Alert */}
        <Alert severity="warning" icon={<ErrorOutlineIcon />} sx={{ mb: 3 }}>
          <Typography variant="body2" className="font-semibold mb-1">
            Are you sure you want to cancel?
          </Typography>
          <Typography variant="caption">
            Your subscription will remain active until{' '}
            <strong>{formatDate(subscription?.endDate)}</strong> ({daysRemaining} days remaining),
            but it won't auto-renew.
          </Typography>
        </Alert>

        {/* Current Plan Info */}
        <Box
          sx={{
            border: '1px solid #E5E7EB',
            borderRadius: 2,
            p: 3,
            mb: 3,
            bgcolor: '#F9FAFB',
          }}
        >
          <Typography variant="caption" className="text-gray-600 block mb-1">
            Current Plan
          </Typography>
          <Typography variant="h6" className="font-bold text-gray-900 mb-1">
            {subscription?.subscriptionPlan?.name}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            ${subscription?.subscriptionPlan?.price?.toFixed(2)} /{' '}
            {subscription?.subscriptionPlan?.duration === 365 ? 'year' : 'month'}
          </Typography>
        </Box>

        {/* What You'll Lose */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" className="font-semibold text-gray-900 mb-2">
            What you'll lose after {formatDate(subscription?.endDate)}:
          </Typography>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 pl-2">
            {subscription?.subscriptionPlan?.features?.split(',').map((feature, index) => (
              <li key={index}>{feature.trim()}</li>
            ))}
            {subscription?.subscriptionPlan?.maxBooksAllowed > 0 && (
              <li>Ability to borrow up to {subscription.subscriptionPlan.maxBooksAllowed} books</li>
            )}
          </ul>
        </Box>

        {/* Cancellation Reason */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" className="font-semibold text-gray-900 mb-2">
            Why are you cancelling? *
          </Typography>
          <RadioGroup
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setError('');
            }}
          >
            {cancellationReasons.map((reason) => (
              <FormControlLabel
                key={reason}
                value={reason}
                control={
                  <Radio
                    sx={{
                      color: '#EF4444',
                      '&.Mui-checked': { color: '#EF4444' },
                    }}
                  />
                }
                label={<Typography variant="body2">{reason}</Typography>}
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 1,
                  px: 2,
                  py: 0.5,
                  mb: 1,
                  mr: 0,
                  bgcolor: selectedReason === reason ? '#FEE2E2' : 'transparent',
                }}
              />
            ))}
          </RadioGroup>
        </Box>

        {/* Custom Reason Input */}
        {selectedReason === 'Other' && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Please tell us more"
            placeholder="Help us improve by sharing your feedback..."
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value);
              setError('');
            }}
            sx={{ mb: 2 }}
            helperText="Minimum 5 characters"
          />
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Retention Offer */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2" className="font-semibold mb-1">
            Consider downgrading instead?
          </Typography>
          <Typography variant="caption">
            You can switch to a lower-tier plan and keep some benefits at a reduced price.
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
        <Button onClick={handleClose} disabled={loading} sx={{ color: '#6B7280' }}>
          Keep Subscription
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading || !selectedReason}
          startIcon={<CancelIcon />}
          sx={{
            bgcolor: '#EF4444',
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              bgcolor: '#DC2626',
            },
            '&:disabled': {
              bgcolor: '#FCA5A5',
              color: 'white',
            },
          }}
        >
          {loading ? 'Cancelling...' : 'Confirm Cancellation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
