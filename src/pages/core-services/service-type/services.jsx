import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../../services/axiosConfig";
import { ServiceTypeUpdateDeleteAPIEndPoint } from "../../../services/api_services";

const itemsPerPage = 10;

export default function Services({ services, onEdit, setServices }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [services]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // Snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        ServiceTypeUpdateDeleteAPIEndPoint(serviceToDelete.id)
      );
      
      setSnackbar({
        open: true,
        message: "Service type deleted successfully",
        severity: "success",
      });

      // Remove deleted service from local state
      setServices((prevService) =>
        prevService.filter((cat) => cat.id !== serviceToDelete.id)
      );
    } catch (error) {
      console.error("Delete failed:", error);
      setSnackbar({
        open: true,
        message: "Delete failed",
        severity: "error",
      });
    } finally {
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  const totalPages = Math.ceil(services.length / itemsPerPage);

  const paginatedServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Updated Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.is_active ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <img
                      src={service.icon}
                      alt={service.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </TableCell>
                  <TableCell>{service.created_at}</TableCell>
                  <TableCell>{service.updated_at}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => onEdit && onEdit(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(service)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        keepMounted
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete service type{" "}
            <strong>{serviceToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
