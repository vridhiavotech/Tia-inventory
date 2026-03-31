import { useState, useEffect } from "react";
import {
  Dialog, DialogContent,
  Box, Typography, Button, TextField,
  Select, MenuItem, FormControl, IconButton, Divider,
} from "@mui/material";
import CloseIcon         from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

// ── Shared style tokens (identical to IssueStockModal) ────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13, borderRadius: "8px", background: "#f9fafb",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },
};

const selectSx = {
  fontSize: 13, borderRadius: "8px", background: "#f9fafb",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
};

function FieldLabel({ children, required }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.04em", mb: "6px", textTransform: "uppercase" }}>
      {children}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
    </Typography>
  );
}

function SectionLabel({ children }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase", mb: "12px" }}>
      {children}
    </Typography>
  );
}

// ── All permissions ───────────────────────────────────────────────────────────
const ALL_PERMISSIONS = [
  { key: "view_inventory",   label: "View Inventory"   },
  { key: "add_items",        label: "Add Items"        },
  { key: "edit_items",       label: "Edit Items"       },
  { key: "delete_items",     label: "Delete Items"     },
  { key: "issue_stock",      label: "Issue Stock"      },
  { key: "receive_stock",    label: "Receive Stock"    },
  { key: "create_po",        label: "Create PO"        },
  { key: "approve_po",       label: "Approve PO"       },
  { key: "create_transfer",  label: "Create Transfer"  },
  { key: "approve_transfer", label: "Approve Transfer" },
  { key: "view_reports",     label: "View Reports"     },
  { key: "export_data",      label: "Export Data"      },
];

// ── Default permissions per role ──────────────────────────────────────────────
const ROLE_DEFAULTS = {
  "Location Manager": [
    "view_inventory","add_items","edit_items","issue_stock","receive_stock",
    "create_po","approve_po","create_transfer","approve_transfer","view_reports","export_data",
  ],
  "Pharmacist": [
    "view_inventory","add_items","edit_items","issue_stock","receive_stock",
    "create_transfer","view_reports",
  ],
  "Storekeeper": [
    "view_inventory","add_items","edit_items","issue_stock","receive_stock",
    "create_transfer","view_reports",
  ],
  "Nurse / Ward Staff": [
    "view_inventory",
  ],
  
  "Viewer (Read-Only)": [
    "view_inventory","approve_po","view_reports",
  ],
};

const ROLES = Object.keys(ROLE_DEFAULTS);

