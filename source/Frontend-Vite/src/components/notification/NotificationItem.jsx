import React from 'react';
import { useDispatch } from 'react-redux';
import {
  MenuItem,
  Box,
  Typography,
  IconButton,
  Avatar,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
  Book as BookIcon,
  Event as EventIcon,
  CardMembership as CardMembershipIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import {
  markNotificationAsRead,
  deleteNotification,
} from '../../store/features/notification/notificationThunk';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onClose }) => {
  const dispatch = useDispatch();

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteNotification(notification.id));
  };

  const getIcon = (type) => {
    const iconProps = { fontSize: 'small' };
    switch (type) {
      case 'DUE_DATE_ALERT':
        return <WarningIcon {...iconProps} />;
      case 'BOOK_REMINDER':
        return <BookIcon {...iconProps} />;
      case 'NEW_ARRIVAL':
        return <NotificationsIcon {...iconProps} />;
      case 'RECOMMENDATION':
        return <InfoIcon {...iconProps} />;
      case 'RESERVATION_AVAILABLE':
        return <EventIcon {...iconProps} />;
      case 'SUBSCRIPTION_EXPIRING':
        return <CardMembershipIcon {...iconProps} />;
      case 'FINE_NOTIFICATION':
        return <AttachMoneyIcon {...iconProps} />;
      case 'BOOK_RETURNED':
        return <CheckCircleIcon {...iconProps} />;
      default:
        return <NotificationsIcon {...iconProps} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'DUE_DATE_ALERT':
      case 'FINE_NOTIFICATION':
        return 'error';
      case 'BOOK_REMINDER':
        return 'warning';
      case 'NEW_ARRIVAL':
      case 'RECOMMENDATION':
        return 'info';
      case 'RESERVATION_AVAILABLE':
      case 'BOOK_RETURNED':
        return 'success';
      default:
        return 'primary';
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const color = getColor(notification.type);

  return (
    <MenuItem
      onClick={handleMarkAsRead}
      sx={{
        py: 1.5,
        px: 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        bgcolor: notification.isRead ? 'transparent' : (theme) => alpha(theme.palette.primary.main, 0.05),
        borderLeft: notification.isRead ? 'none' : (theme) => `3px solid ${theme.palette.primary.main}`,
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.action.hover, 0.08),
        },
      }}
    >
      {/* Icon */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
          color: (theme) => theme.palette[color].main,
        }}
      >
        {getIcon(notification.type)}
      </Avatar>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: notification.isRead ? 400 : 600,
            mb: 0.5,
            color: 'text.primary',
          }}
        >
          {notification.title}
        </Typography>

        {notification.message && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {notification.message}
          </Typography>
        )}

        <Typography variant="caption" color="text.disabled">
          {formatTime(notification.createdAt)}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{ color: 'text.secondary' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </MenuItem>
  );
};

export default NotificationItem;
