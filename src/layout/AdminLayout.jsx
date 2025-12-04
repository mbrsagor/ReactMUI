import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import React from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ mode, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <Header
        handleDrawerToggle={handleDrawerToggle}
        mode={mode}
        toggleTheme={toggleTheme}
      />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
