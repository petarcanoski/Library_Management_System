import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  MenuBook,
  EventNote,
  People,
  Payment,
  CardMembership,
  TrendingUp,
  BookmarkAdded,
  RateReview,
} from "@mui/icons-material";
import StatsCard from "../components/StatsCard";
import { fetchBookStats } from "../../store/features/books/bookThunk";
import {
  getCheckoutStatistics,
  getAllBookLoans,
} from "../../store/features/bookLoans/bookLoanThunk";
import { searchReservations } from "../../store/features/reservations/reservationThunk";
import { fetchAllActiveSubscriptions } from "../../store/features/subscriptions/subscriptionThunk";
import { fetchMonthlyRevenue } from "../../store/features/payments/paymentThunk";
import {
  fetchRatingStatistics,
  fetchReviewStatistics,
} from "../../store/features/reviews/bookReviewThunk";
import { getUsersList } from "../../store/features/auth/authThunk";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  // Select data from Redux store
  const { stats: bookStats, loading: booksLoading } = useSelector(
    (state) => state.books
  );
  const {
    statistics: loanStats,
    allLoans,
    loading: loansLoading,
  } = useSelector((state) => state.bookLoans);
  const {
    reservations,
    totalElements: reservationCount,
  
  } = useSelector((state) => state.reservations);
  const {
    allActiveSubscriptions,

    
  } = useSelector((state) => state.subscriptions);

  const { revenue } = useSelector((state) => state.payments);
  const { reviewStatistics } = useSelector((state) => state.bookReviews);
  const {usersList}= useSelector((state)=>state.auth);

  // console.log("userList in dashboard",usersList);

  // Fetch dashboard statistics on mount
  useEffect(() => {
    dispatch(fetchBookStats());
    dispatch(getCheckoutStatistics());
    dispatch(fetchMonthlyRevenue());
    dispatch(fetchReviewStatistics());
    dispatch(
      searchReservations({
        activeOnly: true,
        page: 0,
        size: 5,
        sortBy: "reservedAt",
        sortDirection: "DESC",
      })
    ); // Get recent reservations
    dispatch(
      fetchAllActiveSubscriptions({
        page: 0,
        size: 5,
        sortBy: "createdAt",
        sortDirection: "DESC",
      })
    ); // Get recent subscriptions
    dispatch(
      getAllBookLoans({
        page: 0,
        size: 5,
        sortBy: "checkoutDate",
        sortDirection: "DESC",
      })
    ); // Get recent loans
    dispatch(getUsersList())
  }, [dispatch]);

  // Compute stats from API data
  const stats = {
    totalBooks: bookStats?.totalActiveBooks || 0,
    activeLoans: loanStats?.activeCheckouts || 0,
    totalUsers: usersList.length, // No endpoint available yet
    monthlyRevenue: revenue?.monthlyRevenue, // Would need payment aggregation endpoint
    activeSubscriptions: allActiveSubscriptions.length || 0,
    pendingReservations: reservationCount || 0,
    totalReviews: reviewStatistics?.totalReviews || 0,
    overdueLoans: loanStats?.overdueCheckouts || 0,
  };

  // Show loading state while fetching initial data
  const isLoading = booksLoading || loansLoading;

  // Helper function to format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  // Combine and format real activities from API data
  const recentActivities = React.useMemo(() => {
    const activities = [];

    // Add recent loans
    if (allLoans.length) {
      allLoans.forEach((loan) => {
        activities.push({
          id: `loan-${loan.id}`,
          type: "loan",
          user: loan.userName || loan.user?.email || "Unknown User",
          action: "borrowed",
          book: loan.bookTitle || "Unknown Book",
          time: getTimeAgo(loan.createdAt),
          timestamp: new Date(loan.createdAt),
        });
      });
    }

    // Add recent reservations
    if (reservations?.content) {
      reservations.content.forEach((reservation) => {
        activities.push({
          id: `reservation-${reservation.id}`,
          type: "reservation",
          user:
            reservation.user?.fullName ||
            reservation.user?.email ||
            "Unknown User",
          action: "reserved",
          book: reservation.book?.title || "Unknown Book",
          time: getTimeAgo(reservation.reservedAt),
          timestamp: new Date(reservation.reservedAt),
        });
      });
    }

    // Add recent subscriptions
    if (allActiveSubscriptions) {
      allActiveSubscriptions.forEach((subscription) => {
        activities.push({
          id: `subscription-${subscription.id}`,
          type: "subscription",
          user:
            subscription.userName ||
            subscription.userEmail ||
            "Unknown User",
          action: "subscribed to",
          book: subscription.planName || "Unknown Plan",
          time: getTimeAgo(subscription.createdAt),
          timestamp: new Date(subscription.createdAt),
        });
      });

    }

    
      console.log(
        "activities ----- ",
        allActiveSubscriptions,
        reservations,
        allLoans
      );

    // Sort by timestamp (most recent first) and take top 10
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [allLoans, reservations, allActiveSubscriptions]);

  const getActivityIcon = (type) => {
    const iconMap = {
      loan: <EventNote />,
      review: <RateReview />,
      subscription: <CardMembership />,
      reservation: <BookmarkAdded />,
    };
    return iconMap[type] || <MenuBook />;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      loan: "primary",
      review: "success",
      subscription: "warning",
      reservation: "info",
    };
    return colorMap[type] || "default";
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening in your library today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Books"
            value={stats.totalBooks}
            icon={MenuBook}
            color="primary"
            trend="up"
            trendValue="+12%"
            subtitle="In collection"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Active Loans"
            value={stats.activeLoans}
            icon={EventNote}
            color="success"
            trend="up"
            trendValue="+8%"
            subtitle={`${stats.overdueLoans} overdue`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={People}
            color="info"
            trend="up"
            trendValue="+23%"
            subtitle="Registered members"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Revenue"
            value={`$${stats.monthlyRevenue?.toLocaleString()}`}
            icon={Payment}
            color="warning"
            trend="up"
            trendValue="+15%"
            subtitle="This month"
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.activeSubscriptions}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Subscriptions
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <CardMembership sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.pendingReservations}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pending Reservations
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <BookmarkAdded sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              height: "100%",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.totalReviews}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Reviews
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <RateReview sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              p: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Activities
              </Typography>
              <Chip label="Live" color="success" size="small" />
            </Box>
            <List>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: (theme) =>
                            alpha(
                              theme.palette[getActivityColor(activity.type)]
                                .main,
                              0.1
                            ),
                          color: (theme) =>
                            theme.palette[getActivityColor(activity.type)].main,
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{activity.user}</strong> {activity.action}{" "}
                          <strong>{activity.book}</strong>
                        </Typography>
                      }
                      secondary={activity.time}
                    />
                    <Chip
                      label={activity.type}
                      size="small"
                      color={getActivityColor(activity.type)}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </ListItem>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activities to display
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Stats
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "error.main" }}
                >
                  {stats.overdueLoans}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overdue Loans
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "warning.main" }}
                >
                  {stats.pendingReservations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Reservations
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {stats.activeSubscriptions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Subscriptions
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
