import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
  Avatar,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  PersonAdd,
  AddLocation,
  Block,
  CheckCircle,
  People,
  Business,
  Category,
  Description,
  LocalShipping,
  Factory,
  ExpandMore,
  Settings,
  Group,
} from "@mui/icons-material";

import AddUserModal from "./AddUserModal";
import AddLocationModal from "./AddLocationModal";

// ── Colour tokens ─────────────────────────────────────────────────────────
const C = {
  bg: "#F5F6FA",
  surface: "#FFFFFF",
  primary: "#1976D2",
  primaryDark: "#1256A0",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  accent: "#7C3AED",
};

// ── Seed data ─────────────────────────────────────────────────────────────
const SEED_LOCATIONS = [
  {
    id: "CS-01",
    name: "Central Store",
    type: "CENTRAL STORE",
    inCharge: "Admin",
    users: 1,
    skus: 8,
    code: "CS",
    phone: "",
    address: "",
  },
  {
    id: "ICU-01",
    name: "ICU",
    type: "WARD/DEPT",
    inCharge: "Dr. Patel",
    users: 1,
    skus: 2,
    code: "ICU",
    phone: "",
    address: "",
  },
  {
    id: "ED-01",
    name: "Emergency Dept",
    type: "WARD/DEPT",
    inCharge: "Dr. Mehra",
    users: 0,
    skus: 1,
    code: "ED",
    phone: "",
    address: "",
  },
  {
    id: "PH-01",
    name: "Pharmacy",
    type: "PHARMACY",
    inCharge: "P. Chen, PharmD",
    users: 1,
    skus: 2,
    code: "PH",
    phone: "",
    address: "",
  },
  {
    id: "OR-01",
    name: "OR / Surgery",
    type: "OT / SURGERY",
    inCharge: "Dr. Kapoor",
    users: 0,
    skus: 2,
    code: "OR",
    phone: "",
    address: "",
  },
  {
    id: "LAB-01",
    name: "Laboratory",
    type: "LABORATORY",
    inCharge: "T. Williams",
    users: 0,
    skus: 0,
    code: "LAB",
    phone: "",
    address: "",
  },
];

const SEED_USERS = [
  {
    id: "SA",
    name: "Sarah Anderson",
    role: "Manager",
    roleBg: "#EFF6FF",
    roleColor: "#1D4ED8",
    location: "Central Store",
    status: "Active",
    initials: "SA",
    avatarBg: "#1976D2",
  },
  {
    id: "PC",
    name: "P. Chen",
    role: "Pharmacist",
    roleBg: "#F0FDF4",
    roleColor: "#15803D",
    location: "Pharmacy",
    status: "Active",
    initials: "PC",
    avatarBg: "#059669",
  },
  {
    id: "IN",
    name: "ICU Nurse",
    role: "Nurse",
    roleBg: "#FAF5FF",
    roleColor: "#7E22CE",
    location: "ICU",
    status: "Active",
    initials: "IN",
    avatarBg: "#7C3AED",
  },
  {
    id: "TW",
    name: "Tom Williams",
    role: "Storekeeper",
    roleBg: "#FFF7ED",
    roleColor: "#C2410C",
    location: "Laboratory",
    status: "Blocked",
    initials: "TW",
    avatarBg: "#DC2626",
  },
];

// ── Location badge colours ────────────────────────────────────────────────
const LOC_COLORS = {
  CS: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", accent: "#1976D2" },
  ICU: {
    bg: "#FFF7ED",
    color: "#C2410C",
    border: "#FED7AA",
    accent: "#EA580C",
  },
  ED: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", accent: "#DC2626" },
  PH: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0", accent: "#16A34A" },
  OR: { bg: "#FAF5FF", color: "#7E22CE", border: "#E9D5FF", accent: "#7C3AED" },
  LAB: {
    bg: "#F0F9FF",
    color: "#0369A1",
    border: "#BAE6FD",
    accent: "#0284C7",
  },
};
const DEFAULT_LOC_COLOR = {
  bg: "#F5F3FF",
  color: "#6D28D9",
  border: "#DDD6FE",
  accent: "#7C3AED",
};

