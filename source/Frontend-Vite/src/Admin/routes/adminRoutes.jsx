import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import DashboardPage from '../pages/DashboardPage';

// Lazy load pages for better performance
const AdminBooksPage = React.lazy(() => import('../pages/books/AdminBooksPage'));
const AdminBookLoansPage = React.lazy(() => import('../pages/bookLoans/AdminBookLoansPage'));
const AdminBookReviewsPage = React.lazy(() => import('../pages/bookReviews/AdminBookReviewsPage'));
const AdminFinesPage = React.lazy(() => import('../pages/fines/AdminFinesPage'));
const AdminGenresPage = React.lazy(() => import('../pages/genres/AdminGenresPage'));
const AdminPaymentsPage = React.lazy(() => import('../pages/payments/AdminPaymentsPage'));
const AdminReservationsPage = React.lazy(() => import('../pages/reservations/AdminReservationsPage'));
const AdminUsersPage = React.lazy(() => import('../pages/users/AdminUsersPage'));
const AdminSubscriptionPlansPage = React.lazy(() => import('../pages/subscriptions/AdminSubscriptionPlansPage'));
const AdminUserSubscriptionsPage = React.lazy(() => import('../pages/subscriptions/AdminUserSubscriptionsPage'));

// Admin route configuration
export const adminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: <DashboardPage />,
    },
    {
      path: 'books',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminBooksPage />
        </React.Suspense>
      ),
    },
    {
      path: 'book-loans',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminBookLoansPage />
        </React.Suspense>
      ),
    },
    {
      path: 'fines',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminFinesPage />
        </React.Suspense>
      ),
    },
    {
      path: 'reservations',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminReservationsPage />
        </React.Suspense>
      ),
    },
    {
      path: 'reviews',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminBookReviewsPage />
        </React.Suspense>
      ),
    },
    {
      path: 'genres',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminGenresPage />
        </React.Suspense>
      ),
    },
    {
      path: 'users',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminUsersPage />
        </React.Suspense>
      ),
    },
    {
      path: 'subscription-plans',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminSubscriptionPlansPage />
        </React.Suspense>
      ),
    },
    {
      path: 'user-subscriptions',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminUserSubscriptionsPage />
        </React.Suspense>
      ),
    },
    {
      path: 'payments',
      element: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <AdminPaymentsPage />
        </React.Suspense>
      ),
    },
  ],
};

export default adminRoutes;
