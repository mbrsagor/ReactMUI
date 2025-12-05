import React from "react";
import { Box, Card, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/auth/verify-otp");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" mb={2} align="center">
          Forgot Password
        </Typography>

        <Typography variant="body2" mb={2}>
          Enter your email. We'll send a 4-digit verification code.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth margin="normal" required />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Send OTP
          </Button>
        </form>
      </Card>
    </Box>
  );
}
