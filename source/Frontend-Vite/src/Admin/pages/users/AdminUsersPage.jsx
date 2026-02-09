import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
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
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Block as BlockIcon,
  AdminPanelSettings as AdminIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../components/DataTable';
import { getUsersList } from '../../../store/features/auth/authThunk';
import UserDetailsDialog from './UserDetailsDialog';
import UserState from './UserState';

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { usersList, usersListLoading } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    dispatch(getUsersList());
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleUpgradeToAdmin = async (user) => {
    if (
      window.confirm(
        `Upgrade "${user.fullName}" to admin role? This will grant full administrative privileges.`
      )
    ) {
      try {
        // TODO: Implement updateUserRole thunk
        // await dispatch(updateUserRole({ userId: user.id, role: 'ADMIN' })).unwrap();
        alert('Upgrade to admin functionality not implemented yet');
        console.log('User upgrade requested:', user.id);
      } catch (error) {
        console.error('Error upgrading user:', error);
      }
    }
  };

  const handleToggleActive = async (user) => {
    const action = user.verified ? 'deactivate' : 'activate';
    if (
      window.confirm(
        `${action.charAt(0).toUpperCase() + action.slice(1)} user "${user.fullName}"?`
      )
    ) {
      try {
        // TODO: Implement toggleUserActive thunk
        // await dispatch(toggleUserActive({ userId: user.id, active: !user.verified })).unwrap();
        alert('Toggle active functionality not implemented yet');
        console.log(`User toggle active requested:`, user.id);
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
      }
    }
  };

  const filteredUsers = (usersList || []).filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery);

    return matchesSearch;
  });

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 60,
    },
    {
      field: 'fullName',
      headerName: 'User',
      minWidth: 250,
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={row.profileImage} sx={{ width: 40, height: 40 }}>
            {row.fullName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      renderCell: (row) => (
        <Chip
          label={row.role}
          color={row.role === 'ROLE_ADMIN' ? 'error' : 'default'}
          size="small"
          icon={row.role === 'ROLE_ADMIN' ? <AdminIcon /> : undefined}
        />
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 140,
      renderCell: (row) => <Typography variant="body2">{row.phone || '-'}</Typography>,
    },
    {
      field: 'authProvider',
      headerName: 'Auth Provider',
      renderCell: (row) => (
        <Chip
          label={row.authProvider || 'LOCAL'}
          size="small"
          variant="outlined"
          color={row.authProvider === 'GOOGLE' ? 'info' : 'default'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      renderCell: (row) => (
        <Typography variant="body2">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      field: 'verified',
      headerName: 'Status',
      renderCell: (row) => (
        <Chip
          label={row.verified ? 'Verified' : 'Unverified'}
          color={row.verified ? 'success' : 'warning'}
          size="small"
          icon={row.verified ? <CheckCircleIcon /> : <BlockIcon />}
        />
      ),
    },
  ];

  const customActions = (row) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Button
        size="small"
        variant="outlined"
        startIcon={<ViewIcon />}
        onClick={() => handleViewDetails(row)}
      >
        View
      </Button>
      {row.role !== 'ROLE_ADMIN' && (
        <Button
          size="small"
          variant="outlined"
          color="warning"
          startIcon={<AdminIcon />}
          onClick={() => handleUpgradeToAdmin(row)}
        >
          Make Admin
        </Button>
      )}
      <Button
        size="small"
        variant="outlined"
        color={row.verified ? 'error' : 'success'}
        startIcon={<BlockIcon />}
        onClick={() => handleToggleActive(row)}
      >
        {row.verified ? 'Unverify' : 'Verify'}
      </Button>
    </Box>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Users Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user accounts and permissions
          </Typography>
        </Box>
      </Box>

      {/* Stats Summary */}
      <UserState usersList={usersList} />

      {/* Search Filter */}
      <div className='pb-5'>
        <TextField
          fullWidth
          placeholder="Search by name, email, or phone number..."
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
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        loading={usersListLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredUsers.length}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        actions={false}
        // customActions={customActions}
      />

      {/* User Details Dialog */}
      <UserDetailsDialog 
        viewDialogOpen={viewDialogOpen}
        setViewDialogOpen={setViewDialogOpen}
        selectedUser={selectedUser}
      />
    </Box>
  );
}
