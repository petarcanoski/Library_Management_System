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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../components/DataTable';
import { getAllPayments } from '../../../store/features/payments/paymentThunk';
import PaymentDetailsDialog from './PaymentDetailsDialog';
import PaymentState from './PaymentState';

export default function AdminPaymentsPage() {
  const dispatch = useDispatch();
  const { allPayments, loading, pagination } = useSelector((state) => state.payments);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGateway, setFilterGateway] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('DESC');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, [page, rowsPerPage, sortBy, sortDir]);

  const loadPayments = () => {
    dispatch(
      getAllPayments({
        page,
        size: rowsPerPage,
        sortBy,
        sortDir,
      })
    );
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  const handleExportCSV = () => {
    const csvData = filteredPayments.map((payment) => ({
      'Transaction ID': payment.transactionId,
      'User': payment.userName,
      'Amount': `${payment.currency} ${payment.amount}`,
      'Gateway': payment.gateway,
      'Status': payment.status,
      'Purpose': payment.purpose,
      'Date': new Date(payment.createdDate).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredPayments = (allPayments || []).filter((payment) => {
    const matchesSearch =
      searchQuery === '' ||
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGateway = !filterGateway || payment.gateway === filterGateway;
    const matchesStatus = !filterStatus || payment.status === filterStatus;
    const matchesType = !filterType || payment.paymentType === filterType;

    return matchesSearch && matchesGateway && matchesStatus && matchesType;
  });

  const getStatusChip = (status) => {
    const statusMap = {
      SUCCESS: { color: 'success', label: 'Success' },
      COMPLETED: { color: 'success', label: 'Completed' },
      FAILED: { color: 'error', label: 'Failed' },
      PENDING: { color: 'warning', label: 'Pending' },
      INITIATED: { color: 'info', label: 'Initiated' },
      REFUNDED: { color: 'info', label: 'Refunded' },
    };
    const config = statusMap[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getGatewayChip = (gateway) => {
    const color = gateway === 'STRIPE' ? 'primary' : gateway === 'RAZORPAY' ? 'warning' : 'default';
    return <Chip label={gateway} color={color} size="small" />;
  };

 

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 60,
    },
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      minWidth: 180,
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {row.transactionId || '-'}
        </Typography>
      ),
    },
    {
      field: 'userName',
      headerName: 'User',
      minWidth: 180,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.userName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.userEmail}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      renderCell: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.currency || 'INR'} {(row.amount ).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'paymentType',
      headerName: 'Type',
      renderCell: (row) => (
        <Chip
          label={row.paymentType || 'N/A'}
          size="small"
          color={row.paymentType === 'SUBSCRIPTION' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'gateway',
      headerName: 'Gateway',
      renderCell: (row) => getGatewayChip(row.gateway),
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => getStatusChip(row.status),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      renderCell: (row) => (
        <Typography variant="body2">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
  ];

  const customActions = (row) => (
    <Button
      size="small"
      variant="outlined"
      startIcon={<VisibilityIcon />}
      onClick={() => handleViewDetails(row)}
    >
      View
    </Button>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Payments Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor all payment transactions and revenue
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportCSV}
          disabled={filteredPayments.length === 0}
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Stats Summary */}
      <PaymentState allPayments={allPayments} />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by transaction ID, user, or description..."
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
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="SUBSCRIPTION">Subscription</MenuItem>
                <MenuItem value="FINE">Fine</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Gateway</InputLabel>
              <Select
                value={filterGateway}
                onChange={(e) => setFilterGateway(e.target.value)}
                label="Gateway"
              >
                <MenuItem value="">All Gateways</MenuItem>
                <MenuItem value="STRIPE">Stripe</MenuItem>
                <MenuItem value="RAZORPAY">Razorpay</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="SUCCESS">Success</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="INITIATED">Initiated</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
                <MenuItem value="REFUNDED">Refunded</MenuItem>
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
                setFilterGateway('');
                setFilterStatus('');
                setFilterType('');
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
        data={filteredPayments}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={pagination?.totalElements || 0}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        actions={false}
        customActions={customActions}
      />

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        selectedPayment={selectedPayment}
        getStatusChip={getStatusChip}
        getGatewayChip={getGatewayChip}
      />
    </Box>
  );
}
