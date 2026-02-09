import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import bookReducer from './features/books/bookSlice';
import bookLoanReducer from './features/bookLoans/bookLoanSlice';
import subscriptionReducer from './features/subscriptions/subscriptionSlice';
import subscriptionPlanReducer from './features/subscriptionPlans/subscriptionPlanSlice';
import genreReducer from './features/genres/genreSlice';
import paymentReducer from './features/payments/paymentSlice';
import bookReviewReducer from './features/reviews/bookReviewSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import reservationReducer from './features/reservations/reservationSlice';
import notificationReducer from './features/notification/notificationSlice';
import fineReducer from './features/fines/fineSlice';

/**
 * Redux store configuration for Library Management System
 * Configured with Redux Toolkit
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    bookLoans: bookLoanReducer,
    subscriptions: subscriptionReducer,
    subscriptionPlans: subscriptionPlanReducer,
    genres: genreReducer,
    payments: paymentReducer,
    bookReviews: bookReviewReducer,
    wishlist: wishlistReducer,
    reservations: reservationReducer,
    notification: notificationReducer,
    fines: fineReducer,
  },

});

export default store;
