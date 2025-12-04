import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: { default: "#f4f6f8" },
        }
      : {
          background: { default: "#121212" },
        }),
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: { border: "none" },
      },
    },
  },
});

export const createCustomTheme = (mode) => createTheme(getDesignTokens(mode));
