import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import { createCustomTheme } from "./theme/theme";

export default function App() {
  const [mode, setMode] = React.useState("light");

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  return (
    <ThemeProvider theme={createCustomTheme(mode)}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<AdminLayout mode={mode} toggleTheme={toggleTheme} />}
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
