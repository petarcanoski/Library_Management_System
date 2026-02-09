import { FilterList } from "@mui/icons-material";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React from "react";

const FilterSection = ({
  filterStatus,
  setFilterStatus,
  filterUserId,
  setFilterUserId,
  filterBookId,
  setFilterBookId,
  filterActiveOnly,
  setFilterActiveOnly,
  setSearchQuery,
}) => {
  return (
    <div className="mb-5">
      <div className="py-2 flex items-center gap-3">
        <FilterList />
        <h1 className=" font-semibold text-xl">Filter</h1>
      </div>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="FULFILLED">Fulfilled</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
              <MenuItem value="EXPIRED">Expired</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Active Only</InputLabel>
            <Select
              value={filterActiveOnly}
              onChange={(e) => setFilterActiveOnly(e.target.value)}
              label="Active Only"
            >
              <MenuItem value="">All Reservations</MenuItem>
              <MenuItem value="true">Active Only</MenuItem>
              <MenuItem value="false">Include Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label="User ID"
            placeholder="Filter by User ID"
            type="number"
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            fullWidth
            label="Book ID"
            placeholder="Filter by Book ID"
            type="number"
            value={filterBookId}
            onChange={(e) => setFilterBookId(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 2 }}>
          <Button
            sx={{ py: 1.8 }}
            fullWidth
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("");
              setFilterUserId("");
              setFilterBookId("");
              setFilterActiveOnly("");
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default FilterSection;
