import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

  const getStatusChip = (status) => {
    const statusMap = {
      PENDING: { color: 'warning', label: 'Pending' },
      FULFILLED: { color: 'success', label: 'Fulfilled' },
      CANCELLED: { color: 'error', label: 'Cancelled' },
      EXPIRED: { color: 'default', label: 'Expired' },
    };
    const config = statusMap[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const calculateWaitingTime = (reservationDate) => {
    const reserved = new Date(reservationDate);
    const today = new Date();
    const diffTime = Math.abs(today - reserved);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };


export const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 60,
    },
    {
      field: 'bookTitle',
      headerName: 'Book',
      minWidth: 200,
    },
    {
      field: 'userName',
      headerName: 'User',
      minWidth: 150,
    },
    {
      field: 'reservationDate',
      headerName: 'Reserved On',
      renderCell: (row) => (
        <Box>
          <Typography variant="body2">
            {new Date(row.reservedAt).toLocaleDateString()}
          </Typography>
          {row.status === 'PENDING' && (
            <Typography variant="caption" color="text.secondary">
              {calculateWaitingTime(row.reservedAt)} days waiting
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      align: 'center',
      renderCell: (row) =>
        row.queuePosition ? (
          <Chip label={`#${row.queuePosition}`} size="small" color="primary" variant="outlined" />
        ) : (
          '-'
        ),
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => getStatusChip(row.status),
    },
  ];
