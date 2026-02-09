import { alpha, Box, Stack, Typography } from "@mui/material";
import React from "react";



const InfoItem = ({ icon, label, value, color, highlight }) => (
    <Box
        sx={{
            p: 2,
            borderRadius: 2,
            background: highlight
                ? `linear-gradient(135deg, ${alpha(color || "#1976d2", 0.08)} 0%, ${alpha(
                    color || "#1976d2",
                    0.03
                )} 100%)`
                : alpha("#000", 0.02),
            border: `1px solid ${alpha(color || "#000", highlight ? 0.1 : 0.05)}`,
            transition: "all 0.3s ease",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(color || "#000", 0.15)}`,
            },
        }}
    >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Box sx={{ color: color || "text.secondary", display: "flex" }}>
                {icon}
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {label}
            </Typography>
        </Stack>
        <Typography
            variant="h6"
            sx={{
                fontWeight: 700,
                color: color || "text.primary",
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
        >
            {value}
        </Typography>
    </Box>
);

export default InfoItem;