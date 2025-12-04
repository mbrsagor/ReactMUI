import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Header({
  toggleSidebar,
  sidebarOpen,
  username,
  darkMode,
  toggleDarkMode,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      elevation={0}
      position="fixed"
      color="inherit"
      sx={{
        borderBottom: "1px solid #e0e0e0",
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        ml: sidebarOpen ? "240px" : "64px", // ⬅ SHIFT HEADER
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Sidebar toggle button (always left) */}
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>

          {/* Logo or Title (ALWAYS visible) */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
          >
            RackinUP
          </Typography>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Dark/Light mode toggle */}
          <IconButton onClick={toggleDarkMode}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Avatar + Username */}
          <Box
            onClick={handleMenuOpen}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Avatar alt={username} sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {username}
            </Typography>
          </Box>

          {/* Menu Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Company Profile</MenuItem>

            <Divider />

            <MenuItem onClick={handleMenuClose}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
