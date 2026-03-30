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
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ─── Items with unitCost for value calculation ────────────────────────────────

const availableItems = [
  { label: "Epinephrine 1mg/mL 10mL Vial",  value: "epinephrine",  available: 4,   lot: "EP24B",  unitCost: 18.50 },
  { label: "Amoxicillin 500mg Capsules",     value: "amoxicillin",  available: 200, lot: "AM12A",  unitCost: 2.40  },
  { label: "Sodium Chloride 0.9% IV 1L",     value: "sodium",       available: 12,  lot: "SC09C",  unitCost: 3.20  },
  { label: "Morphine Sulfate 10mg/mL",       value: "morphine",     available: 18,  lot: "MS10D",  unitCost: 22.00 },
  { label: "Nitrile Exam Gloves (L) 100/bx", value: "gloves",       available: 30,  lot: "GL-L01", unitCost: 12.00 },
  { label: "Surgical Mask ASTM Level 3",     value: "mask",         available: 450, lot: "MK-L3A", unitCost: 0.85  },
  { label: "4×4 Gauze Pads Sterile 10/pk",   value: "gauze",        available: 200, lot: "GZ44B",  unitCost: 3.50  },
  { label: "BD Vacutainer EDTA 10mL",        value: "vacutainer",   available: 600, lot: "BD-E01", unitCost: 1.20  },
];

function FieldLabel({ children, required }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#6b7280", letterSpacing: "0.04em", mb: "6px", textTransform: "uppercase" }}>
      {children}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
    </Typography>
  );
}

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

const selectErrSx = {
  ...selectSx,
  background: "#fff5f5",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fca5a5" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f87171" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ef4444" },
};

const makeRow = () => ({ id: Date.now() + Math.random(), item: "", qty: "" });

