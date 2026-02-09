import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button, Chip, Box, Typography, Divider } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import NumbersIcon from '@mui/icons-material/Numbers';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * LoanCard Component
 * Displays a single book loan with all details and actions
 *
 * @param {Object} loan - Book loan object with new structure
 * @param {Function} onRenew - Callback for renewing the loan
 * @param {Function} onPayFine - Callback for paying fine
 * @param {Function} onReturn - Callback for returning the book
 * @returns {JSX.Element} Loan card component
 */
const LoanCard = ({ loan, onRenew, onPayFine, onReturn }) => {
  const navigate = useNavigate();

  const canRenew = () => {
    return (
      loan.status === 'CHECKED_OUT' &&
      loan.renewalCount < loan.maxRenewals &&
      !loan.isOverdue &&
      (loan.fineAmount === 0 || loan.finePaid)
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusConfig = () => {
    if (loan.returnDate) {
      return {
        label: 'Returned',
        icon: <CheckCircleIcon />,
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
      };
    }
    if (loan.isOverdue) {
      return {
        label: `Overdue (${loan.overdueDays} days)`,
        icon: <WarningIcon />,
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
      };
    }
    if (loan.status === 'CHECKED_OUT') {
      return {
        label: 'Checked Out',
        icon: <CheckCircleIcon />,
        color: '#3B82F6',
        bgColor: 'rgba(59, 130, 246, 0.1)',
      };
    }
    return {
      label: loan.status,
      icon: <AccessTimeIcon />,
      color: '#6B7280',
      bgColor: 'rgba(107, 114, 128, 0.1)',
    };
  };

  const statusConfig = getStatusConfig();

  const getDueDateWarning = () => {
    if (loan.returnDate || loan.isOverdue) return null;

    const dueDate = new Date(loan.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays > 0) {
      return (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'rgba(251, 146, 60, 0.1)',
            border: '1px solid rgba(251, 146, 60, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <AccessTimeIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: '#F59E0B', fontWeight: 600 }}>
            Due in {diffDays} {diffDays === 1 ? 'day' : 'days'}!
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      elevation={loan.isOverdue ? 8 : 2}
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: loan.isOverdue ? '2px solid #EF4444' : '1px solid rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
        '&::before': loan.isOverdue
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
            }
          : {},
      }}
    >
      {/* Status Bar */}
      <Box
        sx={{
          background: statusConfig.bgColor,
          borderBottom: `1px solid ${statusConfig.color}20`,
          px: 3,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Chip
          icon={statusConfig.icon}
          label={statusConfig.label}
          size="small"
          sx={{
            bgcolor: statusConfig.color,
            color: 'white',
            fontWeight: 600,
            '& .MuiChip-icon': {
              color: 'white',
            },
          }}
        />
        {loan.fineAmount > 0 && !loan.finePaid && (
          <Chip
            icon={<PaymentIcon />}
            label={`Fine: ₹${loan.fineAmount.toFixed(2)}`}
            size="small"
            color="error"
            sx={{
              fontWeight: 600,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Book Info Section */}
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            {/* Book Icon/Cover Placeholder */}
            <Box
              sx={{
                width: 80,
                height: 120,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => navigate(`/books/${loan.bookId}`)}
            >
              <MenuBookIcon sx={{ fontSize: 40, color: 'white', opacity: 0.9 }} />
            </Box>

            {/* Book Details */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  cursor: 'pointer',
                  color: '#1F2937',
                  '&:hover': {
                    color: '#667eea',
                  },
                  transition: 'color 0.2s',
                }}
                onClick={() => navigate(`/books/${loan.bookId}`)}
              >
                {loan.bookTitle}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {loan.bookAuthor}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NumbersIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  ISBN: {loan.bookIsbn}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Loan Details Section */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Checkout Date
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: '#667eea' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(loan.checkoutDate)}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Due Date
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: loan.isOverdue ? '#EF4444' : '#667eea' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: loan.isOverdue ? '#EF4444' : 'text.primary',
                    }}
                  >
                    {formatDate(loan.dueDate)}
                  </Typography>
                </Box>
              </Box>

              {loan.returnDate && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Return Date
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AssignmentReturnIcon sx={{ fontSize: 14, color: '#10B981' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatDate(loan.returnDate)}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Renewals
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutorenewIcon sx={{ fontSize: 14, color: '#667eea' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {loan.renewalCount} / {loan.maxRenewals}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(loan.renewalCount / loan.maxRenewals) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {getDueDateWarning()}
          </Box>
        </Box>

        {/* Notes Section */}
        {loan.notes && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              <strong>Note:</strong> {loan.notes}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/books/${loan.bookId}`)}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#764ba2',
                bgcolor: 'rgba(102, 126, 234, 0.05)',
              },
            }}
          >
            View Book Details
          </Button>

          {canRenew() && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AutorenewIcon />}
              onClick={() => onRenew(loan.id)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                },
                transition: 'all 0.3s',
              }}
            >
              Renew Book
            </Button>
          )}

          {loan.fineAmount > 0 && !loan.finePaid && (
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<PaymentIcon />}
              onClick={() => onPayFine(loan)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              Pay Fine ₹{loan.fineAmount.toFixed(2)}
            </Button>
          )}

          {loan.status === 'CHECKED_OUT' && !loan.returnDate && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<AssignmentReturnIcon />}
              onClick={() => onReturn(loan.id)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              Return Book
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoanCard;
