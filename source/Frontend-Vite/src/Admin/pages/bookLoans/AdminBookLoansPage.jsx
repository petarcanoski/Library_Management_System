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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Warning as DamageIcon,
  RemoveCircle as LossIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DataTable from "../../components/DataTable";
import {
  checkinBook,
  getAllBookLoans,
  renewCheckout,
  updateBookLoan,
} from "../../../store/features/bookLoans/bookLoanThunk";
import { createFine } from "../../../store/features/fines/fineThunk";

export default function AdminBookLoansPage() {
  const dispatch = useDispatch();
  const { allLoans, loading, totalElements, totalPages, currentPage } =
    useSelector((state) => state.bookLoans);

  // Basic filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Advanced filters
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [unpaidFinesOnly, setUnpaidFinesOnly] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("DESC");

  // Dialog state
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [extensionDays, setExtensionDays] = useState(7);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: "",
    dueDate: null,
    returnDate: null,
    maxRenewals: "",
    fineAmount: "",
    finePaid: false,
    notes: "",
  });

  // Create fine dialog state
  const [createFineDialogOpen, setCreateFineDialogOpen] = useState(false);
  const [fineType, setFineType] = useState(""); // "DAMAGE" or "LOSS"
  const [createFineFormData, setCreateFineFormData] = useState({
    amount: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    loadLoans();
  }, [
    page,
    rowsPerPage,
    filterStatus,
    overdueOnly,
    unpaidFinesOnly,
    sortBy,
    sortDirection,
  ]);

  const loadLoans = () => {
    const searchRequest = {
      page,
      size: rowsPerPage,
      sortBy,
      sortDirection,
    };

    // Only add filters if they have values
    if (userId) searchRequest.userId = parseInt(userId);
    if (bookId) searchRequest.bookId = parseInt(bookId);
    if (filterStatus) searchRequest.status = filterStatus;
    if (overdueOnly) searchRequest.overdueOnly = overdueOnly;
    if (unpaidFinesOnly) searchRequest.unpaidFinesOnly = unpaidFinesOnly;
    if (startDate)
      searchRequest.startDate = dayjs(startDate).format("YYYY-MM-DD");
    if (endDate) searchRequest.endDate = dayjs(endDate).format("YYYY-MM-DD");

    dispatch(getAllBookLoans(searchRequest));
  };

  const handleApplyFilters = () => {
    setPage(0); // Reset to first page when applying filters
    loadLoans();
  };

  const handleReturn = async (loan) => {
    if (window.confirm(`Mark loan #${loan.id} as returned?`)) {
      try {
        await dispatch(checkinBook({ bookLoanId: loan.id })).unwrap();
        loadLoans();
      } catch (error) {
        console.error("Error returning book:", error);
      }
    }
  };

  const handleOpenExtendDialog = (loan) => {
    setSelectedLoan(loan);
    setExtensionDays(7);
    setExtendDialogOpen(true);
  };

  const handleExtend = async () => {
    try {
      await dispatch(
        renewCheckout({
          bookLoanId: selectedLoan.id,
          extensionDays: extensionDays,
        })
      ).unwrap();
      setExtendDialogOpen(false);
      loadLoans();
    } catch (error) {
      console.error("Error extending loan:", error);
      alert(error || "Failed to extend loan");
    }
  };

  const handleCancel = async (loan) => {
    if (window.confirm(`Cancel loan #${loan.id}?`)) {
      try {
        // await dispatch(cancelLoan(loan.id)).unwrap();
        loadLoans();
      } catch (error) {
        console.error("Error cancelling loan:", error);
      }
    }
  };

  const handleOpenEditDialog = (loan) => {
    setSelectedLoan(loan);
    setEditFormData({
      status: loan.status || "",
      dueDate: loan.dueDate ? dayjs(loan.dueDate) : null,
      returnDate: loan.returnDate ? dayjs(loan.returnDate) : null,
      maxRenewals: loan.maxRenewals || "",
      fineAmount: loan.fineAmount || "",
      finePaid: loan.finePaid || false,
      notes: "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdateLoan = async () => {
    try {
      const updateRequest = {};

      // Only include fields that have values
      if (editFormData.status) updateRequest.status = editFormData.status;
      if (editFormData.dueDate) updateRequest.dueDate = dayjs(editFormData.dueDate).format("YYYY-MM-DD");
      if (editFormData.returnDate) updateRequest.returnDate = dayjs(editFormData.returnDate).format("YYYY-MM-DD");
      if (editFormData.maxRenewals) updateRequest.maxRenewals = parseInt(editFormData.maxRenewals);
      if (editFormData.fineAmount) updateRequest.fineAmount = parseFloat(editFormData.fineAmount);
      updateRequest.finePaid = editFormData.finePaid;
      if (editFormData.notes) updateRequest.notes = editFormData.notes;

      await dispatch(
        updateBookLoan({
          bookLoanId: selectedLoan.id,
          updateRequest,
        })
      ).unwrap();

      setEditDialogOpen(false);
      loadLoans();
    } catch (error) {
      console.error("Error updating loan:", error);
      alert(error || "Failed to update loan");
    }
  };

  const handleOpenCreateFineDialog = (loan, type) => {
    setSelectedLoan(loan);
    setFineType(type);
    setCreateFineFormData({
      amount: "",
      reason: type === "DAMAGE" ? "Book damaged during loan period" : "Book lost by borrower",
      notes: "",
    });
    setCreateFineDialogOpen(true);
  };

  const handleCreateFine = async () => {
    if (!createFineFormData.amount) {
      alert("Please enter a fine amount");
      return;
    }

    try {
      // Create the fine
      await dispatch(
        createFine({
          bookLoanId: selectedLoan.id,
          type: fineType,
          amount: parseFloat(createFineFormData.amount),
          reason: createFineFormData.reason,
          notes: createFineFormData.notes,
        })
      ).unwrap();

      // Update the book loan status to DAMAGED or LOST
      await dispatch(
        updateBookLoan({
          bookLoanId: selectedLoan.id,
          updateRequest: {
            status: fineType === "DAMAGE" ? "DAMAGED" : "LOST",
          },
        })
      ).unwrap();

      setCreateFineDialogOpen(false);
      loadLoans();
    } catch (error) {
      console.error("Error creating fine:", error);
      alert(error || "Failed to create fine");
    }
  };

  const getStatusChip = (status) => {
    const statusMap = {
      CHECKED_OUT: { color: "success", label: "CHECKED_OUT" },
      OVERDUE: { color: "error", label: "Overdue" },
      RETURNED: { color: "default", label: "Returned" },
      CANCELLED: { color: "warning", label: "Cancelled" },
    };
    const config = statusMap[status] || { color: "default", label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const calculateDaysOverdue = (dueDate, status) => {
    if (status !== "OVERDUE") return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const columns = [
    {
      field: "id",
      headerName: "Loan ID",
      minWidth: 80,
    },
    {
      field: "bookTitle",
      headerName: "Book",
      minWidth: 200,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2">{row.bookTitle}</Typography>
          {row.bookAuthor && (
            <Typography variant="caption" color="text.secondary">
              by {row.bookAuthor}
            </Typography>
          )}
        </Box>
      ),
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
      field: "checkoutDate",
      headerName: "Checkout Date",
      renderCell: (row) => (
        <Typography variant="body2">
          {row.checkoutDate
            ? new Date(row.checkoutDate).toLocaleDateString()
            : "-"}
        </Typography>
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      renderCell: (row) => {
        return (
          <Box>
            <Typography variant="body2">
              {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-"}
            </Typography>
            {row.isOverdue && row.overdueDays && (
              <Typography variant="caption" color="error">
                {row.overdueDays} days overdue
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "returnDate",
      headerName: "Return Date",
      renderCell: (row) => (
        <Typography variant="body2">
          {row.returnDate ? new Date(row.returnDate).toLocaleDateString() : "-"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (row) => getStatusChip(row.status),
    },
    
  ];

  const customActions = (row) => (
    <Box sx={{width:"120px", display: "flex", gap: 0.5, flexWrap: "wrap" }}>
  
     
      {(row.status === "CHECKED_OUT" || row.status === "OVERDUE") && (
        <>
        <Button
        fullWidth
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleReturn(row)}
          >
            Return
          </Button>
          <Button
          fullWidth
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<DamageIcon />}
            onClick={() => handleOpenCreateFineDialog(row, "DAMAGE")}
          >
            Damage
          </Button>
          <Button
          fullWidth
            size="small"
            variant="outlined"
            color="error"
            startIcon={<LossIcon />}
            onClick={() => handleOpenCreateFineDialog(row, "LOSS")}
          >
            Loss
          </Button>
        </>
      )}
      <Button
        size="small"
        variant="outlined"
        color="info"
        startIcon={<EditIcon />}
        onClick={() => handleOpenEditDialog(row)}
        fullWidth
      >
        Edit
      </Button>
    </Box>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Book Loans Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage all book loans
          </Typography>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {allLoans?.filter((l) => l.status === "CHECKED_OUT").length || 0}
            </Typography>
            <Typography variant="body2">Active Loans</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "error.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "error.main" }}
            >
              {allLoans?.filter((l) => l.status === "OVERDUE" || l.isOverdue)
                .length || 0}
            </Typography>
            <Typography variant="body2">Overdue Loans</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "info.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "info.main" }}
            >
              {allLoans?.filter((l) => l.status === "RETURNED").length || 0}
            </Typography>
            <Typography variant="body2">Returned</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              $
              {allLoans
                ?.reduce((sum, l) => sum + (parseFloat(l.fineAmount) || 0), 0)
                .toFixed(2) || "0.00"}
            </Typography>
            <Typography variant="body2">Total Fines</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter and Sort Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="loanDate">Loan Date</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="returnDate">Return Date</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort Direction</InputLabel>
          <Select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            label="Sort Direction"
          >
            <MenuItem value="ASC">Ascending</MenuItem>
            <MenuItem value="DESC">Descending</MenuItem>
          </Select>
        </FormControl>

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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Filter Book Loans</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="CHECKED_OUT">Active</MenuItem>
                  <MenuItem value="OVERDUE">Overdue</MenuItem>
                  <MenuItem value="RETURNED">Returned</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                type="number"
                placeholder="Filter by user ID"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Book ID"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                type="number"
                placeholder="Filter by book ID"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={overdueOnly}
                    onChange={(e) => setOverdueOnly(e.target.checked)}
                  />
                }
                label="Overdue Only"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={unpaidFinesOnly}
                    onChange={(e) => setUnpaidFinesOnly(e.target.checked)}
                  />
                }
                label="Unpaid Fines Only"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFilterStatus("");
              setUserId("");
              setBookId("");
              setOverdueOnly(false);
              setUnpaidFinesOnly(false);
              setStartDate(null);
              setEndDate(null);
            }}
            startIcon={<FilterIcon />}
          >
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
        data={allLoans || []}
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

      {/* Extend Loan Dialog */}
      <Dialog
        open={extendDialogOpen}
        onClose={() => setExtendDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Extend Loan Period</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Extend the loan period for:{" "}
            <strong>{selectedLoan?.bookTitle}</strong>
          </Alert>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Extension Period</InputLabel>
            <Select
              value={extensionDays}
              onChange={(e) => setExtensionDays(e.target.value)}
              label="Extension Period"
            >
              <MenuItem value={3}>3 Days</MenuItem>
              <MenuItem value={7}>7 Days</MenuItem>
              <MenuItem value={14}>14 Days</MenuItem>
              <MenuItem value={30}>30 Days</MenuItem>
            </Select>
          </FormControl>
          {selectedLoan && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Current Due Date:{" "}
                {new Date(selectedLoan.dueDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="primary">
                New Due Date:{" "}
                {new Date(
                  new Date(selectedLoan.dueDate).getTime() +
                    extensionDays * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExtendDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExtend} variant="contained">
            Extend Loan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Loan Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Book Loan #{selectedLoan?.id}</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, mt: 1 }}>
            Editing loan for: <strong>{selectedLoan?.bookTitle}</strong> by{" "}
            <strong>{selectedLoan?.userName}</strong>
          </Alert>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="CHECKED_OUT">Checked Out</MenuItem>
                  <MenuItem value="OVERDUE">Overdue</MenuItem>
                  <MenuItem value="RETURNED">Returned</MenuItem>
                  <MenuItem value="LOST">Lost</MenuItem>
                  <MenuItem value="DAMAGED">Damaged</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Max Renewals"
                type="number"
                value={editFormData.maxRenewals}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    maxRenewals: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
                  value={editFormData.dueDate}
                  onChange={(newValue) =>
                    setEditFormData({ ...editFormData, dueDate: newValue })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Return Date"
                  value={editFormData.returnDate}
                  onChange={(newValue) =>
                    setEditFormData({ ...editFormData, returnDate: newValue })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Fine Amount"
                type="number"
                value={editFormData.fineAmount}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    fineAmount: e.target.value,
                  })
                }
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editFormData.finePaid}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        finePaid: e.target.checked,
                      })
                    }
                  />
                }
                label="Fine Paid"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Admin Notes"
                value={editFormData.notes}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, notes: e.target.value })
                }
                placeholder="Add notes about this update..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateLoan} variant="contained" color="primary">
            Update Loan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Fine Dialog */}
      <Dialog
        open={createFineDialogOpen}
        onClose={() => setCreateFineDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Create {fineType === "DAMAGE" ? "Damage" : "Loss"} Fine
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
            Creating {fineType === "DAMAGE" ? "damage" : "loss"} fine for:{" "}
            <strong>{selectedLoan?.bookTitle}</strong> borrowed by{" "}
            <strong>{selectedLoan?.userName}</strong>
            <br />
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              This will update the loan status to{" "}
              {fineType === "DAMAGE" ? "DAMAGED" : "LOST"}.
            </Typography>
          </Alert>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Fine Amount"
                type="number"
                value={createFineFormData.amount}
                onChange={(e) =>
                  setCreateFineFormData({
                    ...createFineFormData,
                    amount: e.target.value,
                  })
                }
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                helperText={
                  fineType === "DAMAGE"
                    ? "Enter the repair/replacement cost"
                    : "Enter the book replacement cost"
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={3}
                value={createFineFormData.reason}
                onChange={(e) =>
                  setCreateFineFormData({
                    ...createFineFormData,
                    reason: e.target.value,
                  })
                }
                placeholder={
                  fineType === "DAMAGE"
                    ? "Describe the damage..."
                    : "Describe the circumstances of the loss..."
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Admin Notes"
                multiline
                rows={2}
                value={createFineFormData.notes}
                onChange={(e) =>
                  setCreateFineFormData({
                    ...createFineFormData,
                    notes: e.target.value,
                  })
                }
                placeholder="Additional notes (optional)..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateFineDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateFine}
            variant="contained"
            color={fineType === "DAMAGE" ? "warning" : "error"}
          >
            Create Fine & Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
