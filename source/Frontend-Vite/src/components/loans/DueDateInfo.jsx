import React from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * DueDateInfo Component
 * Displays relative due date information with color coding
 *
 * @param {Object} loan - Book loan object
 * @param {string} loan.dueDate - Due date in ISO format
 * @param {boolean} loan.isOverdue - Whether the loan is overdue
 * @param {number} loan.overdueDays - Number of overdue days
 * @param {string} loan.status - Loan status
 * @returns {JSX.Element|null} Due date info component or null if returned
 */
const DueDateInfo = ({ loan }) => {
  // Don't show for returned books
  if (loan.status === 'RETURNED') {
    return null;
  }

  const dueDate = new Date(loan.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Overdue
  if (loan.isOverdue) {
    return (
      <div className="flex items-center space-x-1 text-red-600 font-semibold animate-pulse">
        <WarningIcon sx={{ fontSize: 18 }} />
        <span>Overdue by {loan.overdueDays} {loan.overdueDays === 1 ? 'day' : 'days'}</span>
      </div>
    );
  }

  // Due soon (within 3 days)
  if (diffDays <= 3 && diffDays >= 0) {
    return (
      <div className="flex items-center space-x-1 text-orange-600 font-semibold">
        <AccessTimeIcon sx={{ fontSize: 18 }} />
        <span>
          {diffDays === 0 ? 'Due today!' : `Due in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`}
        </span>
      </div>
    );
  }

  // Normal due date
  return (
    <div className="flex items-center space-x-1 text-green-600 font-medium">
      <AccessTimeIcon sx={{ fontSize: 18 }} />
      <span>Due in {diffDays} days</span>
    </div>
  );
};

export default DueDateInfo;
