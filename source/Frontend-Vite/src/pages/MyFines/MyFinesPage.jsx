import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  FilterList as FilterIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import Layout from "../../components/layout/Layout";
import { getMyFines, payFine } from "../../store/features/fines/fineThunk";
import MyFineState from "./MyFineState";
import MyFineCard from "./MyFineCard";

import PaymentDialog from "./FinePaymentDialog";
import FinePaymentDialog from "./FinePaymentDialog";

const MyFinesPage = () => {
  const dispatch = useDispatch();
  const { myFines, loading } = useSelector((state) => state.fines);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [filteredFines, setFilteredFines] = useState([]);

  // Payment dialog
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    fine: null,
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadFines();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [myFines, statusFilter, typeFilter]);

  const loadFines = () => {
    dispatch(getMyFines({}));
  };

  const applyFilters = () => {
    let filtered = [...(myFines || [])];

    if (statusFilter) {
      filtered = filtered.filter((fine) => fine.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter((fine) => fine.type === typeFilter);
    }

    setFilteredFines(filtered);
  };

  const handlePayFine = (fine) => {
    setPaymentDialog({ open: true, fine });
  };

  const confirmPayment = async () => {
    try {
      await dispatch(payFine({ fineId: paymentDialog.fine.id })).unwrap();
      showSnackbar(
        `Fine of ₹${paymentDialog.fine.amountOutstanding.toFixed(
          2
        )} paid successfully!`,
        "success"
      );
      setPaymentDialog({ open: false, fine: null });
      loadFines();
    } catch (err) {
      showSnackbar(err || "Failed to process payment", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate total outstanding
  const totalOutstanding = filteredFines.reduce(
    (sum, fine) => sum + (fine.amountOutstanding || 0),
    0
  );

  const totalPaid = filteredFines.reduce(
    (sum, fine) => sum + (fine.amountPaid || 0),
    0
  );

  // Loading skeleton
  if (loading && (!myFines || myFines.length === 0)) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff8f0 100%)",
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3, lg: 4 } }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <ReceiptIcon sx={{ fontSize: 40, color: "#DC2626" }} />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #DC2626 0%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                My Fines
              </span>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage your library fines
            </Typography>
          </Box>

          {/* Stats Cards */}
          <MyFineState
            filteredFines={filteredFines}
            totalOutstanding={totalOutstanding}
            totalPaid={totalPaid}
          />

          {/* Filters */}
          <div className="mb-3">
            <div className="flex gap-3 items-center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "primary.main",
                }}
              >
                <FilterIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters
                </Typography>
              </Box>

              <div className="w-28">
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PARTIALLY_PAID">Partially Paid</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="WAIVED">Waived</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="w-28">
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="OVERDUE">Overdue</MenuItem>
                    <MenuItem value="DAMAGE">Damage</MenuItem>
                    <MenuItem value="LOSS">Loss</MenuItem>
                    <MenuItem value="PROCESSING">Processing</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {(statusFilter || typeFilter) && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setStatusFilter("");
                      setTypeFilter("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              )}
            </div>
          </div>

          {/* Fines List */}
          {filteredFines.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 80, color: "#16A34A", mb: 2 }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    No Fines Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {statusFilter || typeFilter
                      ? "No fines match your current filters."
                      : "You have no library fines. Keep up the good work!"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              {filteredFines.map((fine) => (
                <MyFineCard
                  key={fine.id}
                  fine={fine}
                  handlePayFine={handlePayFine}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Payment Dialog */}
      <FinePaymentDialog
        paymentDialog={paymentDialog}
        setPaymentDialog={setPaymentDialog}
        confirmPayment={confirmPayment}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default MyFinesPage;