export default function IssueStockModal({ open, onClose, prefillItem = null, onIssued, onPending }) {
  const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

  const [issueType,   setIssueType]   = useState("Ward Requisition");
  const [issueFrom,   setIssueFrom]   = useState("");
  const [issueTo,     setIssueTo]     = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [patientId,   setPatientId]   = useState("");
  const [remarks,     setRemarks]     = useState("");
  const [items, setItems] = useState([
    prefillItem ? { id: Date.now(), item: prefillItem, qty: "" } : makeRow(),
  ]);
  const [errors, setErrors] = useState({});
  const [snack,  setSnack]  = useState({ open: false, msg: "", severity: "success" });

  const getItemData = (v) => availableItems.find((a) => a.value === v);

  // ── live issue value ──
  const issueValue = items.reduce((sum, row) => {
    const d   = getItemData(row.item);
    const qty = parseFloat(row.qty) || 0;
    return d && qty > 0 ? sum + qty * d.unitCost : sum;
  }, 0);

  // ── item row ops ──
  const addItem = () => setItems((p) => [...p, makeRow()]);

  const removeItem = (id) => {
    if (items.length === 1) return;
    setItems((p) => p.filter((r) => r.id !== id));
    setErrors((e) => {
      const n = { ...e };
      delete n[`item_${id}`];
      delete n[`qty_${id}`];
      return n;
    });
  };

  const updateItem = (id, field, value) => {
    setItems((p) => p.map((r) => r.id === id ? { ...r, [field]: value } : r));
    setErrors((e) => { const n = { ...e }; delete n[`${field}_${id}`]; return n; });
  };

  // ── validation ──
  const validate = () => {
    const errs = {};
    if (!issueFrom) errs.issueFrom = true;
    if (!issueTo)   errs.issueTo   = true;

    items.forEach((row) => {
      if (!row.item) errs[`item_${row.id}`] = "Select an item";
      const qty  = parseFloat(row.qty);
      const data = getItemData(row.item);
      if (!row.qty || isNaN(qty) || qty <= 0) {
        errs[`qty_${row.id}`] = "Enter qty";
      } else if (data && qty > data.available) {
        errs[`qty_${row.id}`] = `Max ${data.available}`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── reset + close ──
  const reset = () => {
    setIssueType("Ward Requisition");
    setIssueFrom(""); setIssueTo(""); setRequestedBy(""); setPatientId(""); setRemarks("");
    setItems([makeRow()]); setErrors({});
  };
  const handleClose = () => { reset(); onClose(); };

  const buildPayload = (status) => ({
    issueNumber: "ISS-2026-0013", issueType, issueFrom, issueTo,
    requestedBy, authorisedBy: "S. Anderson", issueDate: today, patientId, remarks,
    items: items.map((r) => {
      const d = getItemData(r.item);
      return { item: r.item, lot: d?.lot, qty: parseFloat(r.qty), unitCost: d?.unitCost };
    }),
    totalValue: issueValue, status,
  });

  // ── button handlers ──
  const handlePending = () => {
    if (!validate()) {
      setSnack({ open: true, msg: "Please fix the highlighted fields.", severity: "error" });
      return;
    }
    onPending?.(buildPayload("Pending Approval"));
    setSnack({ open: true, msg: "Submitted for approval.", severity: "warning" });
    reset(); onClose();
  };

  const handleIssue = () => {
    if (!validate()) {
      setSnack({ open: true, msg: "Please fix the highlighted fields.", severity: "error" });
      return;
    }
    onIssued?.(buildPayload("Issued"));
    setSnack({ open: true, msg: "Stock issued successfully!", severity: "success" });
    reset(); onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" } }}>

        {/* Header */}
        <Box sx={{ px: "24px", pt: "20px", pb: "16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AssignmentIcon sx={{ fontSize: 20, color: "#2563eb" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Issue Stock</Typography>
              <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>Outward stock movement — reduces on-hand quantity</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose}
            sx={{ color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: "8px", width: 30, height: 30, "&:hover": { background: "#f3f4f6", color: "#374151" } }}>
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>

        {/* Scrollable body */}
        <DialogContent sx={{
          px: "24px", py: "20px", overflowY: "auto", maxHeight: "70vh",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
          "&::-webkit-scrollbar-thumb:hover": { background: "#a1a1aa" },
        }}>

          {/* Row 1 */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
            <Box>
              <FieldLabel>Issue Number</FieldLabel>
              <TextField fullWidth size="small" value="ISS-2026-0013" disabled
                sx={{ ...inputSx, "& .MuiOutlinedInput-root": { ...inputSx["& .MuiOutlinedInput-root"], background: "#f3f4f6" } }} />
            </Box>
            <Box>
              <FieldLabel required>Issue Type</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={issueType} onChange={(e) => setIssueType(e.target.value)} sx={selectSx}>
                  {["Ward Requisition","OT Request","Emergency Issue","Transfer","Wastage/Disposal","Patient Dispensing","Return to Supplier"].map((t) => (
                    <MenuItem key={t} value={t} sx={{ fontSize: 13 }}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Row 2 */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
            <Box>
              <FieldLabel required>Issue From (Location)</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={issueFrom} displayEmpty
                  onChange={(e) => { setIssueFrom(e.target.value); setErrors((er) => ({ ...er, issueFrom: false })); }}
                  sx={errors.issueFrom ? selectErrSx : selectSx}>
                  <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select...</MenuItem>
                  {["Central Store","ICU","Emergency Dept","Pharmacy","Surgery","Laboratory"].map((l) => (
                    <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>{l}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.issueFrom && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
            </Box>
            <Box>
              <FieldLabel required>Issue To (Dept / Ward)</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={issueTo} displayEmpty
                  onChange={(e) => { setIssueTo(e.target.value); setErrors((er) => ({ ...er, issueTo: false })); }}
                  sx={errors.issueTo ? selectErrSx : selectSx}>
                  <MenuItem value="" sx={{ fontSize: 13, color: "#9ca3af" }}>Select...</MenuItem>
                  {["Ward A","Ward B","ICU","Emergency","OPD","OR","Radiology","Maternity"].map((d) => (
                    <MenuItem key={d} value={d} sx={{ fontSize: 13 }}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.issueTo && <Typography sx={{ fontSize: 10, color: "#ef4444", mt: "3px" }}>Required</Typography>}
            </Box>
          </Box>

          {/* Row 3 */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
            <Box>
              <FieldLabel>Requested By</FieldLabel>
              <TextField fullWidth size="small" placeholder="e.g. Head Nurse ICU"
                value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} sx={inputSx} />
            </Box>
            <Box>
              <FieldLabel>Authorised By</FieldLabel>
              <TextField fullWidth size="small" value="S. Anderson" disabled
                sx={{ ...inputSx, "& .MuiOutlinedInput-root": { ...inputSx["& .MuiOutlinedInput-root"], background: "#f3f4f6" } }} />
            </Box>
          </Box>

          {/* Row 4 */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "20px" }}>
            <Box>
              <FieldLabel>Issue Date</FieldLabel>
              <TextField fullWidth size="small" value={today} disabled
                InputProps={{ endAdornment: <InputAdornment position="end"><AccessTimeIcon sx={{ fontSize: 16, color: "#9ca3af" }} /></InputAdornment> }}
                sx={{ ...inputSx, "& .MuiOutlinedInput-root": { ...inputSx["& .MuiOutlinedInput-root"], background: "#f3f4f6" } }} />
            </Box>
            <Box>
              <FieldLabel>Patient ID (Optional)</FieldLabel>
              <TextField fullWidth size="small" placeholder="PT-2026-00000"
                value={patientId} onChange={(e) => setPatientId(e.target.value)} sx={inputSx} />
            </Box>
          </Box>

          {/* Items to Issue */}
          <Box sx={{ mb: "16px" }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase", mb: "12px" }}>
              Items to Issue
            </Typography>

            {/* Column headers */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 72px 88px 72px 32px", gap: "8px", mb: "8px", px: "2px" }}>
              {["ITEM", "AVAIL.", "LOT #", "QTY", ""].map((h) => (
                <Typography key={h} sx={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</Typography>
              ))}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((row) => {
                const data    = getItemData(row.item);
                const itemErr = errors[`item_${row.id}`];
                const qtyErr  = errors[`qty_${row.id}`];
                return (
                  <Box key={row.id}>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 72px 88px 72px 32px", gap: "8px", alignItems: "center" }}>
                      {/* Item */}
                      <FormControl size="small">
                        <Select value={row.item} displayEmpty
                          onChange={(e) => updateItem(row.id, "item", e.target.value)}
                          sx={itemErr ? { ...selectErrSx, fontSize: 12 } : { ...selectSx, fontSize: 12 }}>
                          <MenuItem value="" sx={{ fontSize: 12, color: "#9ca3af" }}>Select item...</MenuItem>
                          {availableItems.map((a) => (
                            <MenuItem key={a.value} value={a.value} sx={{ fontSize: 12 }}>{a.label}</MenuItem>
                          ))}
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

                      {/* Qty */}
                      <TextField size="small" placeholder="Qty" type="number"
                        value={row.qty}
                        onChange={(e) => updateItem(row.id, "qty", e.target.value)}
                        inputProps={{ min: 0, max: data?.available }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: 13, borderRadius: "8px",
                            background: qtyErr ? "#fff5f5" : "#f9fafb",
                            "& fieldset": { borderColor: qtyErr ? "#fca5a5" : "#e5e7eb" },
                            "&:hover fieldset": { borderColor: qtyErr ? "#f87171" : "#d1d5db" },
                          },
                          "& input": { py: "7px" },
                        }} />

                      {/* Delete — key fix: using onClick with the specific row id */}
                      <IconButton
                        size="small"
                        onClick={() => removeItem(row.id)}
                        disabled={items.length === 1}
                        sx={{
                          color: "#ef4444", border: "1px solid #fecaca",
                          borderRadius: "6px", width: 28, height: 28,
                          "&:hover": { background: "#fef2f2" },
                          "&.Mui-disabled": { color: "#d1d5db", borderColor: "#e5e7eb" },
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>

                    {/* Inline error hints */}
                    {(itemErr || qtyErr) && (
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 72px 88px 72px 32px", gap: "8px", mt: "2px" }}>
                        <Typography sx={{ fontSize: 10, color: "#ef4444" }}>{itemErr || ""}</Typography>
                        <Box /><Box />
                        <Typography sx={{ fontSize: 10, color: "#ef4444" }}>{qtyErr || ""}</Typography>
                        <Box />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Button onClick={addItem} startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              sx={{ mt: "10px", width: "100%", border: "1.5px dashed #bfdbfe", borderRadius: "8px", py: "8px",
                fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "none", background: "transparent",
                "&:hover": { background: "#eff6ff", borderColor: "#93c5fd" } }}>
              Add Item
            </Button>
          </Box>

          {/* Issue Value — updates live as qty changes */}
          <Box sx={{
            display: "flex", justifyContent: "flex-end", mb: "16px",
            p: "10px 16px", borderRadius: "10px",
            background: issueValue > 0 ? "#eff6ff" : "#f9fafb",
            border: `1px solid ${issueValue > 0 ? "#bfdbfe" : "#e5e7eb"}`,
            transition: "all 0.2s",
          }}>
            <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
              Issue Value:{" "}
              <span style={{ fontSize: 18, fontWeight: 800, color: issueValue > 0 ? "#2563eb" : "#111827" }}>
                ${issueValue.toFixed(2)}
              </span>
            </Typography>
          </Box>

          <Divider sx={{ mb: "16px" }} />

          {/* Remarks */}
          <Box>
            <FieldLabel>Remarks</FieldLabel>
            <TextField fullWidth multiline rows={3} placeholder="Any special instructions..."
              value={remarks} onChange={(e) => setRemarks(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { fontSize: 13, borderRadius: "8px", background: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" }, "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" } } }} />
          </Box>
        </DialogContent>

        {/* Footer */}
        <Box sx={{ px: "24px", py: "16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", background: "#fff", flexShrink: 0 }}>
          <Button onClick={handleClose}
            sx={{ fontSize: 13, fontWeight: 600, color: "#374151", textTransform: "none", borderRadius: "8px", px: "20px", py: "9px",
              border: "1px solid #e5e7eb", background: "#fff", "&:hover": { background: "#f9fafb" } }}>
            Cancel
          </Button>
          <Button onClick={handlePending} startIcon={<AccessTimeIcon sx={{ fontSize: 15 }} />}
            sx={{ fontSize: 13, fontWeight: 600, color: "#d97706", textTransform: "none", borderRadius: "8px", px: "20px", py: "9px",
              border: "1px solid #fde68a", background: "#fffbeb", "&:hover": { background: "#fef3c7" } }}>
            Pending Approval
          </Button>
          <Button onClick={handleIssue} startIcon={<AssignmentIcon sx={{ fontSize: 15 }} />}
            sx={{ fontSize: 13, fontWeight: 600, color: "#fff", textTransform: "none", borderRadius: "8px", px: "20px", py: "9px",
              background: "#2563eb", boxShadow: "0 2px 8px rgba(37,99,235,0.25)", "&:hover": { background: "#1d4ed8" } }}>
            Issue Now
          </Button>
        </Box>
      </Dialog>

      {/* Toast notification */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ fontSize: 13, borderRadius: "10px" }}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}