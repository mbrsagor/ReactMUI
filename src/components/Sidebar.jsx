import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const drawerWidth = 220;

export default function Sidebar({ open, toggleSidebar }) {
  const location = useLocation(); // <-- CURRENT ROUTE

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { label: "Products", path: "/products", icon: <ShoppingCartIcon /> },
    { label: "Users", path: "/users", icon: <PeopleIcon /> },
  ];

  let activePath = location.pathname;

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 70,
          transition: "0.3s",
          overflowX: "hidden",
        },
      }}
    >
      {/* Collapse Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          p: 1,
        }}
      >
        <IconButton onClick={toggleSidebar}>
          {open ? <ChevronLeftIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>

      <List>
        {menuItems.map((item) => (
          <Tooltip
            key={item.label}
            title={!open ? item.label : ""}
            placement="right"
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={activePath === item.path} // <-- ACTIVE SELECTION
              sx={{
                borderRadius: "8px",
                mx: 1,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}
