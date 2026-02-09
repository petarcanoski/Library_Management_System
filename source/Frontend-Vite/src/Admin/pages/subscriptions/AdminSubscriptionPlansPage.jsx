import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Chip, Paper } from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/DataTable";
import {
  fetchAllPlans,
  deletePlan,
} from "../../../store/features/subscriptionPlans/subscriptionPlanThunk";
import SubscriptionPlanForm from "./SubscriptionPlanForm";

export default function AdminSubscriptionPlansPage() {
  const dispatch = useDispatch();
  const { allPlans, loading } = useSelector((state) => state.subscriptionPlans);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    dispatch(fetchAllPlans({ page: 0, size: 100 }));
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
    } else {
      setEditingPlan(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlan(null);
  };

  const handleDelete = async (plan) => {
    if (
      window.confirm(
        `Delete subscription plan "${plan.name}"? This will affect all users subscribed to this plan.`
      )
    ) {
      try {
        await dispatch(deletePlan(plan.id)).unwrap();
        loadPlans();
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const columns = [
    {
      field: "displayOrder",
      headerName: "Order",
      minWidth: 60,
      renderCell: (row) => (
        <Chip label={row.displayOrder || 0} size="small" color="default" />
      ),
    },
    {
      field: "name",
      headerName: "Plan Name",
      minWidth: 200,
      renderCell: (row) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {row.name}
            </Typography>
            {row.isFeatured && (
              <StarIcon sx={{ color: "warning.main", fontSize: 18 }} />
            )}
          </Box>
          {row.badgeText && (
            <Chip
              label={row.badgeText}
              size="small"
              color="secondary"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "planCode",
      headerName: "Code",
      minWidth: 120,
      renderCell: (row) => (
        <Chip
          label={row.planCode}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      renderCell: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.currency} {row.price.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.price} paise
          </Typography>
        </Box>
      ),
    },
    {
      field: "durationDays",
      headerName: "Duration",
      minWidth: 100,
      renderCell: (row) => (
        <Typography variant="body2">{row.durationDays} days</Typography>
      ),
    },
    {
      field: "maxBooksAllowed",
      headerName: "Max Books",
      align: "center",
      minWidth: 100,
      renderCell: (row) => (
        <Chip
          label={row.maxBooksAllowed}
          size="small"
          color="info"
          variant="outlined"
        />
      ),
    },
    {
      field: "maxDaysPerBook",
      headerName: "Days/Book",
      align: "center",
      minWidth: 100,
      renderCell: (row) => (
        <Chip
          label={`${row.maxDaysPerBook} days`}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "isFeatured",
      headerName: "Featured",
      minWidth: 90,
      renderCell: (row) => (
        <Chip
          label={row.isFeatured ? "Yes" : "No"}
          color={row.isFeatured ? "warning" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      minWidth: 90,
      renderCell: (row) => (
        <Chip
          label={row.isActive ? "Active" : "Inactive"}
          color={row.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Subscription Plans
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage subscription plans and pricing
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
          }}
        >
          Add Plan
        </Button>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "primary.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {allPlans?.length || 0}
            </Typography>
            <Typography variant="body2">Total Plans</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "success.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {allPlans?.filter((p) => p.isActive).length || 0}
            </Typography>
            <Typography variant="body2">Active Plans</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "warning.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              {allPlans?.filter((p) => p.isFeatured).length || 0}
            </Typography>
            <Typography variant="body2">Featured Plans</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2, textAlign: "center", bgcolor: "info.lighter" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              {allPlans?.length > 0
                ? (
                    allPlans.reduce(
                      (sum, p) => sum + ( p.price ),
                      0
                    ) / allPlans.length
                  ).toFixed(2)
                : "0.00"}
            </Typography>
            <Typography variant="body2">Avg Price (USD)</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={allPlans || []}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={allPlans?.length || 0}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        // customActions={customActions}
      />

      {/* Add/Edit Dialog */}
      <SubscriptionPlanForm
        dialogOpen={dialogOpen}
        handleCloseDialog={handleCloseDialog}
        plan={editingPlan}
      />
    </Box>
  );
}
