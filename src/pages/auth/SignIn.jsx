import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";

import axios from "axios";
import { signInAPIEndpoint } from "../../services/api_services";

export default function SignIn() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // "success", "error", "warning", "info"
  });

  const navigate = useNavigate();

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(signInAPIEndpoint, {
        username: email,
        password: password,
        device_token: "",
      });

      if (response.data.status === "success") {
        const { token, ...userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        if (response.data.role === 1) {
          navigate("/");
        } else {
          setSnackbar({
            open: true,
            message: "Only admin and super users can access the dashboard.",
            severity: "warning",
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: "Invalid credentials. Please try again.",
          severity: "error",
        });
      }
    } catch (err) {
      console.log("Sign-in error:", err);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Sign In
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
        Welcome back! Please enter your details.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          fullWidth
          variant="outlined"
          placeholder="Enter your email address"
          onChange={(event) => setEmail(event.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Password"
          fullWidth
          variant="outlined"
          type={showPass ? "text" : "password"}
          placeholder="Enter your password"
          onChange={(event) => setPassword(event.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(!showPass)}>
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Link
          component="button"
          onClick={() => navigate("/auth/forgot")}
          underline="hover"
          sx={{ display: "block", textAlign: "right", mb: 3 }}
        >
          Forgot password?
        </Link>

        <Button type="submit" className="submit-button">
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Snackbar */}
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
