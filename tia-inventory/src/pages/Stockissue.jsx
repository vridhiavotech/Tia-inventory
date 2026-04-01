import { useState } from "react";
import {
  Box, Typography, Button, Chip, IconButton, MenuItem, Select,
  FormControl, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Snackbar, Alert, Tooltip,
  Grid, InputLabel, Stack,
} from "@mui/material";
import {
  Add, FileDownload, Check, Close, Info, Visibility,
} from "@mui/icons-material";
import IssueStockModal from "./InventoryItems/Issuestockmodal";

const C = {
  bg:            "#F5F6FA",
  surface:       "#FFFFFF",
  primary:       "#1976D2",
  primaryDark:   "#1256A0",
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
const DEPARTMENTS = ["ICU","Emergency Dept","OR / Surgery","General Ward","Pharmacy"];
const STORES      = ["CS-01","CS-02","PH-01","PH-02"];

const nextId = (list) => {
  const nums = list.map(r => parseInt(r.id.split("-")[2]));
  return `ISS-2026-${String(Math.max(...nums)+1).padStart(4,"0")}`;
};
const nowStr = () =>
  new Date().toLocaleString("en-US",{month:"short",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false});

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <Box sx={{
      flex: 1, bgcolor: "#fff",
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: "8px",
      px: 2, py: 1.5, minWidth: 0,
    }}>
      <Typography sx={{ fontSize:10, fontWeight:700, color:C.textSecondary, letterSpacing:0.7, textTransform:"uppercase", mb:0.4 }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: typeof value === "string" && value.length > 8 ? 15 : 22,
        fontWeight:800, color:C.textPrimary, lineHeight:1.2,
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
      }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize:11, fontWeight:600, color, mt:0.3, whiteSpace:"nowrap" }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

// ── Chips ─────────────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const map = {
    Issued:   { bg:"#F0FDF4", color:"#16A34A", border:"#BBF7D0" },
    Pending:  { bg:"#FFFBEB", color:"#D97706", border:"#FDE68A" },
    Rejected: { bg:"#FEF2F2", color:"#DC2626", border:"#FECACA" },
  };
  const s = map[status] || map.Pending;
  return (
    <Chip label={status} size="small" sx={{
      bgcolor:s.bg, color:s.color, border:`1px solid ${s.border}`,
      fontWeight:700, fontSize:11, height:22, px:0.2,
    }} />
  );
}

function TypeChip({ type }) {
  const map = {
    "Ward Requisition":   { bg:"#EFF6FF", color:"#1D4ED8", border:"#BFDBFE" },
    "Emergency Issue":    { bg:"#FFF1F2", color:"#BE123C", border:"#FECDD3" },
    "OT Request":         { bg:"#FAF5FF", color:"#7E22CE", border:"#E9D5FF" },
    "Patient Dispensing": { bg:"#F0FDF4", color:"#15803D", border:"#BBF7D0" },
  };
  const c = map[type] || { bg:"#F9FAFB", color:"#374151", border:"#E5E7EB" };
  return (
    <Chip label={type} size="small" sx={{
      bgcolor:c.bg, color:c.color, border:`1px solid ${c.border}`,
      fontWeight:600, fontSize:11, height:22,
    }} />
  );
}

function DeptChip({ dept }) {
  const map = {
    ICU:           { bg:"#FFF7ED", color:"#C2410C", border:"#FED7AA" },
    "OR / Surgery":{ bg:"#FAF5FF", color:"#7E22CE", border:"#E9D5FF" },
  };
  const c = map[dept] || { bg:"#EFF6FF", color:"#1D4ED8", border:"#BFDBFE" };
  return (
    <Chip label={dept} size="small" sx={{
      bgcolor:c.bg, color:c.color, border:`1px solid ${c.border}`,
      fontWeight:600, fontSize:11, height:22,
    }} />
  );
}

