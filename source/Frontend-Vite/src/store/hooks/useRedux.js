import { useDispatch, useSelector } from 'react-redux';

/**
 * Custom hooks for Redux store
 * Provides type-safe access to dispatch and selectors
 */

// Hook to use dispatch with type safety
export const useAppDispatch = () => useDispatch();

// Hook to use selector with type safety
export const useAppSelector = useSelector;

// Auth hooks
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  return auth;
};

// Books hooks
export const useBooks = () => {
  const books = useAppSelector((state) => state.books);
  return books;
};

// Book loans hooks
export const useBookLoans = () => {
  const bookLoans = useAppSelector((state) => state.bookLoans);
  return bookLoans;
};

// Subscriptions hooks
export const useSubscriptions = () => {
  const subscriptions = useAppSelector((state) => state.subscriptions);
  return subscriptions;
};

// Genres hooks
export const useGenres = () => {
  const genres = useAppSelector((state) => state.genres);
  return genres;
};

// Payments hooks
export const usePayments = () => {
  const payments = useAppSelector((state) => state.payments);
  return payments;
};
