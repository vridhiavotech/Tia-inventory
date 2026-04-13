import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialData = [
  {
    id: "RPL-2026-005",
    item: "Sodium Chloride 0.9% IV 1L",
    location: "Central Store",
    reason: "Expired",
    urgency: "Critical",
    disposed: 12,
    replaceQty: 40,
    substitute: "Same item",
    linkedPO: "-",
    raisedBy: "S. Anderson",
    date: "Mar 18, 2026",
    status: "Open",
  },
  {
    id: "RPL-2026-004",
    item: "Epinephrine 1mg/mL 10mL",
    location: "Central Store",
    reason: "Low Stock",
    urgency: "Critical",
    disposed: "-",
    replaceQty: 20,
    substitute: "Same item",
    linkedPO: "PO-2026-0004",
    raisedBy: "T. Williams",
    date: "Mar 17, 2026",
    status: "PO Raised",
  },
  {
    id: "RPL-2026-003",
    item: "Amoxicillin 500mg Capsules",
    location: "Central Store",
    reason: "Recalled",
    urgency: "High",
    disposed: 50,
    replaceQty: 50,
    substitute: "Generic Amoxicillin 500mg",
    linkedPO: "-",
    raisedBy: "S. Anderson",
    date: "Mar 10, 2026",
    status: "Open",
  },
  {
    id: "RPL-2026-002",
    item: "Morphine Sulfate 10mg/mL",
    location: "Central Store",
    reason: "Expired",
    urgency: "High",
    disposed: 5,
    replaceQty: 10,
    substitute: "Same item",
    linkedPO: "PO-2026-0002",
    raisedBy: "P. Chen",
    date: "Mar 5, 2026",
    status: "Closed",
  },
];

