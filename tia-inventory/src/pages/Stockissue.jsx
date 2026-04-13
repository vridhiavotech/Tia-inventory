import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Add,
  FileDownload,
  Check,
  Close,
  Visibility,
} from "@mui/icons-material";
import IssueStockModal from "./InventoryItems/Issuestockmodal";

// ─── Design tokens — mirrors index.css vars ───────────────────────────────────
const btnPrimary = {
  height: 32,
  px: "12px",
  borderRadius: "12px",
  bgcolor: "#015DFF",
  color: "#fff",
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,
  boxShadow: "none",
  gap: "8px",
  minWidth: 0,
  "& .MuiButton-startIcon": { mr: 0 },
  "&:hover": { bgcolor: "#0147CC", boxShadow: "none" },
};

const btnOutlined = {
  height: 32,
  px: "12px",
  borderRadius: "12px",
  border: "1px solid #015DFF",
  bgcolor: "#fff",
  color: "#015DFF",
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,
  boxShadow: "none",
  gap: "8px",
  minWidth: 0,
  "& .MuiButton-startIcon": { mr: 0 },
  "&:hover": {
    border: "1px solid #015DFF",
    bgcolor: "#EFF4FF",
    boxShadow: "none",
  },
};

const C = {
  bg: "#F5F6FA",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
};

const INITIAL_ISSUES = [
  {
    id: "ISS-2026-0008",
    type: "Ward Requisition",
    from: "CS-01",
    dept: "ICU",
    items: 1,
    value: 120.0,
    requestedBy: "Head Nurse ICU",
    date: "Mar 19, 2026 09:30",
    status: "Issued",
  },
  {
    id: "ISS-2026-0007",
    type: "Emergency Issue",
    from: "CS-01",
    dept: "Emergency Dept",
    items: 1,
    value: 37.0,
    requestedBy: "Dr. Mehra",
    date: "Mar 18, 2026 22:15",
    status: "Issued",
  },
  {
    id: "ISS-2026-0006",
    type: "OT Request",
    from: "CS-01",
    dept: "OR / Surgery",
    items: 1,
    value: 49.5,
    requestedBy: "Dr. Kapoor",
    date: "Mar 17, 2026 11:00",
    status: "Pending",
  },
  {
    id: "ISS-2026-0012",
    type: "Ward Requisition",
    from: "CS-01",
    dept: "Emergency Dept",
    items: 1,
    value: 14.8,
    requestedBy: "—",
    date: "Mar 30, 2026 12:00",
    status: "Pending",
  },
  {
    id: "ISS-2026-0013",
    type: "Ward Requisition",
    from: "CS-01",
    dept: "Emergency Dept",
    items: 1,
    value: 57.6,
    requestedBy: "—",
    date: "Mar 30, 2026 12:22",
    status: "Pending",
  },
  {
    id: "ISS-2026-0014",
    type: "Patient Dispensing",
    from: "PH-01",
    dept: "Emergency Dept",
    items: 1,
    value: 18.5,
    requestedBy: "—",
    date: "Mar 30, 2026 16:05",
    status: "Issued",
  },
  {
    id: "ISS-2026-0015",
    type: "Patient Dispensing",
    from: "CS-01",
    dept: "ICU",
    items: 1,
    value: 16.5,
    requestedBy: "—",
    date: "Mar 30, 2026 16:30",
    status: "Issued",
  },
];

const ISSUE_TYPES = [
  "Ward Requisition",
  "Emergency Issue",
  "OT Request",
  "Patient Dispensing",
];

const getNextId = (list) => {
  const nums = list.map((r) => parseInt(r.id.split("-")[2]));
  return `ISS-2026-${String(Math.max(...nums) + 1).padStart(4, "0")}`;
};
const nowStr = () =>
  new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

