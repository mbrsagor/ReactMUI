import React from "react";
import { Box, Typography } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* LEFT BRANDING AREA */}
      <Box
        sx={{
          width: { xs: "0%", md: "45%" },
          background: "linear-gradient(135deg, #4C00FF 0%, #090979 100%)",
          color: "#fff",
          p: 6,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Your Company
        </Typography>

        <Typography variant="h6" sx={{ opacity: 0.8, mb: 4 }}>
          The modern dashboard platform for managing your business.
        </Typography>
      </Box>

      {/* RIGHT FORM AREA */}
      <Box
        sx={{
          flexGrow: 1,
          background: "#fff",
          p: { xs: 3, md: 8 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "420px" }}>{children}</Box>
      </Box>
    </Box>
  );
}
