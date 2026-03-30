import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
  InputAdornment,
  Paper,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const inventoryItems = [
  {
    id: 1,
    name: "Amoxicillin 500mg Capsules",
    ndc: "0093-4155-01",
    category: "Pharmaceuticals",
    subcategory: "Antibiotics",
    categoryEmoji: "💊",
    subEmoji: "✏️",
    location: "CS-01",
    qty: 200,
    par: 50,
    cost: 2.4,
    expiry: "Mar 1, 2027",
    expiryRaw: new Date("2027-03-01"),
    status: [
      { label: "In Stock", color: "success" },
      { label: "Quarantined", color: "warning", icon: "⚠️" },
    ],
  },
  {
    id: 2,
    name: "Epinephrine 1mg/mL 10mL Vial",
    ndc: "0409-7166-01",
    category: "Pharmaceuticals",
    subcategory: "Emergency Drugs",
    categoryEmoji: "💊",
    subEmoji: "🚑",
    location: "CS-01",
    qty: 4,
    par: 20,
    cost: 18.5,
    expiry: "Sep 15, 2026",
    expiryRaw: new Date("2026-09-15"),
    status: [{ label: "Low Stock", color: "warning" }],
  },
  {
    id: 3,
    name: "Sodium Chloride 0.9% IV 1L",
    ndc: "0338-0049-04",
    category: "Pharmaceuticals",
    subcategory: "IV Fluids & Electrolytes",
    categoryEmoji: "💊",
    subEmoji: "✏️",
    location: "CS-01",
    qty: 12,
    par: 40,
    cost: 3.2,
    expiry: "Jan 31, 2026",
    expiryRaw: new Date("2026-01-31"),
    expired: true,
    status: [{ label: "Low Stock", color: "warning" }],
  },
  {
    id: 4,
    name: "Morphine Sulfate 10mg/mL",
    ndc: "0641-6083-25",
    category: "Pharmaceuticals",
    subcategory: "Analgesics / Pain Management",
    categoryEmoji: "💊",
    subEmoji: "🔴",
    location: "CS-01",
    qty: 18,
    par: 10,
    cost: 14.8,
    expiry: "Apr 15, 2026",
    expiryRaw: new Date("2026-04-15"),
    expiringSoon: true,
    status: [
      { label: "In Stock", color: "success" },
      { label: "Schedule II", color: "error", icon: "🔥" },
    ],
  },
  {
    id: 5,
    name: "Nitrile Exam Gloves (L) 100/bx",
    ndc: "SKU-GLV-L",
    category: "PPE & Protective",
    subcategory: "Gloves",
    categoryEmoji: "🧤",
    subEmoji: "🧤",
    location: "CS-01",
    qty: 30,
    par: 15,
    cost: 12.0,
    expiry: "Jun 1, 2028",
    expiryRaw: new Date("2028-06-01"),
    status: [{ label: "In Stock", color: "success" }],
  },
  {
    id: 6,
    name: "Surgical Mask ASTM Level 3",
    ndc: "SKU-MASK-L3",
    category: "PPE & Protective",
    subcategory: "Masks & Respirators",
    categoryEmoji: "😷",
    subEmoji: "😷",
    location: "CS-01",
    qty: 450,
    par: 100,
    cost: 0.48,
    expiry: "Jan 1, 2028",
    expiryRaw: new Date("2028-01-01"),
    status: [{ label: "In Stock", color: "success" }],
  },
  {
    id: 7,
    name: "4×4 Gauze Pads Sterile 10/pk",
    ndc: "SKU-GAUZE-44",
    category: "Wound Care",
    subcategory: "Dressings",
    categoryEmoji: "🩹",
    subEmoji: "🩹",
    location: "CS-01",
    qty: 200,
    par: 50,
    cost: 2.8,
    expiry: "Jan 1, 2029",
    expiryRaw: new Date("2029-01-01"),
    status: [{ label: "In Stock", color: "success" }],
  },
  {
    id: 8,
    name: "BD Vacutainer EDTA 3mL",
    ndc: "SKU-VAC-EDTA",
    category: "Laboratory",
    subcategory: "Blood Collection",
    categoryEmoji: "🧪",
    subEmoji: "🧪",
    location: "CS-01",
    qty: 120,
    par: 60,
    cost: 0.95,
    expiry: "Aug 1, 2027",
    expiryRaw: new Date("2027-08-01"),
    status: [{ label: "In Stock", color: "success" }],
  },
];

