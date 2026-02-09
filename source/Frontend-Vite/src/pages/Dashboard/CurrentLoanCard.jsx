import { AccessTime, LibraryBooks } from "@mui/icons-material";
import React from "react";
import GetStatusChip from "./getStatusChip";
import { Button, Chip } from "@mui/material";
import { getDaysRemainingColor } from "./utils";
import { useNavigate } from "react-router-dom";

const CurrentLoanCard = ({ loan }) => {
  const navigate = useNavigate();
  return (
    <div
      key={loan.id}
      className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4 flex-1">
        {loan?.bookCoverImage ? (
          <img
            src={loan.bookCoverImage}
            alt={loan.bookTitle}
            className="w-16 h-24 rounded-lg"
          />
        ) : (
          <div className="w-16 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
            <LibraryBooks
              sx={{
                fontSize: 32,
                color: "#4F46E5",
                opacity: 0.3,
              }}
              z
            />
          </div>
        )}

        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {loan.bookTitle}
          </h4>
          <p className="text-gray-600 mb-2">{loan.bookAuthor}</p>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <AccessTime sx={{ fontSize: 16 }} />
              <span>Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
            </div>
            <GetStatusChip status={loan.status} />
            <Chip
              label={`${
                loan.remainingDays > 0 ? loan.remainingDays : loan.overdueDays
              } days ${loan.remainingDays >= 0 ? "remaining" : "overdue"}`}
              color={getDaysRemainingColor(loan.remainingDays)}
              size="small"
              variant="outlined"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/books/${loan?.bookId}`)}
            sx={{ borderColor: "#4F46E5", color: "#4F46E5" }}
          >
            View
          </Button>
        </div>
        {/* <Button variant="contained" size="small" sx={{ bgcolor: "#4F46E5" }}>
          Renew
        </Button> */}
      </div>
    </div>
  );
};

export default CurrentLoanCard;
