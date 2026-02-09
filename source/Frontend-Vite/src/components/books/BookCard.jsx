import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';

/**
 * BookCard Component
 * Displays a single book in the catalog with cover, title, author, and availability
 *
 * @param {Object} book - Book object containing all book details
 * @param {Function} onReserve - Callback function when reserve button is clicked
 */
const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewDetails = () => {
    navigate(`/books/${book.id}`);
  };



  // Check if book is available
  const isAvailable = book.availableCopies > 0;

  return (
    <div
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:-translate-y-1"
      onClick={handleViewDetails}
    >
      {/* Book Cover */}
      <div className="relative h-64 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MenuBookIcon sx={{ fontSize: 80, color: '#4F46E5', opacity: 0.3 }} />
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <div className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <CheckCircleIcon sx={{ fontSize: 14 }} />
              <span>Available</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <CancelIcon sx={{ fontSize: 14 }} />
              <span>Checked Out</span>
            </div>
          )}
        </div>

        {/* Genre Badge */}
        {book.genre && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full text-xs font-medium shadow-md">
              {book.genre.name}
            </span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center space-x-2 text-gray-600 mb-3">
          <PersonIcon sx={{ fontSize: 16 }} />
          <span className="text-sm line-clamp-1">{book.author}</span>
        </div>

        {/* ISBN & Copies Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>ISBN: {book.isbn}</span>
          <span>{book.availableCopies}/{book.totalCopies} copies</span>
        </div>

        {/* Description Preview */}
        {book.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {book.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outlined"
            fullWidth
            onClick={handleViewDetails}
            sx={{
              textTransform: 'none',
              borderColor: '#4F46E5',
              color: '#4F46E5',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#4338CA',
                bgcolor: '#EEF2FF',
              },
            }}
          >
            View
          </Button>

          
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default BookCard;
