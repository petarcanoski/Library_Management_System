import { Alert } from '@mui/material';
import React, { useMemo } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';


const ActiveSubscriptionCard = ({ subscription, onRenew, onCancel, loading = false }) => {
  // Calculate subscription status
  const subscriptionStatus = useMemo(() => {
    if (!subscription) return null;

    const now = new Date();
    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);

    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    const daysRemaining = subscription.daysRemaining || 0;
    const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

    return {
      daysRemaining,
      progress,
      isExpiringSoon,
      isExpired: subscription.isExpired,
      isActive: subscription.isActive,
    };
  }, [subscription]);

  // Get plan tier color based on plan code
  const getPlanColor = () => {
    if (!subscription?.planCode) return { bg: 'bg-gray-600', border: 'border-gray-200', text: 'text-gray-600' };

    const planCode = subscription.planCode.toUpperCase();
    if (planCode.includes('GOLD') || planCode.includes('PREMIUM')) {
      return { bg: 'bg-amber-600', border: 'border-amber-200', text: 'text-amber-600', light: 'bg-amber-50' };
    } else if (planCode.includes('SILVER') || planCode.includes('STANDARD')) {
      return { bg: 'bg-gray-500', border: 'border-gray-200', text: 'text-gray-600', light: 'bg-gray-50' };
    } else if (planCode.includes('PLATINUM') || planCode.includes('PRO')) {
      return { bg: 'bg-purple-600', border: 'border-purple-200', text: 'text-purple-600', light: 'bg-purple-50' };
    }
    return { bg: 'bg-blue-600', border: 'border-blue-200', text: 'text-blue-600', light: 'bg-blue-50' };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format currency
  const formatPrice = (price, currency = 'INR') => {
    if (currency === 'INR') {
      return `₹${price}`;
    }
    return `$${(price / 100).toFixed(2)}`;
  };

  // Empty state
  if (!subscription) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
        <div className="text-center py-16 px-6 text-white">
          <AutoStoriesIcon className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">No Active Subscription</h2>
          <p className="text-indigo-100 max-w-md mx-auto">
            Subscribe to a plan to unlock premium features and borrow more books!
          </p>
        </div>
      </div>
    );
  }

  const planColors = getPlanColor();
  const showRenewButton = subscriptionStatus?.isExpiringSoon || subscriptionStatus?.isExpired;
  const showCancelButton = subscriptionStatus?.isActive && !subscription.cancelledAt;

  // Get status badge
  const StatusBadge = () => {
    if (subscription.cancelledAt || subscriptionStatus?.isExpired) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-600 text-white">
          <CloseIcon className="w-4 h-4 mr-1" />
          Cancelled
        </span>
      );
    }

    if (subscriptionStatus?.isExpiringSoon) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-500 text-white">
          <WarningAmberIcon className="w-4 h-4 mr-1" />
          Expiring Soon
        </span>
      );
    }

    if (subscriptionStatus?.isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500 text-white">
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          Active
        </span>
      );
    }

    return null;
  };

  return (
    <div className={`relative rounded-2xl border-2 ${planColors.border} ${planColors.light} shadow-lg mb-6`}>
      {/* Header Badge */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${planColors.bg} text-white shadow-md`}>
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          Your Active Plan
        </span>
      </div>

      <div className="pt-10 pb-6 px-6">
        {/* Plan Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h2 className={`text-3xl font-bold ${planColors.text}`}>
              {subscription.planName}
            </h2>
            <StatusBadge />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(subscription.price, subscription.currency)}
            </span>
            <span className="text-sm text-gray-600">/ month</span>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Subscription Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Start Date */}
          <div className="flex items-start gap-3">
            <CalendarMonthIcon className={`w-6 h-6 ${planColors.text} mt-0.5`} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Started</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(subscription.startDate)}
              </p>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-start gap-3">
            <CalendarMonthIcon className={`w-6 h-6 ${planColors.text} mt-0.5`} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">
                {subscriptionStatus?.isExpired ? 'Expired' : 'Expires'}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(subscription.endDate)}
              </p>
            </div>
          </div>

          {/* Books Allowed */}
          <div className="flex items-start gap-3">
            <AutoStoriesIcon className={`w-6 h-6 ${planColors.text} mt-0.5`} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Books Allowed</p>
              <p className="text-sm font-semibold text-gray-900">
                {subscription.maxBooksAllowed} books
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {subscriptionStatus?.isActive && !subscriptionStatus?.isExpired && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Subscription Progress</span>
              <span className={`text-xs font-semibold ${subscriptionStatus.isExpiringSoon ? 'text-amber-600' : planColors.text}`}>
                {subscriptionStatus.daysRemaining} days remaining
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${subscriptionStatus.isExpiringSoon ? 'bg-amber-500' : planColors.bg}`}
                style={{ width: `${subscriptionStatus.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Expiring Soon Alert */}
        {subscriptionStatus?.isExpiringSoon && (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r p-4 mb-6 flex items-start gap-3">
            <Alert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Your subscription is expiring soon!
              </p>
              <p className="text-xs text-amber-800">
                Renew now to continue enjoying premium features without interruption.
              </p>
            </div>
          </div>
        )}

        {/* Expired Alert */}
        {subscriptionStatus?.isExpired && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r p-4 mb-6 flex items-start gap-3">
            <CloseIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">
                Your subscription has expired
              </p>
              <p className="text-xs text-red-800">
                Renew your subscription to regain access to premium features.
              </p>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-3">Your Benefits:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckCircleIcon className={`w-5 h-5 ${planColors.text} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700">
                Borrow up to {subscription.maxBooksAllowed} books at once
              </span>
            </div>
            <div className="flex items-start gap-2">
              <AccessTimeIcon className={`w-5 h-5 ${planColors.text} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700">
                {subscription.maxDaysPerBook} days per book
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className={`w-5 h-5 ${planColors.text} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700">
                Priority support access
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircleIcon className={`w-5 h-5 ${planColors.text} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700">
                Exclusive member discounts
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {showRenewButton && (
            <button
              onClick={() => onRenew?.(subscription)}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 ${planColors.bg} text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <RefreshIcon className="w-5 h-5" />
              {loading ? 'Processing...' : 'Renew Subscription'}
            </button>
          )}

          {showCancelButton && (
            <button
              onClick={() => onCancel?.(subscription)}
              disabled={loading}
              className={`${showRenewButton ? '' : 'flex-1'} flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CloseIcon className="w-5 h-5" />
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



export default ActiveSubscriptionCard;