// ── View Detail Dialog (eye icon) ─────────────────────────────────────────────
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
        <Button onClick={onClose} sx={{ color:C.textSecondary, textTransform:"none", fontWeight:600 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StockIssue() {
  const [issues, setIssues]             = useState(INITIAL_ISSUES);
  const [typeFilter, setTypeFilter]     = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // "Issue Stock" button → opens Issuestockmodal
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  // Eye icon → opens view dialog
  const [viewRow, setViewRow]   = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [toast, setToast] = useState({ open:false, msg:"", severity:"success" });
  const showToast = (msg, severity="success") => setToast({ open:true, msg, severity });

  const issued     = issues.filter(i => i.status==="Issued");
  const pending    = issues.filter(i => i.status==="Pending");
  const issuedVal  = issued.reduce((s,i)=>s+i.value,0);
  const deptCount  = issued.reduce((acc,i)=>{ acc[i.dept]=(acc[i.dept]||0)+1; return acc; },{});
  const mostActive = Object.entries(deptCount).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";

  const filtered = issues.filter(i =>
    (typeFilter==="All Types"      || i.type===typeFilter) &&
    (statusFilter==="All Statuses" || i.status===statusFilter)
  );

  const approve = (id) => { setIssues(p=>p.map(i=>i.id===id?{...i,status:"Issued"}:i));   showToast(`${id} approved & issued.`); };
  const reject  = (id) => { setIssues(p=>p.map(i=>i.id===id?{...i,status:"Rejected"}:i)); showToast(`${id} rejected.`,"warning"); };

  // Called when Issuestockmodal saves a new issue
  const handleModalSave = (form) => {
    const n = {
      id: nextId(issues),
      type: form.type || "Ward Requisition",
      from: form.from || form.store || "CS-01",
      dept: form.dept || form.department || "—",
      items: parseInt(form.items) || 1,
      value: parseFloat(form.value) || 0,
      requestedBy: form.requestedBy || form.requested_by || "—",
      date: nowStr(),
      status: "Pending",
    };
    setIssues(p=>[n,...p]);
    setIssueModalOpen(false);
    showToast(`${n.id} created successfully.`);
  };

  const exportCSV = () => {
    const header = "Issue #,Type,From,To (Dept),Items,Total Value,Requested By,Date & Time,Status";
    const rows   = issues.map(i=>`${i.id},${i.type},${i.from},${i.dept},${i.items},$${i.value.toFixed(2)},${i.requestedBy},${i.date},${i.status}`);
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
    <Box sx={{ bgcolor:C.bg, minHeight:"100vh" }}>
      <Box sx={{ p:"24px 28px" }}>

        {/* ── Title row ── */}
        <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", mb:2.5 }}>
          <Box>
            <Typography sx={{ fontWeight:800, fontSize:22, color:C.textPrimary, letterSpacing:-0.3 }}>
              Stock Issue
            </Typography>
            <Typography sx={{ fontSize:13, color:C.textSecondary, mt:0.3 }}>
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
            {/* Opens Issuestockmodal */}
            <Button startIcon={<Add sx={{ fontSize:16 }} />} variant="contained"
              onClick={() => setIssueModalOpen(true)}
              sx={{ bgcolor:"#2563eb", textTransform:"none", fontWeight:700, fontSize:13,
                borderRadius:"8px", height:36, px:2.5,
              
                }}>
              Issue Stock
            </Button>
          </Stack>
        </Box>

        {/* ── Stat Cards ── */}
        <Stack direction="row" spacing={1.5} sx={{ mb:2.5 }}>
          <StatCard label="Total Issues"     value={issues.length}  sub="+12 this month"                      color="#7C3AED" />
          <StatCard label="Issued"           value={issued.length}  sub={`$${issuedVal.toFixed(0)} total value`} color="#2563EB" />
          <StatCard label="Pending Approval" value={pending.length} sub="+3 this month"                       color="#16A34A" />
          <StatCard label="Most Active Dept" value={mostActive}     sub="Highest issue volume"                color="#D97706" />
        </Stack>

        {/* ── Filters ── */}
        <Box sx={{ display:"flex", alignItems:"center", gap:1.5, mb:2 }}>
          <FormControl size="small" sx={{ minWidth:148 }}>
            <Select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
              sx={{ fontSize:13, borderRadius:"8px", bgcolor:"#F9FAFB",
                "& .MuiOutlinedInput-notchedOutline":{ borderColor:C.border } }}>
              <MenuItem value="All Types">All Types</MenuItem>
              {ISSUE_TYPES.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth:148 }}>
            <Select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
              sx={{ fontSize:13, borderRadius:"8px", bgcolor:"#F9FAFB",
                "& .MuiOutlinedInput-notchedOutline":{ borderColor:C.border } }}>
              <MenuItem value="All Statuses">All Statuses</MenuItem>
              <MenuItem value="Issued">Issued</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flex:1 }} />
          <Typography sx={{ fontSize:13, color:C.textSecondary, fontWeight:500 }}>
            {filtered.length} of {issues.length} records
          </Typography>
        </Box>

        {/* ── Table ── */}
        <TableContainer component={Paper} elevation={0}
          sx={{
            border:`1px solid ${C.border}`, borderRadius:"10px", overflow:"auto",
            "&::-webkit-scrollbar":{ height:4 },
            "&::-webkit-scrollbar-track":{ background:"transparent" },
            "&::-webkit-scrollbar-thumb":{ background:"#d1d5db", borderRadius:4 },
          }}>
          <Table size="small" sx={{ minWidth:1020, tableLayout:"fixed" }}>
            <TableHead>
              <TableRow sx={{ bgcolor:"#F9FAFB" }}>
                {HEADS.map(h=>(
                  <TableCell key={h.label} sx={{
                    width:h.width, fontWeight:700, fontSize:11, color:C.textSecondary,
                    letterSpacing:0.5, py:1.4, px:1.5,
                    borderBottom:`1px solid ${C.border}`,
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
              {filtered.map((row, idx) => (
                <TableRow key={row.id} sx={{
                  bgcolor: idx%2===0 ? "#fff" : "#FAFAFA",
                  "&:hover":{ bgcolor:"#EFF6FF" },
                  transition:"background 0.15s",
                }}>
                  <TableCell sx={{ px:1.5, py:1.1 }}>
                    <Typography sx={{ fontWeight:700, color:"#1D4ED8", fontSize:12 }}>{row.id}</Typography>
                  </TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}><TypeChip type={row.type} /></TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}>
                    <Chip label={row.from} size="small" sx={{
                      bgcolor:"#F5F3FF", color:"#6D28D9", border:"1px solid #DDD6FE",
                      fontWeight:600, fontSize:11, height:22,
                    }} />
                  </TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}><DeptChip dept={row.dept} /></TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}>
                    <Typography sx={{ color:C.textSecondary, fontSize:12 }}>{row.items}</Typography>
                  </TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}>
                    <Typography sx={{ fontWeight:700, color:C.textPrimary, fontSize:12 }}>
                      ${row.value.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}>
                    <Typography sx={{ color:C.textSecondary, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {row.requestedBy}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}>
                    <Typography sx={{ color:C.textSecondary, fontSize:11, whiteSpace:"nowrap" }}>{row.date}</Typography>
                  </TableCell>
                  <TableCell sx={{ px:1.5, py:1.1 }}><StatusChip status={row.status} /></TableCell>

                  {/* ── ACTIONS ── */}
                  <TableCell sx={{ px:1.5, py:1.1 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">

                      {/* Pending: ✓ approve + ✗ reject + 🔴 info dot */}
                      {row.status==="Pending" && (<>
                        <Tooltip title="Approve & Issue">
                          <IconButton size="small" onClick={()=>approve(row.id)}
                            sx={{ bgcolor:"#F0FDF4", color:"#16A34A", "&:hover":{bgcolor:"#DCFCE7"},
                              width:26, height:26, borderRadius:"6px", border:"1px solid #BBF7D0" }}>
                            <Check sx={{ fontSize:13 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton size="small" onClick={()=>reject(row.id)}
                            sx={{ bgcolor:"#FEF2F2", color:"#DC2626", "&:hover":{bgcolor:"#FEE2E2"},
                              width:26, height:26, borderRadius:"6px", border:"1px solid #FECACA" }}>
                            <Close sx={{ fontSize:13 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small"
                            onClick={()=>{ setViewRow(row); setViewOpen(true); }}
                            sx={{ bgcolor:"#FEF2F2", color:"#DC2626", "&:hover":{bgcolor:"#FEE2E2"},
                              width:26, height:26, borderRadius:"50%", border:"1px solid #FECACA" }}>
                            <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:"#DC2626" }} />
                          </IconButton>
                        </Tooltip>
                      </>)}

                      {/* Issued: eye only */}
                      {row.status==="Issued" && (
                        <Tooltip title="View Details">
                          <IconButton size="small"
                            onClick={()=>{ setViewRow(row); setViewOpen(true); }}
                            sx={{ bgcolor:"#EFF6FF", color:"#1D4ED8", "&:hover":{bgcolor:"#DBEAFE"},
                              width:26, height:26, borderRadius:"6px" }}>
                            <Visibility sx={{ fontSize:13 }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Rejected: eye only */}
                      {row.status==="Rejected" && (
                        <Tooltip title="View Details">
                          <IconButton size="small"
                            onClick={()=>{ setViewRow(row); setViewOpen(true); }}
                            sx={{ bgcolor:"#F9FAFB", color:"#6B7280", "&:hover":{bgcolor:"#F3F4F6"},
                              width:26, height:26, borderRadius:"6px" }}>
                            <Visibility sx={{ fontSize:13 }} />
                          </IconButton>
                        </Tooltip>
                      )}

                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ── Issue Stock Modal (your existing Issuestockmodal.jsx) ── */}
      <IssueStockModal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        onSave={handleModalSave}
      />

      {/* ── View Detail Dialog ── */}
      <ViewDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        row={viewRow}
      />

      <Snackbar open={toast.open} autoHideDuration={3000}
        onClose={()=>setToast(t=>({...t,open:false}))}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}>
        <Alert severity={toast.severity} sx={{ borderRadius:"10px", fontWeight:600, fontSize:13 }}
          onClose={()=>setToast(t=>({...t,open:false}))}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}