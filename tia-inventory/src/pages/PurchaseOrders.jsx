  import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  Divider,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NewPO from "../components/NewPO";
import UploadInvoice from "../components/UploadInvoice";
import NewGRNDialog from "./Goodsreceipt/newgrnmodal";

// ── Shared style tokens ────────────────────────────────────────────────────

const labelSx = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  mb: 0.5,
  display: "block",
};

const btnBase = {
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "8px",
  px: "20px",
  py: "9px",
  outline: "none",
  "&:focus": { outline: "none" },
};

const thSx = {
  fontSize: 11,
  fontWeight: 500,
  color: "#373B4D",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  py: "12px",
  px: "16px",
  borderBottom: "1px solid #f3f4f6",
  borderRight: "1px solid #BED3FC",
  "&:last-child": { borderRight: "none" },
};

// ── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ label, count, sub, iconEl, iconBg }) {
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
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          bgcolor: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {iconEl}
      </Box>
      <Box>
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
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Typography
            sx={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}
          >
            {count}
          </Typography>
          {sub && (
            <Typography
              sx={{ fontSize: 11, fontWeight: 500, color: "#6b7280", whiteSpace: "nowrap" }}
            >
              {sub}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ── ViewPO Modal ───────────────────────────────────────────────────────────

const ViewPOModal = ({ open, onClose, po }) => {
  if (!po) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return { bg: "#e0f2fe", color: "#14b8a6", border: "#bae6fd" };
      case "Pending":  return { bg: "#fffbeb", color: "#f59e0b", border: "#fde68a" };
      case "Received": return { bg: "#f0fdf4", color: "#10b981", border: "#bbf7d0" };
      case "Draft":    return { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" };
      default:         return { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":   return { bg: "#fffbeb", color: "#f59e0b", border: "#fde68a" };
      case "Critical": return { bg: "#fef2f2", color: "#ef4444", border: "#fecaca" };
      default:         return { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" };
    }
  };

  const poTotal = po.lineItems?.reduce((sum, item) => sum + item.total, 0) ?? po.total;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      {/* Header */}
      <Box
        sx={{
          px: "24px", pt: "20px", pb: "16px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          borderBottom: "1px solid #f3f4f6", flexShrink: 0, bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: "10px", background: "#eff6ff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 20, color: "#2563eb" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{po.id}</Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>{po.supplier}</Typography>
          </Box>
        </Box>
        <IconButton
          size="small" onClick={onClose} disableRipple
          sx={{
            color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: "8px",
            width: 30, height: 30,
            "&:hover": { background: "#f3f4f6", color: "#374151" },
            "&:focus": { outline: "none" },
          }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent
        sx={{
          px: "24px", py: "20px", overflowY: "auto", flex: 1,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
          scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: "20px" }}>
          <Chip label={po.status} size="small" sx={{ bgcolor: getStatusColor(po.status).bg, color: getStatusColor(po.status).color, border: `1px solid ${getStatusColor(po.status).border}`, fontWeight: 700, fontSize: 11, height: 24 }} />
          <Chip label={po.priority} size="small" sx={{ bgcolor: getPriorityColor(po.priority).bg, color: getPriorityColor(po.priority).color, border: `1px solid ${getPriorityColor(po.priority).border}`, fontWeight: 700, fontSize: 11, height: 24 }} />
        </Box>

        <Box
          sx={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
            mb: "20px", p: "16px", borderRadius: "10px",
            border: "1px solid #e5e7eb", bgcolor: "#f9fafb",
          }}
        >
          {[
            { label: "PO Number",         value: po.id,         valueColor: "#14b8a6" },
            { label: "Quotation Ref",      value: po.quotRef },
            { label: "Supplier",           value: po.supplier },
            { label: "Deliver To",         value: po.location },
            { label: "Order Date",         value: po.date },
            { label: "Required Delivery",  value: po.delivery },
            { label: "Created By",         value: po.createdBy },
          ].map(({ label, value, valueColor }) => (
            <Box key={label}>
              <Typography sx={labelSx}>{label}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: valueColor || "#111827" }}>{value}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: "20px" }} />

        <Box sx={{ mb: "20px" }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.05em", textTransform: "uppercase", mb: "12px" }}>
            Line Items
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0,3fr) 52px 72px 72px", gap: "6px", mb: "8px", px: "10px" }}>
            {["DESCRIPTION", "QTY", "UNIT COST", "TOTAL"].map((h) => (
              <Typography key={h} sx={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.04em", textTransform: "uppercase", textAlign: h === "DESCRIPTION" ? "left" : "right" }}>
                {h}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {po.lineItems?.map((item, idx) => (
              <Box key={idx} sx={{ display: "grid", gridTemplateColumns: "minmax(0,3fr) 52px 72px 72px", gap: "6px", alignItems: "center", p: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", bgcolor: "#fff" }}>
                <Typography sx={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{item.description}</Typography>
                <Typography sx={{ fontSize: 13, color: "#6b7280", textAlign: "right" }}>{item.quantity}</Typography>
                <Typography sx={{ fontSize: 13, color: "#6b7280", textAlign: "right" }}>${item.unitCost.toFixed(2)}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827", textAlign: "right" }}>${item.total.toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: "12px", pt: "12px", borderTop: "1px dashed #e5e7eb" }}>
            <Typography sx={{ fontSize: 13, color: "#6b7280", mr: 1 }}>Total Amount:</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
              ${poTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        {po.invoice?.status !== "none" && (
          <>
            <Divider sx={{ mb: "20px" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", p: "14px", borderRadius: "10px", border: "1px solid #bbf7d0", bgcolor: "#f0fdf4" }}>
              <Typography sx={{ fontSize: 20 }}>✅</Typography>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Invoice Attached</Typography>
                <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: "2px" }}>{po.invoice.number}</Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      {/* Footer */}
      <Box sx={{ px: "24px", py: "16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end", bgcolor: "#fff", flexShrink: 0 }}>
        <Button onClick={onClose} disableRipple sx={{ ...btnBase, color: "#374151", border: "1px solid #e5e7eb", bgcolor: "#fff", "&:hover": { bgcolor: "#f9fafb" } }}>
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

// ── ViewInvoice Modal ──────────────────────────────────────────────────────

const ViewInvoiceModal = ({ open, onClose, po, invoice }) => {
  if (!po || !invoice) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      {/* Header */}
      <Box
        sx={{
          px: "24px", pt: "20px", pb: "16px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          borderBottom: "1px solid #f3f4f6", flexShrink: 0, bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            🧾
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{invoice.number}</Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}>{po.id} — {po.supplier}</Typography>
          </Box>
        </Box>
        <IconButton
          size="small" onClick={onClose} disableRipple
          sx={{ color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: "8px", width: 30, height: 30, "&:hover": { background: "#f3f4f6", color: "#374151" }, "&:focus": { outline: "none" } }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent
        sx={{
          px: "24px", py: "20px", overflowY: "auto", flex: 1,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
          scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: "12px 16px", borderRadius: "10px", border: "1px solid #bbf7d0", bgcolor: "#f0fdf4", mb: "16px" }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>✅ Verified</Typography>
          <Chip label="Verified" size="small" sx={{ bgcolor: "#10b981", color: "#fff", fontWeight: 700, fontSize: 11, height: 22 }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", p: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", bgcolor: "#f9fafb", mb: "16px" }}>
          <Typography sx={{ fontSize: 20 }}>📕</Typography>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{invoice.fileName}</Typography>
            <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: "2px" }}>{invoice.fileSize} · Upload original for download</Typography>
          </Box>
        </Box>

        <Box sx={{ p: "16px", borderRadius: "10px", border: "1px solid #e5e7eb", bgcolor: "#f9fafb", mb: "16px" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827", mb: "4px" }}>{invoice.number}</Typography>
          <Typography sx={{ fontSize: 11, color: "#9ca3af", mb: "12px" }}>Invoice Date: {invoice.date}</Typography>
          <Divider sx={{ mb: "12px" }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "PO Reference",    value: po.id,                                  valueColor: "#14b8a6" },
              { label: "Supplier",         value: po.supplier },
              { label: "Payment Terms",    value: invoice.paymentTerms },
              { label: "Due Date",         value: invoice.dueDate },
              { label: "Invoice Amount",   value: `$${invoice.amount?.toLocaleString()}` },
            ].map(({ label, value, valueColor }) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 12, color: "#6b7280" }}>{label}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: valueColor || "#111827" }}>{value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: "14px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", bgcolor: "#fff", mb: "16px" }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Grand Total</Typography>
            <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: "2px" }}>PO Total: ${po.total?.toLocaleString()} · ✓ Matches PO</Typography>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>${invoice.amount?.toLocaleString()}</Typography>
        </Box>

        {invoice.notes && (
          <Box sx={{ p: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", bgcolor: "#f9fafb", mb: "16px" }}>
            <Typography sx={labelSx}>Notes</Typography>
            <Typography sx={{ fontSize: 13, color: "#374151" }}>{invoice.notes}</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "2px" }}>
          <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
            Uploaded by: <strong style={{ color: "#374151" }}>{invoice.verifiedBy}</strong>
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>{invoice.uploadedAt}</Typography>
        </Box>
      </DialogContent>

      {/* Footer */}
      <Box sx={{ px: "24px", py: "16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end", gap: "10px", bgcolor: "#fff", flexShrink: 0 }}>
        <Button onClick={onClose} disableRipple sx={{ ...btnBase, color: "#374151", border: "1px solid #e5e7eb", bgcolor: "#fff", "&:hover": { bgcolor: "#f9fafb" } }}>Close</Button>
        <Button disableRipple sx={{ ...btnBase, color: "#ef4444", border: "1px solid #fca5a5", bgcolor: "#fff", "&:hover": { bgcolor: "#fef2f2" } }}>🚩 Mark Disputed</Button>
        <Button disableRipple sx={{ ...btnBase, fontWeight: 700, color: "#fff", bgcolor: "#2563eb", boxShadow: "0 2px 8px rgba(37,99,235,0.3)", "&:hover": { bgcolor: "#1d4ed8" } }}>✏️ Edit</Button>
      </Box>
    </Dialog>
  );
};

// ── PurchaseOrders page ────────────────────────────────────────────────────

const PurchaseOrders = () => {
  const [newPOModalOpen,       setNewPOModalOpen]       = useState(false);
  const [invoiceModalOpen,     setInvoiceModalOpen]     = useState(false);
  const [viewInvoiceModalOpen, setViewInvoiceModalOpen] = useState(false);
  const [viewPOModalOpen,      setViewPOModalOpen]      = useState(false);
  const [selectedPO,           setSelectedPO]           = useState(null);
  const [selectedInvoice,      setSelectedInvoice]      = useState(null);
  const [newGRNModalOpen,      setNewGRNModalOpen]      = useState(false);
  const [selectedGRNPO,        setSelectedGRNPO]        = useState(null);

  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: "PO-2026-0004", quotRef: "—", supplier: "McKesson Medical-Surgical",
      location: "CS-01", lines: 2, total: 850, createdBy: "S. Anderson",
      date: "Mar 19, 2026", delivery: "Mar 24, 2026", priority: "Urgent", status: "Approved",
      invoice: { status: "none", number: null },
      lineItems: [
        { description: "Amoxicillin 500mg Capsules", quantity: 200, unitCost: 2.4,  total: 480.0 },
        { description: "Epinephrine 1mg/mL 10mL",   quantity: 20,  unitCost: 18.5, total: 370.0 },
      ],
    },
    {
      id: "PO-2026-0003", quotRef: "—", supplier: "Cardinal Health",
      location: "CS-01", lines: 2, total: 525, createdBy: "S. Anderson",
      date: "Mar 17, 2026", delivery: "Mar 22, 2026", priority: "Normal", status: "Pending",
      invoice: { status: "none", number: null },
      lineItems: [
        { description: "Paracetamol 500mg Tablets", quantity: 100, unitCost: 2.5, total: 250.0 },
        { description: "Ibuprofen 200mg Tablets",   quantity: 50,  unitCost: 5.5, total: 275.0 },
      ],
    },
    {
      id: "PO-2026-0002", quotRef: "—", supplier: "Medline Industries",
      location: "CS-01", lines: 2, total: 696, createdBy: "T. Williams",
      date: "Mar 14, 2026", delivery: "Mar 20, 2026", priority: "Normal", status: "Received",
      invoice: {
        status: "verified", number: "INV-MDL-2026-4821", date: "Mar 20, 2026",
        dueDate: "May 4, 2026", amount: 696.0, paymentTerms: "Net-45",
        fileName: "INV-MDL-2026-4821.pdf", fileSize: "184 KB",
        verifiedBy: "T. Williams", notes: "Medline invoice — correct quantities confirmed.",
        uploadedAt: "Mar 20, 2026 14:32",
      },
      lineItems: [
        { description: "Surgical Gloves (Box of 100)", quantity: 10, unitCost: 45.6, total: 456.0 },
        { description: "Face Masks (Box of 50)",       quantity: 15, unitCost: 16.0, total: 240.0 },
      ],
    },
    {
      id: "PO-2026-0001", quotRef: "—", supplier: "Fisher Scientific",
      location: "CS-01", lines: 1, total: 175, createdBy: "T. Williams",
      date: "Mar 10, 2026", delivery: "Mar 18, 2026", priority: "Normal", status: "Draft",
      invoice: { status: "none", number: null },
      lineItems: [
        { description: "Lab Coats (Large)", quantity: 5, unitCost: 35.0, total: 175.0 },
      ],
    },
  ]);

  const suppliers = [
    { value: "s1", label: "McKesson Medical-Surgical" },
    { value: "s2", label: "Cardinal Health" },
    { value: "s3", label: "Medline Industries" },
    { value: "s4", label: "Fisher Scientific" },
  ];

  const locations = [
    { value: "l1", label: "Central Store" },
    { value: "l2", label: "ICU" },
    { value: "l3", label: "Emergency Dept" },
    { value: "l4", label: "Pharmacy" },
    { value: "l5", label: "OR / Surgery" },
    { value: "l6", label: "Laboratory" },
  ];

  const stats = {
    totalPOs:         purchaseOrders.length,
    totalValue:       purchaseOrders.reduce((sum, po) => sum + po.total, 0),
    pendingApproval:  purchaseOrders.filter((po) => po.status === "Pending").length,
    approved:         purchaseOrders.filter((po) => po.status === "Approved").length,
    received:         purchaseOrders.filter((po) => po.status === "Received").length,
    invoicesAttached: purchaseOrders.filter((po) => po.invoice.status !== "none").length,
  };

  const statCards = [
    {
      label:   "Total Purchase Orders",
      count:   stats.totalPOs,
      sub:     `$${stats.totalValue.toLocaleString()} total value`,
      iconBg:  "#3b82f6",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
    },
    {
      label:   "Pending Approval",
      count:   stats.pendingApproval,
      sub:     "Awaiting approval",
      iconBg:  "#f59e0b",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label:   "Approved / In Transit",
      count:   stats.approved,
      sub:     "Ready to receive GRN",
      iconBg:  "#10b981",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
    },
    {
      label:   "Received",
      count:   stats.received,
      sub:     "Completed orders",
      iconBg:  "#8b5cf6",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8"/>
          <path d="M12 17v4"/>
        </svg>
      ),
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return { bg: "#e0f2fe", color: "#14b8a6", border: "#bae6fd" };
      case "Pending":  return { bg: "#fffbeb", color: "#f59e0b", border: "#fde68a" };
      case "Received": return { bg: "#f0fdf4", color: "#10b981", border: "#bbf7d0" };
      case "Draft":    return { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" };
      default:         return { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "Urgent":   return { bg: "#fffbeb", color: "#f59e0b", border: "#fde68a" };
      case "Critical": return { bg: "#fef2f2", color: "#ef4444", border: "#fecaca" };
      default:         return { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" };
    }
  };

  const handleApprove = (id) =>
    setPurchaseOrders(purchaseOrders.map((po) => po.id === id ? { ...po, status: "Approved" } : po));
  const handleReject = (id) => alert(`PO ${id} has been rejected`);

  const handleViewPO       = (po) => { setSelectedPO(po); setViewPOModalOpen(true); };
  const handleUploadInvoice = (po) => { setSelectedPO(po); setInvoiceModalOpen(true); };
  const handleViewInvoice  = (po) => { setSelectedPO(po); setSelectedInvoice(po.invoice); setViewInvoiceModalOpen(true); };
  const handleCreateGRN    = (po) => { setSelectedGRNPO(po); setNewGRNModalOpen(true); };

  const handleSavePO = (poData) => {
    const supplierLabel = suppliers.find((s) => s.value === poData.supplier)?.label || "";
    const locationLabel = locations.find((l) => l.value === poData.deliverTo)?.label || "";
    const newPO = {
      id:        poData.poNumber,
      quotRef:   poData.quotationRef || "—",
      supplier:  supplierLabel,
      location:  locationLabel,
      lines:     poData.lineItems.length,
      total:     poData.totalAmount,
      createdBy: "Current User",
      date:      new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      delivery:  new Date(poData.requiredDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      priority:  poData.priority,
      status:    poData.status === "Draft" ? "Draft" : "Pending",
      invoice:   { status: "none", number: null },
      lineItems: poData.lineItems.map((item) => ({
        description: item.description,
        quantity:    item.quantity,
        unitCost:    item.unitCost,
        total:       item.quantity * item.unitCost,
      })),
    };
    setPurchaseOrders([newPO, ...purchaseOrders]);
    alert(`Purchase Order ${poData.poNumber} saved as ${poData.status === "Draft" ? "Draft" : "Pending"} successfully!`);
  };

  const handleSaveInvoice = (invoiceData) => {
    setPurchaseOrders(
      purchaseOrders.map((po) =>
        po.id === invoiceData.poNumber
          ? {
              ...po,
              invoice: {
                status:       "verified",
                number:       invoiceData.invoiceNumber,
                date:         invoiceData.invoiceDate,
                dueDate:      invoiceData.paymentDueDate,
                amount:       invoiceData.invoiceAmount,
                paymentTerms: invoiceData.paymentTerms,
                fileName:     invoiceData.file?.name || "invoice.pdf",
                fileSize:     "184 KB",
                verifiedBy:   "Current User",
                notes:        invoiceData.notes,
                uploadedAt:   new Date().toLocaleString(),
              },
            }
          : po,
      ),
    );
    alert(`Invoice ${invoiceData.invoiceNumber} uploaded successfully for ${invoiceData.poNumber}!`);
  };

  const COLUMNS = [
    "PO NUMBER","QUOT. REF","SUPPLIER","LOCATION","LINES",
    "TOTAL","CREATED BY","DATE","DELIVERY","PRIORITY","STATUS","INVOICE","ACTIONS",
  ];

  return (
    <Box>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "20px" }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Purchase Orders</Typography>
          <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
            {stats.totalPOs} POs · {stats.pendingApproval} pending approval · {stats.invoicesAttached} invoices attached
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => setNewPOModalOpen(true)}
          sx={{
            background: "#2563eb", color: "#fff", borderRadius: "8px",
            px: "18px", py: "10px", fontSize: 13, fontWeight: 600,
            textTransform: "none", boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            "&:hover": { background: "#1d4ed8" },
          }}
        >
          New PO
        </Button>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} count={s.count} sub={s.sub} iconBg={s.iconBg} iconEl={s.icon} />
        ))}
      </Box>

      {/* Invoice pill */}
      <Box sx={{ display: "flex", gap: 1.5, mb: "20px", flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: "1px solid #e5e7eb", borderRadius: "8px", p: "8px 13px", background: "#fff" }}>
          <Typography sx={{ fontSize: 16 }}>🧾</Typography>
          <Typography sx={{ color: "#9ca3af", fontSize: 12 }}>Invoices attached:</Typography>
          <Typography sx={{ color: "#14b8a6", fontWeight: 600, fontSize: 12 }}>{stats.invoicesAttached} / {stats.totalPOs}</Typography>
        </Box>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ borderRadius: "14px", border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <TableContainer
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
            scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent",
          }}
        >
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow sx={{ background: "#EBF1FE" }}>
                {COLUMNS.map((col) => (
                  <TableCell key={col} sx={thSx}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseOrders.map((po, idx) => {
                const ss = getStatusStyle(po.status);
                const ps = getPriorityStyle(po.priority);
                return (
                  <TableRow
                    key={po.id}
                    sx={{
                      background: "#fff",
                      "&:hover": { background: "#fafafa" },
                      transition: "background 0.15s",
                      "& td": {
                        borderBottom: idx < purchaseOrders.length - 1 ? "1px solid #f3f4f6" : "none",
                        py: "14px", px: "16px",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ color: "#111827", fontWeight: 500, fontSize: 13 }}>{po.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{po.quotRef}</Typography>
                      <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>Quot. Ref</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{po.supplier}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={po.location} size="small" sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", border: "1px solid #ede9fe", fontWeight: 600, fontSize: 11, height: 22, "& .MuiChip-label": { px: "8px" } }} />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "#6b7280" }}>{po.lines}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "#111827" }}>${po.total.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 12, color: "#374151" }}>{po.createdBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{po.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>{po.delivery}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={po.priority} size="small" sx={{ bgcolor: ps.bg, color: ps.color, border: `1px solid ${ps.border}`, fontWeight: 600, fontSize: 11, height: 22 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={po.status} size="small" sx={{ bgcolor: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, fontWeight: 600, fontSize: 11, height: 22 }} />
                    </TableCell>
                    <TableCell>
                      {po.invoice.status === "none" ? (
                        <Chip label="No Invoice" size="small" sx={{ bgcolor: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb", fontWeight: 600, fontSize: 11, height: 22 }} />
                      ) : (
                        <Box>
                          <Chip label="✓ Verified" size="small" sx={{ bgcolor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontWeight: 600, fontSize: 11, height: 22 }} />
                          <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: 0.5 }}>{po.invoice.number}</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "4px" }}>
                        {po.status === "Pending" && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton size="small" onClick={() => handleApprove(po.id)}
                                sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28, "&:hover": { background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" } }}>
                                <CheckIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton size="small" onClick={() => handleReject(po.id)}
                                sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28, "&:hover": { background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" } }}>
                                <CloseIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {po.status === "Approved" && (
                          <Tooltip title="Create GRN">
                            <IconButton size="small" onClick={() => handleCreateGRN(po)}
                              sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28, "&:hover": { background: "#f0fdfa", color: "#0d9488", borderColor: "#99f6e4" } }}>
                              <InventoryIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title={po.invoice.status === "none" ? "Upload Invoice" : "View Invoice"}>
                          <IconButton size="small"
                            onClick={() => po.invoice.status === "none" ? handleUploadInvoice(po) : handleViewInvoice(po)}
                            sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28, "&:hover": { background: "#f0fdfa", color: "#0d9488", borderColor: "#99f6e4" } }}>
                            <ReceiptIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View PO">
                          <IconButton size="small" onClick={() => handleViewPO(po)}
                            sx={{ color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: "6px", width: 28, height: 28, "&:hover": { background: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" } }}>
                            <VisibilityIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modals */}
      <NewPO open={newPOModalOpen} onClose={() => setNewPOModalOpen(false)} onSave={handleSavePO} onSaveAsDraft={handleSavePO} />
      <UploadInvoice open={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} onSave={handleSaveInvoice} poData={selectedPO} />
      <ViewPOModal open={viewPOModalOpen} onClose={() => setViewPOModalOpen(false)} po={selectedPO} />
      <ViewInvoiceModal open={viewInvoiceModalOpen} onClose={() => setViewInvoiceModalOpen(false)} po={selectedPO} invoice={selectedInvoice} />
      <NewGRNDialog
        open={newGRNModalOpen}
        onClose={() => { setNewGRNModalOpen(false); setSelectedGRNPO(null); }}
        onSave={(grnData) => { console.log("GRN saved:", grnData); setNewGRNModalOpen(false); setSelectedGRNPO(null); }}
        nextId="GRN-2026-0006"
        linkedPO={selectedGRNPO?.id}
      />
    </Box>
  );
};

export default PurchaseOrders;