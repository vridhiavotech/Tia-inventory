import { useState, useRef, useCallback } from "react";
import {
  Box, Typography, Button, Chip, IconButton, MenuItem, Select,
  FormControl, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, Tooltip, Stack,
} from "@mui/material";
import { Add, FileDownload, Check, Close, Visibility } from "@mui/icons-material";
import IssueStockModal from "./InventoryItems/Issuestockmodal";

const C = {
  bg:            "#F5F6FA",
  surface:       "#FFFFFF",
  primary:       "#1976D2",
  border:        "#E5E7EB",
  textPrimary:   "#111827",
  textSecondary: "#6B7280",
};

const INITIAL_ISSUES = [
  { id:"ISS-2026-0008", type:"Ward Requisition",   from:"CS-01", dept:"ICU",            items:1, value:120.00, requestedBy:"Head Nurse ICU", date:"Mar 19, 2026 09:30", status:"Issued"  },
  { id:"ISS-2026-0007", type:"Emergency Issue",    from:"CS-01", dept:"Emergency Dept", items:1, value:37.00,  requestedBy:"Dr. Mehra",      date:"Mar 18, 2026 22:15", status:"Issued"  },
  { id:"ISS-2026-0006", type:"OT Request",         from:"CS-01", dept:"OR / Surgery",   items:1, value:49.50,  requestedBy:"Dr. Kapoor",     date:"Mar 17, 2026 11:00", status:"Pending" },
  { id:"ISS-2026-0012", type:"Ward Requisition",   from:"CS-01", dept:"Emergency Dept", items:1, value:14.80,  requestedBy:"—",              date:"Mar 30, 2026 12:00", status:"Pending" },
  { id:"ISS-2026-0013", type:"Ward Requisition",   from:"CS-01", dept:"Emergency Dept", items:1, value:57.60,  requestedBy:"—",              date:"Mar 30, 2026 12:22", status:"Pending" },
  { id:"ISS-2026-0014", type:"Patient Dispensing", from:"PH-01", dept:"Emergency Dept", items:1, value:18.50,  requestedBy:"—",              date:"Mar 30, 2026 16:05", status:"Issued"  },
  { id:"ISS-2026-0015", type:"Patient Dispensing", from:"CS-01", dept:"Emergency Dept", items:1, value:16.50,  requestedBy:"—",              date:"Mar 30, 2026 16:30", status:"Issued"  },
];

const ISSUE_TYPES = ["Ward Requisition","Emergency Issue","OT Request","Patient Dispensing"];

const getNextId = (list) => {
  const nums = list.map(r => parseInt(r.id.split("-")[2]));
  return `ISS-2026-${String(Math.max(...nums) + 1).padStart(4, "0")}`;
};

