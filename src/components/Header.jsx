import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggle from "./ThemeToggle";

export default function Header({ handleDrawerToggle, mode, toggleTheme }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ThemeToggle mode={mode} toggleMode={toggleTheme} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
