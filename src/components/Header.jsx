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
import { useNavigate } from "react-router-dom";

import "../style/header.scss";

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

  // Navigate to to sign in page
  const navigate = useNavigate();

  // Sign out without API call remove token from localStorage
  const handlerSignOut = async () => {
    localStorage.removeItem("token");
    localStorage.clear();

    // Navigate after state update
    setTimeout(() => {
      navigate("/auth/");
    }, 100);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      className={`header-wrapper ${
        sidebarOpen ? "sidebar-open" : "sidebar-close"
      }`}
    >
      <Toolbar className="header-toolbar">
        {/* LEFT SECTION */}
        <Box className="header-left">
          <IconButton className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className="header-title">
            RackinUP
          </Typography>
        </Box>

        {/* RIGHT SECTION */}
        <Box className="header-right">
          {/* Dark / Light Mode Toggle */}
          <IconButton onClick={toggleDarkMode} className="theme-toggle-btn">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Avatar + Name */}
          <Box className="profile-section" onClick={handleMenuOpen}>
            <Avatar alt={username} className="profile-avatar" />
            <Typography variant="body1" className="profile-name">
              {username}
            </Typography>
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handlerSignOut}>Sign Out</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
