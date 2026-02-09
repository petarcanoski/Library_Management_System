/**
 * Single Main Theme Configuration
 * Author: Ashok Zarmariya
 */

import { createTheme } from "@mui/material/styles";

export const themeConfigs = {
  main: {
    name: "Main",
    palette: {
      mode: "light",
      primary: { main: "#4F46E5" },   // Indigo
      secondary: { main: "#82589F" ,contrastText: "#fff" }, 
      success: { main: "#2ed573" , contrastText: "#fff"},   // Green
      error: { main: "#ff4757" },     // Red for errors
      background: {
        default: "#ffffff",
        paper: "#f9fafb",
      },
      text: {
        primary: "#111827",
        secondary: "#6b7280",
      },
    },
  },
};

// Return the MUI theme object
export const getTheme = (themeKey = "main") => {
  const config = themeConfigs[themeKey] || themeConfigs.main;
  return createTheme(config);
};

// For non-MUI CSS variable usage
export const themes = {
  main: {
    name: "Main",
    colors: {
      primary: "#4F46E5",
      secondary: "#d2dae2",
      success: "#2ed573",
      danger: "#ff4757",

      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",

      textPrimary: "#111827",
      textSecondary: "#6b7280",
      textTertiary: "#9ca3af",

      border: "#e5e7eb",
      borderSecondary: "#d1d5db",

      card: "#ffffff",
      cardHover: "#f9fafb",

      input: "#ffffff",
      inputBorder: "#d1d5db",
      inputFocus: "#4F46E5",

      overlay: "rgba(0, 0, 0, 0.5)",
    },
  },
};

export const themeKeys = ["main"];
