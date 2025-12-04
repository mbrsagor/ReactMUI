import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectCreate from "./pages/ProjectCreate";
import ArchivedProjects from "./pages/ArchivedProjects";
import Products from "./pages/Products";
import ProductCreate from "./pages/ProductCreate";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import { createCustomTheme } from "./theme/theme";

export default function App() {
  const [mode, setMode] = React.useState("light");
  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

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
