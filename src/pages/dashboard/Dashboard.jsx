import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BusinessIcon from "@mui/icons-material/Business";

// API Services
import { SuperAdminDashboardEndpoint } from "../../services/api_services";
import axios from "../../services/axiosConfig";
import "../../style/dashboard.scss";

export default function Dashboard() {
  // State management model for dashboard metrics
  const [totalUser, setTotalUser] = useState(0);
  const [totalCompany, setTotalCompany] = useState(0);
  const [countActiveUsers, setCountActiveUsers] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(SuperAdminDashboardEndpoint);
        setTotalUser(response.data.data.total_users || 0);
        setCountActiveUsers(response.data.data.total_active_users || 0);
        setTotalCompany(response.data.data.total_companies || 0);
        setTotalServices(response.data.data.total_services || 0);
        setTotalSubmissions(response.data.data.total_submissions || 0);
        setTotalTransactions(response.data.data.total_transactions || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Dummy data / Replace with API later
  const cardData = [
    {
      title: "Total Users",
      value: totalUser,
      icon: <PersonIcon />,
      link: "/users",
    },
    {
      title: "Total Active Users",
      value: countActiveUsers,
      icon: <PeopleAltIcon />,
      link: "/users",
    },
    {
      title: "Total Services",
      value: totalServices,
      icon: <InventoryIcon />,
      link: "/services",
    },
    {
      title: "Total Projects",
      value: totalSubmissions,
      icon: <AssignmentTurnedInIcon />,
      link: "/submissions",
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      icon: <MonetizationOnIcon />,
      link: "/transactions",
    },
    {
      title: "Total Companies",
      value: totalCompany,
      icon: <BusinessIcon />,
      link: "/companies",
    },
  ];

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <Box>
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
                className="dashboard-card"
                elevation={0}
                onClick={() => navigate(item.link)}
              >
                <div className="top">
                  <p className="title">{item.title}</p>
                  <span className="icon">{item.icon}</span>
                </div>

                <h2 className="value">{item.value}</h2>

                <p className="details">View Details</p>
              </Paper>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
