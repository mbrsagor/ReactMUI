/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BreadcrumbsNav from "../components/BreadcrumbsNav";

const mainVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const transition = { duration: 0.25, ease: "easeInOut" };

export default function AdminLayout({ mode, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen((s) => !s);
  const handleSidebarToggle = () => setSidebarOpen((s) => !s);

  return (
    <Box sx={{ display: "flex" }}>
      <Header
        handleDrawerToggle={handleDrawerToggle}
        mode={mode}
        toggleTheme={toggleTheme}
      />

      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {/* Breadcrumbs */}
        <Box sx={{ mb: 2 }}>
          <BreadcrumbsNav />
        </Box>

        {/* Page transitions using AnimatePresence */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname} // important: unique key per route for transitions
            variants={mainVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={transition}
            style={{ width: "100%" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
