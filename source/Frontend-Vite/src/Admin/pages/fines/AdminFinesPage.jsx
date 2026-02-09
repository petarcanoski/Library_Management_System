import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Payment as PaymentIcon,
  Block as WaiveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/DataTable";
import {
  getAllFines,
  getTotalCollected,
  getTotalOutstanding,
  payFine,
  waiveFine,
  deleteFine,
} from "../../../store/features/fines/fineThunk";

export default function AdminFinesPage() {
  const dispatch = useDispatch();
  const { allFines, loading, totalElements, totalPages, currentPage, totalCollected, totalOutstanding } =
    useSelector((state) => state.fines);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Filter dialog
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Waive fine dialog
  const [waiveDialogOpen, setWaiveDialogOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [waiveReason, setWaiveReason] = useState("");

  useEffect(() => {
    loadFines();
    loadStatistics();
  }, [page, rowsPerPage, filterStatus, filterType, filterUserId]);

  const loadFines = () => {
    const params = {
      page,
      size: rowsPerPage,
    };

    if (filterStatus) params.status = filterStatus;
    if (filterType) params.type = filterType;
    if (filterUserId) params.userId = parseInt(filterUserId);

    dispatch(getAllFines(params));
  };

  const loadStatistics = () => {
    dispatch(getTotalCollected());
    dispatch(getTotalOutstanding());
  };

  const handlePayFine = async (fine) => {
    if (window.confirm(`Pay fine #${fine.id} (Amount: $${fine.amountOutstanding})?`)) {
      try {
        await dispatch(payFine({ fineId: fine.id })).unwrap();
        loadFines();
        loadStatistics();
      } catch (error) {
        console.error("Error paying fine:", error);
        alert(error || "Failed to pay fine");
      }
    }
  };

  const handleOpenWaiveDialog = (fine) => {
    setSelectedFine(fine);
    setWaiveReason("");
    setWaiveDialogOpen(true);
  };

  const handleWaiveFine = async () => {
    if (!waiveReason.trim()) {
      alert("Please provide a reason for waiving the fine");
      return;
    }

    try {
      await dispatch(
        waiveFine({
          fineId: selectedFine.id,
          reason: waiveReason,
        })
      ).unwrap();
      setWaiveDialogOpen(false);
      loadFines();
      loadStatistics();
    } catch (error) {
      console.error("Error waiving fine:", error);
      alert(error || "Failed to waive fine");
    }
  };

  const handleDeleteFine = async (fine) => {
    if (
      window.confirm(
        `Are you sure you want to delete fine #${fine.id}? This action cannot be undone.`
      )
    ) {
      try {
        await dispatch(deleteFine(fine.id)).unwrap();
        loadFines();
        loadStatistics();
      } catch (error) {
        console.error("Error deleting fine:", error);
        alert(error || "Failed to delete fine");
      }
    }
  };

  const handleApplyFilters = () => {
    setPage(0);
    loadFines();
  };

  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterType("");
    setFilterUserId("");
    setPage(0);
  };

  const getStatusChip = (status) => {
    const statusMap = {
      PENDING: { color: "warning", label: "Pending" },
      PARTIALLY_PAID: { color: "info", label: "Partially Paid" },
      PAID: { color: "success", label: "Paid" },
      WAIVED: { color: "default", label: "Waived" },
    };
    const config = statusMap[status] || { color: "default", label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getTypeChip = (type) => {
    const typeMap = {
      OVERDUE: { color: "error", label: "Overdue" },
      DAMAGE: { color: "warning", label: "Damage" },
      LOSS: { color: "error", label: "Loss" },
      PROCESSING: { color: "info", label: "Processing" },
    };
    const config = typeMap[type] || { color: "default", label: type };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const columns = [
    {
      field: "id",
      headerName: "Fine ID",
      minWidth: 80,
    },
    {
      field: "userName",
      headerName: "User",
      minWidth: 150,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2">{row.userName}</Typography>
          {row.userEmail && (
            <Typography variant="caption" color="text.secondary">
              {row.userEmail}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "bookTitle",
      headerName: "Book",
      minWidth: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2">{row.bookTitle || "N/A"}</Typography>
          {row.bookIsbn && (
            <Typography variant="caption" color="text.secondary">
              ISBN: {row.bookIsbn}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      renderCell: (row) => getTypeChip(row.type),
    },
    {
      field: "amount",
      headerName: "Amount",
      renderCell: (row) => (
        <Typography variant="body2" fontWeight="bold">
          ${parseFloat(row.amount).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "amountPaid",
      headerName: "Paid",
      renderCell: (row) => (
        <Typography variant="body2" color="success.main">
          ${parseFloat(row.amountPaid).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (row) => getStatusChip(row.status),
    },
    {
      field: "reason",
      headerName: "Reason",
      minWidth: 200,
      renderCell: (row) => (
        <Typography variant="caption" noWrap>
          {row.reason || "-"}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      renderCell: (row) => (
        <Typography variant="body2">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
        </Typography>
      ),
    },
  ];

  const customActions = (row) => (
    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
      {(row.status === "PENDING" || row.status === "PARTIALLY_PAID") && (
        <>
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<PaymentIcon />}
            onClick={() => handlePayFine(row)}
          >
            Pay
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<WaiveIcon />}
            onClick={() => handleOpenWaiveDialog(row)}
          >
            Waive
          </Button>
        </>
      )}
      <Button
        size="small"
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => handleDeleteFine(row)}
      >
        Delete
      </Button>
    </Box>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Fines Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor and manage all library fines
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              {allFines?.filter((f) => f.status === "PENDING").length || 0}
            </Typography>
            <Typography variant="body2">Pending Fines</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {allFines?.filter((f) => f.status === "PAID").length || 0}
            </Typography>
            <Typography variant="body2">Paid Fines</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "info.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "info.main" }}
            >
              ${parseFloat(totalCollected || 0).toFixed(2)}
            </Typography>
            <Typography variant="body2">Total Collected</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "error.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "error.main" }}
            >
              ${parseFloat(totalOutstanding || 0).toFixed(2)}
            </Typography>
            <Typography variant="body2">Total Outstanding</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => setFilterModalOpen(true)}
          sx={{ height: 56 }}
        >
          Filters
        </Button>
      </Box>

      {/* Filter Modal */}
      <Dialog
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Fines</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PARTIALLY_PAID">Partially Paid</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="WAIVED">Waived</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="OVERDUE">Overdue</MenuItem>
                  <MenuItem value="DAMAGE">Damage</MenuItem>
                  <MenuItem value="LOSS">Loss</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="User ID"
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                type="number"
                placeholder="Filter by user ID"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearFilters} startIcon={<FilterIcon />}>
            Clear Filters
          </Button>
          <Button onClick={() => setFilterModalOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleApplyFilters();
              setFilterModalOpen(false);
            }}
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={allFines || []}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalElements || 0}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        customActions={customActions}
      />

      {/* Waive Fine Dialog */}
      <Dialog
        open={waiveDialogOpen}
        onClose={() => setWaiveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Waive Fine</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>
            You are about to waive fine #{selectedFine?.id} for{" "}
            <strong>{selectedFine?.userName}</strong> (Amount: $
            {parseFloat(selectedFine?.amount || 0).toFixed(2)})
          </Alert>
          <TextField
            fullWidth
            required
            label="Reason for Waiver"
            multiline
            rows={3}
            value={waiveReason}
            onChange={(e) => setWaiveReason(e.target.value)}
            placeholder="Provide a reason for waiving this fine..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWaiveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleWaiveFine} variant="contained" color="warning">
            Waive Fine
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
