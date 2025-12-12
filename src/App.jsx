import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import ProtectedRoute from "./services/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/Projects";
import ProjectCreate from "./pages/ProjectCreate";
import ArchivedProjects from "./pages/ArchivedProjects";
import Products from "./pages/Products";
import ProductCreate from "./pages/ProductCreate";
import Users from "./pages/users/Users";
import Settings from "./pages/Settings";

// AUTH ROUTES
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ChangePassword from "./pages/auth/ChnagePassword";

import { createCustomTheme } from "./theme/theme";

export default function App() {
  const [mode, setMode] = React.useState("light");
  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={createCustomTheme(mode)}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/auth">
            <Route index element={<SignIn />} />
            <Route path="forgot" element={<ForgotPassword />} />
            <Route path="verify-otp" element={<VerifyOTP />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route
            path="/"
            element={<AdminLayout mode={mode} toggleTheme={toggleTheme} />}
          >
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            <Route path="projects">
              <Route index element={<Projects />} />
              <Route path="create" element={<ProjectCreate />} />
              <Route path="archived" element={<ArchivedProjects />} />
            </Route>

            <Route path="products">
              <Route index element={<Products />} />
              <Route path="create" element={<ProductCreate />} />
            </Route>

            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
