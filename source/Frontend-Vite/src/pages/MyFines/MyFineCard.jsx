import {
  CheckCircle,
  Info,
  Payment,
  Warning,
  Receipt,
  CalendarToday,
  TrendingUp,
  CheckCircleOutline,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
  LinearProgress,
  Stack,
  alpha,
} from "@mui/material";
import React from "react";
import { getTypeChip } from "./getTypeChip";
import InfoItem from "./InfoItem";

const MyFineCard = ({ fine, handlePayFine }) => {
  const getStatusConfig = (status) => {
    const statusMap = {
      PENDING: {
        color: "warning",
        bgGradient: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
        icon: <Warning fontSize="small" />,
        label: "Pending Payment",
        borderColor: "#FF9800",
      },
      PARTIALLY_PAID: {
        color: "info",
        bgGradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
        icon: <Info fontSize="small" />,
        label: "Partially Paid",
        borderColor: "#2196F3",
      },
      PAID: {
        color: "success",
        bgGradient: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
        icon: <CheckCircle fontSize="small" />,
        label: "Paid in Full",
        borderColor: "#4CAF50",
      },
      WAIVED: {
        color: "default",
        bgGradient: "linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)",
        icon: <CheckCircleOutline fontSize="small" />,
        label: "Waived",
        borderColor: "#9E9E9E",
      },
    };
    return (
      statusMap[status] || {
        color: "default",
        bgGradient: "linear-gradient(135deg, #FAFAFA 0%, #EEEEEE 100%)",
        icon: null,
        label: status,
        borderColor: "#BDBDBD",
      }
    );
  };

  const statusConfig = getStatusConfig(fine.status);
  const paymentPercentage =
    fine.amount > 0 ? (fine.amountPaid / fine.amount) * 100 : 0;



  return (
    <Card
      sx={{
        position: "relative",
        overflow: "visible",
        borderRadius: 3,
        border: `2px solid ${alpha(statusConfig.borderColor, 0.2)}`,
        background: "#fff",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: `0 12px 40px ${alpha(statusConfig.borderColor, 0.25)}`,
          transform: "translateY(-4px)",
          borderColor: alpha(statusConfig.borderColor, 0.4),
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: statusConfig.bgGradient,
          borderRadius: "12px 12px 0 0",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pt: { xs: 3.5, sm: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Receipt sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    letterSpacing: 1.2,
                  }}
                >
                  Fine #{fine.id}
                </Typography>
              </Stack>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  background: `linear-gradient(135deg, #1a237e 0%, #283593 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                {fine.bookTitle || `Fine #${fine.id}`}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              sx={{
                background: statusConfig.bgGradient,
                border: `1.5px solid ${statusConfig.borderColor}`,
                fontWeight: 700,
                fontSize: "0.813rem",
                px: 0.5,
                "& .MuiChip-icon": {
                  color: statusConfig.borderColor,
                },
              }}
            />
            {getTypeChip(fine.type)}
          </Stack>
        </Box>

        {/* Payment Progress Bar */}
        {(fine.status === "PENDING" || fine.status === "PARTIALLY_PAID") && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                Payment Progress
              </Typography>
              <Typography variant="caption" fontWeight={700} color="primary">
                {paymentPercentage.toFixed(0)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={paymentPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha("#000", 0.06),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
                },
              }}
            />
          </Box>
        )}

        {/* Reason and Notes */}
        {(fine.reason || fine.notes) && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              background: alpha("#2196F3", 0.04),
              border: `1px solid ${alpha("#2196F3", 0.1)}`,
            }}
          >
            {fine.reason && (
              <Typography variant="body2" color="text.primary" sx={{ mb: fine.notes ? 1 : 0 }}>
                <strong style={{ color: "#1976d2" }}>Reason:</strong> {fine.reason}
              </Typography>
            )}
            {fine.notes && (
              <Typography variant="body2" color="text.primary">
                <strong style={{ color: "#1976d2" }}>Notes:</strong> {fine.notes}
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={{ my: 3, borderColor: alpha("#000", 0.08) }} />

        {/* Amount Details Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <InfoItem
              icon={<TrendingUp fontSize="small" />}
              label="Total Amount"
              value={`₹${parseFloat(fine.amount).toFixed(2)}`}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoItem
              icon={<CheckCircle fontSize="small" />}
              label="Amount Paid"
              value={`₹${parseFloat(fine.amountPaid || 0).toFixed(2)}`}
              color="#16A34A"
              highlight={fine.amountPaid > 0}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoItem
              icon={<Warning fontSize="small" />}
              label="Outstanding"
              value={`₹${parseFloat(fine.amountOutstanding || 0).toFixed(2)}`}
              color="#DC2626"
              highlight={fine.amountOutstanding > 0}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoItem
              icon={<CalendarToday fontSize="small" />}
              label="Created Date"
              value={
                fine.createdAt
                  ? new Date(fine.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "-"
              }
            />
          </Grid>
        </Grid>

        {/* Action Section */}
        <Box>
          {(fine.status === "PENDING" || fine.status === "PARTIALLY_PAID") && (
            <Button
              variant="contained"
            
              size="large"
              startIcon={<Payment />}
              onClick={() => handlePayFine(fine)}
              sx={{
                py: 1.8,
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: 2,
                background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                boxShadow: `0 4px 14px ${alpha("#DC2626", 0.4)}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${alpha("#DC2626", 0.5)}`,
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              Pay Outstanding Amount: ${parseFloat(fine.amountOutstanding).toFixed(2)}
            </Button>
          )}
          {fine.status === "PAID" && (
            <Alert
              severity="success"
              icon={<CheckCircle />}
              sx={{
                borderRadius: 2,
                border: `2px solid ${alpha("#4CAF50", 0.3)}`,
                background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
                "& .MuiAlert-icon": {
                  fontSize: 28,
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#2E7D32" }}>
                This fine has been paid in full
              </Typography>
              <Typography variant="caption" sx={{ color: "#558B2F" }}>
                Thank you for your payment!
              </Typography>
            </Alert>
          )}
          {fine.status === "WAIVED" && (
            <Alert
              severity="info"
              icon={<CheckCircleOutline />}
              sx={{
                borderRadius: 2,
                border: `2px solid ${alpha("#2196F3", 0.3)}`,
                background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
                "& .MuiAlert-icon": {
                  fontSize: 28,
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#1565C0" }}>
                This fine has been waived
              </Typography>
              <Typography variant="caption" sx={{ color: "#1976D2" }}>
                No payment is required
              </Typography>
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MyFineCard;
