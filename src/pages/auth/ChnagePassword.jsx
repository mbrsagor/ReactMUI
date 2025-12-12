import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../layout/AuthLayout";

import { passwordResetAPIEndpoint } from "../../services/api_services";

export default function ChangePassword() {
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleNewPassword = () => setShowNewPassword(!showNewPassword);

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

    // Submit Handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        const email = location.state || "Unknown Data";

        if (!password || !newPassword) {
            setSnackbar({
                open: true,
                message: "All fields are required",
                severity: "error",
            });
            return;
        }

        if (password !== newPassword) {
            setSnackbar({
                open: true,
                message: "Passwords do not match",
                severity: "error",
            });
            return;
        }

        try {
            const response = await axios.post(passwordResetAPIEndpoint, {
                email: email,
                new_password: password,
            });

            if (response.data.status === "success") {
                setSnackbar({
                    open: true,
                    message: response.data.message,
                    severity: "success",
                });
                navigate("/signin");
            } else {
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
        }
    };

    return (
        <AuthLayout>
            <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Change Password
                </Typography>

                <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
                    Set your new password below.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    {/* New Password */}
                    <TextField
                        fullWidth
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Confirm Password */}
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={toggleNewPassword} edge="end">
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Submit */}
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{ py: 1.3, fontSize: "16px" }}
                    >
                        Update Password
                    </Button>
                </Box>
            </Paper>
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
