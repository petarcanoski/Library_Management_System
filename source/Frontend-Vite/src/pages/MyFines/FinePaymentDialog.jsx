import React from "react";
import { getTypeChip } from "./getTypeChip";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Typography } from "@mui/material";
import { Payment } from "@mui/icons-material";

const FinePaymentDialog = ({
  paymentDialog,
  setPaymentDialog,
  confirmPayment,
}) => {
  return (
    <Dialog
      open={paymentDialog.open}
      onClose={() => setPaymentDialog({ open: false, fine: null })}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Payment color="error" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Pay Fine
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {paymentDialog.fine && (
          <Box sx={{ mt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              You are about to pay the fine for{" "}
              <strong>
                {paymentDialog.fine.bookTitle ||
                  "Fine #" + paymentDialog.fine.id}
              </strong>
            </Alert>

            <Paper
              sx={{ p: 3, bgcolor: "#FEF2F2", border: "1px solid #FCA5A5" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Amount to Pay:
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#DC2626" }}
                >
                  ${parseFloat(paymentDialog.fine.amountOutstanding).toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Fine Type:
                </Typography>
                {getTypeChip(paymentDialog.fine.type)}
              </Box>
              {paymentDialog.fine.reason && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Reason:</strong> {paymentDialog.fine.reason}
                  </Typography>
                </Box>
              )}
            </Paper>

            <Alert severity="warning" sx={{ mt: 2 }}>
              Payment will be processed securely. This action cannot be undone.
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => setPaymentDialog({ open: false, fine: null })}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={confirmPayment}
          variant="contained"
          color="error"
          startIcon={<Payment />}
          sx={{ px: 3, fontWeight: 600 }}
        >
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinePaymentDialog;
