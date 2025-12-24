import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

import Services from "./services";

export default function ServicePage() {

  return (
    <Box>
      <Box sx={{ px: 3, pt: 3 }}>
        <Typography variant="h5" fontWeight="bold">Services</Typography>
        <Typography variant="body2" color="text.secondary">Services</Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <Services />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
