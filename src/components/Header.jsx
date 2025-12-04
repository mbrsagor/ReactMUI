import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggle from "./ThemeToggle";

export default function Header({ handleDrawerToggle, mode, toggleTheme }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar>
        {/* Sidebar menu - mobile only */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>

        <ThemeToggle mode={mode} toggleMode={toggleTheme} />
      </Toolbar>
    </AppBar>
  );
}
