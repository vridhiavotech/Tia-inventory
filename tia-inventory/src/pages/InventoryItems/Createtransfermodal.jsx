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
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// ─── Mock Items ───────────────────────────────────────────────────────────────
const availableItems = [
  { label: "Epinephrine 1mg/mL 10mL Vial",   value: "epinephrine", available: 4,   lot: "EP24B"  },
  { label: "Amoxicillin 500mg Capsules",       value: "amoxicillin", available: 200, lot: "AM12A"  },
  { label: "Sodium Chloride 0.9% IV 1L",       value: "sodium",      available: 12,  lot: "SC09C"  },
  { label: "Morphine Sulfate 10mg/mL",         value: "morphine",    available: 18,  lot: "MS10D"  },
  { label: "Nitrile Exam Gloves (L) 100/bx",  value: "gloves",      available: 30,  lot: "GL-L01" },
  { label: "Surgical Mask ASTM Level 3",       value: "mask",        available: 450, lot: "MK-L3A" },
  { label: "4×4 Gauze Pads Sterile 10/pk",    value: "gauze",       available: 200, lot: "GZ44B"  },
  { label: "BD Vacutainer EDTA 10mL",          value: "vacutainer",  available: 600, lot: "BD-E01" },
];

const LOCATIONS = ["Central Store", "ICU", "Emergency Dept", "Pharmacy", "Surgery", "Laboratory", "Ward A", "Ward B", "OPD", "Maternity"];

const PRIORITY_CONFIG = {
  Routine:  { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  Urgent:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Critical: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

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

const disabledInputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13,
    borderRadius: "8px",
    background: "#f3f4f6",
    color: "#9ca3af",
    "& fieldset": { borderColor: "#e5e7eb" },
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
      }}
    >
      {children}
      {required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
    </Typography>
  );
}

function PriorityIcon({ priority }) {
  if (priority === "Critical") return <ErrorOutlineIcon sx={{ fontSize: 14 }} />;
  if (priority === "Urgent") return <WarningAmberIcon sx={{ fontSize: 14 }} />;
  return <InfoOutlinedIcon sx={{ fontSize: 14 }} />;
}

