import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";

import axios from "axios";
import { verifyOTPEndpoint, reSentOTPEndpoint } from "../../services/api_services";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state || "Unknown Phone");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 90 seconds countdown
  const [canResend, setCanResend] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Inside the component:
  const otpRefs = useRef([]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format seconds into mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputs = [...Array(4)].map(() => useRef());

  // change handler
  const handleChange = (e, index) => {
    if (e.target.value && index < 3) inputs[index + 1].current.focus();
    if (!e.target.value && index > 0) inputs[index - 1].current.focus();
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(reSentOTPEndpoint, {
        email,
      });
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
        message: err.response?.data?.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Concatenate OTP into a single string
    const otpString = otp.join("");
    // Verify OTP API integration start from here...
    try {
      const response = await axios.post(verifyOTPEndpoint, {
        email, // Payload sent to the backend
        otp: otpString, // Send concatenated OTP string
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
        message: err.response?.data?.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Verify Code
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
        Enter the 4-digit code sent to your email.
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        {inputs.map((ref, idx) => (
          <TextField
            key={idx}
            inputRef={ref}
            value={otp[idx]}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "22px",
                width: "55px",
              },
            }}
            onChange={(e) => handleChange(e, idx)}
          />
        ))}
      </Box>

      <Box>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Expires in {formatTime(timeLeft)}
        </Typography>
        {canResend ? (
          <Typography
            className="mb-0 mt-1 resent_otp_text cursor-pointer"
            onClick={handleResendOtp}
          >
            Didn’t get it? Resend OTP
          </Typography>
        ) : (
          <Typography className="mb-0 mt-1">Sending... OTP</Typography>
        )}
      </Box>

      <Button
        className="submit-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Verify & processing..." : "Verify & Continue"}
      </Button>
    </AuthLayout>
  );
}
