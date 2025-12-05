import React from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Forgot Password
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
        Enter your email to receive a 4-digit verification code.
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/auth/verify");
        }}
      >
        <TextField label="Email Address" fullWidth sx={{ mb: 3 }} />

        <Button
          type="submit"
          fullWidth
          sx={{
            py: 1.4,
            fontWeight: 700,
            background: "#4C00FF",
            color: "#fff",
            borderRadius: "10px",
          }}
        >
          Send Code
        </Button>
      </form>
    </AuthLayout>
  );
}
