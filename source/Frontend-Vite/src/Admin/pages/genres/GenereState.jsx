import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

const GenereState = ({ getRootGenres, genres }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {getRootGenres().length}
            </Typography>
            <Typography variant="body2">Root Genres</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {genres?.length || 0}
            </Typography>
            <Typography variant="body2">Total Genres</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
              {genres?.filter((g) => g.active).length || 0}
            </Typography>
            <Typography variant="body2">Active Genres</Typography>
          </Paper>
        </Grid>
      </Grid>
  )
}

export default GenereState