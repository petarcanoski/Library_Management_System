import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Tabs,
  Tab,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import Layout from "../../components/layout/Layout";
import Pagination from "../../components/common/Pagination";
import LoanCard from "../../components/loans/LoanCard";
import EmptyState from "../../components/loans/EmptyState";
import {
  fetchMyBookLoans,
  renewCheckout,
  payFine,
  checkinBook,
} from "../../store/features/bookLoans/bookLoanThunk";
import { clearError } from "../../store/features/bookLoans/bookLoanSlice";
import { tabs } from "./tabs";

/**
 * MyLoansPage Component (Enhanced with Redux)
 * Displays and manages user's borrowed books with filtering, sorting, and actions
 */
const MyLoansPage = () => {
  const dispatch = useDispatch();
  const {
    myLoans,
    loading,
    error,
    totalElements,
    totalPages,
    
  } = useSelector((state) => state.bookLoans);

  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    loan: null,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Tab configuration


  // Fetch loans when tab or pagination changes
  useEffect(() => {
    loadLoans();
  }, [activeTab, currentPage, itemsPerPage]);



  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const loadLoans = () => {
    const status = tabs[activeTab].value;
    dispatch(
      fetchMyBookLoans({
        status,
        page: currentPage - 1,
        size: itemsPerPage,
      })
    );
  };

  const handleRenewLoan = async (loanId) => {
    try {
      await dispatch(renewCheckout(loanId)).unwrap();
      showSnackbar("Book renewed successfully! Due date extended.", "success");
      loadLoans();
    } catch (err) {
      showSnackbar(err || "Failed to renew book", "error");
    }
  };

  const handlePayFine = (loan) => {
    setPaymentDialog({ open: true, loan });
  };

  const confirmPayment = async () => {
    try {
      await dispatch(payFine(paymentDialog.loan.id)).unwrap();
      showSnackbar(
        `Fine of ₹${paymentDialog.loan.fineAmount.toFixed(
          2
        )} paid successfully!`,
        "success"
      );
      setPaymentDialog({ open: false, loan: null });
      loadLoans();
    } catch (err) {
      showSnackbar(err || "Failed to process payment", "error");
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await dispatch(checkinBook({ bookLoanId: loanId })).unwrap();
      showSnackbar(
        "Book marked for return. Please drop it off at the library.",
        "success"
      );
      loadLoans();
    } catch (err) {
      showSnackbar(err || "Failed to process return", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Sort loans: Overdue first, then by due date
  const sortedLoans = [...myLoans].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // Loading skeleton
  if (loading && myLoans.length === 0) {
    return (
      
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
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
      
    );
  }

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br 
      from-indigo-50 via-white to-purple-50 py-8"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
              <span className="text-5xl">📚</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Borrowed Books
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Manage your book loans, track due dates, and renew books
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              className="mb-6 animate-fade-in"
              onClose={() => dispatch(clearError())}
            >
              {error}
            </Alert>
          )}

          {/* Tabs */}
          <Card 
          className="mb-6 animate-fade-in-up animation-delay-200">
            <Box 
            sx={{ 
              borderBottom: 1, 
              borderColor: "divider" 
              }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => {
                  setActiveTab(newValue);
                  setCurrentPage(1);
                }}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    minWidth: 100,
                  },
                  "& .Mui-selected": {
                    color: "#4F46E5",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#4F46E5",
                    height: 3,
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab key={index} label={tab.label} />
                ))}
              </Tabs>
            </Box>
          </Card>

          {/* Loans List */}
          {sortedLoans.length === 0 ? (
            <EmptyState filterType={tabs[activeTab].label} />
          ) : (
            <>
              <div className="space-y-4 animate-fade-in-up animation-delay-400">
                {sortedLoans.map((loan, index) => (
                  <div
                    key={loan.id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }}
                  >
                    <LoanCard
                      loan={loan}
                      onRenew={handleRenewLoan}
                      onPayFine={handlePayFine}
                      onReturn={handleReturnBook}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalElements}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(value) => {
                      setItemsPerPage(value);
                      setCurrentPage(1);
                    }}
                    itemsPerPageOptions={[5, 10, 20, 50]}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={paymentDialog.open}
        onClose={() => setPaymentDialog({ open: false, loan: null })}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: "90%", sm: 400 },
          },
        }}
      >
        <DialogTitle>
          <div className="flex items-center space-x-2">
            <PaymentIcon sx={{ color: "#DC2626" }} />
            <span className="font-bold">Pay Fine</span>
          </div>
        </DialogTitle>
        <DialogContent>
          {paymentDialog.loan && (
            <div className="space-y-4 mt-2">
              <p className="text-gray-700">
                You are about to pay the fine for{" "}
                <span className="font-semibold">
                  {paymentDialog.loan?.bookTitle}
                </span>
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">
                    Fine Amount:
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    ${paymentDialog.loan.fineAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Overdue by {paymentDialog.loan.overdueDays} days
                </p>
              </div>
              <Alert severity="info">
                Payment will be processed securely. Once paid, you can renew or
                return the book.
              </Alert>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setPaymentDialog({ open: false, loan: null })}
            sx={{ color: "#6B7280" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmPayment}
            variant="contained"
            color="error"
            startIcon={<PaymentIcon />}
            sx={{
              px: 3,
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default MyLoansPage;
