import { useState, useRef } from "react";
import {
  Box, Typography, Button, Dialog, DialogContent,
  TextField, MenuItem, Select, IconButton,
  Checkbox, FormControlLabel, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AddIcon from "@mui/icons-material/Add";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const CONDITIONS = ["Good — No Issues", "Short Delivery", "Damaged", "Cold Chain Breach", "Wrong Item"];
const LOCATIONS = ["CS-01", "CS-02", "CS-03", "Pharmacy Store", "ICU Store"];
const APPROVED_POS = ["PO-2026-0001", "PO-2026-0002", "PO-2026-0003", "PO-2026-0004"];
const ITEMS_LIST = [
  "Sodium Chloride 0.9% IV 1L", "Epinephrine 1mg/mL 10mL",
  "Amoxicillin 500mg Capsules", "Morphine Sulfate 10mg/mL", "Paracetamol 500mg Tabs",
];

// Fix: rcvQty starts as "" to avoid uncontrolled→controlled issue
const emptyLine = () => ({
  id: Date.now() + Math.random(),
  item: "",
  poQty: "",
  rcvQty: "",
  lotNo: "",
  expiry: "",
});

function DateField({ value, onChange }) {
  const ref = useRef(null);
  const openPicker = () => {
    try { ref.current?.showPicker(); } catch { ref.current?.click(); }
  };
  return (
    <Box
      onClick={openPicker}
      sx={{
        display: "flex", alignItems: "center", border: "1px solid #d1d5db",
        borderRadius: "6px", bgcolor: "#fff", px: 1, height: 34,
        cursor: "pointer", width: "100%",
        "&:hover": { borderColor: "#9ca3af" },
        "&:focus-within": { borderColor: "#6366f1", outline: "2px solid #ede9fe", outlineOffset: "-1px" },
        transition: "border-color 0.15s", boxSizing: "border-box",
      }}
    >
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none", outline: "none", background: "transparent",
          fontSize: 12, color: value ? "#111827" : "#9ca3af",
          flex: 1, cursor: "pointer", minWidth: 0, WebkitAppearance: "none",
          width: "100%",
        }}
      />
      <CalendarTodayOutlinedIcon
        sx={{ fontSize: 13, color: "#9ca3af", flexShrink: 0 }}
        onClick={(e) => { e.stopPropagation(); openPicker(); }}
      />
    </Box>
  );
}

const labelSx = {
  fontSize: 11, fontWeight: 700, color: "#6b7280",
  letterSpacing: "0.06em", textTransform: "uppercase",
  mb: 0.5, display: "block",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13, borderRadius: "6px", bgcolor: "#fff",
    "& fieldset": { borderColor: "#d1d5db" },
    "&:hover fieldset": { borderColor: "#9ca3af" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: "1.5px" },
  },
  "& .MuiInputBase-input": { py: "8px", px: "12px" },
  "& .MuiInputBase-input::placeholder": { color: "#9ca3af", opacity: 1 },
};

const disabledInputSx = {
  ...inputSx,
  "& .MuiOutlinedInput-root": {
    ...inputSx["& .MuiOutlinedInput-root"],
    bgcolor: "#f9fafb",
  },
};

const selectSx = {
  fontSize: 13, borderRadius: "6px",
  "& fieldset": { borderColor: "#d1d5db" },
  "&:hover fieldset": { borderColor: "#9ca3af" },
  "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: "1.5px" },
  "& .MuiSelect-select": { py: "8px", px: "12px" },
};

const smallSelectSx = {
  fontSize: 12, borderRadius: "6px",
  "& fieldset": { borderColor: "#d1d5db" },
  "&:hover fieldset": { borderColor: "#9ca3af" },
  "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  "& .MuiSelect-select": { py: "6px", px: "8px", fontSize: 12 },
};

const btnBase = {
  fontSize: 13, fontWeight: 600, textTransform: "none", borderRadius: "8px",
  px: "20px", py: "9px", outline: "none",
  "&:focus": { outline: "none" },
};

