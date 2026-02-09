import { Chip } from "@mui/material";

  import React from 'react'

  const GetStatusChip = ({status}) => {
    const configs = {
      ACTIVE: { label: "Active", color: "success" },
      OVERDUE: { label: "Overdue", color: "error" },
      PENDING: { label: "Pending", color: "warning" },
      READY: { label: "Ready for Pickup", color: "success" },
    };

    const config = configs[status] || { label: status, color: "default" };
    return <Chip label={config.label} color={config.color} size="small" />;
  }
  
  export default GetStatusChip