const nowStr = () =>
  new Date().toLocaleString("en-US", { month:"short", day:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit", hour12:false });

// ── Stat Card — matches Goods Receipt card style exactly ──
function StatCard({ label, value, sub, color }) {
  return (
    <Box sx={{
      flex: 1,
      bgcolor: "#fff",
      border: "1px solid #e5e7eb",
      borderLeft: `3px solid ${color}`,
      borderRadius: "10px",
      px: 2,
      py: 1.5,
      minWidth: 0,
    }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: 22,
        fontWeight: 700,
        color: "#111827",
        lineHeight: 1.2,
      }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: color, mt: 0.3 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

// ── Chips ─────────────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const map = {
    Issued:   { bg:"#dcfce7", color:"#16a34a" },
    Pending:  { bg:"#e0f2fe", color:"#0284c7" },
    Rejected: { bg:"#fef9c3", color:"#ca8a04" },
  };
  const s = map[status] || map.Pending;
  return (
    <Chip label={status} size="small" sx={{
      bgcolor:s.bg, color:s.color,
      fontWeight:600, fontSize:11, height:22, px:0.2,
    }} />
  );
}

function TypeChip({ type }) {
  const map = {
    "Ward Requisition":   { bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe" },
    "Emergency Issue":    { bg:"#fff1f2", color:"#be123c", border:"#fecdd3" },
    "OT Request":         { bg:"#faf5ff", color:"#7e22ce", border:"#e9d5ff" },
    "Patient Dispensing": { bg:"#dcfce7", color:"#15803d", border:"#bbf7d0" },
  };
  const c = map[type] || { bg:"#f3f4f6", color:"#374151", border:"#e5e7eb" };
  return (
    <Chip label={type} size="small" sx={{
      bgcolor:c.bg, color:c.color, border:`1px solid ${c.border}`,
      fontWeight:600, fontSize:11, height:22,
    }} />
  );
}

function DeptChip({ dept }) {
  const map = {
    ICU:           { bg:"#fff7ed", color:"#c2410c", border:"#fed7aa" },
    "OR / Surgery":{ bg:"#faf5ff", color:"#7e22ce", border:"#e9d5ff" },
  };
  const c = map[dept] || { bg:"#eff6ff", color:"#1d4ed8", border:"#bfdbfe" };
  return (
    <Chip label={dept} size="small" sx={{
      bgcolor:c.bg, color:c.color, border:`1px solid ${c.border}`,
      fontWeight:600, fontSize:11, height:22,
    }} />
  );
}

// ── View Detail Dialog ────────────────────────────────────────────────────────
function ViewDialog({ open, onClose, row }) {
  if (!row) return null;
  const fields = [
    { label:"Issue #",      value: row.id },
    { label:"Type",         value: row.type },
    { label:"From (Store)", value: row.from },
    { label:"To (Dept)",    value: row.dept },
    { label:"Items",        value: row.items },
    { label:"Total Value",  value: `$${row.value.toFixed(2)}` },
    { label:"Requested By", value: row.requestedBy },
    { label:"Date & Time",  value: row.date },
    { label:"Status",       value: row.status },
  ];
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx:{ borderRadius:"12px" } }}>
      <DialogTitle sx={{ fontWeight:700, fontSize:16, color:C.textPrimary, pb:1.5, borderBottom:`1px solid ${C.border}` }}>
        Issue Details
      </DialogTitle>
      <DialogContent sx={{ pt:"16px !important" }}>
        <Stack spacing={1.5}>
          {fields.map(f => (
            <Box key={f.label} sx={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Typography sx={{ fontSize:12, color:C.textSecondary, fontWeight:600 }}>{f.label}</Typography>
              <Typography sx={{ fontSize:13, color:C.textPrimary, fontWeight:500 }}>{f.value}</Typography>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px:3, py:2, borderTop:`1px solid ${C.border}` }}>
        <Button onClick={onClose} sx={{ color:C.textSecondary, textTransform:"none", fontWeight:600 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StockIssue() {
  const [issues,       setIssues]       = useState(INITIAL_ISSUES);
  const [typeFilter,   setTypeFilter]   = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [viewRow,  setViewRow]  = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [toast,    setToast]    = useState({ open:false, msg:"", severity:"success" });

  const [highlightId, setHighlightId] = useState(null);
  const highlightTimer = useRef(null);
  const rowRefs = useRef({});

  const issuesRef = useRef(issues);
  issuesRef.current = issues;

  const showToast = (msg, severity = "success") => setToast({ open:true, msg, severity });

  const issued     = issues.filter(i => i.status === "Issued");
  const pending    = issues.filter(i => i.status === "Pending");
  const rejected   = issues.filter(i => i.status === "Rejected");
  const issuedVal  = issued.reduce((s, i) => s + i.value, 0);
  const deptCount  = issued.reduce((acc, i) => { acc[i.dept] = (acc[i.dept]||0)+1; return acc; }, {});
  const mostActive = Object.entries(deptCount).sort((a,b) => b[1]-a[1])[0]?.[0] || "—";

  const stats = [
    { label:"Total Issues",   value:issues.length,                                    sub:"All issues",        color:"#f59e0b" },
    { label:"Issued",         value:issued.length,   sub:`$${issuedVal.toFixed(0)} total value`, color:"#10b981" },
    { label:"Pending",        value:pending.length,                                   sub:"Awaiting approval", color:"#8b5cf6" },
    { label:"Rejected",       value:rejected.length,                                  sub:"Needs review",      color:"#ef4444" },
  ];

  const filtered = issues.filter(i =>
    (typeFilter   === "All Types"    || i.type   === typeFilter) &&
    (statusFilter === "All Statuses" || i.status === statusFilter)
  );

  const approve = (id) => { setIssues(p => p.map(i => i.id===id ? {...i, status:"Issued"}   : i)); showToast(`${id} approved & issued.`); };
  const reject  = (id) => { setIssues(p => p.map(i => i.id===id ? {...i, status:"Rejected"} : i)); showToast(`${id} rejected.`, "warning"); };

  const addAndHighlight = (newRow) => {
    setIssues(p => [newRow, ...p]);
    setTypeFilter("All Types");
    setStatusFilter("All Statuses");

    clearTimeout(highlightTimer.current);
    setHighlightId(newRow.id);
    setTimeout(() => {
      rowRefs.current[newRow.id]?.scrollIntoView({ behavior:"smooth", block:"center" });
    }, 80);
    highlightTimer.current = setTimeout(() => setHighlightId(null), 3000);
  };

  const handleIssued = useCallback((payload) => {
    setIssueModalOpen(false);
    setTimeout(() => {
      const n = {
        id:          getNextId(issuesRef.current),
        type:        payload.issueType   || "Ward Requisition",
        from:        payload.issueFrom   || "CS-01",
        dept:        payload.issueTo     || "—",
        items:       payload.items?.length || 1,
        value:       payload.totalValue  || 0,
        requestedBy: payload.requestedBy || "—",
        date:        nowStr(),
        status:      "Issued",
      };
      addAndHighlight(n);
      showToast(`${n.id} issued successfully.`);
    }, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePending = useCallback((payload) => {
    setIssueModalOpen(false);
    setTimeout(() => {
      const n = {
        id:          getNextId(issuesRef.current),
        type:        payload.issueType   || "Ward Requisition",
        from:        payload.issueFrom   || "CS-01",
        dept:        payload.issueTo     || "—",
        items:       payload.items?.length || 1,
        value:       payload.totalValue  || 0,
        requestedBy: payload.requestedBy || "—",
        date:        nowStr(),
        status:      "Pending",
      };
      addAndHighlight(n);
      showToast(`${n.id} submitted for approval.`, "warning");
    }, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleModalClose = useCallback(() => {
    setIssueModalOpen(false);
  }, []);

  const exportCSV = () => {
    const header = "Issue #,Type,From,To (Dept),Items,Total Value,Requested By,Date & Time,Status";
    const rows   = issues.map(i => `${i.id},${i.type},${i.from},${i.dept},${i.items},$${i.value.toFixed(2)},${i.requestedBy},${i.date},${i.status}`);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([[header,...rows].join("\n")],{type:"text/csv"}));
    a.download = "stock-issues.csv"; a.click();
    showToast("Exported successfully.");
  };

  const HEADS = [
    { label:"ISSUE #",      width:110 },
    { label:"TYPE",         width:148 },
    { label:"FROM",         width:72  },
    { label:"TO (DEPT)",    width:130 },
    { label:"ITEMS",        width:58  },
    { label:"TOTAL VALUE",  width:90  },
    { label:"REQUESTED BY", width:120 },
    { label:"DATE & TIME",  width:140 },
    { label:"STATUS",       width:82  },
    { label:"ACTIONS",      width:96  },
  ];

  return (
    <>
      <style>{`
        @keyframes rowFlash {
          0%   { background-color: #dbeafe; }
          40%  { background-color: #bfdbfe; }
          100% { background-color: transparent; }
        }
        .row-highlight {
          animation: rowFlash 3s ease-out forwards;
        }
      `}</style>

      {/* ── Outer wrapper — matches Inventory Items exactly ── */}
      <Box sx={{ background: "#f8f9fb", minHeight: "100vh", p: "28px 32px", boxSizing: "border-box" }}>

        {/* ── Title row ── */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "20px" }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
              Stock Issue
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
              Outward movements — ward requisitions, OT requests, dispensing
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button startIcon={<FileDownload sx={{ fontSize:16 }} />} variant="outlined" onClick={exportCSV}
              sx={{ border:`1px solid ${C.border}`, color:C.textSecondary, textTransform:"none",
                fontWeight:600, fontSize:13, borderRadius:"8px", height:36, px:2, bgcolor:"#fff",
                "&:hover":{ borderColor:"#9CA3AF", bgcolor:"#F9FAFB" } }}>
              Export
            </Button>
            <Button startIcon={<Add sx={{ fontSize:16 }} />} variant="contained"
              onClick={() => setIssueModalOpen(true)}
              sx={{ background: "#2563eb", color: "#fff", borderRadius: "8px", px: "18px", py: "10px", fontSize: 13, fontWeight: 600, textTransform: "none", boxShadow: "0 2px 8px rgba(37,99,235,0.25)", "&:hover": { background: "#1d4ed8" } }}>
              Issue Stock
            </Button>
          </Stack>
        </Box>

        {/* ── Stat Cards (Goods Receipt style) ── */}
        <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} color={s.color} />
          ))}
        </Box>

        {/* ── Filters ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", mb: "20px" }}>
          <FormControl size="small" sx={{ minWidth:148 }}>
            <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              sx={{ fontSize: 13, borderRadius: "8px", background: "#fff", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" } }}>
              <MenuItem value="All Types">All Types</MenuItem>
              {ISSUE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth:148 }}>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              sx={{ fontSize: 13, borderRadius: "8px", background: "#fff", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" } }}>
              <MenuItem value="All Statuses">All Statuses</MenuItem>
              <MenuItem value="Issued">Issued</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flex:1 }} />
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
            {filtered.length} of {issues.length} records
          </Typography>
        </Box>

        {/* ── Table ── */}
        <Paper elevation={0} sx={{ borderRadius: "14px", border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <TableContainer
            sx={{
              overflowX: "auto",
              "&::-webkit-scrollbar":{ height:4 },
              "&::-webkit-scrollbar-track":{ background:"transparent" },
              "&::-webkit-scrollbar-thumb":{ background:"#d1d5db", borderRadius:4 },
              "&::-webkit-scrollbar-thumb:hover":{ background:"#a1a1aa" },
              scrollbarWidth:"thin",
              scrollbarColor:"#d1d5db transparent",
            }}
          >
            <Table size="small" sx={{ minWidth:1020, tableLayout:"fixed" }}>
              <TableHead>
                <TableRow sx={{ background: "#f8f9fb" }}>
                  {HEADS.map(h => (
                    <TableCell key={h.label} sx={{
                      width:h.width, fontWeight:600, fontSize:11, color:"#9ca3af",
                      letterSpacing:"0.05em", py:"12px", px:"16px",
                      borderBottom:"1px solid #f3f4f6",
                      textTransform:"uppercase", whiteSpace:"nowrap",
                    }}>
                      {h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py:5, color:C.textSecondary, fontSize:13 }}>
                      No records match the current filters.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((row, idx) => {
                  const isHighlighted = row.id === highlightId;
                  return (
                    <TableRow
                      key={row.id}
                      ref={el => { if (el) rowRefs.current[row.id] = el; }}
                      className={isHighlighted ? "row-highlight" : ""}
                      sx={{
                        background: "#fff",
                        "&:hover": { background: isHighlighted ? "transparent" : "#fafafa" },
                        transition: isHighlighted ? "none" : "background 0.15s",
                        "& td": { borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none", py: "14px", px: "16px" },
                        ...(isHighlighted && {
                          "& td:first-of-type": { borderLeft: "3px solid #2563eb" },
                        }),
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontWeight:700, color:"#1D4ED8", fontSize:12 }}>{row.id}</Typography>
                      </TableCell>
                      <TableCell><TypeChip type={row.type} /></TableCell>
                      <TableCell>
                        <Chip label={row.from} size="small" sx={{ bgcolor:"#F5F3FF", color:"#6D28D9", border:"1px solid #DDD6FE", fontWeight:600, fontSize:11, height:22 }} />
                      </TableCell>
                      <TableCell><DeptChip dept={row.dept} /></TableCell>
                      <TableCell>
                        <Typography sx={{ color:C.textSecondary, fontSize:12 }}>{row.items}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight:700, color:C.textPrimary, fontSize:12 }}>${row.value.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color:C.textSecondary, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {row.requestedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color:C.textSecondary, fontSize:11, whiteSpace:"nowrap" }}>{row.date}</Typography>
                      </TableCell>
                      <TableCell><StatusChip status={row.status} /></TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {row.status === "Pending" && (<>
                            <Tooltip title="Approve & Issue">
                              <IconButton size="small" onClick={() => approve(row.id)}
                                sx={{ bgcolor:"#F0FDF4", color:"#16A34A", "&:hover":{ bgcolor:"#DCFCE7" }, width:26, height:26, borderRadius:"6px", border:"1px solid #BBF7D0" }}>
                                <Check sx={{ fontSize:13 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton size="small" onClick={() => reject(row.id)}
                                sx={{ bgcolor:"#FEF2F2", color:"#DC2626", "&:hover":{ bgcolor:"#FEE2E2" }, width:26, height:26, borderRadius:"6px", border:"1px solid #FECACA" }}>
                                <Close sx={{ fontSize:13 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => { setViewRow(row); setViewOpen(true); }}
                                sx={{ bgcolor:"#EFF6FF", color:"#1D4ED8", "&:hover":{ bgcolor:"#DBEAFE" }, width:26, height:26, borderRadius:"6px" }}>
                                <Visibility sx={{ fontSize:13 }} />
                              </IconButton>
                            </Tooltip>
                          </>)}

                          {row.status === "Issued" && (
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => { setViewRow(row); setViewOpen(true); }}
                                sx={{ bgcolor:"#EFF6FF", color:"#1D4ED8", "&:hover":{ bgcolor:"#DBEAFE" }, width:26, height:26, borderRadius:"6px" }}>
                                <Visibility sx={{ fontSize:13 }} />
                              </IconButton>
                            </Tooltip>
                          )}

                          {row.status === "Rejected" && (
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => { setViewRow(row); setViewOpen(true); }}
                                sx={{ bgcolor:"#F9FAFB", color:"#6B7280", "&:hover":{ bgcolor:"#F3F4F6" }, width:26, height:26, borderRadius:"6px" }}>
                                <Visibility sx={{ fontSize:13 }} />
                              </IconButton>
                            </Tooltip>
                          )}
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

      <ViewDialog open={viewOpen} onClose={() => setViewOpen(false)} row={viewRow} />

      <Snackbar open={toast.open} autoHideDuration={3000}
        onClose={() => setToast(t => ({ ...t, open:false }))}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius:"10px", fontWeight:600, fontSize:13 }}
          onClose={() => setToast(t => ({ ...t, open:false }))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
}