function StatusChip({ status }) {
  const map = {
    Issued: { bg: "#dcfce7", color: "#16a34a" },
    Pending: { bg: "#e0f2fe", color: "#0284c7" },
    Rejected: { bg: "#fef9c3", color: "#ca8a04" },
  };
  const s = map[status] || map.Pending;
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: s.bg,
        color: s.color,
        fontWeight: 600,
        fontSize: 11,
        height: 22,
        px: 0.2,
      }}
    />
  );
}
function TypeChip({ type }) {
  const map = {
    "Ward Requisition": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    "Emergency Issue": { bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
    "OT Request": { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff" },
    "Patient Dispensing": {
      bg: "#dcfce7",
      color: "#15803d",
      border: "#bbf7d0",
    },
  };
  const c = map[type] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontWeight: 600,
        fontSize: 11,
        height: 22,
      }}
    />
  );
}
function DeptChip({ dept }) {
  const map = {
    ICU: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
    "OR / Surgery": { bg: "#faf5ff", color: "#7e22ce", border: "#e9d5ff" },
  };
  const c = map[dept] || { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
  return (
    <Chip
      label={dept}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontWeight: 600,
        fontSize: 11,
        height: 22,
      }}
    />
  );
}

function ViewDialog({ open, onClose, row }) {
  if (!row) return null;
  const fields = [
    { label: "Issue #", value: row.id },
    { label: "Type", value: row.type },
    { label: "From (Store)", value: row.from },
    { label: "To (Dept)", value: row.dept },
    { label: "Items", value: row.items },
    { label: "Total Value", value: `$${row.value.toFixed(2)}` },
    { label: "Requested By", value: row.requestedBy },
    { label: "Date & Time", value: row.date },
    { label: "Status", value: row.status },
  ];
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 16,
          color: C.textPrimary,
          pb: 1.5,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        Issue Details
      </DialogTitle>
      <DialogContent sx={{ pt: "16px !important" }}>
        <Stack spacing={1.5}>
          {fields.map((f) => (
            <Box
              key={f.label}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: 12, color: C.textSecondary, fontWeight: 600 }}
              >
                {f.label}
              </Typography>
              <Typography
                sx={{ fontSize: 13, color: C.textPrimary, fontWeight: 500 }}
              >
                {f.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${C.border}` }}>
        <Button
          onClick={onClose}
          sx={{
            color: C.textSecondary,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function StockIssue() {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "success",
  });
  const [highlightId, setHighlightId] = useState(null);
  const highlightTimer = useRef(null);
  const rowRefs = useRef({});
  const issuesRef = useRef(issues);
  issuesRef.current = issues;

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const issued = issues.filter((i) => i.status === "Issued");
  const pending = issues.filter((i) => i.status === "Pending");
  const issuedVal = issued.reduce((s, i) => s + i.value, 0);
  const deptCount = issued.reduce((acc, i) => {
    acc[i.dept] = (acc[i.dept] || 0) + 1;
    return acc;
  }, {});
  const mostActive =
    Object.entries(deptCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const statCards = [
    {
      label: "Total Issues",
      value: issues.length,
      sub: "All issues",
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
          <path d="M9 17H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4" />
          <rect x="9" y="3" width="6" height="14" rx="1" />
        </svg>
      ),
    },
    {
      label: "Issued",
      value: issued.length,
      sub: `$${issuedVal.toFixed(0)} total value`,
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
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: pending.length,
      sub: "Awaiting approval",
      iconBg: "#8b5cf6",
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
      label: "Most Active Dept",
      value: mostActive,
      sub: "Highest issue volume",
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
  ];

  const filtered = issues.filter(
    (i) =>
      (typeFilter === "All Types" || i.type === typeFilter) &&
      (statusFilter === "All Statuses" || i.status === statusFilter),
  );

  const approve = (id) => {
    setIssues((p) =>
      p.map((i) => (i.id === id ? { ...i, status: "Issued" } : i)),
    );
    showToast(`${id} approved & issued.`);
  };
  const reject = (id) => {
    setIssues((p) =>
      p.map((i) => (i.id === id ? { ...i, status: "Rejected" } : i)),
    );
    showToast(`${id} rejected.`, "warning");
  };

  const addAndHighlight = (newRow) => {
    setIssues((p) => [newRow, ...p]);
    setTypeFilter("All Types");
    setStatusFilter("All Statuses");
    clearTimeout(highlightTimer.current);
    setHighlightId(newRow.id);
    setTimeout(
      () =>
        rowRefs.current[newRow.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      80,
    );
    highlightTimer.current = setTimeout(() => setHighlightId(null), 3000);
  };

  const handleIssued = useCallback((payload) => {
    setIssueModalOpen(false);
    setTimeout(() => {
      const n = {
        id: getNextId(issuesRef.current),
        type: payload.issueType || "Ward Requisition",
        from: payload.issueFrom || "CS-01",
        dept: payload.issueTo || "—",
        items: payload.items?.length || 1,
        value: payload.totalValue || 0,
        requestedBy: payload.requestedBy || "—",
        date: nowStr(),
        status: "Issued",
      };
      addAndHighlight(n);
      showToast(`${n.id} issued successfully.`);
    }, 0);
  }, []); // eslint-disable-line

  const handlePending = useCallback((payload) => {
    setIssueModalOpen(false);
    setTimeout(() => {
      const n = {
        id: getNextId(issuesRef.current),
        type: payload.issueType || "Ward Requisition",
        from: payload.issueFrom || "CS-01",
        dept: payload.issueTo || "—",
        items: payload.items?.length || 1,
        value: payload.totalValue || 0,
        requestedBy: payload.requestedBy || "—",
        date: nowStr(),
        status: "Pending",
      };
      addAndHighlight(n);
      showToast(`${n.id} submitted for approval.`, "warning");
    }, 0);
  }, []); // eslint-disable-line

  const handleModalClose = useCallback(() => setIssueModalOpen(false), []);

  const exportCSV = () => {
    const header =
      "Issue #,Type,From,To (Dept),Items,Total Value,Requested By,Date & Time,Status";
    const rows = issues.map(
      (i) =>
        `${i.id},${i.type},${i.from},${i.dept},${i.items},$${i.value.toFixed(2)},${i.requestedBy},${i.date},${i.status}`,
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([[header, ...rows].join("\n")], { type: "text/csv" }),
    );
    a.download = "stock-issues.csv";
    a.click();
    showToast("Exported successfully.");
  };

  const HEADS = [
    { label: "ISSUE #", width: 110 },
    { label: "TYPE", width: 148 },
    { label: "FROM", width: 72 },
    { label: "TO (DEPT)", width: 130 },
    { label: "ITEMS", width: 80 },
    { label: "TOTAL VALUE", width: 100 },
    { label: "REQUESTED BY", width: 120 },
    { label: "DATE & TIME", width: 140 },
    { label: "STATUS", width: 82 },
    { label: "ACTIONS", width: 96 },
  ];

  return (
    <>
      <style>{`@keyframes rowFlash { 0%{background-color:#dbeafe} 40%{background-color:#bfdbfe} 100%{background-color:transparent} } .row-highlight{animation:rowFlash 3s ease-out forwards}`}</style>
      <Box>
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
              sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}
            >
              Stock Issue
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
              Outward movements — ward requisitions, OT requests, dispensing
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            {/* ── Outlined export — Replacement style ── */}
            <Button
              startIcon={<FileDownload sx={{ fontSize: 16 }} />}
              variant="outlined"
              onClick={exportCSV}
              sx={btnOutlined}
            >
              Export
            </Button>
            {/* ── Primary action — Replacement style ── */}
            <Button
              startIcon={<Add sx={{ fontSize: 16 }} />}
              variant="contained"
              onClick={() => setIssueModalOpen(true)}
              sx={btnPrimary}
            >
              Issue Stock
            </Button>
          </Stack>
        </Box>

        {/* Stat Cards */}
        <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
          {statCards.map((s) => (
            <Box
              key={s.label}
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
                  bgcolor: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {s.icon}
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
                  {s.label}
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
                    {s.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.sub}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            mb: "20px",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 148 }}>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
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
                  borderColor: "#015DFF", // 👈 blue click/focus
                  borderWidth: "1px",
                },
              }}
            >
              <MenuItem value="All Types">All Types</MenuItem>
              {ISSUE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 148 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
                  borderColor: "#015DFF", // 👈 blue click/focus
                  borderWidth: "1px",
                },
              }}
            >
              <MenuItem value="All Statuses">All Statuses</MenuItem>
              <MenuItem value="Issued">Issued</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
            {filtered.length} of {issues.length} records
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
                background: "#d1d5db",
                borderRadius: 4,
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db transparent",
            }}
          >
            <Table size="small" sx={{ minWidth: 1020, tableLayout: "fixed" }}>
              <TableHead>
                <TableRow sx={{ background: "#EBF1FE" }}>
                  {HEADS.map((h) => (
                    <TableCell
                      key={h.label}
                      sx={{
                        width: h.width,
                        fontWeight: 500,
                        fontSize: 11,
                        color: "#373B4D",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                        py: "12px",
                        px: "16px",
                        borderBottom: "1px solid #f3f4f6",
                        borderRight: "1px solid #BED3FC",
                        "&:last-child": { borderRight: "none" },
                      }}
                    >
                      {h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      align="center"
                      sx={{ py: 5, color: C.textSecondary, fontSize: 13 }}
                    >
                      No records match the current filters.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((row, idx) => {
                  const isHighlighted = row.id === highlightId;
                  return (
                    <TableRow
                      key={row.id}
                      ref={(el) => {
                        if (el) rowRefs.current[row.id] = el;
                      }}
                      className={isHighlighted ? "row-highlight" : ""}
                      sx={{
                        background: "#fff",
                        "&:hover": {
                          background: isHighlighted ? "transparent" : "#fafafa",
                        },
                        transition: isHighlighted ? "none" : "background 0.15s",
                        "& td": {
                          borderBottom:
                            idx < filtered.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                          py: "14px",
                          px: "16px",
                        },
                        ...(isHighlighted && {
                          "& td:first-of-type": {
                            borderLeft: "3px solid #015DFF",
                          },
                        }),
                      }}
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: "#2E2E2E",
                            fontSize: 12,
                          }}
                        >
                          {row.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TypeChip type={row.type} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.from}
                          size="small"
                          sx={{
                            bgcolor: "#F5F3FF",
                            color: "#6D28D9",
                            border: "1px solid #DDD6FE",
                            fontWeight: 600,
                            fontSize: 11,
                            height: 22,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <DeptChip dept={row.dept} />
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ color: C.textSecondary, fontSize: 12 }}
                        >
                          {row.items}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: C.textPrimary, fontSize: 12 }}>
                          ${row.value.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: C.textSecondary,
                            fontSize: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.requestedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: C.textSecondary,
                            fontSize: 11,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.status} />
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          {row.status === "Pending" && (
                            <>
                              <Tooltip title="Approve & Issue">
                                <IconButton
                                  size="small"
                                  onClick={() => approve(row.id)}
                                  sx={{
                                    bgcolor: "#F0FDF4",
                                    color: "#16A34A",
                                    "&:hover": { bgcolor: "#DCFCE7" },
                                    width: 26,
                                    height: 26,
                                    borderRadius: "6px",
                                    border: "1px solid #BBF7D0",
                                  }}
                                >
                                  <Check sx={{ fontSize: 13 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  onClick={() => reject(row.id)}
                                  sx={{
                                    bgcolor: "#FEF2F2",
                                    color: "#DC2626",
                                    "&:hover": { bgcolor: "#FEE2E2" },
                                    width: 26,
                                    height: 26,
                                    borderRadius: "6px",
                                    border: "1px solid #FECACA",
                                  }}
                                >
                                  <Close sx={{ fontSize: 13 }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setViewRow(row);
                                setViewOpen(true);
                              }}
                              sx={{
                                bgcolor: "#EFF6FF",
                                color: "#1D4ED8",
                                "&:hover": { bgcolor: "#DBEAFE" },
                                width: 26,
                                height: 26,
                                borderRadius: "6px",
                              }}
                            >
                              <Visibility sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <IssueStockModal
        open={issueModalOpen}
        onClose={handleModalClose}
        onIssued={handleIssued}
        onPending={handlePending}
      />
      <ViewDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        row={viewRow}
      />

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
    </>
  );
}
