import React from "react";
import { Box, Card, TextField, Button, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
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
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth margin="normal" required />

          <TextField
            type="password"
            label="Password"
            fullWidth
            margin="normal"
            required
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>

          <Box mt={2} textAlign="center">
            <Link component="button" onClick={() => navigate("/auth/forgot")}>
              Forgot password?
            </Link>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
