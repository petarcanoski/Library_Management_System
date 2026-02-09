import { Grid, Paper, Typography } from '@mui/material';
import React from 'react'

const PaymentState = ({ allPayments }) => {

  const calculateTotalRevenue = () => {
    return (allPayments || [])
      .filter((p) => p.status === 'SUCCESS' || p.status === 'COMPLETED')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              ₹{calculateTotalRevenue().toFixed(2)}
            </Typography>
            <Typography variant="body2">Total Revenue</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {allPayments?.filter((p) => p.status === 'SUCCESS' || p.status === 'COMPLETED').length || 0}
            </Typography>
            <Typography variant="body2">Successful Payments</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {allPayments?.filter((p) => p.status === 'PENDING' || p.status === 'INITIATED').length || 0}
            </Typography>
            <Typography variant="body2">Pending Payments</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
              {allPayments?.filter((p) => p.status === 'FAILED').length || 0}
            </Typography>
            <Typography variant="body2">Failed Payments</Typography>
          </Paper>
        </Grid>
      </Grid>
  )
}

export default PaymentState