export default function AddUserModal({ open, onClose, onSave, locations = [] }) {
  const defaultRole = "Location Manager";
  const empty = {
    fullName: "", username: "", password: "", email: "",
    phone: "", department: "", role: defaultRole,
    location: "", notes: "",
    permissions: [...ROLE_DEFAULTS[defaultRole]],
  };

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  // auto-update permissions when role changes
  useEffect(() => {
    setForm((p) => ({ ...p, permissions: [...(ROLE_DEFAULTS[p.role] ?? [])] }));
  }, [form.role]);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: false }));
  };

  const togglePerm = (key) =>
    setForm((p) => ({
      ...p,
      permissions: p.permissions.includes(key)
        ? p.permissions.filter((k) => k !== key)
        : [...p.permissions, key],
    }));

  const validate = () => {
    const errs = {};
    if (!form.fullName) errs.fullName = true;
    if (!form.username) errs.username = true;
    if (!form.password) errs.password = true;
    if (!form.location) errs.location = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form });
    setForm(empty);
    setErrors({});
  };

  const handleClose = () => {
    setForm(empty);
    setErrors({});
    onClose();
  };

  const errInputSx = (key) => errors[key] ? {
    "& .MuiOutlinedInput-root": {
      ...inputSx["& .MuiOutlinedInput-root"],
      background: "#fff5f5",
      "& fieldset": { borderColor: "#fca5a5" },
      "&:hover fieldset": { borderColor: "#f87171" },
    },
  } : inputSx;

  const errSelectSx = (key) => errors[key] ? {
    ...selectSx,
    background: "#fff5f5",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fca5a5" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f87171" },
  } : selectSx;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" } }}>

      {/* ── Header ── */}
      <Box sx={{ px: "24px", pt: "20px", pb: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AccountCircleIcon sx={{ fontSize: 20, color: "#7c3aed" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Create User</Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>Set credentials, role, location & permissions</Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose}
          sx={{ color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: "8px", width: 30, height: 30, "&:hover": { background: "#f3f4f6", color: "#374151" } }}>
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* ── Scrollable body ── */}
      <DialogContent sx={{
        px: "24px", py: "20px", overflowY: "auto", maxHeight: "72vh",
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
        "&::-webkit-scrollbar-thumb:hover": { background: "#a1a1aa" },
      }}>

        {/* ── ACCOUNT ── */}
        <SectionLabel>Account</SectionLabel>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
          <Box>
            <FieldLabel required>Full Name</FieldLabel>
            <TextField fullWidth size="small" placeholder="e.g. Sarah Anderson"
              value={form.fullName} onChange={set("fullName")} sx={errInputSx("fullName")} />
            {errors.fullName && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
          </Box>
          <Box>
            <FieldLabel required>Username</FieldLabel>
            <TextField fullWidth size="small" placeholder="e.g. sarah.a"
              value={form.username} onChange={set("username")} sx={errInputSx("username")} />
            {errors.username && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
          <Box>
            <FieldLabel required>Password</FieldLabel>
            <TextField fullWidth size="small" placeholder="Set password" type="password"
              value={form.password} onChange={set("password")} sx={errInputSx("password")} />
            {errors.password && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
          </Box>
          <Box>
            <FieldLabel>Email</FieldLabel>
            <TextField fullWidth size="small" placeholder="user@org.com"
              value={form.email} onChange={set("email")} sx={inputSx} />
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "20px" }}>
          <Box>
            <FieldLabel>Phone</FieldLabel>
            <TextField fullWidth size="small" placeholder="Ext 0000"
              value={form.phone} onChange={set("phone")} sx={inputSx} />
          </Box>
          <Box>
            <FieldLabel>Department</FieldLabel>
            <TextField fullWidth size="small" placeholder="e.g. Pharmacy, ICU"
              value={form.department} onChange={set("department")} sx={inputSx} />
          </Box>
        </Box>

        <Divider sx={{ mb: "20px" }} />

        {/* ── ROLE & LOCATION ── */}
        <SectionLabel>Role & Location</SectionLabel>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "20px" }}>
          <Box>
            <FieldLabel required>Role</FieldLabel>
            <FormControl fullWidth size="small">
              <Select value={form.role} onChange={set("role")} sx={selectSx}>
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FieldLabel required>Assigned Location</FieldLabel>
            <FormControl fullWidth size="small">
              <Select value={form.location} onChange={set("location")} displayEmpty sx={errSelectSx("location")}>
                <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select location...</MenuItem>
                {locations.map((l) => (
                  <MenuItem key={l.id ?? l.name} value={l.name} sx={{ fontSize: 13 }}>{l.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.location && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
          </Box>
        </Box>

        <Divider sx={{ mb: "20px" }} />

        {/* ── PERMISSIONS — 3-col checkbox grid ── */}
        <SectionLabel>Permissions</SectionLabel>

        <Box sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          mb: "20px",
        }}>
          {ALL_PERMISSIONS.map((p) => {
            const checked = form.permissions.includes(p.key);
            return (
              <Box key={p.key} onClick={() => togglePerm(p.key)} sx={{
                display: "flex", alignItems: "center", gap: "8px",
                px: "10px", py: "8px", borderRadius: "6px", cursor: "pointer",
                border: `1px solid ${checked ? "#bfdbfe" : "#e5e7eb"}`,
                bgcolor: checked ? "#eff6ff" : "#f9fafb",
                transition: "all 0.12s",
                "&:hover": { borderColor: "#93c5fd", bgcolor: "#eff6ff" },
                userSelect: "none",
              }}>
                {/* custom checkbox box */}
                <Box sx={{
                  width: 15, height: 15, borderRadius: "3px", flexShrink: 0,
                  border: `1.5px solid ${checked ? "#2563eb" : "#d1d5db"}`,
                  bgcolor: checked ? "#2563eb" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.12s",
                }}>
                  {checked && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </Box>
                <Typography sx={{
                  fontSize: 12,
                  fontWeight: checked ? 600 : 500,
                  color: checked ? "#1d4ed8" : "#374151",
                  lineHeight: 1.2,
                }}>
                  {p.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* ── NOTES ── */}
        <Box>
          <FieldLabel>Notes</FieldLabel>
          <TextField fullWidth multiline rows={3} placeholder="Any notes about this user..."
            value={form.notes} onChange={set("notes")}
            sx={{ "& .MuiOutlinedInput-root": { fontSize: 13, borderRadius: "8px", background: "#f9fafb",
              "& fieldset": { borderColor: "#e5e7eb" }, "&:hover fieldset": { borderColor: "#d1d5db" },
              "&.Mui-focused fieldset": { borderColor: "#2563eb" } } }} />
        </Box>

      </DialogContent>

      {/* ── Footer ── */}
      <Box sx={{ px: "24px", py: "16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", background: "#fff", flexShrink: 0 }}>
        <Button onClick={handleClose}
          sx={{ fontSize: 13, fontWeight: 600, color: "#374151", textTransform: "none", borderRadius: "8px", px: "20px", py: "9px",
            border: "1px solid #e5e7eb", background: "#fff", "&:hover": { background: "#f9fafb" } }}>
          Cancel
        </Button>
        <Button onClick={handleSave} startIcon={<AssignmentIndIcon sx={{ fontSize: 15 }} />}
          sx={{ fontSize: 13, fontWeight: 600, color: "#fff", textTransform: "none", borderRadius: "8px", px: "20px", py: "9px",
            background: "#7c3aed", boxShadow: "0 2px 8px rgba(124,58,237,0.25)", "&:hover": { background: "#6d28d9" } }}>
          Save User
        </Button>
      </Box>

    </Dialog>
  );
}