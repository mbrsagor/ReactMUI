import React, { useState } from "react";
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
  Slide,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../../services/axiosConfig";
import { onBoardingUpdateDeleteEndpoint } from "../../services/api_services";

const itemsPerPage = 10;

// Animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function OnBoardingTable({ onboarding, onEdit, setOnBoarding }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [openDelete, setOpenDelete] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

// Snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Delete click
  const handleDeleteClick = (item) => {
    setToDelete(item);
    setOpenDelete(true);
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(onBoardingUpdateDeleteEndpoint(toDelete.id));

      setOnBoarding((prev) => prev.filter((obj) => obj.id !== toDelete.id));

      setSnackbar({
        open: true,
        message: "Deleted successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Delete failed",
        severity: "error",
      });
    } finally {
      setOpenDelete(false);
      setToDelete(null);
    }
  };

  // Total pages
  const totalPages = Math.ceil(onboarding.length / itemsPerPage);
  const paginatedData = onboarding.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.company_name}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.stage_name}</TableCell>
                  <TableCell>
                    {row.service_type_name || "No service type"}
                  </TableCell>
                  <TableCell>{row.is_active ? "Active" : "Inactive"}</TableCell>
                  <TableCell>{row.created_at}</TableCell>

                  <TableCell align="center">
                    <IconButton onClick={() => onEdit(row)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(row)}
                      color="error"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDelete(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{toDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
