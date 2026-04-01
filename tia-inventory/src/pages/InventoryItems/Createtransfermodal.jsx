import { useState } from "react";
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
import AddIcon                from "@mui/icons-material/Add";
import SwapHorizIcon          from "@mui/icons-material/SwapHoriz";
import DeleteOutlineIcon      from "@mui/icons-material/DeleteOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ErrorOutlineIcon       from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon       from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon       from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// ─── Mock data ────────────────────────────────────────────────────────────────
const availableItems = [
  { label: "Epinephrine 1mg/mL 10mL Vial",  value: "epinephrine", available: 4,   lot: "EP24B"  },
  { label: "Amoxicillin 500mg Capsules",      value: "amoxicillin", available: 200, lot: "AM12A"  },
  { label: "Sodium Chloride 0.9% IV 1L",      value: "sodium",      available: 12,  lot: "SC09C"  },
  { label: "Morphine Sulfate 10mg/mL",        value: "morphine",    available: 18,  lot: "MS10D"  },
  { label: "Nitrile Exam Gloves (L) 100/bx",  value: "gloves",      available: 30,  lot: "GL-L01" },
  { label: "Surgical Mask ASTM Level 3",      value: "mask",        available: 450, lot: "MK-L3A" },
  { label: "4×4 Gauze Pads Sterile 10/pk",   value: "gauze",       available: 200, lot: "GZ44B"  },
  { label: "BD Vacutainer EDTA 10mL",         value: "vacutainer",  available: 600, lot: "BD-E01" },
];

const LOCATIONS = ["Central Store","ICU","Emergency Dept","Pharmacy","Surgery","Laboratory","Ward A","Ward B","OPD","Maternity"];

// Priority — blue-themed active state to match IssueStockModal accent
const PRIORITY_CONFIG = {
  Routine:  { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Urgent:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Critical: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

// ─── Shared styles — identical to IssueStockModal ─────────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13, borderRadius: "8px", background: "#f9fafb",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },
};

const disabledInputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13, borderRadius: "8px", background: "#f3f4f6",
    "& fieldset": { borderColor: "#e5e7eb" },
  },
};

const selectSx = {
  fontSize: 13, borderRadius: "8px", background: "#f9fafb",
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

// hide browser number-input spinner arrows (same fix as IssueStockModal qty)
const noSpinnerSx = {
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
  "& input[type=number]::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
};

function FieldLabel({ children, required }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.04em", mb: "6px", textTransform: "uppercase" }}>
      {children}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
    </Typography>
  );
}

function PriorityIcon({ priority }) {
  if (priority === "Critical") return <ErrorOutlineIcon sx={{ fontSize: 14 }} />;
  if (priority === "Urgent")   return <WarningAmberIcon sx={{ fontSize: 14 }} />;
  return <InfoOutlinedIcon sx={{ fontSize: 14 }} />;
}

function validate({ fromLocation, toLocation, items }) {
  if (!fromLocation) return "Please select a From Location.";
  if (!toLocation)   return "Please select a To Location.";
  const filled = items.filter(i => i.item);
  if (filled.length === 0) return "Please add at least one item.";
  for (const row of filled) {
    const qty = parseInt(row.qty);
    if (!row.qty || isNaN(qty) || qty <= 0) return "All items must have a valid quantity.";
    const data = availableItems.find(a => a.value === row.item);
    if (data && qty > data.available) return `Qty for "${data.label}" exceeds available stock (${data.available}).`;
  }
  return null;
}

