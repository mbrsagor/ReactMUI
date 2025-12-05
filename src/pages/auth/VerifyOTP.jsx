import React, { useRef } from "react";
import { Box, Card, TextField, Button, Typography } from "@mui/material";

export default function VerifyOTP() {
  const inputs = Array(4)
    .fill(0)
    .map(() => useRef());

  const moveNext = (e, index) => {
    if (e.target.value && index < 3) {
      inputs[index + 1].current.focus();
    }
  };

  const handleVerify = () => {
    alert("OTP Verified!");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card sx={{ p: 4, width: 380, textAlign: "center" }}>
        <Typography variant="h5" mb={2}>
          Verification Code
        </Typography>

        <Typography variant="body2" mb={2}>
          Enter the 4-digit code sent to your email.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          {[0, 1, 2, 3].map((i) => (
            <TextField
              key={i}
              inputRef={inputs[i]}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "22px",
                  width: "50px",
                },
              }}
              onChange={(e) => moveNext(e, i)}
            />
          ))}
        </Box>

        <Button variant="contained" fullWidth onClick={handleVerify}>
          Verify
        </Button>
      </Card>
    </Box>
  );
}
