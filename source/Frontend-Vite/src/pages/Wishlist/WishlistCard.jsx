import { Cancel, CheckCircle, Delete, Favorite } from "@mui/icons-material";
import { Button, Checkbox, Chip, IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const WishlistCard = ({
  item,
  isSelected,
  handleSelectItem,
  handleRemoveItem,
  handleReserveBook,
  isAvailable,
}) => {
  const navigate = useNavigate();
  return (
    <div
      key={item.id}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 ${
        isSelected ? "ring-2 ring-indigo-500" : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onChange={() => handleSelectItem(item.id)}
          sx={{
            color: "#4F46E5",
            "&.Mui-checked": { color: "#4F46E5" },
          }}
        />

        {/* Book Cover */}
        <div
          className="w-24 h-36 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/books/${item.book.id}`)}
        >
          {item.book.coverImageUrl ? (
            <img
              src={item.book.coverImageUrl}
              alt={item.book.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Favorite sx={{ fontSize: 40, color: "#DC2626", opacity: 0.3 }} />
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className="text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => navigate(`/books/${item.book.id}`)}
              >
                {item.book.title}
              </h3>
              <p className="text-gray-600 mb-2">{item.book.author}</p>
            </div>

            <IconButton
              onClick={() => handleRemoveItem(item.book.id)}
              sx={{ color: "#DC2626" }}
            >
              <Delete />
            </IconButton>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Chip
              label={item.book.genreName || "General"}
              size="small"
              sx={{ bgcolor: "#EEF2FF", color: "#4F46E5" }}
            />
            {isAvailable ? (
              <Chip
                icon={<CheckCircle />}
                label={`${item.book.availableCopies} available`}
                size="small"
                color="success"
              />
            ) : (
              <Chip
                icon={<Cancel />}
                label="Unavailable"
                size="small"
                color="error"
              />
            )}
            {item.notes && (
              <Chip
                label={`Note: ${item.notes}`}
                size="small"
                sx={{ bgcolor: "#FEF3C7", color: "#92400E" }}
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Added: {new Date(item.addedAt).toLocaleDateString()}
            </p>

            <div className="flex items-center space-x-2">
              <div>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/books/${item.book.id}`)}
                  sx={{ borderColor: "#4F46E5", color: "#4F46E5" }}
                >
                  View Details
                </Button>
              </div>
              {isAvailable && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleReserveBook(item.book.id)}
                  sx={{ bgcolor: "#4F46E5" }}
                >
                  Reserve Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