// Shared row field style — no spinners on number inputs
const rowFieldSx = (extraInput = {}) => ({
  "& .MuiOutlinedInput-root": {
    fontSize: 13, borderRadius: "6px", bgcolor: "#fff",
    "& fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
  "& .MuiInputBase-input": { py: "6px", px: "8px", ...extraInput },
  // Hide native number spinners
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
  "& input::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
});

export default function NewGRNDialog({ open, onClose, onSave, nextId }) {
  const today = new Date().toISOString().split("T")[0];

  const fresh = () => ({
    grnNumber: nextId || "GRN-2026-0006",
    linkedPO: "", supplier: "", receiptDate: today,
    receivedBy: "Sarah Anderson", deliveryNote: "",
    condition: "Good — No Issues", location: "",
    remarks: "", shipmentDate: "", supplierInvoice: "",
    tradingPartnerLicense: "", tsConfirmed: false,
  });

  const [form, setForm] = useState(fresh);
  const [lines, setLines] = useState([emptyLine()]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const addLine = () => setLines((l) => [...l, emptyLine()]);
  const removeLine = (id) => setLines((l) => l.filter((ln) => ln.id !== id));

  // Fix: use functional update to avoid stale closure issues
  const updateLine = (id, k, v) =>
    setLines((prev) => prev.map((ln) => (ln.id === id ? { ...ln, [k]: v } : ln)));

  const handlePOChange = (po) => {
    setField("linkedPO", po);
    const map = {
      "PO-2026-0001": "Cardinal Health",
      "PO-2026-0002": "Medline Industries",
      "PO-2026-0003": "McKesson Medical-Surgical",
      "PO-2026-0004": "McKesson Medical-Surgical",
    };
    setField("supplier", map[po] || "");
  };

  const buildGRN = (status) => ({
    id: form.grnNumber,
    linkedPO: form.linkedPO,
    supplier: form.supplier,
    location: form.location,
    items: lines.filter((l) => l.item).length || 1,
    totalValue: "$0.00",
    receivedBy: form.receivedBy,
    date: new Date(form.receiptDate).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
    condition: form.condition.startsWith("Good") ? "Good" : form.condition.split(" — ")[0],
    status,
  });

  const resetAndClose = () => {
    setForm(fresh());
    setLines([emptyLine()]);
    onClose();
  };

  const handleDraft = () => { onSave(buildGRN("Pending")); resetAndClose(); };

  const handleConfirm = () => {
    if (!form.linkedPO || !form.location) {
      alert("Please select a Linked PO and Location before confirming.");
      return;
    }
    onSave(buildGRN("Completed"));
    resetAndClose();
  };

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
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
            width: 38, height: 38, borderRadius: "10px", background: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LocalShippingOutlinedIcon sx={{ fontSize: 20, color: "#2563eb" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
              Goods Receipt Note
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>
              Record delivery against a PO — stock updates on save
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={resetAndClose}
          disableRipple
          sx={{
            color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: "8px",
            width: 30, height: 30, outline: "none",
            "&:hover": { background: "#f3f4f6", color: "#374151" },
            "&:focus": { outline: "none" },
          }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* ── Scrollable body ── */}
      <DialogContent sx={{
        px: "24px", py: "20px", overflowY: "auto", flex: 1,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
        "&::-webkit-scrollbar-thumb:hover": { background: "#a1a1aa" },
        scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent",
      }}>

        {/* Row 1 */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
          <Box>
            <Typography sx={labelSx}>GRN Number</Typography>
            <TextField
              fullWidth size="small" value={form.grnNumber} disabled
              sx={disabledInputSx} inputProps={{ style: { color: "#9ca3af" } }}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>
              Linked PO <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <Select
              fullWidth displayEmpty size="small"
              value={form.linkedPO}
              onChange={(e) => handlePOChange(e.target.value)}
              sx={selectSx}
              renderValue={(v) =>
                v ? v : <span style={{ color: "#9ca3af", fontSize: 13 }}>Select approved PO...</span>
              }
            >
              {APPROVED_POS.map((po) => (
                <MenuItem key={po} value={po} sx={{ fontSize: 13 }}>{po}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Row 2 */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
          <Box>
            <Typography sx={labelSx}>Supplier (Auto)</Typography>
            <TextField
              fullWidth size="small" value={form.supplier} disabled
              placeholder="Auto-filled from PO" sx={disabledInputSx}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Receipt Date</Typography>
            <DateField value={form.receiptDate} onChange={(v) => setField("receiptDate", v)} />
          </Box>
        </Box>

        {/* Row 3 */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
          <Box>
            <Typography sx={labelSx}>Received By</Typography>
            <TextField
              fullWidth size="small" value={form.receivedBy}
              onChange={(e) => setField("receivedBy", e.target.value)} sx={inputSx}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Delivery Note #</Typography>
            <TextField
              fullWidth size="small" value={form.deliveryNote}
              onChange={(e) => setField("deliveryNote", e.target.value)}
              placeholder="e.g. DN-2026-0482" sx={inputSx}
            />
          </Box>
        </Box>

        {/* Row 4 */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "20px" }}>
          <Box>
            <Typography sx={labelSx}>Condition</Typography>
            <Select
              fullWidth size="small" value={form.condition}
              onChange={(e) => setField("condition", e.target.value)} sx={selectSx}
            >
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>{c}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography sx={labelSx}>
              Store To (Location) <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <Select
              fullWidth displayEmpty size="small" value={form.location}
              onChange={(e) => setField("location", e.target.value)} sx={selectSx}
              renderValue={(v) =>
                v ? v : <span style={{ color: "#9ca3af", fontSize: 13 }}>Select...</span>
              }
            >
              {LOCATIONS.map((l) => (
                <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>{l}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Items Received */}
        <Box sx={{ mb: "16px" }}>
          <Typography sx={{
            fontSize: 12, fontWeight: 700, color: "#2563eb",
            letterSpacing: "0.05em", textTransform: "uppercase", mb: "12px",
          }}>
            Items Received
          </Typography>

          {/* Column headers — match grid below exactly */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0,2fr) 44px 58px 74px minmax(0,96px) 28px",
            gap: "6px", mb: "6px", px: "10px",
          }}>
            {["ITEM", "PO QTY", "RCV QTY", "LOT #", "EXPIRY", ""].map((h) => (
              <Typography key={h} sx={{
                fontSize: 10, fontWeight: 700, color: "#9ca3af",
                letterSpacing: "0.04em", textTransform: "uppercase",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {h}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {lines.map((line) => (
              <Box
                key={line.id}
                sx={{
                  display: "grid",
                  // Fix: exact same columns as header; expiry is minmax so it doesn't overflow
                  gridTemplateColumns: "minmax(0,2fr) 44px 58px 74px minmax(0,96px) 28px",
                  gap: "6px", alignItems: "center",
                  p: "10px", borderRadius: "8px",
                  border: "1px solid #e5e7eb", bgcolor: "#fff",
                  "&:hover": { borderColor: "#c7d2fe", bgcolor: "#f8f7ff" },
                  transition: "all 0.15s",
                }}
              >
                {/* ITEM — Fix: key forces fresh mount; onChange uses functional updateLine */}
                <Select
                  key={`item-select-${line.id}`}
                  fullWidth
                  displayEmpty
                  size="small"
                  value={line.item}
                  onChange={(e) => updateLine(line.id, "item", e.target.value)}
                  sx={smallSelectSx}
                  renderValue={(v) =>
                    v
                      ? <span style={{
                          fontSize: 12, color: "#111827",
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap", display: "block",
                        }}>{v}</span>
                      : <span style={{ color: "#9ca3af", fontSize: 12 }}>Select item...</span>
                  }
                >
                  {ITEMS_LIST.map((it) => (
                    <MenuItem key={it} value={it} sx={{ fontSize: 13 }}>{it}</MenuItem>
                  ))}
                </Select>

                {/* PO QTY — read-only placeholder */}
                <Box sx={{
                  height: 34, border: "1px solid #e5e7eb", borderRadius: "6px",
                  bgcolor: "#f3f4f6", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 13, color: "#9ca3af",
                }}>
                  —
                </Box>

                {/* RCV QTY — Fix: type="number" with spinner hidden via CSS */}
                <TextField
                  size="small"
                  type="number"
                  value={line.rcvQty}
                  onChange={(e) => updateLine(line.id, "rcvQty", e.target.value)}
                  inputProps={{ min: 0 }}
                  sx={rowFieldSx({ textAlign: "center" })}
                />

                {/* LOT # */}
                <TextField
                  size="small"
                  value={line.lotNo}
                  placeholder="Lot #"
                  onChange={(e) => updateLine(line.id, "lotNo", e.target.value)}
                  sx={rowFieldSx()}
                />

                {/* EXPIRY — Fix: wrapped in a Box with overflow:hidden so it never spills out */}
                <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                  <DateField
                    value={line.expiry}
                    onChange={(v) => updateLine(line.id, "expiry", v)}
                  />
                </Box>

                {/* REMOVE */}
                <IconButton
                  size="small"
                  onClick={() => removeLine(line.id)}
                  disabled={lines.length === 1}
                  sx={{
                    color: "#ef4444", border: "1px solid #fca5a5",
                    borderRadius: "6px", width: 28, height: 28, bgcolor: "#fff",
                    outline: "none", flexShrink: 0,
                    "&:hover": { bgcolor: "#fef2f2" },
                    "&:focus": { outline: "none" },
                    "&.Mui-disabled": { borderColor: "#e5e7eb", color: "#d1d5db" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Button
            onClick={addLine}
            fullWidth
            disableRipple
            sx={{
              mt: "10px", border: "1.5px dashed #bfdbfe", borderRadius: "8px", py: "8px",
              fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "none",
              background: "transparent", outline: "none",
              "&:hover": { background: "#eff6ff", borderColor: "#93c5fd" },
              "&:focus": { outline: "none" },
            }}
          >
            <AddIcon sx={{ fontSize: 14, mr: 0.5 }} /> Add Line
          </Button>

          <Box sx={{
            display: "flex", justifyContent: "flex-end", alignItems: "center",
            mt: "12px", pt: "12px", borderTop: "1px dashed #e5e7eb",
          }}>
            <Typography sx={{ fontSize: 13, color: "#6b7280", mr: 1 }}>
              Total Received Value:
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
              $0.00
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: "16px" }} />

        {/* Remarks */}
        <Box sx={{ mb: "16px" }}>
          <Typography sx={labelSx}>Remarks / Discrepancy Notes</Typography>
          <TextField
            fullWidth multiline rows={3} size="small" value={form.remarks}
            onChange={(e) => setField("remarks", e.target.value)}
            placeholder="Note short shipments, damage, cold-chain issues..."
            sx={{ ...inputSx, "& .MuiInputBase-input": { py: "8px", px: "12px", fontSize: 13 } }}
          />
        </Box>

        {/* DSCSA */}
        <Box>
          <Typography sx={{ ...labelSx, color: "#2563eb", mb: "12px" }}>
            DSCSA Transaction Information (TI) — Required
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", mb: "16px" }}>
            <Box>
              <Typography sx={labelSx}>Shipment Date</Typography>
              <DateField value={form.shipmentDate} onChange={(v) => setField("shipmentDate", v)} />
            </Box>
            <Box>
              <Typography sx={labelSx}>Supplier Invoice No.</Typography>
              <TextField
                fullWidth size="small" value={form.supplierInvoice}
                onChange={(e) => setField("supplierInvoice", e.target.value)}
                placeholder="e.g. INV-2026-0482" sx={inputSx}
              />
            </Box>
          </Box>
          <Box sx={{ mb: "16px" }}>
            <Typography sx={labelSx}>Trading Partner License / DEA No.</Typography>
            <TextField
              fullWidth size="small" value={form.tradingPartnerLicense}
              onChange={(e) => setField("tradingPartnerLicense", e.target.value)}
              placeholder="e.g. DEA Lic. BA1234567 or State Lic." sx={inputSx}
            />
          </Box>
          <Box sx={{ p: 2, border: "1px solid #e0e7ff", borderRadius: "10px", bgcolor: "#f5f3ff" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.tsConfirmed}
                  onChange={(e) => setField("tsConfirmed", e.target.checked)}
                  size="small"
                  sx={{ color: "#c4b5fd", pt: 0, "&.Mui-checked": { color: "#6366f1" } }}
                />
              }
              label={
                <Typography sx={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
                  I confirm this Transaction Statement (TS): The entity transferring ownership is an
                  authorised trading partner, is not known to deal in suspect or illegitimate product,
                  and the product has been handled in a compliant manner.{" "}
                  <em style={{ color: "#9ca3af" }}>(DSCSA §582(c)(4))</em>
                </Typography>
              }
              sx={{ alignItems: "flex-start", m: 0 }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <Box sx={{
        px: "24px", py: "16px", borderTop: "1px solid #f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        gap: "10px", bgcolor: "#fff", flexShrink: 0,
      }}>
        <Button
          onClick={resetAndClose}
          disableRipple
          sx={{ ...btnBase, color: "#374151", border: "1px solid #e5e7eb", bgcolor: "#fff", "&:hover": { bgcolor: "#f9fafb" } }}
        >
          Cancel
        </Button>
        <Button
          startIcon={<BookmarkBorderIcon sx={{ fontSize: 15 }} />}
          onClick={handleDraft}
          disableRipple
          sx={{ ...btnBase, color: "#374151", border: "1px solid #e5e7eb", bgcolor: "#fff", "&:hover": { bgcolor: "#f9fafb" } }}
        >
          Draft
        </Button>
        <Button
          startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 15 }} />}
          onClick={handleConfirm}
          disableRipple
          sx={{
            ...btnBase, fontWeight: 700, color: "#fff", bgcolor: "#10b981",
            boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
            "&:hover": { bgcolor: "#059669" },
          }}
        >
          Confirm & Update Stock
        </Button>
      </Box>
    </Dialog>
  );
}