import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * StatusBadge Component
 * Displays a color-coded status badge for book loans
 *
 * @param {Object} loan - Book loan object
 * @param {string} loan.status - Loan status (ACTIVE, OVERDUE, RETURNED)
 * @param {boolean} loan.isOverdue - Whether the loan is overdue
 * @param {number} loan.overdueDays - Number of overdue days
 * @returns {JSX.Element} Status badge component
 */
const StatusBadge = ({ loan }) => {
  // Returned status
  if (loan.status === 'RETURNED') {
    return (
      <Chip
        icon={<CheckCircleIcon />}
        label="Returned"
        size="small"
        sx={{
          bgcolor: '#E5E7EB',
          color: '#6B7280',
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: '#6B7280',
          },
        }}
      />
    );
  }

  // Overdue status
  if (loan.isOverdue) {
    return (
      <Chip
        icon={<WarningIcon />}
        label={`Overdue (${loan.overdueDays} ${loan.overdueDays === 1 ? 'day' : 'days'})`}
        color="error"
        size="small"
        sx={{
          fontWeight: 600,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.8,
            },
          },
        }}
      />
    );
  }

  // Active/Checked out status
  return (
    <Chip
      icon={<AccessTimeIcon />}
      label="Checked Out"
      color="success"
      size="small"
      sx={{
        fontWeight: 600,
        bgcolor: '#10B981',
        color: 'white',
        '& .MuiChip-icon': {
          color: 'white',
        },
      }}
    />
  );
};

export default StatusBadge;
