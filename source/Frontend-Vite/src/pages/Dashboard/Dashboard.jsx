import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  Box,
  Avatar,
} from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useDispatch } from "react-redux";

import { fetchMyBookLoans } from "../../store/features/bookLoans/bookLoanThunk";
import CurrentLoans from "./CurrentLoans";
import { useSelector } from "react-redux";
import Reservation from "./Reservation";
import ReadingHistory from "./ReadingHistory";
import Recommandation from "./Recommandation";
import { statsConfig } from "./StateConfig";
import StatsCard from "./StateCard";

/**
 * Dashboard Component
 * User dashboard showing borrowed books, reservations, reading stats, and recommendations
 */
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const { myLoans } = useSelector((store) => store.bookLoans);
  const { reservations } = useSelector((store) => store.reservations);

  // Mock data - Replace with actual API calls
  const [stats] = useState({
    currentLoans: 3,
    activeReservations: 2,
    booksRead: 24,
    readingStreak: 7,
  });

  const loadLoans = () => {
    const status = null;
    dispatch(
      fetchMyBookLoans({
        status,
        page: 0,
        size: 20,
      })
    );
  };

  useEffect(() => {
    loadLoans();
  }, [auth.user]);

  const readingProgress = Math.min((stats.booksRead / 30) * 100, 100); // Goal: 30 books
  const statsData = statsConfig({ myLoans, reservations, stats });
  return (
  
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Track your reading journey and manage your library
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up animation-delay-200">
            {/* Current Loans */}
            {statsData.map((item) => (
              <StatsCard
                key={item.id}
                icon={item.icon}
                value={item.value}
                title={item.title}
                subtitle={item.subtitle}
                bgColor={item.bgColor}
                textColor={item.textColor}
              />
            ))}
          </div>

          {/* Reading Progress */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-fade-in-up animation-delay-400">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  2025 Reading Goal
                </h3>
                <p className="text-gray-600">
                  {stats.booksRead} of 30 books read
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                <AutoAwesomeIcon sx={{ fontSize: 32, color: "#4F46E5" }} />
              </div>
            </div>
            <LinearProgress
              variant="determinate"
              value={readingProgress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: "#E0E7FF",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, #4F46E5 0%, #9333EA 100%)",
                  borderRadius: 6,
                },
              }}
            />
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(readingProgress)}% complete
            </p>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up animation-delay-600">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  },
                  "& .Mui-selected": {
                    color: "#4F46E5",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#4F46E5",
                  },
                }}
              >
                <Tab label="Current Loans" />
                <Tab label="Reservations" />
                <Tab label="Reading History" />
                <Tab label="Recommendations" />
              </Tabs>
            </Box>

            {/* Current Loans Tab */}
            {activeTab === 0 && <CurrentLoans />}

            {/* Reservations Tab */}
            {activeTab === 1 && <Reservation />}

            {/* Reading History Tab */}
            {activeTab === 2 && <ReadingHistory />}

            {/* Recommendations Tab */}
            {activeTab === 3 && <Recommandation />}
          </div>
        </div>
      </div>
  
  );
};

export default Dashboard;
