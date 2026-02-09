import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

/**
 * EmptyState Component
 * Displays an empty state with appropriate message and CTA based on filter
 *
 * @param {string} filterType - Current filter (all, active, overdue, returned)
 * @returns {JSX.Element} Empty state component
 */
const EmptyState = ({ filterType = 'all' }) => {
  const navigate = useNavigate();

  const getEmptyStateContent = () => {
    switch (filterType.toLowerCase()) {
      case 'active':
        return {
          icon: <HourglassEmptyIcon sx={{ fontSize: 80 }} />,
          title: 'No Active Loans',
          message: "You don't have any books currently checked out.",
          buttonText: 'Browse Books',
        };
      case 'overdue':
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 80, color: '#10B981' }} />,
          title: 'Great Job!',
          message: "You don't have any overdue books. Keep up the good work!",
          buttonText: 'Browse More Books',
        };
      case 'returned':
        return {
          icon: <MenuBookIcon sx={{ fontSize: 80 }} />,
          title: 'No Returned Books',
          message: "You haven't returned any books yet.",
          buttonText: 'Borrow Books',
        };
      default:
        return {
          icon: <MenuBookIcon sx={{ fontSize: 80 }} />,
          title: 'No Books Found',
          message: "You haven't borrowed any books yet. Start exploring our collection!",
          buttonText: 'Browse Books',
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <Card className="text-center py-16 animate-fade-in-up animation-delay-400">
      <CardContent>
        <div className="text-gray-400 mb-4 animate-fade-in-scale animation-delay-600">
          {content.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in-up animation-delay-800">
          {content.title}
        </h3>
        <p className="text-gray-600 mb-6 animate-fade-in-up animation-delay-1000">
          {content.message}
        </p>
        <Button
          variant="contained"
          onClick={() => navigate('/books')}
          className="animate-fade-in-scale"
          sx={{
            bgcolor: '#4F46E5',
            px: 4,
            py: 1.5,
            '&:hover': {
              bgcolor: '#4338CA',
              transform: 'scale(1.05)',
              transition: 'all 0.2s',
            },
          }}
        >
          {content.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
