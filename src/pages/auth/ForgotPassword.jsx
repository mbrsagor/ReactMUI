import React, { useState } from "react";
import { TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";

import axios from "axios";
import { resetPasswordSentOTPEndpoint } from "../../services/api_services";

export default function ForgotPassword() {
  // Form state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // OnChange handler
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // You can send the OTP to the entered email address here
    try {
      const response = await axios.post(resetPasswordSentOTPEndpoint, {
        email: email, // Payload sent to the backend
      });

      if (response.data.status === "success") {
        navigate("/reset-password-verify-otp", { state: email });
      } else {
        // toast.error(response.data.message);
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong.";
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Forgot Password
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
        Enter your email to receive a 4-digit verification code.
      </Typography>

      <form
        onSubmit={handleSubmit}
      >
        <TextField
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
          label="Email Address" fullWidth sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Code"}
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AuthLayout>
  );
}
