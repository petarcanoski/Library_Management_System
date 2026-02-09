import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
 
  Switch,
  FormControlLabel,
  IconButton,
 
  InputAdornment,
} from '@mui/material';
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlan, updatePlan } from "../../../store/features/subscriptionPlans/subscriptionPlanThunk";
import { Close } from "@mui/icons-material";

const SubscriptionPlanForm = ({
  dialogOpen,
  handleCloseDialog,
  plan,
}) => {
    const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    planCode: "",
    name: "",
    description: "",
    price: 0,
    currency: "USD",
    durationDays: 30,
    maxBooksAllowed: 5,
    maxDaysPerBook: 14,
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
    badgeText: "",
    adminNotes: "",
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        planCode: plan.planCode || "",
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price || 0,
        currency: plan.currency || "USD",
        durationDays: plan.durationDays || 30,
        maxBooksAllowed: plan.maxBooksAllowed || 5,
        maxDaysPerBook: plan.maxDaysPerBook || 14,
        displayOrder: plan.displayOrder || 0,
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        isFeatured: plan.isFeatured || false,
        badgeText: plan.badgeText || "",
        adminNotes: plan.adminNotes || "",
      });
    } else {
      setFormData({
        planCode: "",
        name: "",
        description: "",
        price: 0,
        currency: "INR",
        durationDays: 30,
        maxBooksAllowed: 5,
        maxDaysPerBook: 14,
        displayOrder: 0,
        isActive: true,
        isFeatured: false,
        badgeText: "",
        adminNotes: "",
      });
    }
  }, [plan]);

   const handleSubmit = async () => {
      try {
        if (plan) {
          await dispatch(updatePlan({ id: plan.id, planDTO: formData })).unwrap();
        } else {
          await dispatch(createPlan(formData)).unwrap();
        }
        handleCloseDialog();
    
      } catch (error) {
        console.error('Error saving plan:', error);
      }
    };
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {plan
              ? "Edit Subscription Plan"
              : "Create Subscription Plan"}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Plan Code"
              value={formData.planCode}
              onChange={(e) =>
                setFormData({ ...formData, planCode: e.target.value })
              }
              required
              helperText="Unique identifier for the plan (e.g., BASIC, PREMIUM)"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Plan Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              helperText="Display name for the plan"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              helperText="Brief description of plan benefits"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Currency"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              required
              helperText="e.g., USD, EUR, INR"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Duration (Days)"
              type="number"
              value={formData.durationDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durationDays: parseInt(e.target.value),
                })
              }
              required
              helperText="Subscription duration in days"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Max Books Allowed"
              type="number"
              value={formData.maxBooksAllowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxBooksAllowed: parseInt(e.target.value),
                })
              }
              required
              helperText="Maximum books user can borrow simultaneously"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Max Days Per Book"
              type="number"
              value={formData.maxDaysPerBook}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxDaysPerBook: parseInt(e.target.value),
                })
              }
              required
              helperText="Maximum days allowed for each book loan"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Display Order"
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayOrder: parseInt(e.target.value),
                })
              }
              helperText="Order for displaying plans (lower numbers first)"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Badge Text"
              value={formData.badgeText}
              onChange={(e) =>
                setFormData({ ...formData, badgeText: e.target.value })
              }
              helperText="Optional badge text (e.g., 'POPULAR', 'BEST VALUE')"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Admin Notes"
              multiline
              rows={2}
              value={formData.adminNotes}
              onChange={(e) =>
                setFormData({ ...formData, adminNotes: e.target.value })
              }
              helperText="Internal notes for admins (not visible to users)"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                />
              }
              label="Featured Plan"
            />
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Featured plans are highlighted to users
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="Active"
            />
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Only active plans are available for purchase
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseDialog} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !formData.planCode ||
            !formData.name ||
            formData.price <= 0 ||
            formData.durationDays <= 0 ||
            formData.maxBooksAllowed <= 0 ||
            formData.maxDaysPerBook <= 0
          }
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
          }}
        >
          {plan ? "Update Plan" : "Create Plan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionPlanForm;
