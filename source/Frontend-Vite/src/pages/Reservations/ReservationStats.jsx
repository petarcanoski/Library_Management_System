import React from "react";
import { Book, AccessAlarm } from "@mui/icons-material";
import { CalendarMonth } from "@mui/icons-material";

const ReservationStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <p className="text-sm font-semibold text-gray-500 uppercase">Total Reservations</p>
      <p className="text-4xl font-extrabold text-gray-900">{stats.total}</p>
      <Book />
    </div>
    <div className="bg-yellow-50 p-6 rounded-xl shadow-lg border border-yellow-200">
      <p className="text-sm font-semibold text-yellow-800 uppercase">Active</p>
      <p className="text-4xl font-extrabold text-yellow-900">{stats.active}</p>
      <AccessAlarm />
    </div>
    <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200">
      <p className="text-sm font-semibold text-green-800 uppercase">Ready to Pick Up</p>
      <p className="text-4xl font-extrabold text-green-900">{stats.available}</p>
      <CalendarMonth />
    </div>
  </div>
);

export default ReservationStats;