const REASONS = ["All Reasons", "Expired", "Low Stock", "Recalled", "Damaged"];
const STATUSES = ["All Statuses", "Open", "PO Raised", "In Progress", "Closed"];
const INVENTORY_ITEMS = [
  "Sodium Chloride 0.9% IV 1L — Central Store",
  "Epinephrine 1mg/mL 10mL — Central Store",
  "Amoxicillin 500mg Capsules — Central Store",
  "Morphine Sulfate 10mg/mL — Central Store",
  "Paracetamol 500mg Tablets — Ward A",
  "Insulin Glargine 100U/mL — Pharmacy",
  "Metformin 500mg Tablets — Pharmacy",
];
const SUPPLIERS = [
  "Select...",
  "MedSupply Co.",
  "PharmaDirect",
  "GlobalMed",
  "HealthCore Ltd.",
  "BioPharm Inc.",
];
const URGENCY_OPTIONS = [
  "Critical — Within 24h",
  "High — Within 48h",
  "Medium — Within 1 week",
  "Low — No rush",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const urgencyStyle = (u) => {
  if (u === "Critical") return { bg: "#fff5f5", color: "#e53e3e" };
  if (u === "High") return { bg: "#fffbeb", color: "#d97706" };
  return { bg: "#eff6ff", color: "#3b82f6" };
};

const statusStyle = (s) => {
  const map = {
    Open: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "PO Raised": { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
    "In Progress": { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    Closed: { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
  };
  return map[s] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

// ─── Shared input sx ──────────────────────────────────────────────────────────

const inputSx = {
  width: "100%",
  "& .MuiInputBase-root": {
    fontSize: 13,
    borderRadius: "8px",
    bgcolor: "#f8fafc",
    color: "#0f172a",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e2e8f0",
    borderWidth: "1.5px",
  },
  "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cbd5e1",
  },
};
const autoSx = {
  ...inputSx,
  "& .MuiInputBase-root": {
    fontSize: 13,
    borderRadius: "8px",
    bgcolor: "#f1f5f9",
    color: "#94a3b8",
  },
};
const selectSx = { fontSize: 13, borderRadius: "8px", bgcolor: "#f8fafc" };

const SecLabel = ({ text }) => (
  <Typography
    sx={{
      fontSize: 11,
      fontWeight: 700,
      color: "#2563eb",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      mb: 1.5,
      mt: 0.5,
    }}
  >
    {text}
  </Typography>
);
const FLabel = ({ text }) => (
  <Typography
    sx={{
      display: "block",
      fontSize: 11,
      fontWeight: 700,
      color: "#64748b",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      mb: 0.75,
    }}
  >
    {text}
  </Typography>
);

// ─── Cart SVG Icon (exact SVG provided) ───────────────────────────────────────

const CartIcon = ({ color = "#73767C", size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_cart)">
      <path
        d="M1.01221 1.01221H5.06141L7.77437 14.5669C7.86694 15.033 8.12048 15.4516 8.49062 15.7496C8.86075 16.0475 9.3239 16.2058 9.79897 16.1967H19.6385C20.1136 16.2058 20.5767 16.0475 20.9469 15.7496C21.317 15.4516 21.5706 15.033 21.6631 14.5669L23.2828 6.07371H6.07371M10.1229 21.2582C10.1229 21.8173 9.66968 22.2705 9.11061 22.2705C8.55153 22.2705 8.09831 21.8173 8.09831 21.2582C8.09831 20.6991 8.55153 20.2459 9.11061 20.2459C9.66968 20.2459 10.1229 20.6991 10.1229 21.2582ZM21.2582 21.2582C21.2582 21.8173 20.805 22.2705 20.2459 22.2705C19.6868 22.2705 19.2336 21.8173 19.2336 21.2582C19.2336 20.6991 19.6868 20.2459 20.2459 20.2459C20.805 20.2459 21.2582 20.6991 21.2582 21.2582Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_cart">
        <rect width="24.2952" height="24.2952" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// ─── X Icon — Icon/Neutral/Tertiary #767676, 16×16px ─────────────────────────

const XIcon = ({ color = "#767676", size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Raise Replacement Modal ──────────────────────────────────────────────────

function RaiseReplacementModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    item: "",
    currentQty: "",
    location: "",
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

  const handleItemChange = (val) => {
    const mock = {
      "Sodium Chloride 0.9% IV 1L — Central Store": {
        currentQty: "8",
        location: "Central Store",
      },
      "Epinephrine 1mg/mL 10mL — Central Store": {
        currentQty: "3",
        location: "Central Store",
      },
      "Amoxicillin 500mg Capsules — Central Store": {
        currentQty: "0",
        location: "Central Store",
      },
      "Morphine Sulfate 10mg/mL — Central Store": {
        currentQty: "5",
        location: "Central Store",
      },
      "Paracetamol 500mg Tablets — Ward A": {
        currentQty: "120",
        location: "Ward A",
      },
      "Insulin Glargine 100U/mL — Pharmacy": {
        currentQty: "14",
        location: "Pharmacy",
      },
      "Metformin 500mg Tablets — Pharmacy": {
        currentQty: "200",
        location: "Pharmacy",
      },
    };
    const info = mock[val] || { currentQty: "", location: "" };
    setForm((p) => ({ ...p, item: val, ...info }));
  };

  const urgencyToShort = (u) => {
    if (u.startsWith("Critical")) return "Critical";
    if (u.startsWith("High")) return "High";
    if (u.startsWith("Medium")) return "Medium";
    return "Low";
  };

  const handleSave = (raisePO) => {
    if (!form.item || !form.replaceQty) return;
    onSubmit({
      item: form.item.split(" — ")[0],
      location: form.location,
      reason: form.reason,
      urgency: urgencyToShort(form.urgency),
      disposed: form.disposed || "-",
      replaceQty: form.replaceQty,
      substitute:
        form.useSubstitute && form.substitute
          ? `${form.substitute}${form.substituteNDC ? ` (${form.substituteNDC})` : ""}`
          : "Same item",
      raisePO,
    });
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: 560,
            boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: "20px 24px 16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                bgcolor: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SyncAltOutlinedIcon sx={{ fontSize: 18, color: "#2563eb" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}
              >
                Raise Replacement Request
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.1 }}>
                Flag item for replacement
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                width: 32,
                height: 32,
                color: "#64748b",
              }}
            >
              <CloseOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box
            sx={{
              p: "20px 24px",
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": { width: 5 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#e2e8f0",
                borderRadius: 99,
              },
            }}
          >
            <SecLabel text="Item Being Replaced" />

            <Box sx={{ mb: 1.75 }}>
              <FLabel text="Select Item *" />
              <FormControl size="small" sx={{ width: "100%" }}>
                <Select
                  value={form.item}
                  onChange={(e) => handleItemChange(e.target.value)}
                  displayEmpty
                  sx={selectSx}
                >
                  <MenuItem value="" sx={{ fontSize: 13, color: "#94a3b8" }}>
                    Select item...
                  </MenuItem>
                  {INVENTORY_ITEMS.map((i) => (
                    <MenuItem key={i} value={i} sx={{ fontSize: 13 }}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.75,
                mb: 1.75,
              }}
            >
              <Box>
                <FLabel text="Current QTY (Auto)" />
                <TextField
                  size="small"
                  value={form.currentQty}
                  disabled
                  sx={autoSx}
                />
              </Box>
              <Box>
                <FLabel text="Location (Auto)" />
                <TextField
                  size="small"
                  value={form.location}
                  disabled
                  sx={autoSx}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.75,
                mb: 1.75,
              }}
            >
              <Box>
                <FLabel text="Replacement Reason *" />
                <FormControl size="small" sx={{ width: "100%" }}>
                  <Select
                    value={form.reason}
                    onChange={(e) => set("reason", e.target.value)}
                    sx={selectSx}
                  >
                    {["Expired", "Low Stock", "Recalled", "Damaged"].map(
                      (r) => (
                        <MenuItem key={r} value={r} sx={{ fontSize: 13 }}>
                          {r}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FLabel text="Urgency *" />
                <FormControl size="small" sx={{ width: "100%" }}>
                  <Select
                    value={form.urgency}
                    onChange={(e) => set("urgency", e.target.value)}
                    sx={selectSx}
                  >
                    {URGENCY_OPTIONS.map((u) => (
                      <MenuItem key={u} value={u} sx={{ fontSize: 13 }}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.75,
              }}
            >
              <Box>
                <FLabel text="QTY Disposed / Removed" />
                <TextField
                  size="small"
                  type="number"
                  value={form.disposed}
                  onChange={(e) => set("disposed", e.target.value)}
                  placeholder="0"
                  sx={inputSx}
                />
              </Box>
              <Box>
                <FLabel text="QTY to Replace *" />
                <TextField
                  size="small"
                  type="number"
                  value={form.replaceQty}
                  onChange={(e) => set("replaceQty", e.target.value)}
                  placeholder="0"
                  sx={inputSx}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2.25 }} />
            <SecLabel text="Substitute Item (If Different)" />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.useSubstitute}
                  onChange={(e) => set("useSubstitute", e.target.checked)}
                  size="small"
                  sx={{
                    color: "#2563eb",
                    "&.Mui-checked": { color: "#2563eb" },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: 13, color: "#374151" }}>
                  Use a substitute / alternative item
                </Typography>
              }
              sx={{ mb: form.useSubstitute ? 1.75 : 0 }}
            />

            {form.useSubstitute && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.75,
                  }}
                >
                  <Box>
                    <FLabel text="Substitute Name" />
                    <TextField
                      size="small"
                      value={form.substitute}
                      onChange={(e) => set("substitute", e.target.value)}
                      placeholder="e.g. Generic Amox 500mg"
                      sx={inputSx}
                    />
                  </Box>
                  <Box>
                    <FLabel text="Substitute NDC" />
                    <TextField
                      size="small"
                      value={form.substituteNDC}
                      onChange={(e) => set("substituteNDC", e.target.value)}
                      placeholder="0378-0255-01"
                      sx={inputSx}
                    />
                  </Box>
                </Box>
                <Box>
                  <FLabel text="Therapeutic Equivalence" />
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <Select
                      value={form.therapeuticEq}
                      onChange={(e) => set("therapeuticEq", e.target.value)}
                      sx={selectSx}
                    >
                      {[
                        "AB-Rated — Bioequivalent",
                        "Therapeutically Equivalent",
                        "Partial — Physician Approval Required",
                        "Emergency Substitute Only",
                      ].map((o) => (
                        <MenuItem key={o} value={o} sx={{ fontSize: 13 }}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 2.25 }} />
            <SecLabel text="Procurement" />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.75,
                mb: 1.75,
              }}
            >
              <Box>
                <FLabel text="Preferred Supplier" />
                <FormControl size="small" sx={{ width: "100%" }}>
                  <Select
                    value={form.supplier}
                    onChange={(e) => set("supplier", e.target.value)}
                    sx={selectSx}
                  >
                    {SUPPLIERS.map((s) => (
                      <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FLabel text="Est. Unit Cost" />
                <TextField
                  size="small"
                  type="number"
                  value={form.unitCost}
                  onChange={(e) => set("unitCost", e.target.value)}
                  placeholder="0.00"
                  sx={inputSx}
                />
              </Box>
            </Box>

            <FLabel text="Clinical Notes / Justification" />
            <TextField
              multiline
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Reason, approval obtained, protocol followed..."
              sx={{
                ...inputSx,
                "& .MuiInputBase-root": {
                  fontSize: 13,
                  borderRadius: "8px",
                  bgcolor: "#f8fafc",
                  color: "#0f172a",
                  lineHeight: 1.6,
                },
              }}
            />
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: "16px 24px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: 1.25,
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(false)}
              variant="outlined"
              startIcon={
                <SaveOutlinedIcon sx={{ fontSize: "14px !important" }} />
              }
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                borderColor: "#e2e8f0",
                borderRadius: "8px",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              Save Open
            </Button>
            <Button
              onClick={() => handleSave(true)}
              variant="contained"
              startIcon={
                <SyncAltOutlinedIcon sx={{ fontSize: "14px !important" }} />
              }
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 700,
                bgcolor: "#2563eb",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Save & Raise PO
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

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
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {count}
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
    </Box>
  );
}

