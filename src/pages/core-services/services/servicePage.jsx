import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import Services from "./services";

export default function ServicePage() {

  return (
    <Box>
      <Box sx={{ px: 3, pt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h5" fontWeight="bold">Services</Typography>
            <Typography variant="body2" color="text.secondary">Services</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/services/create"
        >
          Add New
        </Button>
      </Box>

      <Box sx={{ p: 3 }}>
        <Services />
      </Box>
    </Box>
  );
}
