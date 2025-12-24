import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

import ServiceForm from "./createServiceForm";
// import Layout from "../../../../components/common/layout";
// import PageTitle from "../../../../components/common/pageTitle";

export default function CreateService() {
  return (
    <Box>
      <Box sx={{ px: 3, pt: 3 }}>
        <Typography variant="h5" fontWeight="bold">Create Service</Typography>
        <Typography variant="body2" color="text.secondary">Service / Create Service</Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Card>
          <CardContent>
            <ServiceForm />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
