import React from "react";
import { AccessAlarm, Book, CheckCircle, Close, HourglassBottom, X } from "@mui/icons-material";
import { getStatusColor } from "./getStatusColor";
import { getTimeRemaining } from "./getTimeRemaining";
import { useState } from "react";
import { formatDate } from "../../utils/formateDate";
import { CalendarIcon } from "@mui/x-date-pickers";

const ReservationCard = ({ reservation, index, onCancel }) => {
  const [queuePositions] = useState({});

  const queuePos = queuePositions[reservation.id];
  const statusColors = getStatusColor(reservation.status);
  const timeRemaining = getTimeRemaining(reservation.expiresAt);

  const handleFulfillReservation = async () => {
    // showSnackbar("Reservation fulfilled successfully!", "success");
  };

    const getStatusIcon = (status) => {
      const iconClass = "w-5 h-5";
      const icons = {
        PENDING: <HourglassBottom className={iconClass} />,
        AVAILABLE: <CalendarIcon className={iconClass} />,
        FULFILLED: <CheckCircle className={iconClass} />,
        CANCELLED: <Close className={iconClass} />,
        EXPIRED: <AccessAlarm className={iconClass} />,
      };
      return icons[status] || <AccessAlarm className={iconClass} />;
    };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 animate-fade-in-up"
      style={{
        animationDelay: `${index * 100}ms`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      {/* Status Banner */}
      <div
        className={`bg-gradient-to-r ${statusColors.gradient} px-4 py-3 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <span className={statusColors.text}>
            {getStatusIcon(reservation.status)}
          </span>
          <span
            className={`${statusColors.text} font-bold text-sm uppercase tracking-wider`}
          >
            {reservation.status}
          </span>
        </div>
        {reservation.status === "AVAILABLE" && timeRemaining && (
          <div
            className={`flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-semibold ${
              timeRemaining.includes("Expired")
                ? "text-red-600 animate-pulse"
                : "text-gray-700"
            }`}
          >
            <AccessAlarm className="w-3 h-3" />
            {timeRemaining}
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Book Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Book ID
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                #{reservation.bookId}
              </h3>
            </div>
          </div>
          <p className="text-base font-medium text-gray-700 ml-12">
            {reservation.bookTitle}
          </p>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        {/* Timeline */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <AccessAlarm className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Reserved
              </p>
              <p className="text-sm font-semibold text-gray-700">
                {formatDate(reservation.reservedAt)}
              </p>
            </div>
          </div>

          {reservation.availableAt && (
            <div className="flex items-start gap-2">
              <CalendarIcon className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase">
                  Available
                </p>
                <p className="text-sm font-semibold text-green-700">
                  {formatDate(reservation.availableAt)}
                </p>
              </div>
            </div>
          )}

          {reservation.expiresAt && (
            <div className="flex items-start gap-2">
              <Notifications className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase">
                  Expires
                </p>
                <p className="text-sm font-semibold text-red-700">
                  {formatDate(reservation.expiresAt)}
                </p>
              </div>
            </div>
          )}

          {reservation.fulfilledAt && (
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase">
                  Fulfilled
                </p>
                <p className="text-sm font-semibold text-blue-700">
                  {formatDate(reservation.fulfilledAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Queue Position */}
        {queuePos && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <MusicNote className="w-5 h-5 text-amber-700" />
              <span className="text-base font-bold text-amber-900">
                Position #{queuePos.position}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>
                ~{queuePos.estimatedWaitTimeMinutes} minutes estimated wait
              </span>
            </div>
            <div className="mt-3 h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {(reservation.status === "AVAILABLE" ||
        reservation.status === "PENDING") && (
        <div className="px-6 pb-6 flex gap-2">
          {reservation.status === "AVAILABLE" && (
            <button
              onClick={() => handleFulfillReservation(reservation.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Check Out Book
            </button>
          )}
          <button
              onClick={() => onCancel(reservation)}
            className={`${
              reservation.status === "AVAILABLE" ? "" : "flex-1"
            } cursor-pointer hover:bg-red-50 hover:scale-105 active:scale-95
 border-2 border-red-500 text-red-600 font-bold py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2`}
          >
            <Close className="w-5 h-5" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
