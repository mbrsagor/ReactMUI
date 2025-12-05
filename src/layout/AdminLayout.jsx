/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BreadcrumbsNav from "../components/BreadcrumbsNav";
import "../style/adminLayout.scss";

const mainVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const transition = { duration: 0.25, ease: "easeInOut" };

export default function AdminLayout({ mode, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

  return (
    <Box className="admin-layout">
      <Header
        toggleSidebar={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
        username="Bozlur Rosid Sagor"
        darkMode={mode === "dark"}
        toggleDarkMode={toggleTheme}
      />

      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />

      {/* MAIN CONTENT */}
      <Box component="main" className="admin-main">
        <Toolbar className="mui-toolbar" />

        <Box className="breadcrumbs-container">
          <BreadcrumbsNav />
        </Box>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="page-transition"
            variants={mainVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={transition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
