import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

const MyFineState = ({ filteredFines, 
    totalOutstanding, 
    
    totalPaid }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#FEF2F2" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#DC2626" }}>
                  {filteredFines.filter((f) => f.status === "PENDING").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Fines
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#F0FDF4" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#16A34A" }}>
                  {filteredFines.filter((f) => f.status === "PAID").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paid Fines
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#FEF2F2" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#DC2626" }}>
                  ₹{totalOutstanding.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Outstanding
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#F0FDF4" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#16A34A" }}>
                  ₹{totalPaid.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Paid
                </Typography>
              </Paper>
            </Grid>
          </Grid>
  )
}

export default MyFineState