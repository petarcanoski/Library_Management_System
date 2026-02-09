import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/features/auth/authSlice';
import { navigationItems, secondaryItems } from './navigationItems';
import {
  Box,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const SidebarDrawer = ({ isMobile, setMobileOpen, handleProfileMenuClose }) => {
  const { myLoans } = useSelector((state) => state.bookLoans);
 
  const { activeSubscription } = useSelector((state) => state.subscriptions);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Fixed: Add useLocation hook

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getBadgeCount = (badge) => {
    if (badge === 'loans') {
      return (
        myLoans?.filter((loan) => loan.status === 'ACTIVE' || loan.status === 'OVERDUE')
          .length || 0
      );
    }
    if (badge === 'subscription') {
      return activeSubscription ? 1 : 0;
    }
    return 0;
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
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
          background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 100%)',
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
          // borderBottom: '1px solid rgba(255,255,255,0.05)',
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            }}
          >
            <MenuBookIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box
            sx={{
              position: 'absolute',
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FINKI_Books
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
            Library Hub
          </Typography>
        </Box>
      </Box>

     
     

      {/* Main Navigation Items */}
        <List
            sx={{
                flex: 1,
                px: 2,
                py: 2,
                position: 'relative',
                zIndex: 1,
                overflowY: 'auto',

                /* ===== Scrollbar styling ===== */
                '&::-webkit-scrollbar': {
                    width: '10px', // 👈 slightly wider
                },

                '&::-webkit-scrollbar-track': {
                    background: 'transparent', // 👈 blends with sidebar
                    marginTop: '8px',
                    marginBottom: '8px',
                },

                '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(180deg, rgba(129,140,248,0.6), rgba(168,85,247,0.6))',
                    borderRadius: '10px',
                    border: '2px solid transparent',
                    backgroundClip: 'content-box',
                },

                '&::-webkit-scrollbar-thumb:hover': {
                    background: 'linear-gradient(180deg, rgba(129,140,248,0.9), rgba(168,85,247,0.9))',
                },

                /* Firefox */
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(129,140,248,0.6) transparent',
            }}
        >



          {navigationItems.map((item) => {
          const active = isActive(item.path);
          const badgeCount = item.badge ? getBadgeCount(item.badge) : 0;

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
                    bgcolor: active
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)'
                      : 'transparent',
                    border: active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                    backdropFilter: active ? 'blur(10px)' : 'none',
                    '&:hover': {
                      bgcolor: active
                        ? alpha('#6366f1', 0.3)
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
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 0 12px rgba(102, 126, 234, 0.6)',
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 48,
                      color: active ? '#818cf8' : 'rgba(255,255,255,0.7)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {badgeCount > 0 ? (
                      <Badge
                        badgeContent={badgeCount}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.7rem',
                            height: 18,
                            minWidth: 18,
                            fontWeight: 700,
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                          },
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
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
                        bgcolor: '#818cf8',
                        boxShadow: '0 0 12px rgba(129, 140, 248, 0.8)',
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

      {/* Secondary Items */}
      <List sx={{ px: 2, py: 1.5, position: 'relative', zIndex: 1 }}>
        {secondaryItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  px: 2,
                  transition: 'all 0.3s ease',
                  bgcolor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: active ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: active
                      ? 'rgba(99, 102, 241, 0.2)'
                      : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: active ? '#818cf8' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    fontSize: '0.9rem',
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.75)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

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
          // borderTop: '1px solid rgba(255,255,255,0.05)',
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
          © 2026 FINKI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarDrawer;
