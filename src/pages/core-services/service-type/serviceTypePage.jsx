import React, { useState, useEffect, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Box,
  Typography,
} from "@mui/material";

import Services from "./services";
// Layout and PageTitle removed as they are handled by AdminLayout or not present

import axios from "../../../services/axiosConfig";
import { ServiceTypesAPIEndPoint, ServiceTypeUpdateDeleteAPIEndPoint } from "../../../services/api_services";

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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClose = () => {
    setShow(false);
    resetForm();
  };
  const handleShow = () => setShow(true);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsActive(true);
    setImage(null);
    setBanner(null);
    setEditingService(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(ServiceTypesAPIEndPoint);
      setServices(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Service Types</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleShow}
        >
          Add New
        </Button>
      </Box>

      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-12 p-0">
            <div className="card">
              <div className="card-body">
                <Services
                  services={services}
                  setServices={setServices}
                  onEdit={handleEditClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editService ? "Update service type" : "Create service type"}
          </DialogTitle>
          <DialogContent>
            <div className="mb-3 mt-2">
              <TextField
                label="Service type name"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <TextField
                label="Service type description (optional)"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Icon {editService ? "(Leave empty to keep current)" : ""}
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="mb-3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    color="primary"
                  />
                }
                label="Active"
              />
            </div>
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
              {loading ? "Saving..." : editService ? "Update" : "Create"}
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