// ─── Validation helper ────────────────────────────────────────────────────────
function validate({ fromLocation, toLocation, items }) {
  if (!fromLocation) return "Please select a From Location.";
  if (!toLocation) return "Please select a To Location.";

  const filledItems = items.filter((i) => i.item);
  if (filledItems.length === 0) return "Please add at least one item.";

  for (const row of filledItems) {
    const qty = parseInt(row.qty);
    if (!row.qty || isNaN(qty) || qty <= 0) return "All items must have a valid quantity.";
    const data = availableItems.find((a) => a.value === row.item);
    if (data && qty > data.available)
      return `Quantity for "${data.label}" exceeds available stock (${data.available}).`;
  }

  return null; // no errors
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateTransferModal({ open, onClose, prefillItem = null }) {
  const [priority, setPriority]     = useState("Routine");
  const [fromLocation, setFrom]     = useState("");
  const [toLocation, setTo]         = useState("");
  const [notes, setNotes]           = useState("");
  const [items, setItems] = useState([
    prefillItem
      ? { id: Date.now(), item: prefillItem, qty: "" }
      : { id: Date.now(), item: "", qty: "" },
  ]);

  // UI state
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState({ open: false, message: "", severity: "success" });
  const [fieldErrors, setFieldErrors] = useState({});

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const addItem    = () => setItems((p) => [...p, { id: Date.now(), item: "", qty: "" }]);
  const removeItem = (id) => setItems((p) => p.filter((i) => i.id !== id));
  const updateItem = (id, field, value) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const getItemData = (value) => availableItems.find((a) => a.value === value);

  const swapLocations = () => {
    setFrom(toLocation);
    setTo(fromLocation);
  };

  const totalQty = items.reduce((sum, r) => sum + (parseInt(r.qty) || 0), 0);

  // ── Highlight missing fields ──────────────────────────────────────────────
  const getFieldErrors = () => {
    const errors = {};
    if (!fromLocation) errors.from = true;
    if (!toLocation) errors.to = true;
    const filledItems = items.filter((i) => i.item);
    if (filledItems.length === 0) errors.items = true;
    filledItems.forEach((row) => {
      const qty = parseInt(row.qty);
      if (!row.qty || isNaN(qty) || qty <= 0) errors[`qty_${row.id}`] = true;
    });
    return errors;
  };

  // ── Transfer Now ──────────────────────────────────────────────────────────
  const handleTransferNow = async () => {
    const error = validate({ fromLocation, toLocation, items });
    if (error) {
      setFieldErrors(getFieldErrors());
      showToast(error, "error");
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1200));

      const payload = {
        transferNumber: "TRF-2026-0009",
        priority,
        from: fromLocation,
        to: toLocation,
        items: items
          .filter((i) => i.item)
          .map((i) => ({
            item: i.item,
            qty: parseInt(i.qty),
            lot: getItemData(i.item)?.lot,
          })),
        notes,
        status: "Transferred",
        timestamp: new Date().toISOString(),
      };

      console.log("Transfer submitted:", payload);
      showToast(`Transfer TRF-2026-0009 completed — ${totalQty} units moved from ${fromLocation} to ${toLocation}.`, "success");

      // Close after a short delay so the user sees the success toast
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      showToast("Transfer failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Request Approval ──────────────────────────────────────────────────────
  const handleRequestApproval = async () => {
    const error = validate({ fromLocation, toLocation, items });
    if (error) {
      setFieldErrors(getFieldErrors());
      showToast(error, "error");
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 900));

      const payload = {
        transferNumber: "TRF-2026-0009",
        priority,
        from: fromLocation,
        to: toLocation,
        items: items
          .filter((i) => i.item)
          .map((i) => ({
            item: i.item,
            qty: parseInt(i.qty),
            lot: getItemData(i.item)?.lot,
          })),
        notes,
        status: "Pending Approval",
        timestamp: new Date().toISOString(),
      };

      console.log("Approval requested:", payload);
      showToast(`Approval request sent for TRF-2026-0009. Awaiting supervisor sign-off.`, "warning");

      setTimeout(() => onClose(), 1800);
    } catch (err) {
      showToast("Could not send approval request. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const pc = PRIORITY_CONFIG[priority];

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            overflow: "hidden",
          },
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            px: "24px", pt: "20px", pb: "16px",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box
              sx={{
                width: 38, height: 38, borderRadius: "10px",
                background: "#f5f3ff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <SwapHorizIcon sx={{ fontSize: 20, color: "#7c3aed" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                Create Transfer
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>
                Move stock between locations — no quantity change
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            disabled={loading}
            sx={{
              color: "#9ca3af",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              width: 30, height: 30,
              "&:hover": { background: "#f3f4f6", color: "#374151" },
            }}
          >
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: "24px", py: "20px", overflowY: "auto", maxHeight: "70vh" }}>

          {/* ── Transfer Number ── */}
          <Box sx={{ mb: "16px" }}>
            <FieldLabel>Transfer Number</FieldLabel>
            <TextField fullWidth size="small" value="TRF-2026-0009" disabled sx={disabledInputSx} />
          </Box>

          {/* ── Priority ── */}
          <Box sx={{ mb: "16px" }}>
            <FieldLabel required>Priority</FieldLabel>
            <Box sx={{ display: "flex", gap: "8px" }}>
              {["Routine", "Urgent", "Critical"].map((p) => {
                const cfg = PRIORITY_CONFIG[p];
                const active = priority === p;
                return (
                  <Box
                    key={p}
                    onClick={() => setPriority(p)}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      py: "9px",
                      borderRadius: "8px",
                      border: `1.5px solid ${active ? cfg.border : "#e5e7eb"}`,
                      background: active ? cfg.bg : "#f9fafb",
                      color: active ? cfg.color : "#9ca3af",
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      userSelect: "none",
                      "&:hover": { borderColor: cfg.border, background: cfg.bg, color: cfg.color },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", color: "inherit" }}>
                      <PriorityIcon priority={p} />
                    </Box>
                    {p}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── From / Swap / To ── */}
          <Box sx={{ mb: "16px" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 36px 1fr", gap: "8px", alignItems: "flex-end" }}>
              <Box>
                <FieldLabel required>From Location</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={fromLocation}
                    onChange={(e) => { setFrom(e.target.value); setFieldErrors((p) => ({ ...p, from: false })); }}
                    displayEmpty
                    sx={{
                      ...selectSx,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: fieldErrors.from ? "#fca5a5" : "#e5e7eb",
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select...</MenuItem>
                    {LOCATIONS.map((l) => (
                      <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>{l}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {fieldErrors.from && (
                  <Typography sx={{ fontSize: 11, color: "#ef4444", mt: "4px" }}>Required</Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", pb: fieldErrors.from || fieldErrors.to ? "20px" : "1px" }}>
                <IconButton
                  size="small"
                  onClick={swapLocations}
                  sx={{
                    width: 32, height: 32,
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#7c3aed",
                    background: "#f9fafb",
                    "&:hover": { background: "#f5f3ff", borderColor: "#ddd6fe" },
                    transition: "all 0.15s",
                  }}
                >
                  <SwapHorizIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              <Box>
                <FieldLabel required>To Location</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={toLocation}
                    onChange={(e) => { setTo(e.target.value); setFieldErrors((p) => ({ ...p, to: false })); }}
                    displayEmpty
                    sx={{
                      ...selectSx,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: fieldErrors.to ? "#fca5a5" : "#e5e7eb",
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select...</MenuItem>
                    {LOCATIONS.filter((l) => l !== fromLocation).map((l) => (
                      <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>{l}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {fieldErrors.to && (
                  <Typography sx={{ fontSize: 11, color: "#ef4444", mt: "4px" }}>Required</Typography>
                )}
              </Box>
            </Box>

            {fromLocation && toLocation && (
              <Box
                sx={{
                  mt: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  px: "12px",
                  py: "7px",
                  borderRadius: "8px",
                  background: "#f5f3ff",
                  border: "1px solid #ede9fe",
                }}
              >
                <LocalShippingOutlinedIcon sx={{ fontSize: 14, color: "#7c3aed" }} />
                <Typography sx={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>
                  {fromLocation}
                </Typography>
                <Box sx={{ flex: 1, height: "1px", borderTop: "1.5px dashed #c4b5fd", mx: "4px" }} />
                <Typography sx={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>
                  {toLocation}
                </Typography>
              </Box>
            )}
          </Box>

          {/* ── Items to Transfer ── */}
          <Box sx={{ mb: "16px" }}>
            <Typography
              sx={{
                fontSize: 12, fontWeight: 700, color: "#7c3aed",
                letterSpacing: "0.05em", textTransform: "uppercase", mb: "12px",
              }}
            >
              Items to Transfer
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 100px 80px 32px",
                gap: "8px", mb: "8px", px: "2px",
              }}
            >
              {["ITEM", "AVAILABLE", "LOT #", "QTY", ""].map((h) => (
                <Typography
                  key={h}
                  sx={{
                    fontSize: 10, fontWeight: 600, color: "#9ca3af",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}
                >
                  {h}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((row) => {
                const data = getItemData(row.item);
                const overQty = data && row.qty && parseInt(row.qty) > data.available;
                const qtyError = fieldErrors[`qty_${row.id}`];
                return (
                  <Box
                    key={row.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 90px 100px 80px 32px",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <FormControl size="small">
                      <Select
                        value={row.item}
                        onChange={(e) => updateItem(row.id, "item", e.target.value)}
                        displayEmpty
                        sx={{ ...selectSx, fontSize: 12 }}
                      >
                        <MenuItem value="" sx={{ fontSize: 12, color: "#9ca3af" }}>Select item...</MenuItem>
                        {availableItems.map((a) => (
                          <MenuItem key={a.value} value={a.value} sx={{ fontSize: 12 }}>
                            {a.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      size="small"
                      value={data ? data.available : ""}
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: 13, borderRadius: "8px", background: "#f3f4f6",
                          "& fieldset": { borderColor: "#e5e7eb" },
                        },
                        "& input": { textAlign: "center", color: "#374151", fontWeight: 600, py: "7px" },
                      }}
                    />

                    <TextField
                      size="small"
                      value={data ? data.lot : ""}
                      placeholder="LOT #"
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: 12, borderRadius: "8px", background: "#f3f4f6",
                          "& fieldset": { borderColor: "#e5e7eb" },
                        },
                        "& input": { py: "7px" },
                      }}
                    />

                    <TextField
                      size="small"
                      placeholder="Qty"
                      type="number"
                      value={row.qty}
                      onChange={(e) => {
                        updateItem(row.id, "qty", e.target.value);
                        setFieldErrors((p) => ({ ...p, [`qty_${row.id}`]: false }));
                      }}
                      inputProps={{ min: 0, max: data?.available }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: 13,
                          borderRadius: "8px",
                          background: "#f9fafb",
                          "& fieldset": { borderColor: overQty || qtyError ? "#fca5a5" : "#e5e7eb" },
                          "&:hover fieldset": { borderColor: overQty || qtyError ? "#f87171" : "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: overQty || qtyError ? "#ef4444" : "#7c3aed" },
                        },
                        "& input": { py: "7px" },
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() => removeItem(row.id)}
                      disabled={items.length === 1}
                      sx={{
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        width: 28, height: 28,
                        "&:hover": { background: "#fef2f2" },
                        "&.Mui-disabled": { color: "#d1d5db", borderColor: "#e5e7eb" },
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>

            <Button
              onClick={addItem}
              disabled={loading}
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{
                mt: "10px", width: "100%",
                border: "1.5px dashed #ddd6fe",
                borderRadius: "8px", py: "8px",
                fontSize: 12, fontWeight: 600, color: "#7c3aed",
                textTransform: "none", background: "transparent",
                "&:hover": { background: "#f5f3ff", borderColor: "#c4b5fd" },
              }}
            >
              + Add Item
            </Button>
          </Box>

          {/* ── Total qty summary ── */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "16px" }}>
            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
              Total Units:{" "}
              <span style={{ fontSize: 16, fontWeight: 800, color: "#111827", fontStyle: "italic" }}>
                {totalQty}
              </span>
            </Typography>
          </Box>

          <Divider sx={{ mb: "16px" }} />

          {/* ── Reason / Notes ── */}
          <Box>
            <FieldLabel>Reason / Notes</FieldLabel>
            <TextField
              fullWidth multiline rows={3}
              placeholder="e.g. ICU surge — urgent restock request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 13, borderRadius: "8px", background: "#f9fafb",
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#d1d5db" },
                  "&.Mui-focused fieldset": { borderColor: "#7c3aed" },
                },
              }}
            />
          </Box>
        </DialogContent>

        {/* ── Footer ── */}
        <Box
          sx={{
            px: "24px", py: "16px",
            borderTop: "1px solid #f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            gap: "10px", background: "#fff",
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              fontSize: 13, fontWeight: 600, color: "#374151",
              textTransform: "none", borderRadius: "8px",
              px: "20px", py: "9px",
              border: "1px solid #e5e7eb", background: "#fff",
              "&:hover": { background: "#f9fafb" },
            }}
          >
            Cancel
          </Button>

          {/* Request Approval */}
          <Button
            onClick={handleRequestApproval}
            disabled={loading}
            startIcon={
              loading
                ? <Box component="span" sx={{ width: 14, height: 14, border: "2px solid #fde68a", borderTopColor: "#d97706", borderRadius: "50%", animation: "spin 0.7s linear infinite", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
                : <WarningAmberIcon sx={{ fontSize: 15 }} />
            }
            sx={{
              fontSize: 13, fontWeight: 600, color: "#d97706",
              textTransform: "none", borderRadius: "8px",
              px: "20px", py: "9px",
              border: "1px solid #fde68a", background: "#fffbeb",
              "&:hover": { background: "#fef3c7" },
              "&.Mui-disabled": { opacity: 0.6 },
            }}
          >
            Request Approval
          </Button>

          {/* Transfer Now */}
          <Button
            onClick={handleTransferNow}
            disabled={loading}
            startIcon={
              loading
                ? <Box component="span" sx={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
                : <SwapHorizIcon sx={{ fontSize: 15 }} />
            }
            sx={{
              fontSize: 13, fontWeight: 600, color: "#fff",
              textTransform: "none", borderRadius: "8px",
              px: "20px", py: "9px",
              background: "#7c3aed",
              boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
              "&:hover": { background: "#6d28d9" },
              "&.Mui-disabled": { opacity: 0.6, color: "#fff" },
            }}
          >
            Transfer Now
          </Button>
        </Box>
      </Dialog>

      {/* ── Toast ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((p) => ({ ...p, open: false }))}
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