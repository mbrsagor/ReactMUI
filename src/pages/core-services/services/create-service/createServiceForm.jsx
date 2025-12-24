import React, { useEffect, useState } from "react";
import axios from "../../../../services/axiosConfig";
import {
  ServiceUtilsAPIEndPoint,
  ServicesAPIEndPoint,
} from "../../../../services/api_services";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  IconButton,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";
import { Add, Remove, Save } from "@mui/icons-material";

export default function CreateServiceForm() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("");

  // File uploads
  const [banner, setBanner] = useState(null);
  const [images, setImages] = useState([]);

  // Dynamic fields
  const [serviceIncludes, setServiceIncludes] = useState([
    { name: "", description: "" },
  ]);
  const [upgradeServices, setUpgradeServices] = useState([
    { name: "", description: "" },
  ]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch categories + service types
  useEffect(() => {
    const fetchUtils = async () => {
      try {
        const response = await axios.get(ServiceUtilsAPIEndPoint);
        setServiceTypes(response.data?.data?.service_types || []);
      } catch (error) {
        console.error("Error fetching service utils:", error);
        showSnackbar("Failed to fetch categories or service types.", "error");
      }
    };
    fetchUtils();
  }, []);

  // File handlers
  const handleBannerChange = (e) => setBanner(e.target.files[0]);
  const handleImagesChange = (e) => setImages([...e.target.files]);

  // Dynamic includes
  const handleIncludeChange = (index, field, value) => {
    const updated = [...serviceIncludes];
    updated[index][field] = value;
    setServiceIncludes(updated);
  };
  const handleAddInclude = () =>
    setServiceIncludes([...serviceIncludes, { name: "", description: "" }]);
  const handleRemoveInclude = (index) =>
    setServiceIncludes(serviceIncludes.filter((_, i) => i !== index));

  // Dynamic upgrades
  const handleUpgradeChange = (index, field, value) => {
    const updated = [...upgradeServices];
    updated[index][field] = value;
    setUpgradeServices(updated);
  };
  const handleAddUpgrade = () =>
    setUpgradeServices([...upgradeServices, { name: "", description: "" }]);
  const handleRemoveUpgrade = (index) =>
    setUpgradeServices(upgradeServices.filter((_, i) => i !== index));

  // Submit data 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        price: parseFloat(price),
        unit,
        description,
        service_type: parseInt(serviceType),
        includes: serviceIncludes.filter((i) => i.name.trim() !== ""),
        upgrades: upgradeServices.filter((i) => i.name.trim() !== ""),
      };

      const response = await axios.post(ServicesAPIEndPoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (banner || images.length > 0) {
        const serviceId = response.data?.data?.id;
        if (serviceId) {
          const formData = new FormData();
          if (banner) formData.append("banner", banner);
          images.forEach((img) => formData.append("images", img));

          await axios.patch(`${ServicesAPIEndPoint}${serviceId}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      showSnackbar("Service created successfully!");

      // Reset form
      setTitle("");
      setPrice("");
      setUnit("");
      setDescription("");
      setServiceType("");
      setBanner(null);
      setImages([]);
      setServiceIncludes([{ name: "", description: "" }]);
      setUpgradeServices([{ name: "", description: "" }]);
    } catch (err) {
      showSnackbar(err?.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Service Title"
                placeholder="Write here"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                placeholder="Write here"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Unit"
                placeholder="Write here"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={serviceType}
                  label="Service Type"
                  onChange={(e) => setServiceType(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Service Type</em>
                  </MenuItem>
                  {serviceTypes.map((st) => (
                    <MenuItem key={st.id} value={st.id}>
                      {st.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                placeholder="Write here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Banner
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload Banner
                <input
                  type="file"
                  hidden
                  onChange={handleBannerChange}
                  accept="image/*"
                />
              </Button>
              {banner && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{banner.name}</Typography>}
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Service Images
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleImagesChange}
                  accept="image/*"
                />
              </Button>
              {images.length > 0 && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {images.length} images selected
                </Typography>
              )}
            </Box>

            {/* Service Includes */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Includes
              </Typography>
              {serviceIncludes.map((item, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 1 }} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) =>
                        handleIncludeChange(index, "name", e.target.value)
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleIncludeChange(index, "description", e.target.value)
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex' }}>
                    <IconButton onClick={handleAddInclude} color="primary" size="small">
                      <Add />
                    </IconButton>
                    {serviceIncludes.length > 1 && (
                      <IconButton onClick={() => handleRemoveInclude(index)} color="error" size="small">
                        <Remove />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Box>

            {/* Upgrade Services */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Upgrades
              </Typography>
              {upgradeServices.map((item, index) => (
                <Grid container spacing={1} key={index} sx={{ mb: 1 }} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Name"
                      value={item.name}
                      onChange={(e) =>
                        handleUpgradeChange(index, "name", e.target.value)
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleUpgradeChange(index, "description", e.target.value)
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ display: 'flex' }}>
                    <IconButton onClick={handleAddUpgrade} color="primary" size="small">
                      <Add />
                    </IconButton>
                    {upgradeServices.length > 1 && (
                      <IconButton onClick={() => handleRemoveUpgrade(index)} color="error" size="small">
                        <Remove />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          disabled={loading}
          startIcon={<Save />}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
