import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import {
  onBoardingEndpoint,
  adminOnBoardingCreateEndpoint,
  ServiceTypesAPIEndPoint,
  onBoardingUpdateDeleteEndpoint,
  companyListFilterEndpoint
} from "../../services/api_services";
import axios from "../../services/axiosConfig";

import OnBoardingTable from "./OnBoarding";


export default function OnBoardingPage() {
  const [open, setOpen] = useState(false);

  const [onboarding, setOnboarding] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [companyId, setCompanyId] = useState("");

  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [stage, setStage] = useState("");
  const [order, setOrder] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingOnBoarding, setEditingOnBoarding] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Snackbar close
  const handleSnackbarClose = () =>
    setSnackbar({ ...snackbar, open: false });

  // Close modal
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Show modal
  const handleShow = () => setOpen(true);

  // Reset form
  const resetForm = () => {
    setName("");
    setStage("");
    setServiceType("");
    setCompanyId("");
    setOrder("");
    setDescription("");
    setIsActive(true);
    setEditingOnBoarding(null);
  };

  // Fetch Onboarding
  const fetchOnboarding = async () => {
    try {
      const res = await axios.get(onBoardingEndpoint);
      setOnboarding(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Service Types
  const fetchServiceType = async () => {
    try {
      const res = await axios.get(ServiceTypesAPIEndPoint);
      setServiceTypes(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(companyListFilterEndpoint);
      setCompanyList(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  } ;


  // Fetch onboarding list
  useEffect(() => {
    fetchOnboarding();
    fetchServiceType();
    fetchCompanies();
  }, []);

  // Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("stage", stage);
    formData.append("order", order);
    formData.append("description", description);
    formData.append("is_active", isActive);
    formData.append("service_type", serviceType);
    formData.append("company", companyId);

    let response;

    if (editingOnBoarding) {
      response = await axios.put(
        onBoardingUpdateDeleteEndpoint(editingOnBoarding.id),
        formData
      );
    } else {
      response = await axios.post(adminOnBoardingCreateEndpoint, formData);
    }

    setSnackbar({
      open: true,
      message:
        response.data?.message ||
        (editingOnBoarding
          ? "Updated successfully"
          : "Created successfully"),
      severity: "success",
    });

    fetchOnboarding();
    handleClose();
  } catch (err) {
    setSnackbar({
      open: true,
      message:
        err.response?.data?.message ||
        err.message ||
        "Error saving",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};

  // Edit
  const handleEditClick = (item) => {
    setEditingOnBoarding(item);
    setName(item.name);
    setStage(item.stage);
    setOrder(item.order);
    setDescription(item.description);
    setServiceType(item.service_type);
    setCompanyId(item.companies);
    setIsActive(item.is_active);
    setOpen(true);
  };

  return (
    <Box>
      {/* Add button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleShow}>
          Onboarding
        </Button>
      </Box>

      {/* Table */}
      <OnBoardingTable
        onboarding={onboarding}
        setOnBoarding={setOnboarding}
        onEdit={handleEditClick}
      />

      {/* Create / Update Modal */}
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingOnBoarding ? "Update Onboarding" : "Create Onboarding"}
          </DialogTitle>

          <DialogContent dividers>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Select Stage</InputLabel>
              <Select
                value={stage}
                label="Select Stage"
                onChange={(e) => setStage(e.target.value)}
              >
                <MenuItem key={1} value={1}>Do you need...</MenuItem>
                <MenuItem key={2} value={2}>Material?</MenuItem>
                <MenuItem key={3} value={3}>Any Upgrade?</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Service Type</InputLabel>
              <Select
                value={serviceType}
                label="Service Type"
                onChange={(e) => setServiceType(e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                {serviceTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Select Company</InputLabel>
              <Select
                value={companyId}
                label="Select Company"
                onChange={(e) => setCompanyId(e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                {companyList.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              }
              label="Active"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="error">
              Close
            </Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : editingOnBoarding ? "Update" : "Create"}
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
