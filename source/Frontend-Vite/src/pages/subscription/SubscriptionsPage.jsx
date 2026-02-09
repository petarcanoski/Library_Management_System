import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// Redux thunks

// Components
import PlanCard from "../../components/subscriptions/PlanCard";
import ActiveSubscriptionCard from "../../components/subscriptions/ActiveSubscriptionCard";
import SubscribeDialog from "../../components/subscriptions/SubscribeDialog";
import CancelSubscriptionDialog from "../../components/subscriptions/CancelSubscriptionDialog";
import { fetchActivePlans } from "../../store/features/subscriptionPlans/subscriptionPlanThunk";
import {
  cancelSubscription,
  fetchActiveSubscription,
  renewSubscription,
  subscribe,
} from "../../store/features/subscriptions/subscriptionThunk";
import BenefitSection from "./BenefitSection";
import * as authUser from "date-fns/locale";

/**
 * SubscriptionsPage Component
 * Main page for managing subscription plans
 * Route: /subscriptions
 */
const SubscriptionsPage = () => {
  const dispatch = useDispatch();
  const { activeSubscription } = useSelector((state) => state.subscriptions);
  // Redux state
  const {
    activePlans: plans,
    loading,
    error,
  } = useSelector((state) => state.subscriptionPlans);

  // Local state
  const [subscribeDialog, setSubscribeDialog] = useState({
    open: false,
    plan: null,
    loading: false,
  });

  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    subscription: null,
    loading: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchActivePlans());
    dispatch(fetchActiveSubscription());
  }, [dispatch]);

  // Show snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Handle subscribe/upgrade click
  const handleSubscribeClick = (plan) => {
    setSubscribeDialog({
      open: true,
      plan,
      loading: false,
    });
  };

  // Handle subscribe confirmation
  const handleSubscribeConfirm = async ({ planId, paymentGateway }) => {
    setSubscribeDialog((prev) => ({ ...prev, loading: true }));

    try {
      const result = await dispatch(
        subscribe({
            planId,
            paymentGateway,
            userId: authUser.id,
        })
      ).unwrap();


      // Check if payment initiation was successful
      if (result.checkoutUrl) {
        // Redirect to payment gateway
        window.location.href = result.checkoutUrl;
      } else if (result.message) {
        showSnackbar(result.message, "success");
        setSubscribeDialog({ open: false, plan: null, loading: false });
        // Refresh subscriptions
        dispatch(fetchActiveSubscription());
      } else {
        showSnackbar(
          "Subscription initiated! Redirecting to payment...",
          "success"
        );
        setSubscribeDialog({ open: false, plan: null, loading: false });
      }
    } catch (err) {
      showSnackbar(
        err.message || "Failed to subscribe. Please try again.",
        "error"
      );
      setSubscribeDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handle renew subscription
  const handleRenewClick = async (subscription) => {
    try {
      const result = await dispatch(
        renewSubscription(subscription.id)
      ).unwrap();

      if (result.checkoutUrl) {
        // Redirect to payment gateway
        window.location.href = result.checkoutUrl;
      } else {
        showSnackbar("Subscription renewed successfully!", "success");
        dispatch(fetchActiveSubscription());
      }
    } catch (err) {
      showSnackbar(err.message || "Failed to renew subscription.", "error");
    }
  };

  // Handle cancel subscription click
  const handleCancelClick = (subscription) => {
    setCancelDialog({
      open: true,
      subscription,
      loading: false,
    });
  };

  // Handle cancel confirmation
  const handleCancelConfirm = async ({ subscriptionId, reason }) => {
    setCancelDialog((prev) => ({ ...prev, loading: true }));

    try {
      await dispatch(
        cancelSubscription({
          subscriptionId,
          reason,
        })
      ).unwrap();

      showSnackbar(
        "Subscription cancelled successfully. You can continue using it until the end date.",
        "success"
      );
      setCancelDialog({ open: false, subscription: null, loading: false });

      // Refresh subscriptions
      dispatch(fetchActiveSubscription());
    } catch (err) {
      showSnackbar(err.message || "Failed to cancel subscription.", "error");
      setCancelDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // Close dialogs
  const handleCloseSubscribeDialog = () => {
    if (!subscribeDialog.loading) {
      setSubscribeDialog({ open: false, plan: null, loading: false });
    }
  };

  const handleCloseCancelDialog = () => {
    if (!cancelDialog.loading) {
      setCancelDialog({ open: false, subscription: null, loading: false });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    dispatch(fetchActiveSubscription());
  }, []);

  // Loading state
  if (loading && !plans.length) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="flex justify-center items-center min-h-[400px]">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error && !plans.length) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error">
          <Typography variant="body1">
            Failed to load subscription plans
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Page Header with Gradient Background */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-100px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "800px",
              height: "800px",
              background:
                "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                p: 1.5,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
              }}
            >
              <WorkspacePremiumIcon sx={{ fontSize: 40, color: "#667eea" }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Subscription Plans
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: "700px",
                mx: "auto",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Choose the perfect plan for your reading journey. Upgrade,
              downgrade, or cancel anytime.
            </Typography>
          </Box>
        </Box>

        {/* Active Subscription Card */}
        <div className="flex flex-col justify-center items-center py-10 rounded-md bg-gradient-to-br from-indigo-600 to-pink-400 my-10">
          <div className="max-w-4xl">
            {activeSubscription && (
              <ActiveSubscriptionCard
                subscription={activeSubscription}
                onRenew={handleRenewClick}
                onCancel={handleCancelClick}
                loading={loading}
              />
            )}
          </div>
        </div>

        {/* Available Plans Section */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            {activeSubscription ? "Available Plans" : "Choose Your Plan"}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
            {activeSubscription
              ? "Compare and switch to a different plan"
              : "Select a plan that fits your reading habits"}
          </Typography>
        </Box>

        {/* Plans Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {plans?.map((plan) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
              <PlanCard
                plan={plan}
                onSubscribe={handleSubscribeClick}
                loading={loading}
              />
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {!loading && plans.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              px: 3,
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <WorkspacePremiumIcon
              sx={{ fontSize: 80, color: "action.disabled", mb: 3 }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
            >
              No plans available at the moment
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Please check back later for subscription options.
            </Typography>
          </Box>
        )}

        {/* Benefits Section with Modern Cards */}
        <BenefitSection />

        {/* Subscribe Dialog */}
        <SubscribeDialog
          open={subscribeDialog.open}
          onClose={handleCloseSubscribeDialog}
          onConfirm={handleSubscribeConfirm}
          plan={subscribeDialog.plan}
          currentSubscription={activeSubscription}
          loading={subscribeDialog.loading}
        />

        {/* Cancel Subscription Dialog */}
        <CancelSubscriptionDialog
          open={cancelDialog.open}
          onClose={handleCloseCancelDialog}
          onConfirm={handleCancelConfirm}
          subscription={cancelDialog.subscription}
          loading={cancelDialog.loading}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
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
      </Container>
    </Box>
  );
};

export default SubscriptionsPage;
