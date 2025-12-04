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
  const location = useLocation();

  // Sidebar open/close
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header
        toggleSidebar={handleSidebarToggle}
        sidebarOpen={sidebarOpen} // ⬅ add this
        username="Bozlur Rosid Sagor"
        darkMode={mode === "dark"}
        toggleDarkMode={toggleTheme}
      />

      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {/* Breadcrumbs */}
        <Box sx={{ mb: 2 }}>
          <BreadcrumbsNav />
        </Box>

        {/* Page transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
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
