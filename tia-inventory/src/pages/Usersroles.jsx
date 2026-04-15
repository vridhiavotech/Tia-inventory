import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
  Dialog,
  DialogContent,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add,
  Edit,
  Block,
  CheckCircle,
  Search,
  Close,
  AccountCircle,
} from "@mui/icons-material";
import AddUserModal from "./Admin/AddUserModal";

// Add this color object right after your imports or at the top of the component
const C = {
  bg: "#F8FAFC",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  primary: "#1976D2",
};

// ── Edit User Dialog ───────────────────────────────────────────────────────
const ROLES = [
  "Location Manager",
  "Manager",
  "Pharmacist",
  "Nurse",
  "Storekeeper",
  "Doctor",
  "Admin",
];

const FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: 13,
    bgcolor: "#F9FAFB",
    "& fieldset": { borderColor: "#E5E7EB" },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
  },
};
const SECTION_LABEL_SX = {
  fontSize: 11,
  fontWeight: 700,
  color: "#7C3AED",
  letterSpacing: 0.8,
  textTransform: "uppercase",
  mb: 1.5,
};
const FIELD_LABEL_SX = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B7280",
  letterSpacing: 0.5,
  textTransform: "uppercase",
  mb: 0.5,
};
const SELECT_SX = {
  borderRadius: "8px",
  fontSize: 13,
  bgcolor: "#F9FAFB",
  "& fieldset": { borderColor: "#E5E7EB" },
  "&:hover fieldset": { borderColor: "#9CA3AF" },
  "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
};

