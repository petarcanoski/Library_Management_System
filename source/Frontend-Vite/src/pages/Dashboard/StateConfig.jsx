import React from "react"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import HistoryIcon from "@mui/icons-material/History"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import { LibraryBooks } from "@mui/icons-material"

export const statsConfig = ({ myLoans, reservations, stats }) => [
  {
    id: "loans",
    title: "Current Loans",
    subtitle: "Books you're reading",
    value: myLoans.length,
    icon: <LibraryBooks sx={{ fontSize: 32, color: "#4F46E5" }} />,
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
  {
    id: "reservations",
    title: "Reservations",
    subtitle: "Books on hold",
    value: reservations?.length || 0,
    icon: <EventAvailableIcon sx={{ fontSize: 32, color: "#9333EA" }} />,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    id: "read",
    title: "Books Read",
    subtitle: "This year",
    value: myLoans.length,
    icon: <HistoryIcon sx={{ fontSize: 32, color: "#10B981" }} />,
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    id: "streak",
    title: "Day Streak",
    subtitle: "Keep it going!",
    value: stats.readingStreak,
    icon: <TrendingUpIcon sx={{ fontSize: 32, color: "#F59E0B" }} />,
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
]
