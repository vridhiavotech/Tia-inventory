import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, TextField, Select, MenuItem, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, LinearProgress, InputAdornment, Paper, Tooltip,
  Dialog, DialogContent, Snackbar, Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicationIcon from "@mui/icons-material/Medication";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ScienceIcon from "@mui/icons-material/Science";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import BiotechIcon from "@mui/icons-material/Biotech";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HealingIcon from "@mui/icons-material/Healing";
import DevicesIcon from "@mui/icons-material/Devices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

import IssueStockModal from "./IssueStockModal";
import { useInventory } from "./useInventory";
import CreateTransferModal from "./CreateTransferModal";

const CATEGORY_ICONS = {
  Pharmaceuticals:     { icon: <MedicationIcon sx={{ fontSize: 17 }} />,      bg: "#ede9fe", color: "#7c3aed" },
  "Surgical Supplies": { icon: <MedicalServicesIcon sx={{ fontSize: 17 }} />, bg: "#fef3c7", color: "#d97706" },
  "PPE & Protective":  { icon: <HealthAndSafetyIcon sx={{ fontSize: 17 }} />, bg: "#dcfce7", color: "#16a34a" },
  "Wound Care":        { icon: <HealingIcon sx={{ fontSize: 17 }} />,          bg: "#fce7f3", color: "#db2777" },
  "Lab Supplies":      { icon: <ScienceIcon sx={{ fontSize: 17 }} />,          bg: "#e0f2fe", color: "#0284c7" },
  Laboratory:          { icon: <BiotechIcon sx={{ fontSize: 17 }} />,          bg: "#e0f2fe", color: "#0284c7" },
  "Equipment/Devices": { icon: <DevicesIcon sx={{ fontSize: 17 }} />,          bg: "#f1f5f9", color: "#475569" },
};

const SUBCATEGORY_ICONS = {
  Antibiotics:                    { icon: <MedicationIcon sx={{ fontSize: 13 }} />,      color: "#7c3aed" },
  "Emergency Drugs":              { icon: <LocalHospitalIcon sx={{ fontSize: 13 }} />,   color: "#dc2626" },
  "IV Fluids & Electrolytes":     { icon: <WaterDropIcon sx={{ fontSize: 13 }} />,       color: "#0284c7" },
  "Analgesics / Pain Management": { icon: <PsychologyIcon sx={{ fontSize: 13 }} />,      color: "#d97706" },
  Gloves:                         { icon: <HealthAndSafetyIcon sx={{ fontSize: 13 }} />, color: "#16a34a" },
  "Masks & Respirators":          { icon: <HealthAndSafetyIcon sx={{ fontSize: 13 }} />, color: "#16a34a" },
  Dressings:                      { icon: <HealingIcon sx={{ fontSize: 13 }} />,          color: "#db2777" },
  "Blood Collection":             { icon: <BloodtypeIcon sx={{ fontSize: 13 }} />,        color: "#dc2626" },
  "Collection Tubes":             { icon: <VaccinesIcon sx={{ fontSize: 13 }} />,         color: "#0284c7" },
  Monitoring:                     { icon: <MonitorHeartIcon sx={{ fontSize: 13 }} />,     color: "#475569" },
};


function CategoryTile({ category }) {
  const cfg = CATEGORY_ICONS[category] || { icon: <MedicationIcon sx={{ fontSize: 17 }} />, bg: "#f3f4f6", color: "#6b7280" };
  return (
    <Box sx={{ width: 34, height: 34, borderRadius: "8px", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, flexShrink: 0 }}>
      {cfg.icon}
    </Box>
  );
}

function QtyBar({ qty, par }) {
  const pct = Math.min((qty / (par * 2)) * 100, 100);
  const isLow = qty < par;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography sx={{ fontSize: 13, minWidth: 32 }}>{qty}</Typography>
      <LinearProgress variant="determinate" value={pct}
        sx={{ width: 80, height: 5, borderRadius: 3, backgroundColor: "#f3f4f6",
          "& .MuiLinearProgress-bar": { borderRadius: 3, backgroundColor: isLow ? "#f97316" : "#22c55e" } }} />
    </Box>
  );
}