function EditUserDialog({ open, onClose, user, onSave, locations = [] }) {
  const [form, setForm] = useState({});

  // Populate form when user changes
  const u = user || {};
  const initialForm = {
    fullName: u.name || "",
    username: (u.username || "").replace("@", ""),
    email: u.email || "",
    phone: u.phone || "",
    department: u.department || "",
    role: u.role || "Nurse",
    location: u.locationName || "",
    notes: u.notes || "",
  };

  const [localForm, setLocalForm] = useState(initialForm);

  // Sync when dialog opens with a new user
  const handleOpen = () =>
    setLocalForm({
      fullName: u.name || "",
      username: (u.username || "").replace("@", ""),
      email: u.email || "",
      phone: u.phone || "",
      department: u.department || "",
      role: u.role || "Nurse",
      location: u.locationName || "",
      notes: u.notes || "",
    });

  const set = (k) => (e) =>
    setLocalForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    onSave(u.id, localForm);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ onEnter: handleOpen }}
      PaperProps={{
        sx: {
          borderRadius: "14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          px: "24px",
          pt: "20px",
          pb: "16px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: "1px solid #f3f4f6",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "#EDE9FE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountCircle sx={{ color: "#7C3AED", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}
            >
              Edit User
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>
              Update credentials, role & location
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#9ca3af",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            width: 30,
            height: 30,
            "&:hover": { background: "#f3f4f6", color: "#374151" },
          }}
        >
          <Close sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Scrollable Body */}
      <DialogContent
        sx={{
          px: "24px",
          py: "20px",
          overflowY: "auto",
          maxHeight: "70vh",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": {
            background: "#d1d5db",
            borderRadius: 4,
          },
        }}
      >
        <Typography sx={SECTION_LABEL_SX}>Account</Typography>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Full Name</Typography>
            <TextField
              fullWidth
              size="small"
              value={localForm.fullName}
              onChange={set("fullName")}
              sx={FIELD_SX}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Username</Typography>
            <TextField
              fullWidth
              size="small"
              value={localForm.username}
              onChange={set("username")}
              sx={FIELD_SX}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Email</Typography>
            <TextField
              fullWidth
              size="small"
              value={localForm.email}
              onChange={set("email")}
              sx={FIELD_SX}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Phone</Typography>
            <TextField
              fullWidth
              size="small"
              value={localForm.phone}
              onChange={set("phone")}
              sx={FIELD_SX}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={FIELD_LABEL_SX}>Department</Typography>
            <TextField
              fullWidth
              size="small"
              value={localForm.department}
              onChange={set("department")}
              sx={FIELD_SX}
            />
          </Grid>
        </Grid>

        <Typography sx={SECTION_LABEL_SX}>Role & Location</Typography>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Role</Typography>
            <Select
              fullWidth
              size="small"
              value={localForm.role}
              onChange={set("role")}
              sx={SELECT_SX}
            >
              {ROLES.map((r) => (
                <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Location</Typography>
            <Select
              fullWidth
              size="small"
              value={localForm.location}
              onChange={set("location")}
              displayEmpty
              sx={SELECT_SX}
            >
              <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>
                Select location...
              </MenuItem>
              {locations.map((l) => (
                <MenuItem key={l.id} value={l.name} sx={{ fontSize: 13 }}>
                  {l.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Typography sx={FIELD_LABEL_SX}>Notes</Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          size="small"
          placeholder="Any notes..."
          value={localForm.notes}
          onChange={set("notes")}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: 13,
              borderRadius: "8px",
              bgcolor: "#f9fafb",
              "& fieldset": { borderColor: "#e5e7eb" },
              "&:hover fieldset": { borderColor: "#d1d5db" },
              "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
            },
          }}
        />
      </DialogContent>

      {/* Fixed Footer */}
      <Box
        sx={{
          px: "24px",
          py: "16px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "10px",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            textTransform: "none",
            borderRadius: "8px",
            px: "20px",
            py: "9px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            "&:hover": { background: "#f9fafb" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            textTransform: "none",
            borderRadius: "8px",
            px: "20px",
            py: "9px",
            background: "#2563eb",
            boxShadow: "0 2px 8px #2563eb",
            "&:hover": { background: "#2563eb" },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Dialog>
  );
}

// ── Seed data ─────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: "SA",
    initials: "SA",
    avatarBg: "#1976D2",
    name: "Sarah Anderson",
    username: "@sarah.a",
    email: "s.anderson@hospital.org",
    role: "Manager",
    roleBg: "#EFF6FF",
    roleColor: "#1D4ED8",
    locationCode: "CS-01",
    locationName: "Central Store",
    locationBg: "#EFF6FF",
    locationColor: "#1D4ED8",
    locationBorder: "#BFDBFE",
    department: "Supply Chain",
    status: "Active",
  },
  {
    id: "PC",
    initials: "PC",
    avatarBg: "#059669",
    name: "P. Chen",
    username: "@p.chen",
    email: "p.chen@hospital.org",
    role: "Pharmacist",
    roleBg: "#F0FDF4",
    roleColor: "#15803D",
    locationCode: "PH-01",
    locationName: "Pharmacy",
    locationBg: "#F0FDF4",
    locationColor: "#15803D",
    locationBorder: "#BBF7D0",
    department: "Pharmacy",
    status: "Active",
  },
  {
    id: "IN",
    initials: "IN",
    avatarBg: "#7C3AED",
    name: "ICU Nurse",
    username: "@icu.nurse",
    email: "icu@hospital.org",
    role: "Nurse",
    roleBg: "#FAF5FF",
    roleColor: "#7E22CE",
    locationCode: "ICU-01",
    locationName: "ICU",
    locationBg: "#FFF7ED",
    locationColor: "#C2410C",
    locationBorder: "#FED7AA",
    department: "ICU",
    status: "Active",
  },
  {
    id: "TW",
    initials: "TW",
    avatarBg: "#DC2626",
    name: "Tom Williams",
    username: "@t.williams",
    email: "t.williams@hospital.org",
    role: "Storekeeper",
    roleBg: "#FFF7ED",
    roleColor: "#C2410C",
    locationCode: "LAB-01",
    locationName: "Laboratory",
    locationBg: "#F0F9FF",
    locationColor: "#0369A1",
    locationBorder: "#BAE6FD",
    department: "Laboratory",
    status: "Blocked",
  },
];

const ROLE_PERMISSION_MATRIX = [
  {
    role: "Manager",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    view: 1,
    add: 1,
    edit: 1,
    del: 0,
    issue: 1,
    receive: 1,
    createPO: 1,
    approvePO: 1,
    transfer: 1,
    approveTR: 1,
    reports: 1,
    export: 1,
  },
  {
    role: "Pharmacist",
    color: "#15803D",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    view: 1,
    add: 1,
    edit: 1,
    del: 0,
    issue: 1,
    receive: 1,
    createPO: 0,
    approvePO: 0,
    transfer: 1,
    approveTR: 0,
    reports: 1,
    export: 0,
  },
  {
    role: "Storekeeper",
    color: "#C2410C",
    bg: "#FFF7ED",
    border: "#FED7AA",
    view: 1,
    add: 1,
    edit: 1,
    del: 0,
    issue: 1,
    receive: 1,
    createPO: 0,
    approvePO: 0,
    transfer: 1,
    approveTR: 0,
    reports: 1,
    export: 0,
  },
  {
    role: "Nurse",
    color: "#7E22CE",
    bg: "#FAF5FF",
    border: "#E9D5FF",
    view: 1,
    add: 0,
    edit: 0,
    del: 0,
    issue: 0,
    receive: 0,
    createPO: 0,
    approvePO: 0,
    transfer: 0,
    approveTR: 0,
    reports: 0,
    export: 0,
  },
  {
    role: "Viewer",
    color: "#6B7280",
    bg: "#F9FAFB",
    border: "#E5E7EB",
    view: 1,
    add: 0,
    edit: 0,
    del: 0,
    issue: 0,
    receive: 0,
    createPO: 0,
    approvePO: 0,
    transfer: 0,
    approveTR: 0,
    reports: 1,
    export: 0,
  },
];

const PERM_COLS = [
  { key: "view", label: "VIEW" },
  { key: "add", label: "ADD" },
  { key: "edit", label: "EDIT" },
  { key: "del", label: "DELETE" },
  { key: "issue", label: "ISSUE" },
  { key: "receive", label: "RECEIVE" },
  { key: "createPO", label: "CREATE PO" },
  { key: "approvePO", label: "APPROVE PO" },
  { key: "transfer", label: "TRANSFER" },
  { key: "approveTR", label: "APPROVE TR." },
  { key: "reports", label: "REPORTS" },
  { key: "export", label: "EXPORT" },
];

const ROLE_COLORS = {
  "Location Manager": { bg: "#EFF6FF", color: "#1D4ED8", avatarBg: "#1976D2" },
  Manager: { bg: "#EFF6FF", color: "#1D4ED8", avatarBg: "#1976D2" },
  Pharmacist: { bg: "#F0FDF4", color: "#15803D", avatarBg: "#059669" },
  Nurse: { bg: "#FAF5FF", color: "#7E22CE", avatarBg: "#7C3AED" },
  Storekeeper: { bg: "#FFF7ED", color: "#C2410C", avatarBg: "#EA580C" },
  Doctor: { bg: "#FEF2F2", color: "#DC2626", avatarBg: "#DC2626" },
  Admin: { bg: "#F5F3FF", color: "#6D28D9", avatarBg: "#6D28D9" },
};

const LOC_COLORS = {
  CS: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  ICU: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  ED: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  PH: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  OR: { bg: "#FAF5FF", color: "#7E22CE", border: "#E9D5FF" },
  LAB: { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" },
};

// ── Column header ─────────────────────────────────────────────────────────
const TH = ({ children, width, align = "left" }) => (
  <TableCell
    sx={{
      width,
      fontWeight: 700,
      fontSize: 11,
      color: C.textSecondary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      py: 1.4,
      px: 1.5,
      borderBottom: `1px solid ${C.border}`,
      whiteSpace: "nowrap",
      bgcolor: "#F9FAFB",
      textAlign: align,
    }}
  >
    {children}
  </TableCell>
);

// ── Perm tick / dash ──────────────────────────────────────────────────────
const Perm = ({ v }) =>
  v ? (
    <Typography
      sx={{
        color: "#16A34A",
        fontWeight: 700,
        fontSize: 14,
        textAlign: "center",
      }}
    >
      ✓
    </Typography>
  ) : (
    <Typography sx={{ color: "#D1D5DB", fontSize: 14, textAlign: "center" }}>
      —
    </Typography>
  );

// ── Main ──────────────────────────────────────────────────────────────────
export default function UsersRoles() {
  const [users, setUsers] = useState(SEED_USERS);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [locFilter, setLocFilter] = useState("All Locations");
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const activeCount = users.filter((u) => u.status === "Active").length;
  const blockedCount = users.filter((u) => u.status === "Blocked").length;

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchLoc =
      locFilter === "All Locations" || u.locationName === locFilter;
    const matchStatus = statusTab === "All" || u.status === statusTab;
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchLoc && matchStatus && matchSearch;
  });

  const handleSaveUser = (form) => {
    const rc = ROLE_COLORS[form.role] || ROLE_COLORS.Nurse;
    const initials = form.fullName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const locCode =
      form.location?.split(" ")[0]?.slice(0, 3).toUpperCase() || "CS";
    const lc = LOC_COLORS[locCode] || LOC_COLORS.CS;
    const newUser = {
      id: initials + Date.now(),
      initials,
      avatarBg: rc.avatarBg,
      name: form.fullName,
      username: `@${(form.username || form.fullName.split(" ")[0]).toLowerCase()}`,
      email:
        form.email || `${(form.username || "user").toLowerCase()}@hospital.org`,
      role: form.role,
      roleBg: rc.bg,
      roleColor: rc.color,
      locationCode: `${locCode}-01`,
      locationName: form.location,
      locationBg: lc.bg,
      locationColor: lc.color,
      locationBorder: lc.border,
      department: form.department || form.location,
      status: "Active",
    };
    setUsers((p) => [...p, newUser]);
    setModalOpen(false);
    showToast(`"${form.fullName}" created successfully.`);
  };

  const handleEditSave = (id, form) => {
    const rc = ROLE_COLORS[form.role] || ROLE_COLORS.Nurse;
    const locCode =
      form.location?.split(" ")[0]?.slice(0, 3).toUpperCase() || "CS";
    const lc = LOC_COLORS[locCode] || LOC_COLORS.CS;
    setUsers((p) =>
      p.map((u) =>
        u.id !== id
          ? u
          : {
              ...u,
              name: form.fullName || u.name,
              username: form.username ? `@${form.username}` : u.username,
              email: form.email || u.email,
              phone: form.phone || u.phone,
              department: form.department || u.department,
              role: form.role,
              roleBg: rc.bg,
              roleColor: rc.color,
              avatarBg: rc.avatarBg,
              locationName: form.location || u.locationName,
              locationBg: lc.bg,
              locationColor: lc.color,
              locationBorder: lc.border,
              notes: form.notes,
            },
      ),
    );
    showToast("User updated successfully.");
  };

  const toggleBlock = (id) => {
    setUsers((p) =>
      p.map((u) => {
        if (u.id !== id) return u;
        const next = u.status === "Blocked" ? "Active" : "Blocked";
        showToast(
          `${u.name} ${next === "Blocked" ? "blocked" : "unblocked"}.`,
          next === "Blocked" ? "warning" : "success",
        );
        return { ...u, status: next };
      }),
    );
  };

  const uniqueRoles = [...new Set(users.map((u) => u.role))];
  const uniqueLocs = [...new Set(users.map((u) => u.locationName))];

  // ── mock locations list for modal ──
  const locationsList = uniqueLocs.map((n, i) => ({ id: `LOC-${i}`, name: n }));

  return (
    <Box>
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* ── Title row ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 22,
                color: C.textPrimary,
                letterSpacing: -0.3,
              }}
            >
              Users & Roles
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: C.textSecondary,
                mt: 0.3,
              }}
            >
              {users.length} users · {activeCount} active · {blockedCount}{" "}
              blocked
            </Typography>
          </Box>
          <Button
            startIcon={<Add sx={{ fontSize: 16 }} />}
            variant="contained"
            onClick={() => setModalOpen(true)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "12px",
              px: "15px",
              py: "8px",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "none",
              lineHeight: 1,
              boxShadow: "0 1px 4px rgba(37,99,235,0.25)",
              "&:hover": {
                background: "#1d4ed8",
                boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
              },
            }}
          >
            Create User
          </Button>
        </Box>

        {/* ── Filters row ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Role filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{
                fontSize: 13,
                borderRadius: "20px",
                bgcolor: "#fff",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: C.border,
                  borderWidth: "1px", // 👈 thin
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#015DFF", // 👈 blue hover
                  borderWidth: "1px",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#015DFF", // 👈 blue focus
                  borderWidth: "1px",
                },
              }}
            >
              <MenuItem value="All Roles" sx={{ fontSize: 13 }}>
                All Roles
              </MenuItem>

              {uniqueRoles.map((r) => (
                <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Location filter */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              sx={{
                fontSize: 13,
                borderRadius: "20px",
                bgcolor: "#fff",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: C.border,
                  borderWidth: "1px", // 👈 thin
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#015DFF", // 👈 blue hover
                  borderWidth: "1px",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#015DFF", // 👈 blue focus
                  borderWidth: "1px",
                },
              }}
            >
              <MenuItem value="All Locations" sx={{ fontSize: 13 }}>
                All Locations
              </MenuItem>

              {uniqueLocs.map((l) => (
                <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 16, color: C.textSecondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 220,
              "& .MuiOutlinedInput-root": {
                fontSize: 13,
                borderRadius: "8px",
                bgcolor: "#fff",
                "& fieldset": { borderColor: C.border },
              },
            }}
          />

          <Box sx={{ flex: 1 }} />

          {/* Status tabs */}
          {["All", "Active", "Blocked"].map((tab) => (
            <Button
              key={tab}
              size="small"
              onClick={() => setStatusTab(tab)}
              startIcon={
                tab === "Active" ? (
                  <CheckCircle sx={{ fontSize: 13 }} />
                ) : tab === "Blocked" ? (
                  <Block sx={{ fontSize: 13 }} />
                ) : null
              }
              sx={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                px: 1.8,
                height: 32,
                bgcolor:
                  statusTab === tab
                    ? tab === "Blocked"
                      ? "#FEF2F2"
                      : tab === "Active"
                        ? "#F0FDF4"
                        : C.primary
                    : "#fff",
                color:
                  statusTab === tab
                    ? tab === "Blocked"
                      ? "#DC2626"
                      : tab === "Active"
                        ? "#16A34A"
                        : "#fff"
                    : C.textSecondary,
                border: `1px solid ${
                  statusTab === tab
                    ? tab === "Blocked"
                      ? "#FECACA"
                      : tab === "Active"
                        ? "#BBF7D0"
                        : C.primary
                    : C.border
                }`,
                "&:hover": { opacity: 0.85 },
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>

        {/* ── MAIN OUTER CARD ── */}
   
          <CardContent
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } },
            }}
          >
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                overflow: "auto",
                "&::-webkit-scrollbar": { height: 4 },
                "&::-webkit-scrollbar-thumb": {
                  background: "#d1d5db",
                  borderRadius: 4,
                },
              }}
            >
              <Table
                size="small"
                sx={{
                  width: "100%",
                  tableLayout: "auto", // or "fixed" if you want equal columns
                }}
              >
                <TableHead>
                  <TableRow>
                    <TH width={260}>User</TH>
                    <TH width={120}>Role</TH>
                    <TH width={180}>Location</TH>
                    <TH width={140}>Department</TH>
                    <TH width={90}>Status</TH>
                    <TH width={80} align="center">
                      Actions
                    </TH>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ py: 5, fontSize: 13, color: C.textSecondary }}
                      >
                        No users match the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((u, idx) => (
                    <TableRow
                      key={u.id}
                      sx={{
                        bgcolor: idx % 2 === 0 ? "#fff" : "#FAFAFA",
                        "&:hover": { bgcolor: "#EFF6FF" },
                        transition: "background 0.15s",
                      }}
                    >
                      {/* User cell */}
                      <TableCell sx={{ px: 1.5, py: 1.2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: u.avatarBg,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {u.initials}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.textPrimary,
                                lineHeight: 1.3,
                              }}
                            >
                              {u.name}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 11, color: C.textSecondary }}
                            >
                              {u.username} · {u.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Role */}
                      <TableCell sx={{ px: 1.5, py: 1.2 }}>
                        <Chip
                          label={u.role}
                          size="small"
                          sx={{
                            bgcolor: u.roleBg,
                            color: u.roleColor,
                            border: `1px solid ${u.roleColor}33`,
                            fontWeight: 600,
                            fontSize: 11,
                            height: 22,
                          }}
                        />
                      </TableCell>

                      {/* Location */}
                      <TableCell sx={{ px: 1.5, py: 1.2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <Chip
                            label={u.locationCode}
                            size="small"
                            sx={{
                              bgcolor: u.locationBg,
                              color: u.locationColor,
                              border: `1px solid ${u.locationBorder}`,
                              fontWeight: 700,
                              fontSize: 10,
                              height: 20,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: C.textPrimary,
                              fontWeight: 500,
                            }}
                          >
                            {u.locationName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Department */}
                      <TableCell sx={{ px: 1.5, py: 1.2 }}>
                        <Typography
                          sx={{ fontSize: 12, color: C.textSecondary }}
                        >
                          {u.department}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ px: 1.5, py: 1.2 }}>
                        <Chip
                          label={
                            u.status === "Active" ? "● Active" : "⊘ Blocked"
                          }
                          size="small"
                          sx={{
                            bgcolor:
                              u.status === "Active" ? "#F0FDF4" : "#FEF2F2",
                            color:
                              u.status === "Active" ? "#16A34A" : "#DC2626",
                            border: `1px solid ${u.status === "Active" ? "#BBF7D0" : "#FECACA"}`,
                            fontWeight: 700,
                            fontSize: 11,
                            height: 22,
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell sx={{ px: 1.5, py: 1.2 }}>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditUser(u);
                                setEditOpen(true);
                              }}
                              sx={{
                                bgcolor: "#EFF6FF",
                                color: "#1D4ED8",
                                "&:hover": { bgcolor: "#DBEAFE" },
                                width: 26,
                                height: 26,
                                borderRadius: "6px",
                              }}
                            >
                              <Edit sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={u.status === "Blocked" ? "Unblock" : "Block"}
                          >
                            <IconButton
                              size="small"
                              onClick={() => toggleBlock(u.id)}
                              sx={{
                                bgcolor:
                                  u.status === "Blocked"
                                    ? "#F0FDF4"
                                    : "#FEF2F2",
                                color:
                                  u.status === "Blocked"
                                    ? "#16A34A"
                                    : "#DC2626",
                                "&:hover": {
                                  bgcolor:
                                    u.status === "Blocked"
                                      ? "#DCFCE7"
                                      : "#FEE2E2",
                                },
                                width: 26,
                                height: 26,
                                borderRadius: "6px",
                              }}
                            >
                              {u.status === "Blocked" ? (
                                <CheckCircle sx={{ fontSize: 13 }} />
                              ) : (
                                <Block sx={{ fontSize: 13 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
    

        {/* ── Role Permission Matrix ── */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 16,
              color: C.textPrimary,
              mb: 0.4,
            }}
          >
            Role Permission Matrix
          </Typography>
        </Box>

        <Card
          sx={{
            width: "100%",
            borderRadius: { xs: 2, sm: 3 },
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } },
            }}
          >
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                overflow: "auto",
                "&::-webkit-scrollbar": { height: 4 },
                "&::-webkit-scrollbar-thumb": {
                  background: "#d1d5db",
                  borderRadius: 4,
                },
              }}
            >
              <Table size="small" sx={{ Width: 1000 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: 11,
                        color: C.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        py: 1.4,
                        px: 1.5,
                        borderBottom: `1px solid ${C.border}`,
                        minWidth: 130,
                      }}
                    >
                      ROLE
                    </TableCell>
                    {PERM_COLS.map((c) => (
                      <TableCell
                        key={c.key}
                        align="center"
                        sx={{
                          fontWeight: 700,
                          fontSize: 10,
                          color: C.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                          py: 1.4,
                          px: 0.5,
                          borderBottom: `1px solid ${C.border}`,
                          whiteSpace: "nowrap",
                          minWidth: 72,
                        }}
                      >
                        {c.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ROLE_PERMISSION_MATRIX.map((r, idx) => (
                    <TableRow
                      key={r.role}
                      sx={{
                        bgcolor: idx % 2 === 0 ? "#fff" : "#FAFAFA",
                        "&:hover": { bgcolor: "#F9FAFB" },
                      }}
                    >
                      <TableCell sx={{ px: 1.5, py: 1.1 }}>
                        <Chip
                          label={r.role}
                          size="small"
                          sx={{
                            bgcolor: r.bg,
                            color: r.color,
                            border: `1px solid ${r.border}`,
                            fontWeight: 700,
                            fontSize: 11,
                            height: 22,
                          }}
                        />
                      </TableCell>
                      {PERM_COLS.map((c) => (
                        <TableCell
                          key={c.key}
                          align="center"
                          sx={{ px: 0.5, py: 1.1 }}
                        >
                          <Perm v={r[c.key]} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* ── Edit Modal ── */}
        <EditUserDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          user={editUser}
          onSave={handleEditSave}
          locations={locationsList}
        />

        {/* ── Create Modal ── */}
        <AddUserModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUser}
          locations={locationsList}
        />

        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={toast.severity}
            sx={{ borderRadius: "10px", fontWeight: 600, fontSize: 13 }}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
          >
            {toast.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
