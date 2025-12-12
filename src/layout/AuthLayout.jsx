import React from "react";
import { Box, Typography } from "@mui/material";
import "../style/auth.scss";

export default function AuthLayout({ children }) {
  return (
    <Box className="auth-layout">
      {/* LEFT BRANDING AREA */}
      <Box className="left-side-box">
        <Typography variant="h3">RackinUP LLC</Typography>
        <Typography variant="h6">
          Empowering Your Business with Digital Solutions
        </Typography>
      </Box>

      {/* RIGHT FORM AREA */}
      <Box className="right-form-area">
        <Box className="form-container">{children}</Box>
      </Box>
    </Box>
  );
}
