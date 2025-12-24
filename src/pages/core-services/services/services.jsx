import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";

import axios from "../../../services/axiosConfig";
import {
  ServicesAPIEndPoint,
  ServiceDetailAPIEndPoint,
} from "../../../services/api_services";

export default function Services() {
  const [services, setServices] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(ServicesAPIEndPoint);
        setServices(response.data?.data || []);
      } catch (error) {
        showSnackbar("Failed to fetch services", "error");
      }
    };

    fetchServices();
  }, []);

  // Show delete confirmation dialog
  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteDialog(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(ServiceDetailAPIEndPoint(serviceToDelete.id));
      showSnackbar("Service deleted successfully");
      // Remove deleted service from local state
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceToDelete.id)
      );
    } catch (error) {
      showSnackbar("Failed to delete service", "error");
    } finally {
      setShowDeleteDialog(false);
      setServiceToDelete(null);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="services table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.length > 0 ? (
              services.map((service) => (
                <TableRow
                  key={service.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  hover
                >
                  <TableCell>{service.title}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{service.unit}</TableCell>
                  <TableCell>{service.category_name}</TableCell>
                  <TableCell>
                    {service.is_active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    {new Date(service.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        component={Link}
                        to={`/services/update/${service.id}`}
                        color="primary"
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/services/detail/${service.id}`}
                        color="primary"
                        size="small"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(service)}
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete service{" "}
            <strong>{serviceToDelete?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
