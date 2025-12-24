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
  Snackbar,
  Alert,
} from "@mui/material";

import { Add, Remove, Save } from "@mui/icons-material";

export default function CreateServiceForm() {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("");

  // Files
  const [banner, setBanner] = useState(null);
  const [images, setImages] = useState([]);

  // Dynamic fields
  const [serviceIncludes, setServiceIncludes] = useState([
    { name: "", description: "" },
  ]);
  const [upgradeServices, setUpgradeServices] = useState([
    { name: "", description: "" },
  ]);

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const fetchUtils = async () => {
      try {
        const res = await axios.get(ServiceUtilsAPIEndPoint);
        setServiceTypes(res.data?.data?.service_types || []);
      } catch {
        showSnackbar("Failed to fetch service types", "error");
      }
    };
    fetchUtils();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        price: parseFloat(price),
        unit,
        description,
        service_type: Number(serviceType),
        includes: serviceIncludes.filter((i) => i.name.trim()),
        upgrades: upgradeServices.filter((i) => i.name.trim()),
      };

      const res = await axios.post(ServicesAPIEndPoint, payload);

      if (banner || images.length) {
        const fd = new FormData();
        if (banner) fd.append("banner", banner);
        images.forEach((img) => fd.append("images", img));

        await axios.patch(
          `${ServicesAPIEndPoint}${res.data.data.id}/`,
          fd
        );
      }

      showSnackbar("Service created successfully");

      // reset
      setTitle("");
      setPrice("");
      setUnit("");
      setDescription("");
      setServiceType("");
      setBanner(null);
      setImages([]);
      setServiceIncludes([{ name: "", description: "" }]);
      setUpgradeServices([{ name: "", description: "" }]);
    } catch {
      showSnackbar("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>

        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>
          <TextField fullWidth label="Service Title" value={title}
            onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />

          <TextField fullWidth type="number" label="Price" value={price}
            onChange={(e) => setPrice(e.target.value)} sx={{ mb: 2 }} />

          <TextField fullWidth label="Unit" value={unit}
            onChange={(e) => setUnit(e.target.value)} sx={{ mb: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Service Type</InputLabel>
            <Select value={serviceType} label="Service Type"
              onChange={(e) => setServiceType(e.target.value)}>
              {serviceTypes.map((st) => (
                <MenuItem key={st.id} value={st.id}>
                  {st.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={5}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={4}>
          <Button fullWidth variant="outlined" component="label" sx={{ mb: 2 }}>
            Upload Banner
            <input hidden type="file" accept="image/*"
              onChange={(e) => setBanner(e.target.files[0])} />
          </Button>

          <Button fullWidth variant="outlined" component="label" sx={{ mb: 3 }}>
            Upload Images
            <input hidden multiple type="file" accept="image/*"
              onChange={(e) => setImages([...e.target.files])} />
          </Button>

          {/* INCLUDES */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Includes
          </Typography>
          {serviceIncludes.map((item, i) => (
            <Grid container spacing={1} key={i} sx={{ mb: 1 }}>
              <Grid item xs={5}>
                <TextField size="small" fullWidth placeholder="Name"
                  value={item.name}
                  onChange={(e) => {
                    const v = [...serviceIncludes];
                    v[i].name = e.target.value;
                    setServiceIncludes(v);
                  }} />
              </Grid>
              <Grid item xs={5}>
                <TextField size="small" fullWidth placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const v = [...serviceIncludes];
                    v[i].description = e.target.value;
                    setServiceIncludes(v);
                  }} />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() =>
                  setServiceIncludes([...serviceIncludes, { name: "", description: "" }])
                }>
                  <Add />
                </IconButton>
                {serviceIncludes.length > 1 && (
                  <IconButton color="error" onClick={() =>
                    setServiceIncludes(serviceIncludes.filter((_, idx) => idx !== i))
                  }>
                    <Remove />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          {/* UPGRADES */}
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Upgrades
          </Typography>
          {upgradeServices.map((item, i) => (
            <Grid container spacing={1} key={i} sx={{ mb: 1 }}>
              <Grid item xs={5}>
                <TextField size="small" fullWidth placeholder="Name"
                  value={item.name}
                  onChange={(e) => {
                    const v = [...upgradeServices];
                    v[i].name = e.target.value;
                    setUpgradeServices(v);
                  }} />
              </Grid>
              <Grid item xs={5}>
                <TextField size="small" fullWidth placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const v = [...upgradeServices];
                    v[i].description = e.target.value;
                    setUpgradeServices(v);
                  }} />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() =>
                  setUpgradeServices([...upgradeServices, { name: "", description: "" }])
                }>
                  <Add />
                </IconButton>
                {upgradeServices.length > 1 && (
                  <IconButton color="error" onClick={() =>
                    setUpgradeServices(upgradeServices.filter((_, idx) => idx !== i))
                  }>
                    <Remove />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" color="success"
          startIcon={<Save />} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
