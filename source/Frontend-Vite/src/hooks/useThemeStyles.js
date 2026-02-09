import { useTheme } from "../contexts/ThemeContext";

/**
 * Custom hook for easy access to theme-based inline styles
 * Use this when you need dynamic theme colors for inline styles
 */
export const useThemeStyles = () => {
  const { theme } = useTheme();

  return {
    // Background styles
    bgPrimary: { backgroundColor: theme.colors.primary },
    bgSecondary: { backgroundColor: theme.colors.secondary },
    bgSuccess: { backgroundColor: theme.colors.success },
    bgDanger: { backgroundColor: theme.colors.danger },
    bgCard: { backgroundColor: theme.colors.card },
    bg: { backgroundColor: theme.colors.background },
    bgSecondaryBg: { backgroundColor: theme.colors.backgroundSecondary },

    // Text styles
    textPrimary: { color: theme.colors.textPrimary },
    textSecondary: { color: theme.colors.textSecondary },
    textTertiary: { color: theme.colors.textTertiary },
    textOnPrimary: { color: theme.colors.primary },

    // Border styles
    border: { borderColor: theme.colors.border },
    borderSecondary: { borderColor: theme.colors.borderSecondary },

    // Combined styles
    card: {
      backgroundColor: theme.colors.card,
      color: theme.colors.textPrimary,
      borderColor: theme.colors.border,
    },

    input: {
      backgroundColor: theme.colors.input,
      color: theme.colors.textPrimary,
      borderColor: theme.colors.inputBorder,
    },

    button: {
      backgroundColor: theme.colors.primary,
      color: "#ffffff",
      border: "none",
    },

    buttonSecondary: {
      backgroundColor: theme.colors.secondary,
      color: "#ffffff",
      border: "none",
    },

    // Direct access to all colors
    colors: theme.colors,
  };
};
