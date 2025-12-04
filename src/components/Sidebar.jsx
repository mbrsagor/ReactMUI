import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Collapse,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerCollapsedWidth = 64;
const drawerExpandedWidth = 220;

// helper menu structure with submenus
const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    label: "Projects",
    icon: <WorkspacesIcon />,
    children: [
      { label: "All Projects", path: "/projects" },
      { label: "Create Project", path: "/projects/create" },
      { label: "Archived", path: "/projects/archived" },
    ],
  },
  {
    label: "Products",
    icon: <FolderOpenIcon />,
    children: [
      { label: "All Products", path: "/products" },
      { label: "Create Product", path: "/products/create" },
    ],
  },
  {
    label: "Users",
    path: "/users",
    icon: <PeopleIcon />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsIcon />,
  },
];

export default function Sidebar({ open, onToggle }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  const toggleMenu = (label) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  // small helper to determine active
  const isActive = (path) =>
    path
      ? location.pathname === path || location.pathname.startsWith(path + "/")
      : false;

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: open ? drawerExpandedWidth : drawerCollapsedWidth,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          overflowX: "hidden",
          boxSizing: "border-box",
        },
      }}
      sx={{
        width: open ? drawerExpandedWidth : drawerCollapsedWidth,
        flexShrink: 0,
      }}
    >
      {/* Collapse Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-end" : "center",
          p: 1,
        }}
      >
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeftIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>

      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const hasChildren =
            Array.isArray(item.children) && item.children.length > 0;
          const activeParent = item.path
            ? isActive(item.path)
            : hasChildren && item.children.some((c) => isActive(c.path));
          return (
            <Box key={item.label} sx={{ mb: 0.5 }}>
              {hasChildren ? (
                <>
                  <Tooltip title={!open ? item.label : ""} placement="right">
                    <ListItemButton
                      onClick={() => toggleMenu(item.label)}
                      selected={activeParent}
                      sx={{
                        borderRadius: 1,
                        px: open ? 2 : 1,
                        transition: (t) =>
                          t.transitions.create(["background-color"], {
                            duration: 200,
                          }),
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : 0,
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <>
                          <ListItemText primary={item.label} />
                          {openMenus[item.label] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </>
                      )}
                    </ListItemButton>
                  </Tooltip>

                  <Collapse
                    in={openMenus[item.label]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.label}
                          component={Link}
                          to={child.path}
                          selected={isActive(child.path)}
                          sx={{
                            pl: open ? 6 : 2,
                            borderRadius: 1,
                            mx: 1,
                            transition: (t) =>
                              t.transitions.create(["padding-left"], {
                                duration: 250,
                              }),
                          }}
                        >
                          {open ? (
                            <ListItemText primary={child.label} />
                          ) : (
                            <ListItemText
                              primary={child.label}
                              sx={{ textAlign: "center" }}
                            />
                          )}
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <Tooltip title={!open ? item.label : ""} placement="right">
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive(item.path)}
                    sx={{
                      borderRadius: 1,
                      px: open ? 2 : 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.label} />}
                  </ListItemButton>
                </Tooltip>
              )}
            </Box>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Optional bottom area when expanded */}
      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}
