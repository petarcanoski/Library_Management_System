import React from "react";
import { Book, AccessAlarm, CheckCircle } from "@mui/icons-material";

const tabs = [
  { label: "All Reservations", icon: <Book /> },
  { label: "Active", icon: <AccessAlarm /> },
  { label: "Completed", icon: <CheckCircle /> },
];

const ReservationTabs = ({ activeTab, setActiveTab }) => (
  <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
    <div className="flex border-b border-gray-200">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`flex-1 px-6 py-4 font-semibold text-base flex items-center justify-center gap-2 ${
            activeTab === index ? "text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default ReservationTabs;
