import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  EventNote as EventNoteIcon,
  CardMembership as CardMembershipIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";

import React from "react";


export const secondaryItems = [
  {
    title: 'Profile',
    path: '/profile',
    icon: <PersonIcon />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];

export const navigationItems = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
    description: 'Overview & Stats',
  },
  {
    title: 'Browse Books',
    path: '/books',
    icon: <MenuBookIcon />,
    description: 'Explore Library',
  },
  {
    title: 'My Loans',
    path: '/my-loans',
    icon: <EventNoteIcon />,
    description: 'Active & History',
    badge: 'loans',
  },
  {
    title: 'My Reservations',
    path: '/my-reservations',
    icon: <EventNoteIcon />,
    description: 'Active & History',
    badge: 'reservations',
  },
  {
    title: 'My Fines',
    path: '/my-fines',
    icon: <ReceiptIcon />,
    description: 'Pending & Paid',
    badge: 'fines',
  },
  {
    title: 'Subscriptions',
    path: '/subscriptions',
    icon: <CardMembershipIcon />,
    description: 'Manage Plans',
    badge: 'subscription',
  },
  {
    title: 'Wishlist',
    path: '/wishlist',
    icon: <FavoriteIcon />,
    description: 'Saved Books',
  },
];