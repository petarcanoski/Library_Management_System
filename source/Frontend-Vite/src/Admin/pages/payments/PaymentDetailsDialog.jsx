import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";

const PaymentDetailsDialog = ({
  detailsDialogOpen,
  setDetailsDialogOpen,
  selectedPayment,
  getStatusChip,
  getGatewayChip
}) => {
  return (
    <Dialog
      open={detailsDialogOpen}
      onClose={() => setDetailsDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Payment Details
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {selectedPayment && (
          <List>
            <ListItem>
              <ListItemText
                primary="Payment ID"
                secondary={selectedPayment.id}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Transaction ID"
                secondary={
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                  >
                    {selectedPayment.transactionId || "-"}
                  </Typography>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="User"
                secondary={`${selectedPayment.userName} (${selectedPayment.userEmail})`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Amount"
                secondary={`${selectedPayment.currency || "INR"} ${(
                  selectedPayment.amount / 100
                ).toFixed(2)}`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Payment Type"
                secondary={selectedPayment.paymentType || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Payment Gateway"
                secondary={getGatewayChip(selectedPayment.gateway)}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Status"
                secondary={getStatusChip(selectedPayment.status)}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Description"
                secondary={selectedPayment.description || "-"}
              />
            </ListItem>
            <Divider />
            {selectedPayment.paymentMethod && (
              <>
                <ListItem>
                  <ListItemText
                    primary="Payment Method"
                    secondary={selectedPayment.paymentMethod}
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {selectedPayment.bookLoanId && (
              <>
                <ListItem>
                  <ListItemText
                    primary="Book Loan ID"
                    secondary={selectedPayment.bookLoanId}
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {selectedPayment.subscriptionId && (
              <>
                <ListItem>
                  <ListItemText
                    primary="Subscription ID"
                    secondary={selectedPayment.subscriptionId}
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {selectedPayment.gatewayPaymentId && (
              <>
                <ListItem>
                  <ListItemText
                    primary="Gateway Payment ID"
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                      >
                        {selectedPayment.gatewayPaymentId}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {selectedPayment.gatewayOrderId && (
              <>
                <ListItem>
                  <ListItemText
                    primary="Gateway Order ID"
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                      >
                        {selectedPayment.gatewayOrderId}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </>
            )}
            {selectedPayment.failureReason && (
              <>
                <ListItem>
                  <ListItemText
                    primary="Failure Reason"
                    secondary={selectedPayment.failureReason}
                  />
                </ListItem>
                <Divider />
              </>
            )}
            <ListItem>
              <ListItemText
                primary="Initiated At"
                secondary={
                  selectedPayment.initiatedAt
                    ? new Date(selectedPayment.initiatedAt).toLocaleString()
                    : "-"
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Completed At"
                secondary={
                  selectedPayment.completedAt
                    ? new Date(selectedPayment.completedAt).toLocaleString()
                    : "-"
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Created At"
                secondary={
                  selectedPayment.createdAt
                    ? new Date(selectedPayment.createdAt).toLocaleString()
                    : "-"
                }
              />
            </ListItem>
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setDetailsDialogOpen(false)} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDetailsDialog;
