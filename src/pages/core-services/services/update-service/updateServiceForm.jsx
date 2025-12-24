import React, { useEffect, useState } from "react";
import axios from "../../../../services/axiosConfig";
import {
  ServiceUtilsAPIEndPoint,
  ServiceDetailAPIEndPoint,
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
  Alert,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { Add, Remove, Save } from "@mui/icons-material";

export default function UpdateServiceForm({ serviceId }) {
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [isActive, setIsActive] = useState(true);

  // File uploads
  const [banner, setBanner] = useState(null);
  const [images, setImages] = useState([]);
  const [existingBanner, setExistingBanner] = useState("");
  const [existingImages, setExistingImages] = useState([]);

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
        setCategories(response.data?.data?.categories || []);
        setServiceTypes(response.data?.data?.service_types || []);
      } catch (error) {
        console.error("Failed to fetch categories or service types:", error);
        showSnackbar("Failed to fetch categories or service types.", "error");
      }
    };
    fetchUtils();
  }, []);

  // Fetch service details for editing
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(ServiceDetailAPIEndPoint(serviceId));
        const data = response.data?.data;

        setTitle(data.title || "");
        setPrice(data.price || "");
        setUnit(data.unit || "");
        setDescription(data.description || "");
        setIsActive(!!data.is_active);
        setCategory(data.category || "");
        setServiceType(data.service_type || "");
        setExistingBanner(data.banner || "");
        setExistingImages(data.images || []);

        // FIXED normalizeItem to support multiple possible backend keys
        const normalizeItem = (i) => ({
          name: i?.name || i?.title || "",
          description:
            i?.description ||
            i?.desc ||
            i?.details ||
            i?.detail ||
            i?.include_description ||
            i?.upgrade_description ||
            i?.upgrade_detail ||
            "",
        });

        setServiceIncludes(
          Array.isArray(data.includes_list) && data.includes_list.length
            ? data.includes_list.map(normalizeItem)
            : [{ name: "", description: "" }]
        );

        setUpgradeServices(
          Array.isArray(data.upgrades_list) && data.upgrades_list.length
            ? data.upgrades_list.map(normalizeItem)
            : [{ name: "", description: "" }]
        );
      
      } catch (error) {
        showSnackbar("Failed to fetch service details.", "error");
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);

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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        price,
        unit,
        description,
        category: parseInt(category),
        service_type: parseInt(serviceType),
        is_active: isActive,
        includes: serviceIncludes.filter((item) => item.name.trim() !== ""),
        upgrades: upgradeServices.filter((item) => item.name.trim() !== ""),
      };

      const hasFiles = banner || images.length > 0;
      let response;

      if (hasFiles) {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("price", payload.price);
        formData.append("unit", payload.unit);
        formData.append("description", payload.description);
        formData.append("category", payload.category);
        formData.append("service_type", payload.service_type);
        formData.append("is_active", payload.is_active);

        // send JSON strings for nested lists
        formData.append("includes", JSON.stringify(payload.includes));
        formData.append("upgrades", JSON.stringify(payload.upgrades));

        if (banner) formData.append("banner", banner);
        images.forEach((img) => formData.append("images", img));

        response = await axios.put(
          ServiceDetailAPIEndPoint(serviceId),
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.put(
          ServiceDetailAPIEndPoint(serviceId),
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      showSnackbar("Service updated successfully!");
      console.log("Updated Service:", response.data);
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
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                variant="outlined"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={() => setIsActive(!isActive)}
                    color="primary"
                  />
                }
                label="Active Service"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            {/* Banner */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Banner
              </Typography>
              {existingBanner && !banner && (
                <Box sx={{ mb: 2 }}>
                  <img src={existingBanner} alt="Banner" width="150" style={{ borderRadius: 4 }} />
                </Box>
              )}
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

            {/* Service Images */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Service Images
              </Typography>
              {existingImages?.length > 0 && images.length === 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {existingImages.map((img, i) => (
                    <img key={i} src={img.image} alt="Service" width="100" style={{ borderRadius: 4 }} />
                  ))}
                </Box>
              )}
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

            {/* Includes */}
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

            {/* Upgrades */}
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
          color="primary"
          disabled={loading}
          startIcon={<Save />}
        >
          {loading ? "Updating..." : "Update"}
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
