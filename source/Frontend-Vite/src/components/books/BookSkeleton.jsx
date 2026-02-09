import React from 'react';

/**
 * BookSkeleton Component
 * Loading skeleton for book cards while data is being fetched
 */
const BookSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>

        {/* Author Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Info Skeleton */}
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/5"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-2 mt-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * BookSkeletonGrid Component
 * Renders multiple book skeletons in a grid
 *
 * @param {number} count - Number of skeleton cards to display
 */
export const BookSkeletonGrid = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BookSkeleton key={index} />
      ))}
    </>
  );
};

export default BookSkeleton;
