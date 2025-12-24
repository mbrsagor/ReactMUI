import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton
} from "@mui/material";
import { Edit, ArrowBack, ArrowForward } from "@mui/icons-material";

import axios from "../../../services/axiosConfig";
import { ServiceDetailAPIEndPoint } from "../../../services/api_services";

export default function ServiceDetails() {
  // State to hold service details
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { id } = useParams();
 
  // Fetch service details by ID
  useEffect(() => {
    setLoading(true);
    axios
      .get(ServiceDetailAPIEndPoint(id))
      .then((response) => {
        if (response?.data?.data) {
          setService(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch service details", error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
     return (
        <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </Box>
        </Box>
     )
  }

  if (!service && !loading) return (
     <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">Service not found.</Typography>
     </Box>
  );

  return (
    <Box>
      {/* Page Title Replacement */}
      <Box sx={{ px: 3, pt: 3, mb: 0 }}>
        <Typography variant="h5" fontWeight="bold">Service Details</Typography>
        <Typography variant="body2" color="text.secondary">Service / Service Details</Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Service Details</Typography>
          <Box>
            <IconButton
              component={Link}
              to={`/services/update/${id}`}
              color="primary"
              sx={{ mr: 1 }}
            >
              <Edit />
            </IconButton>
             {/* Retaining the arrow button as purely visual or placeholder if function unknown, 
                 but mapping to 'Back' is usually safer. 
                 Original was arrow-right (ArrowForward). Keeping as 'Back' for UX or just Link to list. 
                 I'll default to a Back button to /services. */}
            <IconButton component={Link} to="/services" color="secondary">
              <ArrowBack />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{service.title}</Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" fontWeight="bold">Price:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2">{service.price}</Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" fontWeight="bold">Unit:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                     <Typography variant="body2">{service.unit}</Typography>
                  </Grid>
                </Grid>

                 <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" fontWeight="bold">Category:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                     <Typography variant="body2">{service.category_name}</Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" fontWeight="bold">Status:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      variant="body2"
                      color={service.is_active ? "success.main" : "text.secondary"}
                      fontWeight="bold"
                    >
                      {service.is_active ? "Active" : "Inactive"}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                   <Grid item xs={4}>
                    <Typography variant="subtitle2" fontWeight="bold">Created Date:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                     <Typography variant="body2">{service.created_at}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Includes List */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Includes:</Typography>
                    <List dense>
                      {service.includes_list?.map((item) => (
                        <ListItem key={item.id} disablePadding>
                          <ListItemText primary={`• ${item.name}`} />
                        </ListItem>
                      ))}
                    </List>
                </Box>

                {/* Upgrades List */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Upgrades:</Typography>
                     <List dense>
                      {service.upgrades_list?.map((item) => (
                        <ListItem key={item.id} disablePadding>
                           <ListItemText primary={`• ${item.name}`} />
                        </ListItem>
                      ))}
                    </List>
                </Box>

                 <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">Description:</Typography>
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {service.description}
                  </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>

          {/* Image Section */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                {service.image_url ? (
                  <Box
                    component="img"
                    src={service.image_url}
                    alt={service.title}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">No image uploaded</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