const STATUS_STYLES = {
  success: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  warning: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  error:   { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  info:    { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
};

function StatusChip({ label, color, icon }) {
  const s = STATUS_STYLES[color] || STATUS_STYLES.info;
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: "3px", px: "8px", py: "2px", borderRadius: "6px",
      background: s.bg, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, color: s.color, whiteSpace: "nowrap", lineHeight: "18px" }}>
      {icon && <Box sx={{ display: "flex", alignItems: "center", color: s.color }}>{icon}</Box>}
      {label}
    </Box>
  );
}

// Delete Confirmation Dialog
function DeleteConfirmDialog({ open, item, onCancel, onConfirm, deleting }) {
  return (
    <Dialog open={open} onClose={deleting ? undefined : onCancel} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" } }}>
      <Box sx={{ px: "24px", pt: "20px", pb: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DeleteOutlineIcon sx={{ fontSize: 20, color: "#dc2626" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Delete Item</Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>This action cannot be undone</Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onCancel} disabled={deleting}
          sx={{ color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: "8px", width: 30, height: 30, "&:hover": { background: "#f3f4f6" } }}>
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: "24px", py: "20px" }}>
        <Typography sx={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
          Are you sure you want to delete{" "}
          <span style={{ fontWeight: 700, color: "#111827" }}>{item?.name}</span>
          {item?.ndc && <span style={{ color: "#9ca3af" }}> ({item.ndc})</span>}?
          All associated records will be permanently removed.
        </Typography>
        {item && (
          <Box sx={{ mt: "16px", p: "12px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", display: "flex", alignItems: "center", gap: "10px" }}>
            <CategoryTile category={item.category} />
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{item.name}</Typography>
              <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>{item.location} · Qty: {item.qty} · {item.category}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <Box sx={{ px: "24px", py: "16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end", gap: "10px", background: "#fff" }}>
        <Button onClick={onCancel} disabled={deleting}
          sx={{ fontSize: 13, fontWeight: 600, color: "#374151", textTransform: "none", borderRadius: "8px", px: "20px", py: "9px", border: "1px solid #e5e7eb", background: "#fff", "&:hover": { background: "#f9fafb" } }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={deleting}
          startIcon={deleting
            ? <Box component="span" sx={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
            : <DeleteOutlineIcon sx={{ fontSize: 15 }} />}
          sx={{ fontSize: 13, fontWeight: 600, color: "#fff", textTransform: "none", borderRadius: "8px", px: "20px", py: "9px", background: "#dc2626", "&:hover": { background: "#b91c1c" }, "&.Mui-disabled": { opacity: 0.6, color: "#fff" } }}>
          {deleting ? "Deleting…" : "Delete Item"}
        </Button>
      </Box>
    </Dialog>
  );
}

// Main Component
export default function InventoryItems() {
  const navigate = useNavigate();
  const { items: inventoryItems, deleteItem } = useInventory();

  const [search, setSearch]               = useState("");
  const [location, setLocation]           = useState("All Locations");
  const [category, setCategory]           = useState("All Categories");
  const [filter, setFilter]               = useState("All");
  const [issueModal, setIssueModal]       = useState({ open: false, item: null });
  const [transferModal, setTransferModal] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog]   = useState({ open: false, item: null });
  const [deleting, setDeleting]           = useState(false);
  const [toast, setToast]                 = useState({ open: false, message: "", severity: "success" });

  const today = new Date();

  const filtered = inventoryItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.ndc.toLowerCase().includes(search.toLowerCase());
    const matchLoc    = location === "All Locations" || item.location === location;
    const matchCat    = category === "All Categories" || item.category === category;
    const matchFilter =
      filter === "All" ||
      (filter === "Low Stock" && item.qty < item.par) ||
      (filter === "Expiring" && item.expiryRaw && (item.expired || (item.expiryRaw - today) / (1000 * 60 * 60 * 24) <= 60));
    return matchSearch && matchLoc && matchCat && matchFilter;
  });

  const openDeleteDialog  = (item) => setDeleteDialog({ open: true, item });
  const closeDeleteDialog = () => { if (!deleting) setDeleteDialog({ open: false, item: null }); };

  // ── Issue Stock submitted → close modal immediately, then navigate ────────
  const handleIssued = () => {
    setIssueModal({ open: false, item: null });
    navigate("/admin/stock-issue");
  };

  const handleIssuePending = () => {
    setIssueModal({ open: false, item: null });
    navigate("/admin/stock-issue");
  };

  // ── Transfer submitted → close modal immediately, then navigate ───────────
  const handleTransferSubmitted = () => {
    setTransferModal({ open: false, item: null });
    navigate("/admin/transfers");
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await new Promise((res) => setTimeout(res, 900));
      const name = deleteDialog.item.name;
      deleteItem(deleteDialog.item.id);
      setDeleteDialog({ open: false, item: null });
      setToast({ open: true, message: `"${name}" has been deleted.`, severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to delete item. Please try again.", severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const selectSx = {
    fontSize: 13, borderRadius: "8px", background: "#fff",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
  };

  return (
    <Box sx={{ background: "#f8f9fb", minHeight: "100vh", p: "28px 32px", boxSizing: "border-box" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "20px" }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Inventory Items</Typography>
          <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>{inventoryItems.length} items across all locations</Typography>
        </Box>
        <Button
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate("/admin/inventory/add")}
          sx={{
            background: "#2563eb", color: "#fff", borderRadius: "8px",
            px: "18px", py: "10px", fontSize: 13, fontWeight: 600,
            textTransform: "none", boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            "&:hover": { background: "#1d4ed8" },
          }}
        >
          Add Item
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", mb: "20px" }}>
        <FormControl size="small">
          <Select value={location} onChange={(e) => setLocation(e.target.value)} sx={{ ...selectSx, minWidth: 150 }}>
            {["All Locations","Central Store","ICU","Emergency Dept","Pharmacy","Surgery","Laboratory"].map((l) => (
              <MenuItem key={l} value={l} sx={{ fontSize: 13 ,color:"#FFFFFF" }}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} sx={{ ...selectSx, minWidth: 170 }}>
            {["All Categories","Pharmaceuticals","Surgical Supplies","PPE & Protective","Wound Care","Lab Supplies","Equipment/Devices"].map((c) => {
              const cfg = CATEGORY_ICONS[c];
              return (
                <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {cfg && <Box sx={{ color: cfg.color, display: "flex" }}>{cfg.icon}</Box>}
                    {c}
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} /></InputAdornment> }}
          sx={{ "& .MuiOutlinedInput-root": { fontSize: 13, borderRadius: "8px", background: "#fff", "& fieldset": { borderColor: "#e5e7eb" }, "&:hover fieldset": { borderColor: "#d1d5db" } }, minWidth: 220 }} />
        <Box sx={{ display: "flex", gap: "8px", ml: "auto" }}>
          {["All","Low Stock","Expiring"].map((f) => (
            <Button key={f} size="small" onClick={() => setFilter(f)}
              startIcon={f === "Low Stock" ? <WarningAmberIcon sx={{ fontSize: 14 }} /> : f === "Expiring" ? <AccessTimeIcon sx={{ fontSize: 14 }} /> : null}
              sx={{ fontSize: 12, fontWeight: 600, textTransform: "none", borderRadius: "8px", px: "14px", py: "6px",
                border: filter === f ? "none" : "1px solid #e5e7eb",
                background: filter === f ? (f === "Low Stock" ? "#fff7ed" : f === "Expiring" ? "#eff6ff" : "#2563eb") : "#fff",
                color: filter === f ? (f === "Low Stock" ? "#f97316" : f === "Expiring" ? "#2563eb" : "#fff") : "#6b7280",
                "&:hover": { background: filter === f ? (f === "Low Stock" ? "#fed7aa" : f === "Expiring" ? "#dbeafe" : "#1d4ed8") : "#f9fafb" } }}>
              {f}
            </Button>
          ))}
        </Box>
      </Box>
      <Paper elevation={0} sx={{ borderRadius: "14px", border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <TableContainer
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
            "&::-webkit-scrollbar-thumb:hover": { background: "#a1a1aa" },
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db transparent",
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ background: "#EBF1FE" }}>
                {["ITEM / NDC","CATEGORY","LOCATION","QTY","PAR","COST","EXPIRY","STATUS","ACTIONS"].map((col) => (
                 <TableCell key={col} sx={{ fontSize: 11, fontWeight: 700, color: "#373B4D", letterSpacing: "0.05em", borderBottom: "none", borderRight: "1px solid #BED3FC", py: "12px", px: "16px", whiteSpace: "nowrap",
  "&:last-child": { borderRight: "none" }
}}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, idx) => (
                <TableRow key={item.id}
                  sx={{ background: "#fff", "&:hover": { background: "#fafafa" }, transition: "background 0.15s",
                    "& td": { borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none", py: "14px", px: "16px" } }}>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <CategoryTile category={item.category} />
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111827", lineHeight: 1.4 }}>{item.name}</Typography>
                        <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>{item.ndc}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <Box sx={{ color: CATEGORY_ICONS[item.category]?.color || "#6b7280", display: "flex", flexShrink: 0 }}>{CATEGORY_ICONS[item.category]?.icon}</Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{item.category}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mt: "3px" }}>
                      <Box sx={{ color: SUBCATEGORY_ICONS[item.subcategory]?.color || "#9ca3af", display: "flex", flexShrink: 0 }}>{SUBCATEGORY_ICONS[item.subcategory]?.icon}</Box>
                      <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>{item.subcategory}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip label={item.location} size="small"
                      sx={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: "6px", height: 22, "& .MuiChip-label": { px: "8px" } }} />
                  </TableCell>

                  <TableCell><QtyBar qty={item.qty} par={item.par} /></TableCell>
                  <TableCell><Typography sx={{ fontSize: 14, color: "#2E2E2E" }}>{item.par}</Typography></TableCell>
                  <TableCell><Typography sx={{ fontSize: 14, color: "#2E2E2E" }}>${item.cost.toFixed(2)}</Typography></TableCell>

                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: item.expired || item.expiringSoon ? 600 : 400,
                      color: item.expired ? "#ef4444" : item.expiringSoon ? "#f59e0b" : "#374151",
                      textDecoration: item.expired ? "line-through" : "none" }}>
                      {item.expiry}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {item.status.map((s) => <StatusChip key={s.label} label={s.label} color={s.color} icon={s.icon} />)}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: "flex", gap: "4px" }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => navigate(`/admin/inventory/add?id=${item.id}&edit=true`)}
                          sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28,
                            "&:hover": { background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" } }}>
                          <EditIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Transfer">
                        <IconButton size="small" onClick={() => setTransferModal({ open: true, item: item.name })}
                          sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28,
                            "&:hover": { background: "#f5f3ff", color: "#7c3aed", borderColor: "#ddd6fe" } }}>
                          <SwapHorizIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Issue Stock">
                        <IconButton size="small" onClick={() => setIssueModal({ open: true, item: item.name })}
                          sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28,
                            "&:hover": { background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" } }}>
                          <AssignmentIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => openDeleteDialog(item)}
                          sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28,
                            "&:hover": { background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" } }}>
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: "#9ca3af", fontSize: 13 }}>
                    No items found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        
      </Paper>
      <IssueStockModal
        open={issueModal.open}
        onClose={() => setIssueModal({ open: false, item: null })}
        prefillItem={issueModal.item}
        onIssued={handleIssued}
        onPending={handleIssuePending}
      />
      <CreateTransferModal
        open={transferModal.open}
        onClose={() => setTransferModal({ open: false, item: null })}
        prefillItem={transferModal.item}
        onSubmitted={handleTransferSubmitted}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        item={deleteDialog.item}
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setToast((p) => ({ ...p, open: false }))} severity={toast.severity} variant="filled" sx={{ fontSize: 13, borderRadius: "10px", minWidth: 280 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}