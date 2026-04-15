import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon              from "@mui/icons-material/Close";
import BusinessIcon           from "@mui/icons-material/Business";
import SaveIcon               from "@mui/icons-material/Save";
import DraftsIcon             from "@mui/icons-material/Drafts";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// ─── Shared styles (mirrors SupplierModal exactly) ──────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13,
    borderRadius: "8px",
    background: "#f9fafb",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },
};

const inputErrSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13,
    borderRadius: "8px",
    background: "#fff5f5",
    "& fieldset": { borderColor: "#fca5a5" },
    "&:hover fieldset": { borderColor: "#f87171" },
    "&.Mui-focused fieldset": { borderColor: "#ef4444" },
  },
};

const selectSx = {
  fontSize: 13,
  borderRadius: "8px",
  background: "#f9fafb",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
};

const selectErrSx = {
  ...selectSx,
  background: "#fff5f5",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fca5a5" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f87171" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ef4444" },
};

// ─── FieldLabel — identical to SupplierModal ────────────────────────────────
function FieldLabel({ children, required }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 600,
        color: "#6b7280",
        letterSpacing: "0.04em",
        mb: "6px",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: "3px",
      }}
    >
      {children}
      {required && <span style={{ color: "#ef4444" }}>*</span>}
    </Typography>
  );
}

// ─── Section heading — mirrors SupplierModal exactly ────────────────────────
function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 700,
        color: "#2563eb",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        mb: "12px",
      }}
    >
      {children}
    </Typography>
  );
}

// ─── Manufacturer Types ──────────────────────────────────────────────────────
const MANUFACTURER_TYPES = [
  "Pharma",
  "PPE",
  "Surgical",
  "Diagnostics",
  "Medical Devices",
  "Consumables",
  "Equipment",
  "Other"
];