// ── Role colour map ───────────────────────────────────────────────────────
const ROLE_COLORS = {
  "Location Manager": { bg: "#EFF6FF", color: "#1D4ED8", avatarBg: "#1976D2" },
  Manager: { bg: "#EFF6FF", color: "#1D4ED8", avatarBg: "#1976D2" },
  Pharmacist: { bg: "#F0FDF4", color: "#15803D", avatarBg: "#059669" },
  Nurse: { bg: "#FAF5FF", color: "#7E22CE", avatarBg: "#7C3AED" },
  Storekeeper: { bg: "#FFF7ED", color: "#C2410C", avatarBg: "#EA580C" },
  Doctor: { bg: "#FEF2F2", color: "#DC2626", avatarBg: "#DC2626" },
  Admin: { bg: "#F5F3FF", color: "#6D28D9", avatarBg: "#6D28D9" },
};

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#fff",
        border: "1px solid #e5e7eb", // ✅ simple border
        borderRadius: "10px",
        px: 2,
        py: 1.5,
        minWidth: 0,
      }}
    >
      {/* Top row (label + icon) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#9ca3af",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>

        {Icon && <Icon sx={{ fontSize: 16, color: "#9ca3af" }} />}
      </Box>

      {/* Value + Subtitle INLINE */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {sub && (
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: "#6b7280",
              whiteSpace: "nowrap",
            }}
          >
            {sub}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// ── Location Card ─────────────────────────────────────────────────────────
function LocationCard({ loc }) {
  const navigate = useNavigate();
  const c = LOC_COLORS[loc.code] || DEFAULT_LOC_COLOR;
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${c.accent}`,
        borderRadius: "8px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 0.8,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}
          >
            {loc.name}
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              color: C.textSecondary,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              mt: 0.1,
            }}
          >
            {loc.type}
          </Typography>
        </Box>
        <Chip
          label={loc.id}
          size="small"
          sx={{
            bgcolor: c.bg,
            color: c.color,
            border: `1px solid ${c.border}`,
            fontWeight: 700,
            fontSize: 10,
            height: 20,
          }}
        />
      </Box>

      <Divider sx={{ borderColor: C.border }} />

      {[
        { label: "In-Charge", value: loc.inCharge || "—" },
        { label: "Users", value: loc.users },
        { label: "Item SKUs", value: loc.skus },
      ].map((f) => (
        <Box
          key={f.label}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
            {f.label}
          </Typography>
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}
          >
            {f.value}
          </Typography>
        </Box>
      ))}

      {loc.address && (
        <Typography
          sx={{
            fontSize: 11,
            color: C.textSecondary,
            mt: 0.2,
            fontStyle: "italic",
          }}
        >
          📍 {loc.address}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate("/admin/locations")}
          sx={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "6px",
            border: `1px solid ${C.border}`,
            color: C.textSecondary,
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" },
            px: 1.2,
            height: 26,
          }}
        >
          <Settings sx={{ fontSize: 12, mr: 0.4 }} /> Manage
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate("/admin/users")}
          sx={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "6px",
            border: `1px solid ${C.border}`,
            color: C.textSecondary,
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" },
            px: 1.2,
            height: 26,
          }}
        >
          <Group sx={{ fontSize: 12, mr: 0.4 }} /> Users
        </Button>
      </Box>
    </Box>
  );
}

// ── User Card ─────────────────────────────────────────────────────────────
function UserCard({ user, onToggle }) {
  const isBlocked = user.status === "Blocked";
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: "10px 16px",
        bgcolor: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: "8px",
        "&:hover": { bgcolor: "#F9FAFB" },
        transition: "background 0.15s",
      }}
    >
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: user.avatarBg,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {user.initials}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
        >
          {user.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.2 }}>
          <Chip
            label={user.role}
            size="small"
            sx={{
              bgcolor: user.roleBg,
              color: user.roleColor,
              fontWeight: 600,
              fontSize: 10,
              height: 18,
              border: `1px solid ${user.roleColor}22`,
            }}
          />
          <Typography sx={{ fontSize: 11, color: C.textSecondary }}>
            · {user.location}
          </Typography>
        </Box>
      </Box>
      <Chip
        label={user.status}
        size="small"
        sx={{
          bgcolor: isBlocked ? "#FEF2F2" : "#F0FDF4",
          color: isBlocked ? "#DC2626" : "#16A34A",
          border: `1px solid ${isBlocked ? "#FECACA" : "#BBF7D0"}`,
          fontWeight: 700,
          fontSize: 11,
          height: 22,
        }}
      />
      <Tooltip title={isBlocked ? "Unblock User" : "Block User"}>
        <IconButton
          size="small"
          onClick={() => onToggle(user.id)}
          sx={{
            bgcolor: isBlocked ? "#F0FDF4" : "#FEF2F2",
            color: isBlocked ? "#16A34A" : "#DC2626",
            "&:hover": { bgcolor: isBlocked ? "#DCFCE7" : "#FEE2E2" },
            width: 26,
            height: 26,
            borderRadius: "6px",
          }}
        >
          {isBlocked ? (
            <CheckCircle sx={{ fontSize: 13 }} />
          ) : (
            <Block sx={{ fontSize: 13 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function AdminOverview() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState(SEED_LOCATIONS);
  const [users, setUsers] = useState(SEED_USERS);

  // Modal states
  const [addLocOpen, setAddLocOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "success",
  });
  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  // Derived
  const activeCount = users.filter((u) => u.status !== "Blocked").length;
  const blockedCount = users.filter((u) => u.status === "Blocked").length;

  // ── Handle save from AddLocationModal ──
  const handleSaveLocation = (form) => {
    const code = form.code
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 5);
    const exists = locations.filter((l) => l.code === code).length;
    const num = String(exists + 1).padStart(2, "0");
    const newLoc = {
      id: `${code}-${num}`,
      name: form.name,
      type: form.type.toUpperCase(),
      inCharge: form.inCharge || "—",
      phone: form.phone || "",
      address: form.address || "",
      notes: form.notes || "",
      users: 0,
      skus: 0,
      code,
    };
    setLocations((p) => [...p, newLoc]);
    setAddLocOpen(false);
    showToast(`"${form.name}" added to Locations.`);
  };

  // ── Handle save from AddUserModal ──
  const handleSaveUser = (form) => {
    const rc = ROLE_COLORS[form.role] || ROLE_COLORS["Nurse"];
    const initials = form.fullName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const newUser = {
      id: initials + Date.now(),
      name: form.fullName,
      role: form.role,
      roleBg: rc.bg,
      roleColor: rc.color,
      avatarBg: rc.avatarBg,
      location: form.location,
      status: "Active",
      initials,
      email: form.email,
      phone: form.phone,
      department: form.department,
      permissions: form.permissions,
    };
    setUsers((p) => [...p, newUser]);
    setLocations((p) =>
      p.map((l) =>
        l.name === form.location ? { ...l, users: l.users + 1 } : l,
      ),
    );
    setAddUserOpen(false);
    showToast(`"${form.fullName}" added to Users.`);
  };

  // ── Toggle block/unblock ──
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

  return (
    <Box
      sx={{ background: "#f8fafc", minHeight: "100vh", padding: "26px 24px" }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* ── Title row ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
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
              Admin Overview
            </Typography>
            <Typography sx={{ fontSize: 13, color: C.textSecondary, mt: 0.3 }}>
              System health — all locations and master data
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
              variant="outlined"
              onClick={() => setAddUserOpen(true)}
              sx={{
                border: `1px solid ${C.border}`,
                color: C.textSecondary,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "8px",
                height: 36,
                px: 2,
                bgcolor: "#fff",
                "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" },
              }}
            >
              Add User
            </Button>
            <Button
              startIcon={<AddLocation sx={{ fontSize: 16 }} />}
              variant="contained"
              onClick={() => setAddLocOpen(true)}
              sx={{
                bgcolor: "#2563eb",
                textTransform: "none",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: "8px",
                height: 36,
                px: 2.5,
                boxShadow: "0 1px 4px #2563eb",
                "&:hover": {
                  bgcolor: "#2563eb",
                  boxShadow: "0 2px 8px #2563eb",
                },
              }}
            >
              Add Location
            </Button>
          </Stack>
        </Box>

        {/* ── CARD 1: STAT CARDS ── */}
       
          <CardContent
            sx={{
              p: { xs: 2, sm: 3, md: 3 },
              "&:last-child": { pb: { xs: 2, sm: 3, md: 3 } },
            }}
          >
            {/* Stat Cards Row 1 - 3 cards */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mb: 1.5 }}
            >
              <StatCard
                label="Active Users"
                value={activeCount}
                sub={`${blockedCount} blocked`}
                color="#7C3AED"
                icon={People}
              />
              <StatCard
                label="Locations"
                value={locations.length}
                sub="Active facilities"
                color="#2563EB"
                icon={Business}
              />
              <StatCard
                label="Suppliers"
                value={4}
                sub="Approved vendors"
                color="#16A34A"
                icon={LocalShipping}
              />
            </Stack>

            {/* Stat Cards Row 2 - 3 cards */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <StatCard
                label="Manufacturers"
                value={8}
                sub="Registered brands"
                color="#D97706"
                icon={Factory}
              />
              <StatCard
                label="Categories"
                value={6}
                sub="Product categories"
                color="#0284C7"
                icon={Category}
              />
              <StatCard
                label="Documents"
                value={7}
                sub="1 expiring · 1 expired"
                color="#DC2626"
                icon={Description}
              />
            </Stack>
          </CardContent>
    

        {/* ── CARD 2: LOCATIONS ── */}
     
          <CardContent
            sx={{
              p: { xs: 2, sm: 3, md: 3 },
              "&:last-child": { pb: { xs: 2, sm: 3, md: 3 } },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: C.textPrimary,
                  letterSpacing: -0.2,
                }}
              >
                Locations
              </Typography>
              <Button
                size="small"
                endIcon={<ExpandMore sx={{ fontSize: 14 }} />}
                onClick={() => navigate("/admin/locations")}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textSecondary,
                  textTransform: "none",
                }}
              >
                View All
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 1.5,
              }}
            >
              {locations.map((loc) => (
                <LocationCard key={loc.id} loc={loc} />
              ))}
            </Box>
          </CardContent>
       

        {/* ── CARD 3: USERS ── */}
      
          <CardContent
            sx={{
              p: { xs: 2, sm: 3, md: 3 },
              "&:last-child": { pb: { xs: 2, sm: 3, md: 3 } },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 16,
                  color: C.textPrimary,
                  letterSpacing: -0.2,
                }}
              >
                Users
              </Typography>
              <Button
                size="small"
                endIcon={<ExpandMore sx={{ fontSize: 14 }} />}
                onClick={() => navigate("/admin/users")}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textSecondary,
                  textTransform: "none",
                }}
              >
                View All
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 1.5,
              }}
            >
              {users.map((user) => (
                <UserCard key={user.id} user={user} onToggle={toggleBlock} />
              ))}
            </Box>
          </CardContent>
       

        {/* ══ Modals ══ */}
        <AddLocationModal
          open={addLocOpen}
          onClose={() => setAddLocOpen(false)}
          onSave={handleSaveLocation}
        />
        <AddUserModal
          open={addUserOpen}
          onClose={() => setAddUserOpen(false)}
          onSave={handleSaveUser}
          locations={locations}
        />

        {/* ── Toast ── */}
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