// ─── Dropdown ────────────────────────────────────────────────────────────────

function FilterSelect({ value, onChange, options }) {
  return (
    <FormControl size="small" sx={{ minWidth: 148 }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        sx={{
          fontSize: 13,
          borderRadius: "20px",
          background: "#fff",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e5e7eb",
            borderWidth: "1px", // 👈 thin
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#015DFF", // 👈 blue hover
            borderWidth: "1px",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#015DFF", // 👈 blue focus
            borderWidth: "1px",
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const HEADS = [
  "Request#",
  "Item",
  "Reason",
  "Urgency",
  "Disposed",
  "Replace Qty",
  "Substitute",
  "Linked PO",
  "Raised By",
  "Date",
  "Status",
  "Action",
];

export default function Replacement() {
  const [data, setData] = useState(initialData);
  const [reasonFilter, setReasonFilter] = useState("All Reasons");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const filtered = data.filter(
    (r) =>
      (reasonFilter === "All Reasons" || r.reason === reasonFilter) &&
      (statusFilter === "All Statuses" || r.status === statusFilter),
  );

  const counts = {
    open: data.filter((r) => r.status === "Open").length,
    poRaised: data.filter((r) => r.status === "PO Raised").length,
    inProgress: data.filter((r) => r.status === "In Progress").length,
    closed: data.filter((r) => r.status === "Closed").length,
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((r) => r.id !== id));
    showToast("Record removed.", "warning");
  };

  const handleRaiseOrder = (id) => {
    setData((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "PO Raised",
              linkedPO: `PO-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            }
          : r,
      ),
    );
    showToast(`PO raised for ${id}.`);
  };

  const handleRaiseReplacement = (form) => {
    const newId = `RPL-2026-${String(data.length + 1).padStart(3, "0")}`;
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setData((prev) => [
      {
        id: newId,
        item: form.item,
        location: form.location,
        reason: form.reason,
        urgency: form.urgency,
        disposed: form.disposed || "-",
        replaceQty: form.replaceQty,
        substitute: form.substitute,
        linkedPO: form.raisePO
          ? `PO-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
          : "-",
        raisedBy: "System Admin",
        date: today,
        status: form.raisePO ? "PO Raised" : "Open",
      },
      ...prev,
    ]);
    setShowModal(false);
    showToast(`${newId} created successfully.`);
  };

  const handleExport = () => {
    const headers = [
      "Request#",
      "Item",
      "Location",
      "Reason",
      "Urgency",
      "Disposed",
      "Replace QTY",
      "Substitute",
      "Linked PO",
      "Raised By",
      "Date",
      "Status",
    ];
    const rows = filtered.map((r) => [
      r.id,
      r.item,
      r.location,
      r.reason,
      r.urgency,
      r.disposed,
      r.replaceQty,
      r.substitute,
      r.linkedPO,
      r.raisedBy,
      r.date,
      r.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "replacement_tracking.csv";
    a.click();
    showToast("Exported successfully.");
  };

  const statCards = [
    {
      label: "Open Requests",
      count: counts.open,
      sub: "Awaiting action",
      iconBg: "#f59e0b",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "PO Raised",
      count: counts.poRaised,
      sub: "Pending delivery",
      iconBg: "#a855f7",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "In Progress",
      count: counts.inProgress,
      sub: "",
      iconBg: "#3b82f6",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      label: "Closed",
      count: counts.closed,
      sub: "Successfully replaced",
      iconBg: "#10b981",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      ),
    },
  ];

  return (
    <Box>
      {showModal && (
        <RaiseReplacementModal
          onClose={() => setShowModal(false)}
          onSubmit={handleRaiseReplacement}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: "20px",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
            Replacement Tracking
          </Typography>
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ mt: "4px" }}
          >
            {["Flag", "Request", "PO", "Receive", "Close"].map(
              (step, i, arr) => (
                <Stack
                  key={step}
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                >
                  <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                    {step}
                  </Typography>
                  {i < arr.length - 1 && (
                    <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
                      →
                    </Typography>
                  )}
                </Stack>
              ),
            )}
          </Stack>
        </Box>

        {/* ── Header Buttons (Figma-matched) ── */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            startIcon={
              <FileDownloadOutlinedIcon sx={{ fontSize: "14px !important" }} />
            }
            variant="outlined"
            onClick={handleExport}
            sx={{
              height: 32,
              px: "12px",
              borderRadius: "12px",
              border: "1px solid #015DFF",
              color: "#015DFF",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              bgcolor: "#fff",
              boxShadow: "none",
              gap: "8px",
              minWidth: 0,
              "& .MuiButton-startIcon": { mr: 0 },
              "&:hover": {
                border: "1px solid #015DFF",
                bgcolor: "#EFF4FF",
                boxShadow: "none",
              },
            }}
          >
            Export
          </Button>
          <Button
            startIcon={<AddIcon sx={{ fontSize: "14px !important" }} />}
            variant="contained"
            onClick={() => setShowModal(true)}
            sx={{
              height: 32,
              px: "12px",
              borderRadius: "12px",
              bgcolor: "#015DFF",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              boxShadow: "none",
              gap: "8px",
              minWidth: 0,
              "& .MuiButton-startIcon": { mr: 0 },
              "&:hover": { bgcolor: "#0147CC", boxShadow: "none" },
            }}
          >
            Raise Replacement
          </Button>
        </Stack>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
        {statCards.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            count={s.count}
            sub={s.sub}
            iconBg={s.iconBg}
            iconEl={s.icon}
          />
        ))}
      </Box>

      {/* Filters */}
      <Box
        sx={{ display: "flex", gap: "12px", mb: "20px", alignItems: "center" }}
      >
        <FilterSelect
          value={reasonFilter}
          onChange={setReasonFilter}
          options={REASONS}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUSES}
        />
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
          {filtered.length} of {data.length} records
        </Typography>
      </Box>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "14px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#d1d5db",
              borderRadius: 4,
            },
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db transparent",
          }}
        >
          <Table
            size="small"
            sx={{ minWidth: 1100, borderCollapse: "collapse" }}
          >
            <TableHead>
              <TableRow sx={{ background: "#EBF1FE" }}>
                {HEADS.map((h, i) => (
                  <TableCell
                    key={h}
                    sx={{
                      py: "12px",
                      px: "16px",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#373B4D",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #f3f4f6",
                      borderRight:
                        i < HEADS.length - 1 ? "1px solid #BED3FC" : "none",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={HEADS.length}
                    align="center"
                    sx={{
                      py: 5,
                      color: "#94a3b8",
                      fontSize: 13,
                      border: "none",
                    }}
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row, idx) => {
                  const us = urgencyStyle(row.urgency);
                  const ss = statusStyle(row.status);
                  const canRaisePO =
                    row.status !== "Closed" && row.status !== "PO Raised";
                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        background: "#fff",
                        "&:hover": { background: "#fafafa" },
                        transition: "background 0.15s",
                        "& td": {
                          borderBottom:
                            idx < filtered.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                          py: "13px",
                          px: "16px",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 400,
                            color: "#2e2e2e",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.id}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ minWidth: 160 }}>
                        <Typography sx={{ fontSize: 13, color: "#0f172a" }}>
                          {row.item}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 11.5, color: "#374151", mt: 0.25 }}
                        >
                          {row.location}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#374151",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.reason}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={row.urgency}
                          size="small"
                          sx={{
                            bgcolor: us.bg,
                            color: us.color,
                            fontWeight: 700,
                            fontSize: 11,
                            height: 22,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Typography sx={{ fontSize: 13, color: "#374151" }}>
                          {row.disposed}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography sx={{ fontSize: 13, color: "#374151" }}>
                          {row.replaceQty}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            color: "#374151",
                            maxWidth: 140,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.substitute}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            color: row.linkedPO === "-" ? "#cbd5e1" : "#374151",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.linkedPO}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            color: "#374151",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.raisedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12.5,
                            color: "#374151",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.date}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: ss.bg,
                            color: ss.color,
                            borderColor: ss.border,
                            fontWeight: 700,
                            fontSize: 11,
                            height: 22,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>

                      {/* ── Action: Cart SVG + X SVG (Figma-matched) ── */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          {/* Raise PO — Cart icon, neutral border, 28×28 */}
                          <Tooltip title="Raise PO">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  canRaisePO && handleRaiseOrder(row.id)
                                }
                                disabled={!canRaisePO}
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "6px",
                                  border: "1px solid #E4E4E4",
                                  bgcolor: "#fff",
                                  opacity: canRaisePO ? 1 : 0.35,
                                  p: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  "&:hover": {
                                    bgcolor: "#f5f5f5",
                                    borderColor: "#d1d5db",
                                  },
                                }}
                              >
                                <CartIcon
                                  color={canRaisePO ? "#73767C" : "#b0b0b0"}
                                  size={15}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>

                          {/* Remove — X icon, neutral border, 28×28 */}
                          <Tooltip title="Remove">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(row.id)}
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: "6px",
                                border: "1px solid #E4E4E4",
                                bgcolor: "#fff",
                                p: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                  bgcolor: "#fef2f2",
                                  borderColor: "#fecaca",
                                },
                              }}
                            >
                              <XIcon color="#767676" size={14} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
  );
}
