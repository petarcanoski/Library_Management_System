import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
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
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/DataTable";
import {
  searchReservations,
  fulfillReservation,
  cancelReservation,
} from "../../../store/features/reservations/reservationThunk";
import { columns } from "./ReservationColumn";
import StateSummary from "./StateSummary";
import FilterSection from "./FilterSection";

export default function AdminReservationsPage() {
  const dispatch = useDispatch();

  // Get data from Redux store
  const {
    allReservations,
    loading,
    totalElements,
   
    error,
  } = useSelector((state) => state.reservations);

  
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterBookId, setFilterBookId] = useState("");
  const [filterActiveOnly, setFilterActiveOnly] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const loadReservations = useCallback(() => {
    dispatch(
      searchReservations({
        page,
        size: rowsPerPage,
        status: filterStatus || undefined,
        userId: filterUserId || undefined,
        bookId: filterBookId || undefined,
        activeOnly:
          filterActiveOnly === "" ? undefined : filterActiveOnly === "true",
        sortBy: "reservedAt",
        sortDirection: "DESC",
      })
    );
  }, [
    dispatch,
    page,
    rowsPerPage,
    filterStatus,
    filterUserId,
    filterBookId,
    filterActiveOnly,
  ]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const handleOpenApproveDialog = (reservation) => {
    setSelectedReservation(reservation);
    setApproveDialogOpen(true);
  };

  const handleApprove = async () => {
    try {
      await dispatch(
        fulfillReservation(selectedReservation.id)
      ).unwrap();
      setApproveDialogOpen(false);
      // Reload reservations to get updated data
      loadReservations();
    } catch (error) {
      console.error("Error approving reservation:", error);
      alert(error || "Failed to approve reservation");
    }
  };

  const handleCancel = async (reservation) => {
    if (
      window.confirm(
        `Cancel reservation #${reservation.id} for "${reservation.bookTitle}"?`
      )
    ) {
      try {
        await dispatch(cancelReservation(reservation.id)).unwrap();
        
      } catch (error) {
        console.error("Error cancelling reservation:", error);
        alert(error || "Failed to cancel reservation");
      }
    }
  };



  const customActions = (row) => (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {row.status === "AVAILABLE" && (
        <>
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            disabled={!row.isBookAvailable}
            onClick={() => handleOpenApproveDialog(row)}
          >
            Approve
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => handleCancel(row)}
          >
            Cancel
          </Button>
        </>
      )}
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
            Reservations Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage book reservations and fulfill requests
          </Typography>
        </Box>
      </Box>

      {/* Stats Summary */}
      <StateSummary
        allReservations={allReservations}
        totalElements={totalElements}
      />

      {/* Filters */}
      <FilterSection
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterUserId={filterUserId}
        setFilterUserId={setFilterUserId}
        filterBookId={filterBookId}
        setFilterBookId={setFilterBookId}
        filterActiveOnly={filterActiveOnly}
        setFilterActiveOnly={setFilterActiveOnly}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={allReservations || []}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalElements || 0}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        actions={false}
        customActions={customActions}
      />

      {/* Approve Reservation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Reservation</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                You are about to approve the reservation and assign the book to
                the user.
              </Alert>
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Book
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedReservation.bookTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedReservation.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reserved On
                </Typography>
                <Typography variant="body1">
                  {new Date(
                    selectedReservation.reservationDate
                  ).toLocaleString()}
                </Typography>
              </Paper>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This will create a new loan for the user and mark the
                reservation as fulfilled.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" color="success">
            Approve & Assign Book
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
