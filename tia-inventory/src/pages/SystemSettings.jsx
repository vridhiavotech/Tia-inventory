import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Typography,
  CardContent,
} from "@mui/material";

// Add this color object right after your imports or at the top of the component
const C = {
  bg: "#F8FAFC",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  primary: "#1976D2",
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    height: "44px",
    width: "270px",
    borderRadius: "10px",
    fontSize: "14px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#d1d5db",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "12px",
    color: "#6b7280",
  },
};

const labelStyle = {
  fontSize: "14px",
  color: "#6b7280",
  mb: 0.5,
};

const SystemSettings = () => {
  // --- Initial Values ---
  const initialFacilityName = "St. Mary's Regional Medical Center";
  const initialNpiNumber = "1234567890";
  const initialDeaRegistration = "AS1234563";
  const initialStateLicense = "IL-HOSP-2024-04821";

  const initialLowStockThreshold = 20;
  const initialExpiryWarningDays = 60;
  const initialAutoReorder = "Yes — Create draft PO";
  const initialAlertEmail = "inventory@stmarys.org";

  // --- State ---
  const [facilityName, setFacilityName] = useState(initialFacilityName);
  const [npiNumber, setNpiNumber] = useState(initialNpiNumber);
  const [deaRegistration, setDeaRegistration] = useState(
    initialDeaRegistration,
  );
  const [stateLicense, setStateLicense] = useState(initialStateLicense);

  const [lowStockThreshold, setLowStockThreshold] = useState(
    initialLowStockThreshold,
  );
  const [expiryWarningDays, setExpiryWarningDays] = useState(
    initialExpiryWarningDays,
  );
  const [autoReorder, setAutoReorder] = useState(initialAutoReorder);
  const [alertEmail, setAlertEmail] = useState(initialAlertEmail);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const findScrollableParent = (element) => {
      while (element) {
        const style = window.getComputedStyle(element);
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    };

    const container = findScrollableParent(
      document.querySelector(".MuiBox-root")?.parentElement,
    );
    if (container) {
      container.style.overflowY = "hidden";
    }

    return () => {
      if (container) {
        container.style.overflowY = "auto";
      }
    };
  }, []);

  const handleSave = () => {
    const settings = {
      facilityName,
      npiNumber,
      deaRegistration,
      stateLicense,
      lowStockThreshold,
      expiryWarningDays,
      autoReorder,
      alertEmail,
    };

    console.log("Saved settings:", settings);
    setSnackbarMessage("Settings saved successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCancel = () => {
    setFacilityName(initialFacilityName);
    setNpiNumber(initialNpiNumber);
    setDeaRegistration(initialDeaRegistration);
    setStateLicense(initialStateLicense);
    setLowStockThreshold(initialLowStockThreshold);
    setExpiryWarningDays(initialExpiryWarningDays);
    setAutoReorder(initialAutoReorder);
    setAlertEmail(initialAlertEmail);

    setSnackbarMessage("Changes discarded");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "26px 24px",
        overflow: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {/* MAIN OUTER CARD */}
    
        {/* Header inside the card */}
        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 2, sm: 3, md: 4 },
            pb: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 22,
              color: C.textPrimary,
              letterSpacing: -0.3,
            }}
          >
            System Settings
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: C.textSecondary,
              mt: 0.3,
            }}
          >
            Global configuration
          </Typography>
        </Box>

        <CardContent
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } },
            pt: 0,
          }}
        >
          {/* FACILITY INFO CARD */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              mb: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
              
                
              }}
            >
              <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                FACILITY INFO
              </Typography>
            </Box>

            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>Facility Name</Typography>
                    <TextField
                      fullWidth
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>NPI Number</Typography>
                    <TextField
                      fullWidth
                      value={npiNumber}
                      onChange={(e) => setNpiNumber(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>Dea Registration</Typography>
                    <TextField
                      fullWidth
                      value={deaRegistration}
                      onChange={(e) => setDeaRegistration(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>State License</Typography>
                    <TextField
                      fullWidth
                      value={stateLicense}
                      onChange={(e) => setStateLicense(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* ALERT THRESHOLDS CARD */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              mb: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
             
              }}
            >
              <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                ALERT THRESHOLDS
              </Typography>
            </Box>

            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>
                      Low Stock Threshold (%)
                    </Typography>
                    <TextField
                      type="number"
                      fullWidth
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>
                      Expiry Warning (Days)
                    </Typography>
                    <TextField
                      type="number"
                      fullWidth
                      value={expiryWarningDays}
                      onChange={(e) => setExpiryWarningDays(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>Auto-Reorder at par</Typography>
                    <TextField
                      select
                      fullWidth
                      value={autoReorder}
                      onChange={(e) => setAutoReorder(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    >
                      <MenuItem
                        value="Yes — Create draft PO"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        Yes — Create draft PO
                      </MenuItem>
                      <MenuItem value="Alert only" sx={{ fontSize: "0.75rem" }}>
                        Alert only
                      </MenuItem>
                      <MenuItem value="No" sx={{ fontSize: "0.75rem" }}>
                        No
                      </MenuItem>
                    </TextField>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography sx={labelStyle}>Alert Email</Typography>
                    <TextField
                      fullWidth
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      size="small"
                      sx={inputStyles}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                textTransform: "none",
                fontSize: "13px",
                px: 2.5,
                borderRadius: "8px",
                color: "#374151",
                borderColor: "#d1d5db",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                textTransform: "none",
                fontSize: "13px",
                px: 2.5,
                borderRadius: "8px",
                bgcolor: "#4284f8",
                "&:hover": { bgcolor: "#0b5bf9" },
              }}
            >
              Save
            </Button>
          </Box>
        </CardContent>
 

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;