import React, { useState, useEffect } from 'react';
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
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../components/DataTable';
import { cancelSubscription, fetchAllActiveSubscriptions, renewSubscription } from '../../../store/features/subscriptions/subscriptionThunk';


export default function AdminUserSubscriptionsPage() {
  const dispatch = useDispatch();
  const { allActiveSubscriptions, loading } = useSelector((state) => state.subscriptions);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    loadSubscriptions();
  }, [page, rowsPerPage, filterStatus]);

  const loadSubscriptions = () => {
    dispatch(
      fetchAllActiveSubscriptions({
        page,
        size: rowsPerPage,
        status: filterStatus || undefined,
      })
    );
  };

  const handleOpenRenewDialog = (subscription) => {
    setSelectedSubscription(subscription);
    setRenewDialogOpen(true);
  };

  const handleOpenCancelDialog = (subscription) => {
    setSelectedSubscription(subscription);
    setCancelDialogOpen(true);
  };

  const handleRenew = async () => {
    try {
      await dispatch(
        renewSubscription({
          subscriptionId: selectedSubscription.id,
          subscribeRequest: {
            planId: selectedSubscription.planId,
          },
        })
      ).unwrap();
      setRenewDialogOpen(false);
      loadSubscriptions();
    } catch (error) {
      console.error('Error renewing subscription:', error);
      alert(error || 'Failed to renew subscription');
    }
  };

  const handleCancel = async () => {
    try {
      await dispatch(
        cancelSubscription({
          subscriptionId: selectedSubscription.id,
          reason: 'Cancelled by admin',
        })
      ).unwrap();
      setCancelDialogOpen(false);
      loadSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert(error || 'Failed to cancel subscription');
    }
  };

  const filteredSubscriptions = (allActiveSubscriptions || []).filter((subscription) => {
    const matchesSearch =
      searchQuery === '' ||
      subscription.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.id.toString().includes(searchQuery);

    // Apply status filter
    const matchesStatus = !filterStatus ||
      (subscription.isActive && filterStatus === 'ACTIVE') ||
      (subscription.isExpired && filterStatus === 'EXPIRED') ||
      (subscription.cancelledAt && filterStatus === 'CANCELLED');

    return matchesSearch && matchesStatus;
  });

  const getStatusChip = (subscription) => {
    if (subscription.cancelledAt) {
      return <Chip label="Cancelled" color="warning" size="small" />;
    }
    if (subscription.isExpired) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    if (subscription.isActive) {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="default" size="small" />;
  };

  const calculateDaysRemaining = (subscription) => {
    if (!subscription.isActive || subscription.isExpired) return null;
    return subscription.daysRemaining || 0;
  };

  const calculateTotalRevenue = () => {
    return (allActiveSubscriptions || [])
      .reduce((sum, s) => sum + (s.price || 0), 0);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 60,
    },
    {
      field: 'userName',
      headerName: 'User',
      minWidth: 200,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>{row.userName?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.userEmail}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'planName',
      headerName: 'Plan',
      minWidth: 150,
      renderCell: (row) => (
        <Box>
          <Chip label={row.planName} size="small" color="primary" variant="outlined" />
          <Typography variant="caption" display="block" color="text.secondary">
            {row.planCode}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.currency || 'INR'}{" "}{row.price || '0.00'}
        </Typography>
      ),
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      renderCell: (row) => (
        <Typography variant="body2">
          {row.startDate ? new Date(row.startDate).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      renderCell: (row) => {
        const daysRemaining = calculateDaysRemaining(row);
        return (
          <Box>
            <Typography variant="body2">
              {row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'}
            </Typography>
            {daysRemaining !== null && (
              <Typography
                variant="caption"
                color={daysRemaining < 7 ? 'error' : 'text.secondary'}
              >
                {daysRemaining} days left
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => getStatusChip(row),
    },
    {
      field: 'autoRenew',
      headerName: 'Auto Renew',
      renderCell: (row) => (
        <Chip
          label={row.autoRenew ? 'Yes' : 'No'}
          size="small"
          color={row.autoRenew ? 'success' : 'default'}
          variant="outlined"
        />
      ),
    },
  ];

  const customActions = (row) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {!row.isExpired && (
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={() => handleOpenCancelDialog(row)}
        >
          Cancel
        </Button>
      )}
      {(row.isExpired) && (
        <Button
          size="small"
          variant="contained"
          color="success"
          startIcon={<RefreshIcon />}
          disabled
          // onClick={() => handleOpenRenewDialog(row)}
        >
          Expired
        </Button>
      )}
    </Box>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            User Subscriptions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage all user subscriptions
          </Typography>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {allActiveSubscriptions?.filter((s) => s.isActive && !s.cancelledAt).length || 0}
            </Typography>
            <Typography variant="body2">Active Subscriptions</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
              {allActiveSubscriptions?.filter((s) => s.isExpired).length || 0}
            </Typography>
            <Typography variant="body2">Expired</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {allActiveSubscriptions?.filter((s) => s.cancelledAt).length || 0}
            </Typography>
            <Typography variant="body2">Cancelled</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ₹{calculateTotalRevenue().toFixed(2)}
            </Typography>
            <Typography variant="body2">Total Revenue</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Search by subscription ID, user, or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="EXPIRED">Expired</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('');
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredSubscriptions}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredSubscriptions.length}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        actions={false}
        customActions={customActions}
      />

      {/* Renew Subscription Dialog */}
      <Dialog
        open={renewDialogOpen}
        onClose={() => setRenewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Renew Subscription</DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                You are about to manually renew this subscription. The user's plan will be
                reactivated.
              </Alert>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedSubscription.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Plan
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedSubscription.planName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Previous Period
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedSubscription.startDate).toLocaleDateString()} -{' '}
                  {new Date(selectedSubscription.endDate).toLocaleDateString()}
                </Typography>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRenewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenew} variant="contained" color="success">
            Renew Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                You are about to cancel this active subscription. This action cannot be undone.
              </Alert>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedSubscription.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Plan
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {selectedSubscription.planName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Days Remaining
                </Typography>
                <Typography variant="body1">
                  {calculateDaysRemaining(selectedSubscription) || 0} days
                </Typography>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCancelDialogOpen(false)}>Go Back</Button>
          <Button onClick={handleCancel} variant="contained" color="error">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
