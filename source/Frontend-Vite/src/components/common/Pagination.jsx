import React from 'react';
import { IconButton, Select, MenuItem } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Pagination Component
 * Reusable pagination with page numbers, navigation, and items per page selector
 *
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items per page
 * @param {Function} onPageChange - Callback when page changes
 * @param {Function} onItemsPerPageChange - Callback when items per page changes
 * @param {Array} itemsPerPageOptions - Options for items per page (default: [10, 20, 50, 100])
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
}) => {
  // Calculate displayed page range
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  // Calculate item range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-700">
          <span>
            Showing <span className="font-semibold">{startItem}</span> to{' '}
            <span className="font-semibold">{endItem}</span> of{' '}
            <span className="font-semibold">{totalItems}</span> results
          </span>

          {/* Items Per Page Selector */}
          {onItemsPerPageChange && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Show:</span>
              <Select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4F46E5',
                  },
                }}
              >
                {itemsPerPageOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-1">
          {/* First Page */}
          <IconButton
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            size="small"
            sx={{
              color: currentPage === 1 ? '#9CA3AF' : '#4F46E5',
              '&:hover': {
                bgcolor: '#EEF2FF',
              },
            }}
          >
            <FirstPageIcon />
          </IconButton>

          {/* Previous Page */}
          <IconButton
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            size="small"
            sx={{
              color: currentPage === 1 ? '#9CA3AF' : '#4F46E5',
              '&:hover': {
                bgcolor: '#EEF2FF',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`dots-${index}`} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <IconButton
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            size="small"
            sx={{
              color: currentPage === totalPages ? '#9CA3AF' : '#4F46E5',
              '&:hover': {
                bgcolor: '#EEF2FF',
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Last Page */}
          <IconButton
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            size="small"
            sx={{
              color: currentPage === totalPages ? '#9CA3AF' : '#4F46E5',
              '&:hover': {
                bgcolor: '#EEF2FF',
              },
            }}
          >
            <LastPageIcon />
          </IconButton>
        </div>
      </div>

      {/* Mobile-friendly compact view */}
      <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page <span className="font-semibold">{currentPage}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
