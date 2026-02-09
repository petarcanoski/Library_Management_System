import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Pagination,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  alpha,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkEmailReadIcon,
  DeleteSweep as DeleteSweepIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Book as BookIcon,
  Event as EventIcon,
  CardMembership as CardMembershipIcon,
  AttachMoney as AttachMoneyIcon,
  MoreVert as MoreVertIcon,
  LibraryBooks as LibraryBooksIcon,
  BookmarkAdd as BookmarkAddIcon,
  NewReleases as NewReleasesIcon,
  ThumbUp as ThumbUpIcon,
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Clear as ClearIcon,
  Inbox as InboxIcon,
} from '@mui/icons-material';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../../store/features/notification/notificationThunk';
import { formatDistanceToNow } from 'date-fns';

// Notification type configuration with icons and colors
const NOTIFICATION_TYPES = {
  DUE_DATE_ALERT: {
    label: 'Due Date Alert',
    icon: AccessTimeIcon,
    color: '#f44336',
    bgColor: alpha('#f44336', 0.1),
  },
  BOOK_REMINDER: {
    label: 'Book Reminder',
    icon: BookIcon,
    color: '#ff9800',
    bgColor: alpha('#ff9800', 0.1),
  },
  NEW_ARRIVAL: {
    label: 'New Arrival',
    icon: NewReleasesIcon,
    color: '#4caf50',
    bgColor: alpha('#4caf50', 0.1),
  },
  RECOMMENDATION: {
    label: 'Recommendation',
    icon: ThumbUpIcon,
    color: '#2196f3',
    bgColor: alpha('#2196f3', 0.1),
  },
  RESERVATION_AVAILABLE: {
    label: 'Reservation Available',
    icon: EventAvailableIcon,
    color: '#9c27b0',
    bgColor: alpha('#9c27b0', 0.1),
  },
  SUBSCRIPTION_EXPIRING: {
    label: 'Subscription Expiring',
    icon: CardMembershipIcon,
    color: '#ff5722',
    bgColor: alpha('#ff5722', 0.1),
  },
  FINE_NOTIFICATION: {
    label: 'Fine Notification',
    icon: AttachMoneyIcon,
    color: '#f44336',
    bgColor: alpha('#f44336', 0.1),
  },
  BOOK_RETURNED: {
    label: 'Book Returned',
    icon: AssignmentReturnIcon,
    color: '#00bcd4',
    bgColor: alpha('#00bcd4', 0.1),
  },
};

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { notifications, totalPages, currentPage, loading, unreadCount } = useSelector(
    (state) => state.notification
  );

  // State management
  const [tabValue, setTabValue] = useState('all'); // 'all', 'unread', 'read'
  const [page, setPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Load notifications on mount and when filters change
  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue, page, selectedTypes]);

  const loadNotifications = () => {
    const params = {
      page: page - 1,
      size: 20,
    };

    // Add read filter based on tab
    if (tabValue === 'unread') {
      params.isRead = false;
    } else if (tabValue === 'read') {
      params.isRead = true;
    }

    // Add type filters
    if (selectedTypes.length > 0) {
      params.types = selectedTypes.join(',');
    }

    dispatch(fetchNotifications(params));
  };

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setPage(1);
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
    loadNotifications();
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      await dispatch(deleteAllNotifications());
      loadNotifications();
    }
  };

  const handleCardClick = async (notification) => {
    if (!notification.isRead) {
      await dispatch(markNotificationAsRead(notification.id));
      loadNotifications();
    }
  };

  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async () => {
    if (selectedNotification && !selectedNotification.isRead) {
      await dispatch(markNotificationAsRead(selectedNotification.id));
      loadNotifications();
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedNotification) {
      await dispatch(deleteNotification(selectedNotification.id));
      loadNotifications();
    }
    handleMenuClose();
  };

  // Calculate counts
  const totalCount = notifications.length;
  const readCount = notifications.filter((n) => n.isRead).length;

  // Get empty state message
  const getEmptyMessage = () => {
    switch (tabValue) {
      case 'unread':
        return {
          icon: CheckCircleIcon,
          title: 'All caught up!',
          message: 'You have no unread notifications.',
        };
      case 'read':
        return {
          icon: InboxIcon,
          title: 'No read notifications',
          message: 'Your read notifications will appear here.',
        };
      default:
        return {
          icon: NotificationsIcon,
          title: 'No notifications yet',
          message: 'When you receive notifications, they will appear here.',
        };
    }
  };

  const emptyState = getEmptyMessage();
  const EmptyIcon = emptyState.icon;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
              }}
            >
              <NotificationsIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : 'All notifications are read'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Mark all as read">
                <span>
                  <Button
                    variant="outlined"
                    startIcon={<MarkEmailReadIcon />}
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    size="small"
                  >
                    Mark all as read
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Clear all notifications">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleClearAll}
                  disabled={totalCount === 0}
                  size="small"
                >
                  Clear all
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* Tabs */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              },
            }}
          >
            <Tab
              value="all"
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>All</span>
                  <Chip label={totalCount} size="small" />
                </Stack>
              }
            />
            <Tab
              value="unread"
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Unread</span>
                  <Chip
                    label={unreadCount}
                    size="small"
                    color="error"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
              }
            />
            <Tab
              value="read"
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Read</span>
                  <Chip label={readCount} size="small" />
                </Stack>
              }
            />
          </Tabs>
        </Paper>

        {/* Type Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {Object.entries(NOTIFICATION_TYPES).map(([type, config]) => {
              const Icon = config.icon;
              const isSelected = selectedTypes.includes(type);
              return (
                <Chip
                  key={type}
                  icon={<Icon />}
                  label={config.label}
                  onClick={() => handleTypeFilter(type)}
                  sx={{
                    bgcolor: isSelected ? config.bgColor : 'transparent',
                    borderColor: isSelected ? config.color : 'divider',
                    color: isSelected ? config.color : 'text.secondary',
                    fontWeight: isSelected ? 600 : 400,
                    '&:hover': {
                      bgcolor: config.bgColor,
                      borderColor: config.color,
                    },
                  }}
                  variant={isSelected ? 'filled' : 'outlined'}
                />
              );
            })}
            {selectedTypes.length > 0 && (
              <Chip
                icon={<ClearIcon />}
                label="Clear filters"
                onClick={handleClearFilters}
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        </Paper>

        {/* Notifications List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : notifications.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <EmptyIcon
              sx={{ fontSize: 80, color: 'text.disabled', mb: 2, opacity: 0.5 }}
            />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {emptyState.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {emptyState.message}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={() => handleCardClick(notification)}
                onMenuOpen={(e) => handleMenuOpen(e, notification)}
              />
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={handleMarkAsRead}
          disabled={selectedNotification?.isRead}
        >
          <MarkEmailReadIcon fontSize="small" sx={{ mr: 1 }} />
          Mark as read
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// NotificationCard Sub-component
const NotificationCard = ({ notification, onClick, onMenuOpen }) => {
  const typeConfig = NOTIFICATION_TYPES[notification.type] || {
    label: notification.type,
    icon: InfoIcon,
    color: '#757575',
    bgColor: alpha('#757575', 0.1),
  };

  const Icon = typeConfig.icon;
  const isUnread = !notification.isRead;

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isUnread ? 'primary.main' : 'divider',
        borderLeft: isUnread ? '4px solid' : '1px solid',
        borderLeftColor: isUnread ? 'primary.main' : 'divider',
        bgcolor: isUnread ? alpha('#2196f3', 0.02) : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-2px)',
          borderColor: 'primary.main',
        },
      }}
      elevation={0}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* Icon Avatar */}
          <Avatar
            sx={{
              bgcolor: typeConfig.bgColor,
              color: typeConfig.color,
              width: 48,
              height: 48,
            }}
          >
            <Icon />
          </Avatar>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={isUnread ? 700 : 600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {notification.title}
              </Typography>
              {isUnread && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    flexShrink: 0,
                  }}
                />
              )}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.5 }}
            >
              {notification.message}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={typeConfig.label}
                size="small"
                sx={{
                  bgcolor: typeConfig.bgColor,
                  color: typeConfig.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {notification.createdAt
                  ? formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })
                  : 'Just now'}
              </Typography>
              {isUnread && (
                <Chip
                  label="NEW"
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                />
              )}
            </Stack>
          </Box>

          {/* More Menu Button */}
          <IconButton
            size="small"
            onClick={onMenuOpen}
            sx={{
              opacity: 0.6,
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NotificationPage;
