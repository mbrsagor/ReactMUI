import React from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography } from "@mui/material";

import UpdateServiceForm from "./updateServiceForm";

export default function ServiceUpdate() {
  const { id } = useParams();
  return (
    <Box>
      <Box sx={{ px: 3, pt: 3 }}>
        <Typography variant="h5" fontWeight="bold">Service Update</Typography>
        <Typography variant="body2" color="text.secondary">Service / Service Update</Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <UpdateServiceForm serviceId={id} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
