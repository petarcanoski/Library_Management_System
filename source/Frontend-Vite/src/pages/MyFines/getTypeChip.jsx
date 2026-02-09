  import { Chip } from "@mui/material";
import React from "react";

  export const getTypeChip = (type) => {
    const typeMap = {
      OVERDUE: { color: "error", label: "Overdue" },
      DAMAGE: { color: "warning", label: "Damage" },
      LOSS: { color: "error", label: "Loss" },
      PROCESSING: { color: "info", label: "Processing" },
    };
    const config = typeMap[type] || { color: "default", label: type };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
  };