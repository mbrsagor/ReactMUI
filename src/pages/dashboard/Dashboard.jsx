import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LayersIcon from "@mui/icons-material/Layers";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BusinessIcon from "@mui/icons-material/Business";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Dummy data / Replace with API later
  const cardData = [
    { title: "Total Users", value: 5, icon: <PersonIcon />, link: "/users" },
    {
      title: "Active Users",
      value: 5,
      icon: <PeopleAltIcon />,
      link: "/users",
    },
    {
      title: "Service Type",
      value: 0,
      icon: <LayersIcon />,
      link: "/service-type",
    },
    {
      title: "Total Services",
      value: 1,
      icon: <InventoryIcon />,
      link: "/services",
    },
    {
      title: "Total Categories",
      value: 0,
      icon: <CategoryIcon />,
      link: "/categories",
    },
    {
      title: "Total Submissions",
      value: 3,
      icon: <AssignmentTurnedInIcon />,
      link: "/submissions",
    },
    {
      title: "Total Transactions",
      value: 5,
      icon: <MonetizationOnIcon />,
      link: "/transactions",
    },
    {
      title: "Total Companies",
      value: 1,
      icon: <BusinessIcon />,
      link: "/companies",
    },
  ];

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {(loading ? Array.from(new Array(8)) : cardData).map((item, idx) => (
          <Grid item xs={12} sm={4} md={3} key={idx}>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={160}
                animation="wave"
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <Paper
                elevation={0}
                onClick={() => navigate(item.link)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 160,
                  cursor: "pointer",
                  border: "1px solid #E3E3E3",
                  transition: "all .25s ease",
                  background: "#fff",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    borderColor: "#d6d6d6",
                  },
                }}
              >
                {/* Top */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ fontSize: 24, color: "#333" }}>{item.icon}</Box>
                </Box>

                {/* Number */}
                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: 700,
                    mt: 1,
                    color: "#111",
                  }}
                >
                  {item.value}
                </Typography>

                {/* View Details */}
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#0056D2",
                    textDecoration: "underline",
                  }}
                >
                  View Details
                </Typography>
              </Paper>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
