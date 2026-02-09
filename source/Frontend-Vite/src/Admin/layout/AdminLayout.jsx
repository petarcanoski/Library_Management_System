import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
  alpha,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  EventNote as EventNoteIcon,
  RateReview as RateReviewIcon,
  Category as CategoryIcon,
  Payment as PaymentIcon,
  BookmarkAdded as ReservationIcon,
  People as PeopleIcon,
  CardMembership as CardMembershipIcon,
  Subscriptions as SubscriptionsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  AccountCircle as AccountCircleIcon,
  Shield as ShieldIcon,
  TrendingUp as TrendingUpIcon,
  Gavel as FineIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/features/auth/authSlice';
import ThemeToggle from '../../components/theme/ThemeToggle';

const drawerWidth = 280;

const navigationItems = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
    description: 'Overview & Analytics',
  },
  {
    title: 'Books',
    path: '/admin/books',
    icon: <MenuBookIcon />,
    description: 'Manage Library Books',
  },
  {
    title: 'Book Loans',
    path: '/admin/book-loans',
    icon: <EventNoteIcon />,
    description: 'Active & Historical Loans',
  },
  {
    title: 'Fines',
    path: '/admin/fines',
    icon: <FineIcon />,
    description: 'Fine Management',
  },
  {
    title: 'Reservations',
    path: '/admin/reservations',
    icon: <ReservationIcon />,
    description: 'Book Reservations',
  },
 
  {
    title: 'Genres',
    path: '/admin/genres',
    icon: <CategoryIcon />,
    description: 'Manage Categories',
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: <PeopleIcon />,
    description: 'User Management',
  },
  {
    title: 'Subscriptions',
    icon: <CardMembershipIcon />,
    description: 'Subscription Management',
    children: [
      {
        title: 'Subscription Plans',
        path: '/admin/subscription-plans',
        icon: <SubscriptionsIcon />,
      },
      {
        title: 'User Subscriptions',
        path: '/admin/user-subscriptions',
        icon: <CardMembershipIcon />,
      },
    ],
  },
  {
    title: 'Payments',
    path: '/admin/payments',
    icon: <PaymentIcon />,
    description: 'Transaction History',
  },
];

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
      if (isMobile) {
        setMobileOpen(false);
      }
    }
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Logo Section with Animation */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
            }}
          >
            <ShieldIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box
            sx={{
              position: 'absolute',
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              borderRadius: '50%',
              opacity: 0.3,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  opacity: 0.3,
                },
                '50%': {
                  transform: 'scale(1.2)',
                  opacity: 0,
                },
              },
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.5,
              background: 'linear-gradient(135deg, #ffffff 0%, #fecaca 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Admin Panel
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Control Center
          </Typography>
        </Box>
      </Box>

      {/* Admin Info Card */}
      {/* <Box
        sx={{
          m: 2.5,
          p: 2.5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(153, 27, 27, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(220, 38, 38, 0.2)',
            border: '1px solid rgba(255,255,255,0.12)',
          },
        }}
      >
        
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, position: 'relative' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.profilePicture}
              sx={{
                width: 56,
                height: 56,
                border: '3px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                fontSize: '1.5rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: '#22c55e',
                border: '3px solid #020617',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '1rem',
                mb: 0.25,
              }}
            >
              {user?.fullName || 'Admin User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                fontSize: '0.8rem',
                display: 'block',
              }}
            >
              {user?.email || 'admin@example.com'}
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<ShieldIcon sx={{ fontSize: 14 }} />}
          label="Administrator"
          size="small"
          sx={{
            bgcolor: 'rgba(220, 38, 38, 0.2)',
            color: '#fca5a5',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            fontWeight: 700,
            fontSize: '0.75rem',
            height: 26,
            '& .MuiChip-icon': {
              color: '#fca5a5',
            },
          }}
        />
      </Box> */}

      {/* <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2 }} /> */}

      {/* Navigation Items */}
      <List
        sx={{
          flex: 1,
          px: 2,
          py: 2,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
          // Hide scrollbar for Chrome, Safari and Opera
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {navigationItems.map((item) => {
          if (item.children) {
            return (
              <React.Fragment key={item.title}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <Tooltip title={item.description} placement="right" arrow>
                    <ListItemButton
                      onClick={() => setSubscriptionsOpen(!subscriptionsOpen)}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.5,
                        px: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '1px solid transparent',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                          transform: 'translateX(6px)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 48, color: 'rgba(255,255,255,0.7)' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          color: 'rgba(255,255,255,0.85)',
                        }}
                      />
                      {subscriptionsOpen ? (
                        <ExpandLess sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      ) : (
                        <ExpandMore sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
                <Collapse in={subscriptionsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      const active = isActive(child.path);
                      return (
                        <ListItem key={child.path} disablePadding sx={{ mb: 0.5 }}>
                          <ListItemButton
                            onClick={() => handleNavigation(child.path)}
                            sx={{
                              borderRadius: 2,
                              py: 1.2,
                              pl: 6,
                              pr: 2,
                              transition: 'all 0.3s ease',
                              bgcolor: active ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
                              border: active ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid transparent',
                              '&:hover': {
                                bgcolor: active
                                  ? 'rgba(220, 38, 38, 0.2)'
                                  : 'rgba(255,255,255,0.05)',
                                transform: 'translateX(5px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40, color: active ? '#fca5a5' : 'rgba(255,255,255,0.6)' }}>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.title}
                              primaryTypographyProps={{
                                fontWeight: active ? 700 : 500,
                                fontSize: '0.9rem',
                                color: active ? '#ffffff' : 'rgba(255,255,255,0.75)',
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <Tooltip title={item.description} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    bgcolor: active ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
                    border: active ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid transparent',
                    backdropFilter: active ? 'blur(10px)' : 'none',
                    '&:hover': {
                      bgcolor: active
                        ? alpha('#dc2626', 0.25)
                        : 'rgba(255,255,255,0.05)',
                      transform: 'translateX(6px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    },
                    '&::before': active
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: '70%',
                          borderRadius: '0 4px 4px 0',
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          boxShadow: '0 0 12px rgba(220, 38, 38, 0.6)',
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 48,
                      color: active ? '#fca5a5' : 'rgba(255,255,255,0.7)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.95rem',
                      color: active ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    }}
                  />
                  {active && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#fca5a5',
                        boxShadow: '0 0 12px rgba(252, 165, 165, 0.8)',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2 }} />

      {/* Logout Button */}
      <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2.5,
            py: 1.5,
            px: 2,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 42, color: '#f87171' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#fca5a5',
            }}
          />
        </ListItemButton>
      </Box>

      {/* Bottom Branding */}
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            opacity: 0.4,
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          © 2025 Admin Panel. Secured.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {navigationItems.find((item) => {
              if (item.children) {
                return item.children.some((child) => isActive(child.path));
              }
              return isActive(item.path);
            })?.title || 'Admin Dashboard'}
          </Typography>

          {/*<Tooltip title="Notifications">*/}
          {/*  <IconButton>*/}
          {/*    <Badge badgeContent={5} color="error">*/}
          {/*      <NotificationsIcon />*/}
          {/*    </Badge>*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}

          {/*<Tooltip title="Settings">*/}
          {/*  <IconButton sx={{ ml: 1 }}>*/}
          {/*    <SettingsIcon />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}

          {/*<Box sx={{ ml: 2 }}>*/}
          {/*  <ThemeToggle />*/}
          {/*</Box>*/}

          <Tooltip title="Account">
            <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
              <Avatar src={user?.profilePicture} sx={{ width: 36, height: 36 }}>
                {user?.fullName?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/*<MenuItem onClick={handleProfileMenuClose}>*/}
        {/*  <ListItemIcon>*/}
        {/*    <AccountCircleIcon fontSize="small" />*/}
        {/*  </ListItemIcon>*/}
        {/*  Profile*/}
        {/*</MenuItem>*/}
        {/*<MenuItem onClick={handleProfileMenuClose}>*/}
        {/*  <ListItemIcon>*/}
        {/*    <SettingsIcon fontSize="small" />*/}
        {/*  </ListItemIcon>*/}
        {/*  Settings*/}
        {/*</MenuItem>*/}
        {/*<Divider />*/}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
