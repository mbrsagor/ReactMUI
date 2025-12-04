import React from "react";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

/**
 * Basic breadcrumb builder:
 * - Splits path segments and uses a mapping to display names.
 * - You can extend `labelMap` to include dynamic routes: e.g. /projects/123 -> "Project #123"
 */
const labelMap = {
  "": "Dashboard",
  projects: "Projects",
  products: "Products",
  users: "Users",
  create: "Create",
  archived: "Archived",
  settings: "Settings",
};

export default function BreadcrumbsNav() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean); // e.g. ['projects', '123', 'edit']

  // build crumb links
  const crumbs = pathnames.map((_, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    const key = pathnames[index];
    const label = labelMap[key] || decodeURIComponent(key);
    return { to, label };
  });

  // include root at start
  const root = { to: "/", label: labelMap[""] || "Home" };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <MuiLink
        component={RouterLink}
        underline="hover"
        color="inherit"
        to={root.to}
      >
        {root.label}
      </MuiLink>

      {crumbs.length === 0 ? (
        <Typography color="textPrimary">{root.label}</Typography>
      ) : (
        crumbs.map((c, idx) =>
          idx === crumbs.length - 1 ? (
            <Typography key={c.to} color="textPrimary">
              {c.label}
            </Typography>
          ) : (
            <MuiLink
              key={c.to}
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={c.to}
            >
              {c.label}
            </MuiLink>
          )
        )
      )}
    </Breadcrumbs>
  );
}
