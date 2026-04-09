import { useState } from "react";
import {
  Box, Typography, Button, IconButton, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Chip, Modal, Divider as MuiDivider,
  TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel,
  Paper,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

// ─── Data ────────────────────────────────────────────────────────────────────

const today = new Date("2026-03-30");

const calcDaysLeft = (dateStr) => {
  const d = new Date(dateStr);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const initialItems = [
  { id: 1, item: "Sodium Chloride 0.9% IV 1L", ndc: "0338-0049-04", location: "CS-01", locationFull: "Central Store", lot: "NS2023F", qty: 12, expiry: "2026-01-31" },
  { id: 2, item: "Morphine Sulfate 10mg/mL", ndc: "0641-6083-25", location: "CS-01", locationFull: "Central Store", lot: "MS24C", qty: 18, expiry: "2026-04-15" },
  { id: 3, item: "Morphine Sulfate 10mg/mL", ndc: "0641-6083-25", location: "PH-01", locationFull: "Pharmacy", lot: "MS24C", qty: 12, expiry: "2026-04-15" },
  { id: 4, item: "Lidocaine 1% 20mL Vial", ndc: "0409-4277-01", location: "OR-01", locationFull: "Operating Room", lot: "LI24A", qty: 24, expiry: "2026-05-10" },
];

const getStatus = (days) => {
  if (days < 0) return "Expired";
  if (days <= 60) return "Expiring Soon";
  return "OK";
};

const SUPPLIERS = ["Select...", "MedSupply Co.", "PharmaDirect", "GlobalMed", "HealthCore Ltd.", "BioPharm Inc."];
const URGENCY_OPTIONS = ["Critical — Within 24h", "High — Within 48h", "Medium — Within 1 week", "Low — No rush"];
const THERAPEUTIC_EQ = ["AB-Rated — Bioequivalent", "Therapeutically Equivalent", "Partial — Physician Approval Required", "Emergency Substitute Only"];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }) {
  return (
    <Box sx={{ flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb", borderLeft: `3px solid ${color}`, borderRadius: "10px", p: "12px 16px", minWidth: 0 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 11, fontWeight: 600, color, mt: 0.4 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

// ─── Field Label ──────────────────────────────────────────────────────────────

const SecLabel = ({ text }) => (
  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase", mb: 1.5, mt: 0.5 }}>
    {text}
  </Typography>
);

const FLabel = ({ text }) => (
  <Typography component="label" sx={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.75 }}>
    {text}
  </Typography>
);

// ─── Shared input sx ─────────────────────────────────────────────────────────

const inputSx = {
  width: "100%",
  "& .MuiInputBase-root": { fontSize: 13, borderRadius: "8px", bgcolor: "#f8fafc", color: "#0f172a" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
  "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
};

const autoSx = {
  ...inputSx,
  "& .MuiInputBase-root": { fontSize: 13, borderRadius: "8px", bgcolor: "#f1f5f9", color: "#374151" },
};

// ─── Location badge colors ────────────────────────────────────────────────────

const locColor = (loc) => {
  const map = {
    "CS-01": { bg: "#ede9fe", color: "#6d28d9" },
    "PH-01": { bg: "#dcfce7", color: "#166534" },
    "OR-01": { bg: "#ffedd5", color: "#c2410c" },
    "WA-01": { bg: "#dbeafe", color: "#1e40af" },
    "WA-02": { bg: "#fce7f3", color: "#9d174d" },
  };
  return map[loc] || { bg: "#f3f4f6", color: "#374151" };
};

// ─── Replace Modal ────────────────────────────────────────────────────────────

function ReplaceModal({ prefill, onClose, onSubmit }) {
  const [form, setForm] = useState({
    item: prefill ? `${prefill.item} — ${prefill.location}` : "",
    currentQty: prefill ? String(prefill.qty) : "",
    location: prefill ? prefill.locationFull : "",
    reason: "Expired",
    urgency: "Critical — Within 24h",
    disposed: "",
    replaceQty: "",
    useSubstitute: false,
    substitute: "",
    substituteNDC: "",
    therapeuticEq: "AB-Rated — Bioequivalent",
    supplier: "Select...",
    unitCost: "",
    notes: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = (raisePO) => {
    if (!form.item || !form.replaceQty) return;
    onSubmit({ ...form, raisePO });
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Box sx={{ bgcolor: "#fff", borderRadius: "16px", width: "100%", maxWidth: 560, boxShadow: "0 24px 64px rgba(0,0,0,0.20)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ p: "20px 24px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: "10px", bgcolor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SyncAltOutlinedIcon sx={{ fontSize: 18, color: "#2563eb" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Raise Replacement Request</Typography>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.1 }}>Flag item for replacement</Typography>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ border: "1.5px solid #e2e8f0", borderRadius: "8px", width: 32, height: 32, color: "#64748b" }}>
              <CloseOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: "20px 24px", overflowY: "auto", flex: 1, "&::-webkit-scrollbar": { width: 5 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#e2e8f0", borderRadius: 99 } }}>
            <SecLabel text="Item Being Replaced" />

            <Box sx={{ mb: 1.75 }}>
              <FLabel text="Select Item *" />
              <TextField size="small" value={form.item} onChange={(e) => set("item", e.target.value)} disabled={!!prefill} placeholder="Select item..." sx={prefill ? autoSx : inputSx} />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75, mb: 1.75 }}>
              <Box>
                <FLabel text="Current QTY (Auto)" />
                <TextField size="small" value={form.currentQty} disabled sx={autoSx} />
              </Box>
              <Box>
                <FLabel text="Location (Auto)" />
                <TextField size="small" value={form.location} disabled sx={autoSx} />
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75, mb: 1.75 }}>
              <Box>
                <FLabel text="Replacement Reason *" />
                <FormControl size="small" sx={{ width: "100%" }}>
                  <Select value={form.reason} onChange={(e) => set("reason", e.target.value)} sx={{ fontSize: 13, borderRadius: "8px", bgcolor: "#f8fafc" }}>
                    {["Expired", "Low Stock", "Recalled", "Damaged"].map((r) => <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>{r}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FLabel text="Urgency *" />
                <FormControl size="small" sx={{ width: "100%" }}>
                  <Select value={form.urgency} onChange={(e) => set("urgency", e.target.value)} sx={{ fontSize: 13, borderRadius: "8px", bgcolor: "#f8fafc" }}>
                    {URGENCY_OPTIONS.map((u) => <MenuItem key={u} value={u} sx={{ fontSize: 13 }}>{u}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
              <Box>
                <FLabel text="QTY Disposed / Removed" />
                <TextField size="small" type="number" value={form.disposed} onChange={(e) => set("disposed", e.target.value)} placeholder="0" sx={inputSx} />
              </Box>
              <Box>
                <FLabel text="QTY to Replace *" />
                <TextField size="small" type="number" value={form.replaceQty} onChange={(e) => set("replaceQty", e.target.value)} placeholder="0" sx={inputSx} />
              </Box>
            </Box>

            <MuiDivider sx={{ my: 2.25 }} />
            <SecLabel text="Substitute Item (If Different)" />

            <FormControlLabel
              control={<Checkbox checked={form.useSubstitute} onChange={(e) => set("useSubstitute", e.target.checked)} size="small" sx={{ color: "#2563eb", "&.Mui-checked": { color: "#2563eb" } }} />}
              label={<Typography sx={{ fontSize: 13, color: "#374151" }}>Use a substitute / alternative item</Typography>}
              sx={{ mb: form.useSubstitute ? 1.75 : 0 }}
            />

            {form.useSubstitute && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
                  <Box>
                    <FLabel text="Substitute Name" />
                    <TextField size="small" value={form.substitute} onChange={(e) => set("substitute", e.target.value)} placeholder="e.g. Generic Amox 500mg" sx={inputSx} />
                  </Box>
                  <Box>
                    <FLabel text="Substitute NDC" />
                    <TextField size="small" value={form.substituteNDC} onChange={(e) => set("substituteNDC", e.target.value)} placeholder="0378-0255-01" sx={inputSx} />
                  </Box>
                </Box>
                <Box>
                  <FLabel text="Therapeutic Equivalence" />
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <Select value={form.therapeuticEq} onChange={(e) => set("therapeuticEq", e.target.value)} sx={{ fontSize: 13, borderRadius: "8px", bgcolor: "#f8fafc" }}>
                      {THERAPEUTIC_EQ.map((o) => <MenuItem key={o} value={o} sx={{ fontSize: 13 }}>{o}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}

            <MuiDivider sx={{ my: 2.25 }} />
            <SecLabel text="Procurement" />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75, mb: 1.75 }}>
              <Box>
                <FLabel text="Preferred Supplier" />
                <FormControl size="small" sx={{ width: "100%" }}>
                  <Select value={form.supplier} onChange={(e) => set("supplier", e.target.value)} sx={{ fontSize: 13, borderRadius: "8px", bgcolor: "#f8fafc" }}>
                    {SUPPLIERS.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FLabel text="Est. Unit Cost" />
                <TextField size="small" type="number" value={form.unitCost} onChange={(e) => set("unitCost", e.target.value)} placeholder="0.00" sx={inputSx} />
              </Box>
            </Box>

            <FLabel text="Clinical Notes / Justification" />
            <TextField multiline rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Reason, approval obtained, protocol followed..." sx={{ ...inputSx, "& .MuiInputBase-root": { fontSize: 13, borderRadius: "8px", bgcolor: "#f8fafc", color: "#0f172a", lineHeight: 1.6 } }} />
          </Box>

          {/* Footer */}
          <Box sx={{ p: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 1.25, justifyContent: "flex-end", alignItems: "center" }}>
            <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, color: "#374151", borderColor: "#e2e8f0", borderRadius: "8px", "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" } }}>
              Cancel
            </Button>
            <Button onClick={() => handleSave(false)} variant="outlined" startIcon={<SaveOutlinedIcon sx={{ fontSize: "14px !important" }} />} sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, color: "#374151", borderColor: "#e2e8f0", borderRadius: "8px", "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" } }}>
              Save Open
            </Button>
            <Button onClick={() => handleSave(true)} variant="contained" startIcon={<SyncAltOutlinedIcon sx={{ fontSize: "14px !important" }} />} sx={{ textTransform: "none", fontSize: 13, fontWeight: 700, bgcolor: "#2563eb", borderRadius: "8px", boxShadow: "0 2px 8px rgba(37,99,235,0.3)", "&:hover": { bgcolor: "#1d4ed8" } }}>
              Save &amp; Raise PO
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

// ─── Dispose Confirm Modal ────────────────────────────────────────────────────

function DisposeModal({ item, onClose, onConfirm }) {
  return (
    <Modal open onClose={onClose}>
      <Box sx={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Box sx={{ bgcolor: "#fff", borderRadius: "16px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.20)", p: 3.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <DeleteOutlineOutlinedIcon sx={{ fontSize: 18, color: "#ef4444" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Confirm Disposal</Typography>
              <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>This action cannot be undone</Typography>
            </Box>
          </Box>
          <Box sx={{ bgcolor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", p: "12px 14px", mb: 2.5, fontSize: 13, color: "#374151" }}>
            <Typography sx={{ fontSize: 13, color: "#374151" }}>
              Mark <strong>{item.item}</strong> (Lot: {item.lot}, Qty: {item.qty}) at <strong>{item.location}</strong> as disposed?
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.25, justifyContent: "flex-end" }}>
            <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, color: "#374151", borderColor: "#e2e8f0", borderRadius: "8px", "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" } }}>
              Cancel
            </Button>
            <Button onClick={() => onConfirm(item.id)} variant="contained" sx={{ textTransform: "none", fontSize: 13, fontWeight: 700, bgcolor: "#ef4444", borderRadius: "8px", "&:hover": { bgcolor: "#dc2626" }, boxShadow: "none" }}>
              Dispose
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExpiryTracking() {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState("All");
  const [replaceTarget, setReplaceTarget] = useState(null);
  const [disposeTarget, setDisposeTarget] = useState(null);

  const enriched = items.map((it) => {
    const days = calcDaysLeft(it.expiry);
    return { ...it, days, status: getStatus(days) };
  });

  const expired      = enriched.filter((i) => i.status === "Expired");
  const expiringSoon = enriched.filter((i) => i.status === "Expiring Soon");
  const ok           = enriched.filter((i) => i.status === "OK");

  const displayed =
    filter === "Expired"       ? expired :
    filter === "Expiring Soon" ? expiringSoon :
    enriched;

  const handleDispose = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDisposeTarget(null);
  };

  const handleExport = () => {
    const headers = ["Item", "NDC", "Location", "Lot #", "QTY", "Expiry Date", "Days Left", "Status"];
    const rows = displayed.map((r) => [
      r.item, r.ndc, r.location, r.lot, r.qty,
      formatDate(r.expiry),
      r.days < 0 ? `${Math.abs(r.days)}d ago` : `${r.days}d`,
      r.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "expiry_tracking.csv";
    a.click();
  };

  const daysDisplay = (days) => {
    if (days < 0)   return { label: `${Math.abs(days)}d ago`, color: "#ef4444", bg: "#fee2e2" };
    if (days <= 60) return { label: `${days}d`,               color: "#d97706", bg: "#fef3c7" };
    return               { label: `${days}d`,               color: "#16a34a", bg: "#dcfce7" };
  };

  const statusChip = (status) => {
    if (status === "Expired")       return { label: "Expired",       bg: "#fee2e2", color: "#ef4444", border: "#fecaca" };
    if (status === "Expiring Soon") return { label: "Expiring Soon", bg: "#fef9c3", color: "#d97706", border: "#fde68a" };
    return                               { label: "OK",             bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
  };

  const filters = [
    { label: "All",           dot: null },
    { label: "Expired",       dot: "#ef4444" },
    { label: "Expiring Soon", dot: "#d97706" },
  ];

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: "22px 20px" }}>
      {replaceTarget && <ReplaceModal prefill={replaceTarget} onClose={() => setReplaceTarget(null)} onSubmit={() => setReplaceTarget(null)} />}
      {disposeTarget && <DisposeModal item={disposeTarget} onClose={() => setDisposeTarget(null)} onConfirm={handleDispose} />}

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Expiry Tracking</Typography>
          <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
            <Box component="span" sx={{ color: "#ef4444", fontWeight: 600 }}>{expired.length} expired</Box>
            <Box component="span" sx={{ mx: 0.75 }}>·</Box>
            <Box component="span" sx={{ color: "#d97706", fontWeight: 600 }}>{expiringSoon.length} expiring within 60 days</Box>
          </Typography>
        </Box>
        <Button
          onClick={handleExport}
          startIcon={<DownloadOutlinedIcon sx={{ fontSize: "14px !important" }} />}
          variant="outlined"
          sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, color: "#374151", borderColor: "#e2e8f0", borderRadius: "9px", bgcolor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" } }}
        >
          Export
        </Button>
      </Box>

      {/* Stat Cards */}
    <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
  <Box sx={{ flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", px: 2, py: 1.5 }}>
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>
      Expired
    </Typography>
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
        {expired.length}
      </Typography>
      <Typography sx={{ fontSize: 11, color: "#6b7280" }}>
        Must be disposed immediately
      </Typography>
    </Box>
  </Box>

  <Box sx={{ flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", px: 2, py: 1.5 }}>
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>
      Expiring ≤ 60 Days
    </Typography>
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
        {expiringSoon.length}
      </Typography>
      <Typography sx={{ fontSize: 11, color: "#6b7280" }}>
        Plan replacement now
      </Typography>
    </Box>
  </Box>

  <Box sx={{ flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", px: 2, py: 1.5 }}>
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>
      OK
    </Typography>
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
        {ok.length}
      </Typography>
      <Typography sx={{ fontSize: 11, color: "#6b7280" }}>
        No immediate concern
      </Typography>
    </Box>
  </Box>
</Box>

      {/* Filter tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 2.5 }}>
        {filters.map(({ label, dot }) => (
          <Button
            key={label}
            onClick={() => setFilter(label)}
            sx={{
              textTransform: "none", fontSize: 13, fontWeight: filter === label ? 700 : 500,
              color: filter === label ? "#2563eb" : "#374151",
              bgcolor: filter === label ? "#f0f9ff" : "#fff",
              border: "1.5px solid", borderColor: filter === label ? "#2563eb" : "#e2e8f0",
              borderRadius: "99px", px: 2, py: 0.75, gap: 0.75,
              "&:hover": { bgcolor: filter === label ? "#f0f9ff" : "#f1f5f9" },
            }}
          >
            {dot && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: dot, flexShrink: 0 }} />}
            {label}
          </Button>
        ))}
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <TableContainer>
          <Table sx={{ tableLayout: "fixed", minWidth: 900 }}>
            <colgroup>
              <col style={{ width: "22%" }} /><col style={{ width: "11%" }} />
              <col style={{ width: "7%" }}  /><col style={{ width: "7%" }} />
              <col style={{ width: "5%" }}  /><col style={{ width: "10%" }} />
              <col style={{ width: "8%" }}  /><col style={{ width: "12%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                {["Item", "NDC", "Location", "Lot #", "QTY", "Expiry Date", "Days Left", "Status", "Action"].map((h) => (
                  <TableCell key={h} sx={{ py: "11px", px: "10px", fontSize: 10.5, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", fontWeight: 600, borderBottom: "none" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ py: 6, textAlign: "center", color: "#94a3b8", fontSize: 14, border: "none" }}>
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((row, i) => {
                  const dl = daysDisplay(row.days);
                  const sc = statusChip(row.status);
                  const lc = locColor(row.location);
                  const isExpired = row.status === "Expired";
                  return (
                    <TableRow key={row.id} sx={{ borderBottom: i < displayed.length - 1 ? "1px solid #f1f5f9" : "none", "&:hover td": { bgcolor: "#f8faff" } }}>
                      <TableCell sx={{ py: "11px", px: "10px", border: "none" }}>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.item}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", fontSize: 11.5, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", border: "none" }}>{row.ndc}</TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", border: "none" }}>
                        <Chip label={row.location} size="small" sx={{ bgcolor: lc.bg, color: lc.color, fontWeight: 700, fontSize: 11, height: 22, borderRadius: "5px" }} />
                      </TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", border: "none" }}>{row.lot}</TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", fontSize: 12.5, fontWeight: 600, color: "#0f172a", textAlign: "center", border: "none" }}>{row.qty}</TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", border: "none" }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: isExpired ? "#ef4444" : row.days <= 60 ? "#d97706" : "#374151", whiteSpace: "nowrap", textDecoration: isExpired ? "line-through" : "none" }}>
                          {formatDate(row.expiry)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", border: "none" }}>
                        <Chip label={dl.label} size="small" sx={{ bgcolor: dl.bg, color: dl.color, fontWeight: 700, fontSize: 11, height: 22, borderRadius: "5px" }} />
                      </TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", border: "none" }}>
                        <Chip label={sc.label} size="small" variant="outlined" sx={{ bgcolor: sc.bg, color: sc.color, borderColor: sc.border, fontWeight: 700, fontSize: 11, height: 22, borderRadius: "5px" }} />
                      </TableCell>
                      <TableCell sx={{ py: "11px", px: "10px", border: "none" }}>
                        <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
                          {isExpired && (
                            <Button onClick={() => setDisposeTarget(row)} size="small" variant="outlined" sx={{ textTransform: "none", fontSize: 11, fontWeight: 700, color: "#ef4444", borderColor: "#fecaca", borderRadius: "7px", px: 1.25, py: 0.5, minWidth: 0, "&:hover": { bgcolor: "#fef2f2", borderColor: "#ef4444" } }}>
                              Dispose
                            </Button>
                          )}
                          <Button onClick={() => setReplaceTarget(row)} size="small" startIcon={<SyncAltOutlinedIcon sx={{ fontSize: "11px !important" }} />} sx={{ textTransform: "none", fontSize: 11, fontWeight: 700, color: "#1d4ed8", bgcolor: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "7px", px: 1.25, py: 0.5, minWidth: 0, "&:hover": { bgcolor: "#dbeafe" } }}>
                            Replace
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      
      </Paper>
    </Box>
  );
}