// ─── Qty Progress Bar ─────────────────────────────────────────────────────────

function QtyBar({ qty, par }) {
  const pct = Math.min((qty / (par * 2)) * 100, 100);
  const isLow = qty < par;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: isLow ? "#f97316" : "#111827",
          minWidth: 32,
        }}
      >
        {qty}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          width: 80,
          height: 5,
          borderRadius: 3,
          backgroundColor: "#f3f4f6",
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
            backgroundColor: isLow ? "#f97316" : "#22c55e",
          },
        }}
      />
    </Box>
  );
}

// ─── Status Chip ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  success: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  warning: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  error: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  info: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
};

function StatusChip({ label, color, icon }) {
  const s = STATUS_STYLES[color] || STATUS_STYLES.info;
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        px: "8px",
        py: "2px",
        borderRadius: "6px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        whiteSpace: "nowrap",
        lineHeight: "18px",
      }}
    >
      {icon && <span style={{ fontSize: 10 }}>{icon}</span>}
      {label}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InventoryItems() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [category, setCategory] = useState("All Categories");
  const [filter, setFilter] = useState("All");

  const today = new Date();

  const filtered = inventoryItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.ndc.toLowerCase().includes(search.toLowerCase());
    const matchLoc = location === "All Locations" || item.location === location;
    const matchCat = category === "All Categories" || item.category === category;
    const matchFilter =
      filter === "All" ||
      (filter === "Low Stock" && item.qty < item.par) ||
      (filter === "Expiring" &&
        item.expiryRaw &&
        (item.expired ||
          (item.expiryRaw - today) / (1000 * 60 * 60 * 24) <= 60));
    return matchSearch && matchLoc && matchCat && matchFilter;
  });

  return (
    <Box
      sx={{
        background: "#f8f9fb",
        minHeight: "100vh",
        p: "28px 32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "20px",
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: 20, fontWeight: 700, color: "#111827", m: 0 }}
          >
            Inventory Items
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
            {inventoryItems.length} items across all locations
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          sx={{
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            px: "18px",
            py: "10px",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            "&:hover": { background: "#1d4ed8" },
          }}
        >
          + Add Item
        </Button>
      </Box>

      {/* ── Filters Row ── */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          mb: "20px",
        }}
      >
        {/* Location Select */}
        <FormControl size="small">
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{
              fontSize: 13,
              borderRadius: "8px",
              background: "#fff",
              minWidth: 150,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d1d5db",
              },
            }}
          >
            {["All Locations", "Central Store", "ICU", "Emergency Dept", "Pharmacy","Surgery","Laboratory"].map(
              (l) => (
                <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>
                  {l}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        {/* Category Select */}
        <FormControl size="small">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{
              fontSize: 13,
              borderRadius: "8px",
              background: "#fff",
              minWidth: 160,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d1d5db",
              },
            }}
          >
            {[
              "All Categories",
              "Pharmaceuticals",
              "Surgical Supplies",
              "PPE & Protective",
              "Wound Care",
              "Lab Supplies",
              "Equipment/Devices",
            ].map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
                {c}
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
                <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: 13,
              borderRadius: "8px",
              background: "#fff",
              "& fieldset": { borderColor: "#e5e7eb" },
              "&:hover fieldset": { borderColor: "#d1d5db" },
            },
            minWidth: 220,
          }}
        />

        {/* Filter Chips */}
        <Box sx={{ display: "flex", gap: "8px", ml: "auto" }}>
          {["All", "Low Stock", "Expiring"].map((f) => (
            <Button
              key={f}
              size="small"
              onClick={() => setFilter(f)}
              startIcon={
                f === "Low Stock" ? (
                  <WarningAmberIcon sx={{ fontSize: 14 }} />
                ) : f === "Expiring" ? (
                  <AccessTimeIcon sx={{ fontSize: 14 }} />
                ) : null
              }
              sx={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                px: "14px",
                py: "6px",
                border: filter === f ? "none" : "1px solid #e5e7eb",
                background:
                  filter === f
                    ? f === "Low Stock"
                      ? "#fff7ed"
                      : f === "Expiring"
                      ? "#eff6ff"
                      : "#2563eb"
                    : "#fff",
                color:
                  filter === f
                    ? f === "Low Stock"
                      ? "#f97316"
                      : f === "Expiring"
                      ? "#2563eb"
                      : "#fff"
                    : "#6b7280",
                "&:hover": {
                  background:
                    filter === f
                      ? f === "Low Stock"
                        ? "#fed7aa"
                        : f === "Expiring"
                        ? "#dbeafe"
                        : "#1d4ed8"
                      : "#f9fafb",
                },
              }}
            >
              {f}
            </Button>
          ))}
        </Box>
      </Box>

      {/* ── Table ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "14px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ background: "#f8f9fb" }}>
                {[
                  "ITEM / NDC",
                  "CATEGORY",
                  "LOCATION",
                  "QTY",
                  "PAR",
                  "COST",
                  "EXPIRY",
                  "STATUS",
                  "ACTIONS",
                ].map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#9ca3af",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #f3f4f6",
                      py: "12px",
                      px: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((item, idx) => (
                <TableRow
                  key={item.id}
                  sx={{
                    background: "#fff",
                    "&:hover": { background: "#fafafa" },
                    transition: "background 0.15s",
                    "& td": {
                      borderBottom:
                        idx < filtered.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                      py: "14px",
                      px: "16px",
                    },
                  }}
                >
                  {/* Item / NDC */}
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "8px",
                          background: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {item.categoryEmoji}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#111827",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
                          {item.ndc}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 500, color: "#374151" }}
                    >
                      {item.categoryEmoji} {item.category}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 11, color: "#9ca3af", mt: "2px" }}
                    >
                      {item.subEmoji} {item.subcategory}
                    </Typography>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <Chip
                      label={item.location}
                      size="small"
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#7c3aed",
                        background: "#f5f3ff",
                        border: "1px solid #ede9fe",
                        borderRadius: "6px",
                        height: 22,
                        "& .MuiChip-label": { px: "8px" },
                      }}
                    />
                  </TableCell>

                  {/* QTY */}
                  <TableCell>
                    <QtyBar qty={item.qty} par={item.par} />
                  </TableCell>

                  {/* PAR */}
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                      {item.par}
                    </Typography>
                  </TableCell>

                  {/* Cost */}
                  <TableCell>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 500, color: "#111827" }}
                    >
                      ${item.cost.toFixed(2)}
                    </Typography>
                  </TableCell>

                  {/* Expiry */}
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: item.expired || item.expiringSoon ? 600 : 400,
                        color: item.expired
                          ? "#ef4444"
                          : item.expiringSoon
                          ? "#f59e0b"
                          : "#374151",
                        textDecoration: item.expired ? "line-through" : "none",
                      }}
                    >
                      {item.expiry}
                    </Typography>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {item.status.map((s) => (
                        <StatusChip
                          key={s.label}
                          label={s.label}
                          color={s.color}
                          icon={s.icon}
                        />
                      ))}
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: "4px" }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#6b7280",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            width: 28,
                            height: 28,
                            "&:hover": { background: "#f3f4f6", color: "#2563eb" },
                          }}
                        >
                          <EditIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Transfer">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#6b7280",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            width: 28,
                            height: 28,
                            "&:hover": { background: "#f3f4f6", color: "#7c3aed" },
                          }}
                        >
                          <SwapHorizIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Issue">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#6b7280",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            width: 28,
                            height: 28,
                            "&:hover": { background: "#f3f4f6", color: "#16a34a" },
                          }}
                        >
                          <AssignmentIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{
                            color: "#6b7280",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            width: 28,
                            height: 28,
                            "&:hover": {
                              background: "#fef2f2",
                              color: "#dc2626",
                              borderColor: "#fecaca",
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ py: 6, color: "#9ca3af", fontSize: 13 }}
                  >
                    No items found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box
          sx={{
            px: "16px",
            py: "12px",
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
            Showing {filtered.length} of {inventoryItems.length} items
          </Typography>
          <Box sx={{ display: "flex", gap: "6px" }}>
            {[1, 2].map((p) => (
              <Button
                key={p}
                size="small"
                sx={{
                  minWidth: 30,
                  height: 28,
                  fontSize: 12,
                  fontWeight: p === 1 ? 700 : 400,
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  background: p === 1 ? "#2563eb" : "#fff",
                  color: p === 1 ? "#fff" : "#6b7280",
                  textTransform: "none",
                  px: "10px",
                  "&:hover": {
                    background: p === 1 ? "#1d4ed8" : "#f9fafb",
                  },
                }}
              >
                {p}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}