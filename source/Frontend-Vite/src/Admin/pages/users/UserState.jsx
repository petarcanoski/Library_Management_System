import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

const UserState = ({usersList}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {usersList?.length || 0}
            </Typography>
            <Typography variant="body2">Total Users</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {usersList?.filter((u) => u.verified).length || 0}
            </Typography>
            <Typography variant="body2">Verified Users</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
              {usersList?.filter((u) => u.role === 'ROLE_ADMIN').length || 0}
            </Typography>
            <Typography variant="body2">Administrators</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
              {usersList?.filter((u) => u.authProvider === 'GOOGLE').length || 0}
            </Typography>
            <Typography variant="body2">Google Auth Users</Typography>
          </Paper>
        </Grid>
      </Grid>
  )
}

export default UserState