const makeRow = () => ({ id: Date.now() + Math.random(), item: "", qty: "" });

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateTransferModal({ open, onClose, prefillItem = null }) {
  const [priority,     setPriority] = useState("Routine");
  const [fromLocation, setFrom]     = useState("");
  const [toLocation,   setTo]       = useState("");
  const [notes,        setNotes]    = useState("");
  const [items,        setItems]    = useState([
    prefillItem ? { id: Date.now(), item: prefillItem, qty: "" } : makeRow(),
  ]);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState({ open: false, message: "", severity: "success" });
  const [errors,   setErrors]   = useState({});

  const showToast = (message, severity = "success") => setToast({ open: true, message, severity });

  const addItem    = () => setItems(p => [...p, makeRow()]);
  const removeItem = (id) => { if (items.length === 1) return; setItems(p => p.filter(i => i.id !== id)); };
  const updateItem = (id, field, value) => {
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));
    setErrors(e => { const n = { ...e }; delete n[`qty_${id}`]; return n; });
  };
  const getItemData = (v) => availableItems.find(a => a.value === v);

  const totalQty = items.reduce((sum, r) => sum + (parseInt(r.qty) || 0), 0);

  const getFieldErrors = () => {
    const e = {};
    if (!fromLocation) e.from = true;
    if (!toLocation)   e.to   = true;
    const filled = items.filter(i => i.item);
    if (filled.length === 0) e.items = true;
    filled.forEach(row => {
      const qty = parseInt(row.qty);
      if (!row.qty || isNaN(qty) || qty <= 0) e[`qty_${row.id}`] = true;
    });
    return e;
  };

  const handleReset = () => {
    setPriority("Routine"); setFrom(""); setTo(""); setNotes("");
    setItems([makeRow()]); setErrors({});
  };
  const handleClose = () => { handleReset(); onClose(); };

  const submit = async (status, successMsg) => {
    const error = validate({ fromLocation, toLocation, items });
    if (error) { setErrors(getFieldErrors()); showToast(error, "error"); return; }
    setErrors({});
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      showToast(successMsg, status === "Transferred" ? "success" : "warning");
      setTimeout(() => { handleReset(); onClose(); }, 1800);
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferNow     = () => submit("Transferred",     `TRF-2026-0009 completed — ${totalQty} units moved from ${fromLocation} to ${toLocation}.`);
  const handleRequestApproval = () => submit("Pending Approval", "Approval request sent for TRF-2026-0009. Awaiting supervisor sign-off.");

  return (
    <>
      <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" } }}>

        {/* ── Header — identical to IssueStockModal, blue icon ── */}
        <Box sx={{
          px: "24px", pt: "20px", pb: "16px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          borderBottom: "1px solid #f3f4f6", flexShrink: 0, bgcolor: "#fff",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SwapHorizIcon sx={{ fontSize: 20, color: "#2563eb" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Create Transfer</Typography>
              <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>Move stock between locations — no quantity change</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose} disabled={loading}
            sx={{ color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: "8px", width: 30, height: 30, "&:hover": { background: "#f3f4f6", color: "#374151" } }}>
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>

        {/* ── Scrollable body ── */}
        <DialogContent sx={{
          px: "24px", py: "20px", overflowY: "auto", maxHeight: "70vh",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
          "&::-webkit-scrollbar-thumb:hover": { background: "#a1a1aa" },
        }}>

          {/* Row 1: Transfer Number + Priority */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
            <Box>
              <FieldLabel>Transfer Number</FieldLabel>
              <TextField fullWidth size="small" value="TRF-2026-0009" disabled sx={disabledInputSx}
                inputProps={{ style: { color: "#9ca3af" } }} />
            </Box>
            <Box>
              <FieldLabel required>Priority</FieldLabel>
              <Box sx={{ display: "flex", gap: "6px" }}>
                {["Routine", "Urgent", "Critical"].map(p => {
                  const cfg    = PRIORITY_CONFIG[p];
                  const active = priority === p;
                  return (
                    <Box key={p} onClick={() => setPriority(p)} sx={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                      py: "7px", borderRadius: "8px", cursor: "pointer", userSelect: "none",
                      border: `1.5px solid ${active ? cfg.border : "#e5e7eb"}`,
                      background: active ? cfg.bg : "#f9fafb",
                      color: active ? cfg.color : "#9ca3af",
                      fontSize: 11, fontWeight: active ? 700 : 500,
                      transition: "all 0.15s",
                      "&:hover": { borderColor: cfg.border, background: cfg.bg, color: cfg.color },
                    }}>
                      <PriorityIcon priority={p} />
                      <span style={{ marginLeft: 3 }}>{p}</span>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Row 2: From + To — side by side, NO swap button */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
            <Box>
              <FieldLabel required>From Location</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={fromLocation} displayEmpty
                  onChange={e => { setFrom(e.target.value); setErrors(p => ({ ...p, from: false })); }}
                  sx={errors.from ? selectErrSx : selectSx}>
                  <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select...</MenuItem>
                  {LOCATIONS.map(l => <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>{l}</MenuItem>)}
                </Select>
              </FormControl>
              {errors.from && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
            </Box>
            <Box>
              <FieldLabel required>To Location</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={toLocation} displayEmpty
                  onChange={e => { setTo(e.target.value); setErrors(p => ({ ...p, to: false })); }}
                  sx={errors.to ? selectErrSx : selectSx}>
                  <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select...</MenuItem>
                  {LOCATIONS.filter(l => l !== fromLocation).map(l => (
                    <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>{l}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.to && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
            </Box>
          </Box>

          {/* Route preview pill — blue theme */}
          {fromLocation && toLocation && (
            <Box sx={{
              display: "flex", alignItems: "center", gap: "8px",
              px: "12px", py: "7px", mb: "16px",
              borderRadius: "8px", background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 14, color: "#2563eb" }} />
              <Typography sx={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>{fromLocation}</Typography>
              <Box sx={{ flex: 1, height: "1px", borderTop: "1.5px dashed #93c5fd", mx: "4px" }} />
              <Typography sx={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>{toLocation}</Typography>
            </Box>
          )}

          {/* Items to Transfer */}
          <Box sx={{ mb: "16px" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase", mb: "12px" }}>
              Items to Transfer
            </Typography>

            {/* Column headers */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 72px 88px 72px 32px", gap: "8px", mb: "8px", px: "2px" }}>
              {["ITEM", "AVAIL.", "LOT #", "QTY", ""].map(h => (
                <Typography key={h} sx={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</Typography>
              ))}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map(row => {
                const data    = getItemData(row.item);
                const overQty = data && row.qty && parseInt(row.qty) > data.available;
                const qtyErr  = errors[`qty_${row.id}`] || overQty;
                return (
                  <Box key={row.id}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 72px 88px 72px 32px", gap: "8px", alignItems: "center" }}>

                      {/* Item */}
                      <FormControl size="small">
                        <Select value={row.item} displayEmpty
                          onChange={e => updateItem(row.id, "item", e.target.value)}
                          sx={{ ...selectSx, fontSize: 12 }}>
                          <MenuItem value="" sx={{ fontSize: 12, color: "#9ca3af" }}>Select item...</MenuItem>
                          {availableItems.map(a => <MenuItem key={a.value} value={a.value} sx={{ fontSize: 12 }}>{a.label}</MenuItem>)}
                        </Select>
                      </FormControl>

                      {/* Available */}
                      <TextField size="small" value={data ? data.available : ""} disabled
                        sx={{ "& .MuiOutlinedInput-root": { fontSize: 13, borderRadius: "8px", background: "#f3f4f6", "& fieldset": { borderColor: "#e5e7eb" } },
                          "& input": { textAlign: "center", color: "#374151", fontWeight: 600, py: "7px" } }} />

                      {/* Lot */}
                      <TextField size="small" value={data ? data.lot : ""} placeholder="LOT #" disabled
                        sx={{ "& .MuiOutlinedInput-root": { fontSize: 12, borderRadius: "8px", background: "#f3f4f6", "& fieldset": { borderColor: "#e5e7eb" } },
                          "& input": { py: "7px" } }} />

                      {/* Qty — no spinner arrows, centered, same fix as IssueStockModal */}
                      <TextField size="small" placeholder="Qty" type="number"
                        value={row.qty} onChange={e => updateItem(row.id, "qty", e.target.value)}
                        inputProps={{ min: 0, max: data?.available }}
                        sx={{
                          ...noSpinnerSx,
                          "& .MuiOutlinedInput-root": {
                            fontSize: 13, borderRadius: "8px",
                            background: qtyErr ? "#fff5f5" : "#f9fafb",
                            "& fieldset": { borderColor: qtyErr ? "#fca5a5" : "#e5e7eb" },
                            "&:hover fieldset": { borderColor: qtyErr ? "#f87171" : "#d1d5db" },
                          },
                          "& input": { py: "7px", textAlign: "center" },
                        }} />

                      {/* Delete */}
                      <IconButton size="small" onClick={() => removeItem(row.id)} disabled={items.length === 1}
                        sx={{ color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", width: 28, height: 28,
                          "&:hover": { background: "#fef2f2" },
                          "&.Mui-disabled": { color: "#d1d5db", borderColor: "#e5e7eb" } }}>
                        <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>

                    {/* Qty error hint */}
                    {qtyErr && (
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 72px 88px 72px 32px", gap: "8px", mt: "2px" }}>
                        <Box /><Box /><Box />
                        <Typography sx={{ fontSize: 10, color: "#ef4444" }}>
                          {overQty ? `Max ${data.available}` : "Enter qty"}
                        </Typography>
                        <Box />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Add Item — blue dashed, matching IssueStockModal */}
            <Button onClick={addItem} disabled={loading} startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{ mt: "10px", width: "100%", border: "1.5px dashed #bfdbfe", borderRadius: "8px", py: "8px",
                fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "none", background: "transparent",
                "&:hover": { background: "#eff6ff", borderColor: "#93c5fd" } }}>
              Add Item
            </Button>
          </Box>

          {/* Total units — blue tint when > 0, matching Issue Value pill style */}
          <Box sx={{
            display: "flex", justifyContent: "flex-end", mb: "16px",
            p: "10px 16px", borderRadius: "10px",
            background: totalQty > 0 ? "#eff6ff" : "#f9fafb",
            border: `1px solid ${totalQty > 0 ? "#bfdbfe" : "#e5e7eb"}`,
            transition: "all 0.2s",
          }}>
            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
              Total Units:{" "}
              <span style={{ fontSize: 18, fontWeight: 800, color: totalQty > 0 ? "#2563eb" : "#111827" }}>
                {totalQty}
              </span>
            </Typography>
          </Box>

          <Divider sx={{ mb: "16px" }} />

          {/* Reason / Notes */}
          <Box>
            <FieldLabel>Reason / Notes</FieldLabel>
            <TextField fullWidth multiline rows={3} placeholder="e.g. ICU surge — urgent restock request..."
              value={notes} onChange={e => setNotes(e.target.value)} disabled={loading}
              sx={{ "& .MuiOutlinedInput-root": { fontSize: 13, borderRadius: "8px", background: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" }, "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" } } }} />
          </Box>
        </DialogContent>

        {/* ── Footer — identical to IssueStockModal ── */}
        <Box sx={{
          px: "24px", py: "16px", borderTop: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          gap: "10px", bgcolor: "#fff", flexShrink: 0,
        }}>
          <Button onClick={handleClose} disabled={loading} sx={{
            fontSize: 13, fontWeight: 600, color: "#374151", textTransform: "none",
            borderRadius: "8px", px: "20px", py: "9px",
            border: "1px solid #e5e7eb", bgcolor: "#fff", "&:hover": { bgcolor: "#f9fafb" },
          }}>
            Cancel
          </Button>

          <Button onClick={handleRequestApproval} disabled={loading}
            startIcon={<WarningAmberIcon sx={{ fontSize: 15 }} />}
            sx={{ fontSize: 13, fontWeight: 600, color: "#d97706", textTransform: "none",
              borderRadius: "8px", px: "20px", py: "9px",
              border: "1px solid #fde68a", bgcolor: "#fffbeb", "&:hover": { bgcolor: "#fef3c7" },
              "&.Mui-disabled": { opacity: 0.6 } }}>
            Request Approval
          </Button>

          <Button onClick={handleTransferNow} disabled={loading}
            startIcon={loading
              ? <Box component="span" sx={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
              : <SwapHorizIcon sx={{ fontSize: 15 }} />
            }
            sx={{ fontSize: 13, fontWeight: 600, color: "#fff", textTransform: "none",
              borderRadius: "8px", px: "20px", py: "9px",
              bgcolor: "#2563eb", boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              "&:hover": { bgcolor: "#1d4ed8" },
              "&.Mui-disabled": { opacity: 0.6, color: "#fff" } }}>
            Transfer Now
          </Button>
        </Box>
      </Dialog>

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={4000}
        onClose={() => setToast(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setToast(p => ({ ...p, open: false }))}
          severity={toast.severity} variant="filled"
          sx={{ fontSize: 13, borderRadius: "10px", minWidth: 320 }}
          icon={toast.severity === "success" ? <CheckCircleOutlineIcon fontSize="inherit" /> : undefined}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}