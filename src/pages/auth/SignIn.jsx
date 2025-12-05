import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";

export default function SignIn() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Sign In
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
        Welcome back! Please enter your details.
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        <TextField
          label="Email Address"
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <TextField
          label="Password"
          fullWidth
          variant="outlined"
          type={showPass ? "text" : "password"}
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

        <Button
          type="submit"
          fullWidth
          sx={{
            py: 1.4,
            mt: 1,
            fontWeight: 700,
            background: "#4C00FF",
            color: "#fff",
            borderRadius: "10px",
            "&:hover": { opacity: 0.9, background: "#4C00FF" },
          }}
        >
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
