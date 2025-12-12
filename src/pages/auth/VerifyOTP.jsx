import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import axios from "axios";
import { verifyOTPEndpoint, reSentOTPEndpoint } from "../../services/api_services";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email] = useState(location.state || "Unknown Email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const inputRefs = useRef([]);

  // ------------ Countdown Logic ------------
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time into mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ------------ OTP Input Change Handler ------------
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only digits

    let updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) inputRefs.current[index + 1].focus();
    if (!value && index > 0) inputRefs.current[index - 1].focus();
  };

  // ------------ Resend OTP ------------
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(reSentOTPEndpoint, { email });

      if (response.data.status === "success") {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "success",
        });

        setTimeLeft(30);
        setCanResend(false);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Error sending OTP",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------ Verify OTP ------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length < 4) {
      setSnackbar({
        open: true,
        message: "Please enter a valid 4-digit OTP.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(verifyOTPEndpoint, {
        email,
        otp: otpString,
      });

      if (response.data.status === "success") {
        navigate("/change-password", { state: email });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Verification failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Verify Code
      </Typography>

      <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
        Enter the 4-digit code sent to your email.
      </Typography>

      {/* OTP Boxes */}
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        {[0, 1, 2, 3].map((i) => (
          <TextField
            key={i}
            inputRef={(el) => (inputRefs.current[i] = el)}
            value={otp[i]}
            onChange={(e) => handleChange(e, i)}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "24px",
                width: "55px",
              },
            }}
          />
        ))}
      </Box>

      {/* Timer + Resend */}
      <Box textAlign="center" mb={2}>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Expires in {formatTime(timeLeft)}
        </Typography>

        {canResend ? (
          <Typography
            onClick={handleResendOtp}
            sx={{
              mt: 1,
              cursor: "pointer",
              color: "primary.main",
              fontWeight: 600,
            }}
          >
            Didn’t get it? Resend OTP
          </Typography>
        ) : (
          <Typography sx={{ mt: 1, color: "#999" }}>Waiting for OTP...</Typography>
        )}
      </Box>

      {/* Submit */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2, py: 1.3 }}
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </Button>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </AuthLayout>
  );
}
