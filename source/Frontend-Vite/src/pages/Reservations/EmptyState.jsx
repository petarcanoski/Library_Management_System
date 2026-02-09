import React from "react";
import { BookmarkAdd, Book } from "@mui/icons-material";

const EmptyState = ({ openDialog }) => (
  <div className="bg-gray-50 p-16 text-center rounded-2xl border-2 border-dashed border-gray-300">
    <Book className="text-gray-400 w-16 h-16 mx-auto mb-4" />
    <h3 className="text-2xl font-bold text-gray-700 mb-2">No reservations found</h3>
    <p className="text-gray-500 mb-6">You haven’t made any reservations yet</p>
    <button
      onClick={openDialog}
      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
    >
      <BookmarkAdd />
      Create Your First Reservation
    </button>
  </div>
);

export default EmptyState;
