import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuth2Callback from "./pages/OAuth2Callback";
import BookDetailsPage from "./pages/BookDetailsPage";


import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./admin/layout/AdminLayout";

import "./App.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCurrentUser } from "./store/features/auth/authThunk";
import AdminBookLoansPage from "./Admin/pages/bookLoans/AdminBookLoansPage";
import AdminReservationsPage from "./Admin/pages/reservations/AdminReservationsPage";
import AdminBookReviewsPage from "./Admin/pages/bookReviews/AdminBookReviewsPage";
import AdminSubscriptionPlansPage from "./Admin/pages/subscriptions/AdminSubscriptionPlansPage";
import AdminUserSubscriptionsPage from "./Admin/pages/subscriptions/AdminUserSubscriptionsPage";
import AdminPaymentsPage from "./Admin/pages/payments/AdminPaymentsPage";
import AdminUsersPage from "./Admin/pages/users/AdminUsersPage";
import AdminGenresPage from "./Admin/pages/genres/AdminGenresPage";
import SubscriptionsPage from "./pages/subscription/SubscriptionsPage";
import MyLoansPage from "./pages/MyLoan/MyLoansPage";
import MyFinesPage from "./pages/MyFines/MyFinesPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotificationPage from "./components/notification/NotificationPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ReservationsPage from "./pages/Reservations/ReservationsPage";
import BooksPage from "./pages/Books/BooksPage";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import AdminFinesPage from "./Admin/pages/fines/AdminFinesPage";
import WishlistPage from "./pages/Wishlist/WishlistPage";

// Lazy load admin pages
const AdminBooksPage = React.lazy(() => import("./admin/pages/books/AdminBooksPage"));

function App() {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();


  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  const isAdmin = auth.user?.role === "ROLE_ADMIN" || auth.user?.role === "ADMIN";

  // Show loading state while fetching user on initial load
  if (auth.loading && !auth.user && localStorage.getItem("jwt")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated based on token and user data
  const isAuthenticated = auth.isAuthenticated && (auth.user || localStorage.getItem("jwt"));

  return (
      <Routes>
        {/* Public Routes - Always accessible */}
        {!isAuthenticated && (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          </>
        )}

        {/* Admin Routes */}
        {isAdmin && (
          <Route  element={<AdminLayout />}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/book-loans" element={<AdminBookLoansPage />} />
            <Route path="/admin/reservations" element={<AdminReservationsPage />} />
            <Route path="/admin/reviews" element={<AdminBookReviewsPage />} />
            <Route path="/admin/genres" element={<AdminGenresPage />} />
            <Route path="/admin/subscription-plans" element={<AdminSubscriptionPlansPage />} />
            <Route path="/admin/user-subscriptions" element={<AdminUserSubscriptionsPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/fines" element={<AdminFinesPage />} />
            <Route
              path="/admin/books"
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AdminBooksPage />
                </React.Suspense>
              }
            />
          </Route>
        )}

        {/* User Dashboard Routes with Sidebar Layout */}
        {isAuthenticated && !isAdmin && (
          <Route element={<UserLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailsPage />} />
            <Route path="/my-loans" element={<MyLoansPage />} />
            <Route path="/my-reservations" element={<ReservationsPage />} />
            <Route path="/my-fines" element={<MyFinesPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/payment-success/:subscriptionId" element={<PaymentSuccess />} />
          </Route>
        )}
      </Routes>

  );
}

export default App;