const EMPTY_FORM = {
  name: "",
  code: "",
  type: "",
  country: "",
  email: "",
  phone: "",
  website: "",
  regNumber: "",
  notes: "",
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ManufacturerModal({ open, onClose, onSave, manufacturer }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => setToast({ open: true, message, severity });

  // ── Populate on edit ──────────────────────────────────────────────────────
  useEffect(() => {
    if (manufacturer) {
      setForm({
        name: manufacturer.name || "",
        code: manufacturer.code || "",
        type: manufacturer.type || "",
        country: manufacturer.country || "",
        email: manufacturer.contactEmail || manufacturer.email || "",
        phone: manufacturer.contactPhone || manufacturer.phone || "",
        website: manufacturer.website || "",
        regNumber: manufacturer.regNumber || "",
        notes: manufacturer.notes || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [manufacturer, open]);

  // ── Field helpers ─────────────────────────────────────────────────────────
  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  // ── Validate + submit ─────────────────────────────────────────────────────
  const getErrors = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    return e;
  };

  const handleSubmit = async (isDraft = false) => {
    const e = getErrors();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 600));
      
      const manufacturerData = {
        name: form.name,
        code: form.code,
        type: form.type,
        country: form.country,
        contactEmail: form.email,
        contactPhone: form.phone,
        website: form.website,
        regNumber: form.regNumber,
        notes: form.notes,
        status: isDraft ? "Inactive" : "Active"
      };
      
      onSave?.(manufacturerData);
      handleClose();
      showToast(isDraft ? "Manufacturer saved as draft" : "Manufacturer saved successfully");
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" },
        }}
      >
        {/* ── Header ── */}
        <Box sx={{
          px: "24px", pt: "20px", pb: "16px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          borderBottom: "1px solid #f3f4f6", flexShrink: 0, bgcolor: "#fff",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box sx={{
              width: 38, height: 38, borderRadius: "10px",
              background: "#eff6ff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BusinessIcon sx={{ fontSize: 20, color: "#2563eb" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                {manufacturer ? "Edit Manufacturer" : "Add Manufacturer"}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>
                Register a manufacturer / brand
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: "#9ca3af", border: "1px solid #e5e7eb",
              borderRadius: "8px", width: 30, height: 30,
              "&:hover": { background: "#f3f4f6", color: "#374151" },
            }}
          >
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>

        {/* ── Scrollable Body ── */}
        <DialogContent sx={{
          px: "24px", py: "20px", overflowY: "auto", maxHeight: "70vh",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
          "&::-webkit-scrollbar-thumb:hover": { background: "#a1a1aa" },
        }}>

          {/* ── Section: Manufacturer Info ── */}
          <Box sx={{ mb: "20px" }}>
            <SectionLabel>Manufacturer Info</SectionLabel>

            {/* Manufacturer Name */}
            <Box sx={{ mb: "16px" }}>
              <FieldLabel required>Manufacturer Name</FieldLabel>
              <TextField
                fullWidth size="small"
                placeholder="e.g. Pfizer Inc."
                value={form.name}
                onChange={set("name")}
                disabled={loading}
                sx={errors.name ? inputErrSx : inputSx}
              />
              {errors.name && (
                <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>
              )}
            </Box>

            {/* Code + Type */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
              <Box>
                <FieldLabel>Code / Short Name</FieldLabel>
                <TextField
                  fullWidth size="small"
                  placeholder="e.g. PFZ"
                  value={form.code}
                  onChange={set("code")}
                  disabled={loading}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <FieldLabel>Type</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={form.type}
                    onChange={set("type")}
                    displayEmpty
                    disabled={loading}
                    sx={selectSx}
                  >
                    <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select Type…</MenuItem>
                    {MANUFACTURER_TYPES.map(type => (
                      <MenuItem key={type} value={type} sx={{ fontSize: 13 }}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Country */}
            <Box sx={{ mb: "16px" }}>
              <FieldLabel>Country of Origin</FieldLabel>
              <TextField
                fullWidth size="small"
                placeholder="e.g. USA, India"
                value={form.country}
                onChange={set("country")}
                disabled={loading}
                sx={inputSx}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: "20px" }} />

          {/* ── Section: Contact & Registration ── */}
          <Box sx={{ mb: "20px" }}>
            <SectionLabel>Contact &amp; Registration</SectionLabel>

            {/* Email + Phone */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
              <Box>
                <FieldLabel>Email</FieldLabel>
                <TextField
                  fullWidth size="small" type="email"
                  placeholder="contact@manufacturer.com"
                  value={form.email}
                  onChange={set("email")}
                  disabled={loading}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <FieldLabel>Phone</FieldLabel>
                <TextField
                  fullWidth size="small"
                  placeholder="1-800-000-0000"
                  value={form.phone}
                  onChange={set("phone")}
                  disabled={loading}
                  sx={inputSx}
                />
              </Box>
            </Box>

            {/* Website + Reg Number */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Box>
                <FieldLabel>Website</FieldLabel>
                <TextField
                  fullWidth size="small"
                  placeholder="www.manufacturer.com"
                  value={form.website}
                  onChange={set("website")}
                  disabled={loading}
                  sx={inputSx}
                />
              </Box>
              <Box>
                <FieldLabel>Reg. / License No.</FieldLabel>
                <TextField
                  fullWidth size="small"
                  placeholder="e.g. FDA-REG-123456"
                  value={form.regNumber}
                  onChange={set("regNumber")}
                  disabled={loading}
                  sx={inputSx}
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: "20px" }} />

          {/* ── Notes ── */}
          <Box>
            <FieldLabel>Notes</FieldLabel>
            <TextField
              fullWidth multiline rows={3}
              placeholder="Product specializations, certifications, compliance notes…"
              value={form.notes}
              onChange={set("notes")}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 13, borderRadius: "8px", background: "#f9fafb",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                },
              }}
            />
          </Box>
        </DialogContent>

        {/* ── Footer ── */}
        <Box sx={{
          px: "24px", py: "16px",
          borderTop: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          gap: "10px", bgcolor: "#fff", flexShrink: 0,
        }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              fontSize: 13, fontWeight: 600, color: "#374151",
              textTransform: "none", borderRadius: "8px",
              px: "20px", py: "9px",
              border: "1px solid #e5e7eb", bgcolor: "#fff",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            startIcon={<DraftsIcon sx={{ fontSize: 15 }} />}
            sx={{
              fontSize: 13, fontWeight: 600, color: "#374151",
              textTransform: "none", borderRadius: "8px",
              px: "20px", py: "9px",
              border: "1px solid #e5e7eb", bgcolor: "#fff",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            Save as Draft
          </Button>

          <Button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            startIcon={
              loading
                ? (
                  <Box component="span" sx={{
                    width: 14, height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                  }} />
                )
                : <SaveIcon sx={{ fontSize: 15 }} />
            }
            sx={{
              fontSize: 13, fontWeight: 600, color: "#fff",
              textTransform: "none", borderRadius: "8px",
              px: "20px", py: "9px",
              bgcolor: "#2563eb",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              "&:hover": { bgcolor: "#1d4ed8" },
              "&.Mui-disabled": { opacity: 0.6, color: "#fff" },
            }}
          >
            {manufacturer ? "Update Manufacturer" : "Save Manufacturer"}
          </Button>
        </Box>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(p => ({ ...p, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ fontSize: 13, borderRadius: "10px", minWidth: 320 }}
          icon={toast.severity === "success" ? <CheckCircleOutlineIcon fontSize="inherit" /> : undefined}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}