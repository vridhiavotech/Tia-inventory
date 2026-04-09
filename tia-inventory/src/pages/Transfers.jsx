import { useState, useEffect } from "react";
import CreateTransferModal from "./InventoryItems/CreateTransferModal";
import {
  Box, Typography, Button, IconButton, Paper,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Chip as MuiChip, Snackbar, Alert, Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const STORAGE_KEY = "tiatele_transfers";

const loadTransfers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saveTransfers = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const seedTransfers = [
  {
    id: "TRF-2026-0003",
    from: "CS-01", fromLabel: "Central Store",
    to: "ICU-01",  toLabel: "ICU",
    items: [{ item: "Amoxicillin 500mg", qty: 20 }, { item: "NS 0.9% IV 1L", qty: 10 }],
    itemsLabel: "Amoxicillin 500mg ×20, NS 0.9% IV 1L ×10",
    priority: "Urgent", notes: "ICU running low", by: "Sarah Anderson",
    date: "Mar 19, 2026", status: "Pending",
  },
  {
    id: "TRF-2026-0002",
    from: "CS-01", fromLabel: "Central Store",
    to: "PH-01",  toLabel: "Pharmacy",
    items: [{ item: "Morphine Sulfate 10mg/mL", qty: 5 }],
    itemsLabel: "Morphine Sulfate 10mg/mL ×5",
    priority: "Normal", notes: "Monthly resupply", by: "P. Chen",
    date: "Mar 17, 2026", status: "Completed",
  },
  {
    id: "TRF-2026-0001",
    from: "CS-01", fromLabel: "Central Store",
    to: "OR-01",  toLabel: "OR / Surgery",
    items: [{ item: "Lidocaine 1% 20mL", qty: 10 }],
    itemsLabel: "Lidocaine 1% 20mL ×10",
    priority: "Normal", notes: "OR prep", by: "T. Williams",
    date: "Mar 15, 2026", status: "Completed",
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        px: 2,
        py: 1.5,
        minWidth: 0,
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: "#9ca3af",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      {/* Value + Subtitle inline */}
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

// ─── Badge helpers ────────────────────────────────────────────────────────────
const locColor = (code) => {
  const map = {
    "CS-01":  { bg: "#ede9fe", color: "#6d28d9", border: "#ddd6fe" },
    "PH-01":  { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "IC-01":  { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "ICU-01": { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "OR-01":  { bg: "#ffedd5", color: "#c2410c", border: "#fed7aa" },
    "WA-01":  { bg: "#fce7f3", color: "#9d174d", border: "#fbcfe8" },
    "WA-02":  { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
    "EM-01":  { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
    "SU-01":  { bg: "#ffedd5", color: "#c2410c", border: "#fed7aa" },
    "LA-01":  { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" },
    "OP-01":  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    "MA-01":  { bg: "#fdf4ff", color: "#86198f", border: "#f0abfc" },
  };
  return map[code] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

const priorityStyle = (p) => {
  if (p === "Urgent")   return { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" };
  if (p === "Critical") return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
  return { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };
};

const statusStyle = (s) => {
  if (s === "Pending")   return { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" };
  if (s === "Completed") return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
  if (s === "Rejected")  return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
  return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

const StyledChip = ({ label, style }) => (
  <MuiChip
    label={label}
    size="small"
    variant="outlined"
    sx={{
      bgcolor: style.bg, color: style.color, borderColor: style.border,
      fontWeight: 700, fontSize: 12, height: 24, borderRadius: "99px",
      borderWidth: "1.5px",
    }}
  />
);

// ─── View Transfer Modal ──────────────────────────────────────────────────────
function ViewTransferModal({ transfer, onClose }) {
  const lf = locColor(transfer.from);
  const lt = locColor(transfer.to);
  const ps = priorityStyle(transfer.priority);
  const ss = statusStyle(transfer.status);

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Box sx={{ bgcolor: "#fff", borderRadius: "18px", width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}>
          {/* Header */}
          <Box sx={{ p: "20px 24px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{transfer.id}</Typography>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.25 }}>{transfer.date} · by {transfer.by}</Typography>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ border: "2px solid #cbd5e1", borderRadius: "8px", width: 36, height: 36, bgcolor: "#f8fafc", color: "#0f172a" }}>
              <CloseOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: "20px 24px" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
              {[
                { heading: "From", code: transfer.from, label: transfer.fromLabel, lc: lf },
                { heading: "To",   code: transfer.to,   label: transfer.toLabel,   lc: lt },
              ].map(({ heading, code, label, lc }) => (
                <Box key={heading}>
                  <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.75 }}>{heading}</Typography>
                  <MuiChip label={code} size="small" variant="outlined" sx={{ bgcolor: lc.bg, color: lc.color, borderColor: lc.border, fontWeight: 700, fontSize: 12, height: 24, borderRadius: "6px", borderWidth: "1.5px" }} />
                  <Typography sx={{ fontSize: 12, color: "#64748b", mt: 0.5 }}>{label}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ mb: 1.75 }}>
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 1 }}>Items</Typography>
              {transfer.items.map((it, i) => (
                <Box key={i} sx={{ display: "flex", justifyContent: "space-between", p: "8px 12px", bgcolor: "#f8fafc", borderRadius: "8px", mb: 0.75 }}>
                  <Typography sx={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{it.item}</Typography>
                  <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>×{it.qty}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.75 }}>Priority</Typography>
                <StyledChip label={transfer.priority} style={ps} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.75 }}>Status</Typography>
                <StyledChip label={transfer.status} style={ss} />
              </Box>
            </Box>

            {transfer.notes && transfer.notes !== "—" && (
              <Box sx={{ mt: 1.75, p: "10px 14px", bgcolor: "#f8fafc", borderRadius: "8px" }}>
                <Typography sx={{ fontSize: 13, color: "#374151" }}>
                  <Box component="span" sx={{ fontWeight: 600, color: "#64748b" }}>Notes: </Box>
                  {transfer.notes}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ p: "14px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, color: "#374151", borderColor: "#e2e8f0", borderRadius: "8px", "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" } }}>
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Transfers() {
  const [transfers, setTransfers] = useState(() => loadTransfers() ?? seedTransfers);
  const [showCreate, setShowCreate] = useState(false);
  const [viewItem,   setViewItem]   = useState(null);
  const [toast,      setToast]      = useState(null);

  useEffect(() => {
    saveTransfers(transfers);
  }, [transfers]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setTransfers((prev) => prev.map((t) => t.id === id ? { ...t, status: "Completed" } : t));
    showToast(`${id} approved and completed.`);
  };

  const handleReject = (id) => {
    setTransfers((prev) => prev.map((t) => t.id === id ? { ...t, status: "Rejected" } : t));
    showToast(`${id} rejected.`, "error");
  };

  const handleCreate = (newTransfer) => {
    setTransfers((prev) => [newTransfer, ...prev]);
    showToast(`${newTransfer.id} created successfully.`);
  };

  const total     = transfers.length;
  const pending   = transfers.filter((t) => t.status === "Pending").length;
  const completed = transfers.filter((t) => t.status === "Completed").length;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: "28px" }}>
      {/* Toast */}
      <Snackbar open={!!toast} anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ mt: 1 }}>
        <Alert
          severity={toast?.type === "error" ? "error" : "success"}
          variant="outlined"
          sx={{ fontSize: 13, fontWeight: 600, borderRadius: "10px", bgcolor: toast?.type === "error" ? "#fee2e2" : "#dcfce7", borderColor: toast?.type === "error" ? "#fecaca" : "#bbf7d0", color: toast?.type === "error" ? "#991b1b" : "#166534", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>

      <CreateTransferModal open={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} prefillItem={null} />
      {viewItem && <ViewTransferModal transfer={viewItem} onClose={() => setViewItem(null)} />}

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3.25 }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Stock Transfers</Typography>
          <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 0.5 }}>
            Inter-location stock movements —{" "}
            <Box component="span" sx={{ color: "#d97706", fontWeight: 600 }}>{pending} pending approval</Box>
          </Typography>
        </Box>
        <Button
          onClick={() => setShowCreate(true)}
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: "15px !important" }} />}
          sx={{ textTransform: "none", fontSize: 13.5, fontWeight: 700, bgcolor: "#2563eb", borderRadius: "10px", px: 2.5, py: 1.25, letterSpacing: "0.01em", boxShadow: "none", "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" } }}
        >
          New Transfer
        </Button>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
        <StatCard label="Total Transfers" value={total}     color="#f59e0b" sub="All transfers" />
        <StatCard label="Pending"         value={pending}   color="#8b5cf6" sub="Awaiting approval" />
        <StatCard label="Completed"       value={completed} color="#10b981" sub="Successfully moved" />
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: "14px", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch", "&::-webkit-scrollbar": { height: 5 }, "&::-webkit-scrollbar-track": { bgcolor: "#f1f5f9" }, "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 99 }, "&::-webkit-scrollbar-thumb:hover": { bgcolor: "#94a3b8" } }}>
          <Table sx={{ minWidth: 900, borderCollapse: "collapse" }}>
            <colgroup>
              <col style={{ minWidth: 120 }} /><col style={{ minWidth: 100 }} />
              <col style={{ minWidth: 100 }} /><col style={{ minWidth: 180 }} />
              <col style={{ minWidth: 80 }}  /><col style={{ minWidth: 110 }} />
              <col style={{ minWidth: 110 }} /><col style={{ minWidth: 100 }} />
              <col style={{ minWidth: 90 }}  /><col style={{ minWidth: 110 }} />
            </colgroup>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                {["Transfer #", "From", "To", "Items", "Priority", "Notes", "By", "Date", "Status", "Actions"].map((h) => (
                  <TableCell key={h} sx={{ py: "11px", px: "8px", fontSize: 10.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", borderBottom: "none" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ py: 6, textAlign: "center", color: "#94a3b8", fontSize: 14, border: "none" }}>
                    No transfers found.
                  </TableCell>
                </TableRow>
              ) : (
                transfers.map((row, i) => {
                  const lf = locColor(row.from);
                  const lt = locColor(row.to);
                  const ps = priorityStyle(row.priority);
                  const ss = statusStyle(row.status);
                  const isPending = row.status === "Pending";
                  return (
                    <TableRow key={row.id} sx={{ borderBottom: i < transfers.length - 1 ? "1px solid #f1f5f9" : "none", "&:hover td": { bgcolor: "#f8faff" } }}>
                      <TableCell sx={{ py: "12px", px: "8px", border: "none" }}>
                        <Typography onClick={() => setViewItem(row)} sx={{ fontSize: 12, fontWeight: 700, color: "#0e7490", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                          {row.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", border: "none" }}>
                        <MuiChip label={row.from} size="small" variant="outlined" sx={{ bgcolor: lf.bg, color: lf.color, borderColor: lf.border, fontWeight: 700, fontSize: 11, height: 22, borderRadius: "6px", borderWidth: "1.5px", mb: 0.4 }} />
                        <Typography sx={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.fromLabel}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", border: "none" }}>
                        <MuiChip label={row.to} size="small" variant="outlined" sx={{ bgcolor: lt.bg, color: lt.color, borderColor: lt.border, fontWeight: 700, fontSize: 11, height: 22, borderRadius: "6px", borderWidth: "1.5px", mb: 0.4 }} />
                        <Typography sx={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.toLabel}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", fontSize: 11.5, color: "#374151", whiteSpace: "nowrap", border: "none" }}>{row.itemsLabel}</TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", border: "none" }}><StyledChip label={row.priority} style={ps} /></TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap", border: "none" }}>{row.notes}</TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", fontSize: 11.5, color: "#374151", whiteSpace: "nowrap", border: "none" }}>{row.by}</TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", fontSize: 11.5, color: "#94a3b8", whiteSpace: "nowrap", border: "none" }}>{row.date}</TableCell>
                      <TableCell sx={{ py: "12px", px: "8px", border: "none" }}><StyledChip label={row.status} style={ss} /></TableCell>
                      <TableCell sx={{ py: "6px", px: "8px", border: "none" }}>
                        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                          {/* Approve */}
                          <IconButton
                            title="Approve"
                            disabled={!isPending}
                            onClick={() => isPending && handleApprove(row.id)}
                            size="small"
                            sx={{ width: 28, height: 28, border: "1.5px solid #d1d5db", borderRadius: "6px", bgcolor: "#fff", opacity: isPending ? 1 : 0.3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#f0fdf4", borderColor: "#86efac" }, "&.Mui-disabled": { bgcolor: "#fff", opacity: 0.3 } }}
                          >
                            <CheckOutlinedIcon sx={{ fontSize: 14, color: "#16a34a" }} />
                          </IconButton>
                          {/* Reject */}
                          <IconButton
                            title="Reject"
                            disabled={!isPending}
                            onClick={() => isPending && handleReject(row.id)}
                            size="small"
                            sx={{ width: 28, height: 28, border: "1.5px solid #d1d5db", borderRadius: "6px", bgcolor: "#fff", opacity: isPending ? 1 : 0.3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#fef2f2", borderColor: "#fca5a5" }, "&.Mui-disabled": { bgcolor: "#fff", opacity: 0.3 } }}
                          >
                            <CloseOutlinedIcon sx={{ fontSize: 14, color: "#ef4444" }} />
                          </IconButton>
                          {/* View */}
                          <IconButton
                            title="View details"
                            onClick={() => setViewItem(row)}
                            size="small"
                            sx={{ width: 28, height: 28, border: "1.5px solid #d1d5db", borderRadius: "6px", bgcolor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#eff6ff", borderColor: "#93c5fd" } }}
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: 14, color: "#3b82f6" }} />
                          </IconButton>
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