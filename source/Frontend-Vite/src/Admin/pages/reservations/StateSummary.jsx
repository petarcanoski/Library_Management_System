import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

const StateSummary = ({allReservations,totalElements}) => {
  return (
     <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {(allReservations || []).filter((r) => r.status === 'PENDING').length}
            </Typography>
            <Typography variant="body2">Pending Reservations</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {(allReservations || []).filter((r) => r.status === 'FULFILLED').length}
            </Typography>
            <Typography variant="body2">Fulfilled</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
              {(allReservations || []).filter((r) => r.status === 'CANCELLED').length}
            </Typography>
            <Typography variant="body2">Cancelled</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
              {totalElements || 0}
            </Typography>
            <Typography variant="body2">Total Reservations</Typography>
          </Paper>
        </Grid>
      </Grid>
  )
}

export default StateSummary