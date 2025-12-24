import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
  Switch,
  CircularProgress,
} from "@mui/material";

import Services from "./services";
import axios from "../../../services/axiosConfig";
import { ServiceTypesAPIEndPoint, ServiceTypeUpdateDeleteAPIEndPoint } from "../../../services/api_services";

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ServiceTypePage() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [editService, setEditingService] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle close
  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  // Handle show
  const handleShow = () => setShow(true);

  // Reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setIsActive(true);
    setImage(null);
    setBanner(null);
    setEditingService(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await axios.get(ServiceTypesAPIEndPoint);
      setServices(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch services
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("is_active", isActive);
      if (banner) formData.append("banner", banner);
      if (image) formData.append("image", image);

      let response;

      if (editService) {
        response = await axios.put(
          ServiceTypeUpdateDeleteAPIEndPoint(editService.id),
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(ServiceTypesAPIEndPoint, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: response.data.message || (editService ? "Service Type updated" : "Service Type created"),
          severity: "success",
        });
        fetchServices();
        handleClose();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data || err.message || "Error saving service type",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit click
  const handleEditClick = (service) => {
    setEditingService(service);
    setName(service.name || "");
    setDescription(service.description || "");
    setIsActive(service.is_active !== undefined ? service.is_active : true);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShow(true);
  };

  return (
    <Box>
       <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleShow}
        >
          Add New
        </Button>
      </Box>

      {/* Services Table */}
      <Services
        services={services}
        setServices={setServices}
        onEdit={handleEditClick}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={show} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editService ? "Update service type" : "Create service type"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              label="Service type name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              label="Service type description (optional)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
             <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      sx={{ mt: 2, mb: 1 }}>
            <Box>
              Upload Icon
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                ref={fileInputRef}
                multiple
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Box>
      </Button>
      <FormControlLabel
              control={
                <Switch
                  defaultChecked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  color="primary"
                />
              }
              label="Active"
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : editService ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
    </Box>
  );
}
