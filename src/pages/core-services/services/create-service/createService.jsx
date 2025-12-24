import React from "react";
import { Box, Card, CardContent } from "@mui/material";
import ServiceForm from "./createServiceForm";

export default function CreateService() {
  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Card sx={{ width: "100%" }}>
        <CardContent sx={{ width: "100%" }}>
          <ServiceForm />
        </CardContent>
      </Card>
    </Box>
  );
}
