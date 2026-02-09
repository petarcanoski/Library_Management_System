import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { logout } from '../../store/features/auth/authSlice';


/**
 * AppNavbar Component
 * Enhanced navigation bar for authenticated users
 */
const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Browse Books', path: '/books', icon: LibraryBooksIcon },
    { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon, authRequired: true },
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await dispatch(logout());
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Mock notifications count
  const notificationsCount = 3;
  const wishlistCount = 5;

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <MenuBookIcon sx={{ fontSize: 24, color: 'white' }} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              FINKI Library
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;

              const Icon = link.icon;
              const isActive = isActivePath(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {Icon && <Icon sx={{ fontSize: 20 }} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <IconButton
                  onClick={() => navigate('/wishlist')}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteIcon className="text-gray-700" />
                  </Badge>
                </IconButton>

                {/* Notifications */}
                <IconButton
                  onClick={() => navigate('/notifications')}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <Badge badgeContent={notificationsCount} color="error">
                    <NotificationsIcon className="text-gray-700" />
                  </Badge>
                </IconButton>

                {/* Profile Menu */}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  className="ml-2"
                >
                  <Avatar
                    sx={{
                      bgcolor: '#4F46E5',
                      width: 40,
                      height: 40,
                      fontSize: '1rem',
                    }}
                  >
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;

              const Icon = link.icon;
              const isActive = isActivePath(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {Icon && <Icon sx={{ fontSize: 20 }} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <Divider className="my-2" />
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FavoriteIcon sx={{ fontSize: 20 }} />
                    <span>Wishlist</span>
                  </div>
                  <Badge badgeContent={wishlistCount} color="error" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PersonIcon sx={{ fontSize: 20 }} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogoutIcon sx={{ fontSize: 20 }} />
                  <span>Logout</span>
                </button>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900">
            {user?.fullName || 'User'}
          </p>
          <p className="text-xs text-gray-600">{user?.email || ''}</p>
        </div>

        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/profile');
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/dashboard');
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/settings');
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{ py: 1.5, color: '#DC2626' }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#DC2626' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900">Notifications</p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Sample notifications */}
          <MenuItem sx={{ py: 2, px: 3, whiteSpace: 'normal' }}>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Book Due Tomorrow
              </p>
              <p className="text-xs text-gray-600 mt-1">
                "The Great Gatsby" is due tomorrow. Please return or renew.
              </p>
              <p className="text-xs text-indigo-600 mt-1">2 hours ago</p>
            </div>
          </MenuItem>

          <Divider />

          <MenuItem sx={{ py: 2, px: 3, whiteSpace: 'normal' }}>
            <div>
              <p className="text-sm font-medium text-gray-900">
                New Book Available
              </p>
              <p className="text-xs text-gray-600 mt-1">
                "Atomic Habits" from your wishlist is now available!
              </p>
              <p className="text-xs text-indigo-600 mt-1">5 hours ago</p>
            </div>
          </MenuItem>

          <Divider />

          <MenuItem sx={{ py: 2, px: 3, whiteSpace: 'normal' }}>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Reservation Confirmed
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Your reservation for "1984" has been confirmed.
              </p>
              <p className="text-xs text-indigo-600 mt-1">1 day ago</p>
            </div>
          </MenuItem>
        </div>

        <Divider />

        <MenuItem
          onClick={handleNotificationMenuClose}
          sx={{ py: 1.5, justifyContent: 'center', color: '#4F46E5' }}
        >
          View All Notifications
        </MenuItem>
      </Menu>
    </nav>
  );
};

export default AppNavbar;
