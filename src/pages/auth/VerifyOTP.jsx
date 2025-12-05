import React, { useRef } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";


export default function VerifyOTP() {
  const navigate = useNavigate();
  const inputs = [...Array(4)].map(() => useRef());

  const handleChange = (e, index) => {
    if (e.target.value && index < 3) inputs[index + 1].current.focus();
    if (!e.target.value && index > 0) inputs[index - 1].current.focus();
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

      <Button
        fullWidth
        sx={{
          py: 1.4,
          fontWeight: 700,
          background: "#4C00FF",
          color: "#fff",
          borderRadius: "10px",
        }}
        onClick={() => navigate("/")}
      >
        Verify & Continue
      </Button>
    </AuthLayout>
  );
}
