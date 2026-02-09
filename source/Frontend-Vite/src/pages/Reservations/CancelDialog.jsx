import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

const CancelDialog = ({ open, reservation, onClose, onConfirm }) => {
  if (!reservation) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="flex items-center gap-2 text-red-600 font-bold">
        <ErrorOutline /> Cancel Reservation
      </DialogTitle>
      <DialogContent>
        <p className="text-gray-700 mb-3">
          Are you sure you want to cancel the reservation for{" "}
          <strong>{reservation.bookTitle}</strong> (Book ID:{" "}
          <strong>#{reservation.bookId}</strong>)?
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Keep Reservation
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Cancel Reservation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelDialog;
