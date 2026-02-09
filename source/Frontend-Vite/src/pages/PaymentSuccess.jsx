import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { verifyPayment } from "../store/features/payments/paymentThunk";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { subscriptionId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Extract payment details from URL parameters
    const razorpayPaymentId = searchParams.get("razorpay_payment_id");
    const razorpayPaymentLinkId = searchParams.get("razorpay_payment_link_id");
    const razorpayPaymentLinkStatus = searchParams.get(
      "razorpay_payment_link_status"
    );
    const razorpaySignature = searchParams.get("razorpay_signature");

    setPaymentDetails({
      paymentId: razorpayPaymentId,
      paymentLinkId: razorpayPaymentLinkId,
      status: razorpayPaymentLinkStatus,
      signature: razorpaySignature,
      subscriptionId: subscriptionId,
    });

    const verifyRequest = {
      paymentId: 1,
      gateway: "RAZORPAY",
      razorpayPaymentId: razorpayPaymentId,
      razorpaySignature: razorpaySignature,
      subscriptionId
      
    };

    console.log("verifyRequest", verifyRequest);

    // Refresh subscriptions after payment
    if (razorpayPaymentLinkStatus === "paid") {
      dispatch(verifyPayment(verifyRequest));
    }

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [searchParams, subscriptionId, dispatch]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewSubscriptions = () => {
    navigate("/subscriptions");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} sx={{ color: "#4F46E5" }} />
          <Typography variant="h6" className="mt-4 text-gray-600">
            Processing your payment...
          </Typography>
        </div>
      </div>
    );
  }

  const isSuccess = paymentDetails?.status === "paid";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            animation: "fadeInUp 0.6s ease-out",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              bgcolor: isSuccess ? "#10B981" : "#EF4444",
              color: "white",
              py: 4,
              px: 3,
              textAlign: "center",
            }}
          >
            {isSuccess ? (
              <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 80, mb: 2 }} />
            )}
            <Typography variant="h4" fontWeight="bold">
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              {isSuccess
                ? "Your subscription has been activated successfully"
                : "There was an issue processing your payment"}
            </Typography>
          </Box>

          {/* Details Section */}
          <Box sx={{ p: 4 }}>
            {isSuccess ? (
              <>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your payment! Your subscription is now active.
                </Alert>

                <Box className="space-y-3">
                  <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="body2" color="text.secondary">
                      Payment ID
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      className="font-mono"
                    >
                      {paymentDetails?.paymentId}
                    </Typography>
                  </Box>

                  <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="body2" color="text.secondary">
                      Subscription ID
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {paymentDetails?.subscriptionId}
                    </Typography>
                  </Box>

                  <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      sx={{ color: "#10B981", textTransform: "capitalize" }}
                    >
                      {paymentDetails?.status}
                    </Typography>
                  </Box>

                  {user && (
                    <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <Typography variant="body2" color="text.secondary">
                        Account
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {user.email || user.fullName}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 4, p: 3, bgcolor: "#EEF2FF", borderRadius: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    What's Next?
                  </Typography>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• You can now access all premium features</li>
                    <li>• Borrow books according to your subscription plan</li>
                    <li>• Manage your subscription from your account</li>
                    <li>• Receipt has been sent to your email</li>
                  </ul>
                </Box>
              </>
            ) : (
              <>
                <Alert severity="error" sx={{ mb: 3 }}>
                  Your payment could not be processed. Please try again or
                  contact support.
                </Alert>

                {paymentDetails?.paymentId && (
                  <Box className="space-y-3">
                    <Box className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <Typography variant="body2" color="text.secondary">
                        Reference ID
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        className="font-mono"
                      >
                        {paymentDetails?.paymentId}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ mt: 4, p: 3, bgcolor: "#FEF2F2", borderRadius: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Need Help?
                  </Typography>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• Check your payment details and try again</li>
                    <li>• Contact your bank for transaction status</li>
                    <li>• Reach out to our support team for assistance</li>
                  </ul>
                </Box>
              </>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                fullWidth
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                sx={{
                  bgcolor: "#4F46E5",
                  color: "white",
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "0.75rem",
                  "&:hover": {
                    bgcolor: "#4338CA",
                  },
                }}
              >
                Go to Dashboard
              </Button>

              {isSuccess && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  onClick={handleViewSubscriptions}
                  sx={{
                    borderColor: "#4F46E5",
                    color: "#4F46E5",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "0.75rem",
                    "&:hover": {
                      borderColor: "#4338CA",
                      bgcolor: "#EEF2FF",
                    },
                  }}
                >
                  View Subscriptions
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Additional Information */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {isSuccess
              ? "A confirmation email has been sent to your registered email address."
              : "If you continue to face issues, please contact our support team."}
          </Typography>
        </Box>
      </Container>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
