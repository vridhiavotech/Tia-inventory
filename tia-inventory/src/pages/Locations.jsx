import { useState } from "react";
import {
  Box, Typography, Button, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Snackbar, Alert,
  Tooltip, Stack, Dialog, DialogContent, TextField,
  MenuItem, Select, Grid, Card, CardContent,
} from "@mui/material";
import { Add, Edit, Delete, Close, LocationOn } from "@mui/icons-material";
import AddLocationModal from "./Admin/AddLocationModal";

const LOCATION_TYPES = ["Central Store","Ward / Dept","Pharmacy","OT / Surgery","Laboratory","Outpatient"];

const FIELD_SX = {
  "& .MuiOutlinedInput-root": {
    borderRadius:"8px", fontSize:13, bgcolor:"#F9FAFB",
    "& fieldset":{ borderColor:"#E5E7EB" },
    "&:hover fieldset":{ borderColor:"#9CA3AF" },
    "&.Mui-focused fieldset":{ borderColor:"#7C3AED" },
  },
};
const FIELD_LABEL_SX = { fontSize:11, fontWeight:700, color:"#6B7280", letterSpacing:0.5, textTransform:"uppercase", mb:0.5 };
const SELECT_SX = {
  borderRadius:"8px", fontSize:13, bgcolor:"#F9FAFB",
  "& fieldset":{ borderColor:"#E5E7EB" },
  "&:hover fieldset":{ borderColor:"#9CA3AF" },
  "&.Mui-focused fieldset":{ borderColor:"#7C3AED" },
};

function EditLocationDialog({ open, onClose, loc, onSave }) {
  const l = loc || {};
  const init = { name:l.name||"", type:l.type||"Central Store", inCharge:l.inCharge||"", phone:l.phone||"", address:l.address||"", sub:l.sub||"" };
  const [form, setForm] = useState(init);

  const handleEnter = () => setForm({ name:l.name||"", type:l.type||"Central Store", inCharge:l.inCharge||"", phone:l.phone||"", address:l.address||"", sub:l.sub||"" });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      TransitionProps={{ onEnter: handleEnter }}
      PaperProps={{ sx:{ borderRadius:"14px", boxShadow:"0 20px 60px rgba(0,0,0,0.15)", overflow:"hidden" } }}>

      {/* Header */}
      <Box sx={{ px:"24px", pt:"20px", pb:"16px", display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", borderBottom:"1px solid #f3f4f6", flexShrink:0 }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <Box sx={{ width:38, height:38, borderRadius:"10px", bgcolor:"#FFF1F2",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LocationOn sx={{ color:"#E11D48", fontSize:22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize:16, fontWeight:700, color:"#111827" }}>Edit Location</Typography>
            <Typography sx={{ fontSize:12, color:"#9ca3af", mt:"1px" }}>Update facility details</Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}
          sx={{ color:"#9ca3af", border:"1px solid #e5e7eb", borderRadius:"8px", width:30, height:30,
            "&:hover":{ background:"#f3f4f6" } }}>
          <Close sx={{ fontSize:15 }} />
        </IconButton>
      </Box>

      {/* Body */}
      <DialogContent sx={{ px:"24px", py:"20px", overflowY:"auto", maxHeight:"70vh",
        "&::-webkit-scrollbar":{ width:4 },
        "&::-webkit-scrollbar-thumb":{ background:"#d1d5db", borderRadius:4 } }}>

        <Box sx={{ mb:1.5 }}>
          <Typography sx={FIELD_LABEL_SX}>Location Name</Typography>
          <TextField fullWidth size="small" value={form.name} onChange={set("name")} sx={FIELD_SX} />
        </Box>

        <Grid container spacing={1.5} sx={{ mb:1.5 }}>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Type</Typography>
            <Select fullWidth size="small" value={form.type} onChange={set("type")} sx={SELECT_SX}>
              {LOCATION_TYPES.map(t => <MenuItem key={t} value={t} sx={{ fontSize:13 }}>{t}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>In-Charge</Typography>
            <TextField fullWidth size="small" value={form.inCharge} onChange={set("inCharge")} sx={FIELD_SX} />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Phone</Typography>
            <TextField fullWidth size="small" value={form.phone} onChange={set("phone")} sx={FIELD_SX} />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={FIELD_LABEL_SX}>Address / Wing / Floor</Typography>
            <TextField fullWidth size="small" value={form.address} onChange={set("address")} sx={FIELD_SX} />
          </Grid>
        </Grid>

        <Typography sx={FIELD_LABEL_SX}>Notes / Description</Typography>
        <TextField fullWidth multiline rows={2} size="small" value={form.sub} onChange={set("sub")}
          placeholder="Storage conditions, access..."
          sx={{ "& .MuiOutlinedInput-root":{ fontSize:13, borderRadius:"8px", bgcolor:"#f9fafb",
            "& fieldset":{ borderColor:"#e5e7eb" }, "&.Mui-focused fieldset":{ borderColor:"#7C3AED" } } }} />
      </DialogContent>

      {/* Footer */}
      <Box sx={{ px:"24px", py:"16px", borderTop:"1px solid #f3f4f6", display:"flex",
        alignItems:"center", justifyContent:"flex-end", gap:"10px", background:"#fff", flexShrink:0 }}>
        <Button onClick={onClose}
          sx={{ fontSize:13, fontWeight:600, color:"#374151", textTransform:"none", borderRadius:"8px",
            px:"20px", py:"9px", border:"1px solid #e5e7eb", "&:hover":{ background:"#f9fafb" } }}>
          Cancel
        </Button>
        <Button onClick={() => { onSave(l.id, form); onClose(); }}
          sx={{ fontSize:13, fontWeight:600, color:"#fff", textTransform:"none", borderRadius:"8px",
            px:"20px", py:"9px", background:"#7C3AED", boxShadow:"0 2px 8px rgba(124,58,237,0.25)",
            "&:hover":{ background:"#6D28D9" } }}>
          Save Changes
        </Button>
      </Box>
    </Dialog>
  );
}

// ── Colour tokens ─────────────────────────────────────────────────────────
const C = {
  bg:            "#F5F6FA",
  border:        "#E5E7EB",
  textPrimary:   "#111827",
  textSecondary: "#6B7280",
  primary:       "#1976D2",
};

// ── Seed data ─────────────────────────────────────────────────────────────
const SEED_LOCATIONS = [
  {
    id: "CS-01", code: "CS-01", codeBg:"#EFF6FF", codeColor:"#1D4ED8", codeBorder:"#BFDBFE", codeAccent:"#1976D2",
    name: "Central Store",  sub: "Main warehouse — all procurement received here",
    type: "Central Store",  inCharge: "Admin",          phone: "Ext 100", address: "Ground Floor, Main Block",
    users: 1, status: "Active",
  },
  {
    id: "ICU-01", code: "ICU-01", codeBg:"#FFF7ED", codeColor:"#C2410C", codeBorder:"#FED7AA", codeAccent:"#EA580C",
    name: "ICU",            sub: "Critical care unit",
    type: "Ward/Dept",      inCharge: "Dr. Patel",      phone: "Ext 201", address: "3rd Floor, East Wing",
    users: 1, status: "Active",
  },
  {
    id: "ED-01", code: "ED-01", codeBg:"#FEF2F2", codeColor:"#DC2626", codeBorder:"#FECACA", codeAccent:"#DC2626",
    name: "Emergency Dept", sub: "24/7 emergency",
    type: "Ward/Dept",      inCharge: "Dr. Mehra",      phone: "Ext 300", address: "Ground Floor, North Wing",
    users: 0, status: "Active",
  },
  {
    id: "PH-01", code: "PH-01", codeBg:"#F0FDF4", codeColor:"#15803D", codeBorder:"#BBF7D0", codeAccent:"#16A34A",
    name: "Pharmacy",       sub: "Main dispensing pharmacy",
    type: "Pharmacy",       inCharge: "P. Chen, PharmD", phone: "Ext 150", address: "Ground Floor, Main Block",
    users: 1, status: "Active",
  },
  {
    id: "OR-01", code: "OR-01", codeBg:"#FAF5FF", codeColor:"#7E22CE", codeBorder:"#E9D5FF", codeAccent:"#7C3AED",
    name: "OR / Surgery",   sub: "Operating theatre complex",
    type: "OT / Surgery",   inCharge: "Dr. Kapoor",     phone: "Ext 400", address: "2nd Floor, West Wing",
    users: 0, status: "Active",
  },
  {
    id: "LAB-01", code: "LAB-01", codeBg:"#F0F9FF", codeColor:"#0369A1", codeBorder:"#BAE6FD", codeAccent:"#0284C7",
    name: "Laboratory",     sub: "Pathology & clinical labs",
    type: "Laboratory",     inCharge: "T. Williams",    phone: "Ext 180", address: "1st Floor, East Wing",
    users: 0, status: "Active",
  },
];

// Code badge colours for new locations
const CODE_PALETTE = [
  { bg:"#F5F3FF", color:"#6D28D9", border:"#DDD6FE", accent:"#7C3AED" },
  { bg:"#FFF1F2", color:"#BE123C", border:"#FECDD3", accent:"#E11D48" },
  { bg:"#F0FDF4", color:"#15803D", border:"#BBF7D0", accent:"#16A34A" },
  { bg:"#EFF6FF", color:"#1D4ED8", border:"#BFDBFE", accent:"#1976D2" },
];

// ── Column header ─────────────────────────────────────────────────────────
const TH = ({ children, width }) => (
  <TableCell sx={{
    width, fontWeight:700, fontSize:11, color:C.textSecondary,
    letterSpacing:0.5, textTransform:"uppercase",
    py:1.4, px:1.5, borderBottom:`1px solid ${C.border}`,
    whiteSpace:"nowrap", bgcolor:"#F9FAFB",
  }}>
    {children}
  </TableCell>
);

export default function Locations() {
  const [locations, setLocations] = useState(SEED_LOCATIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLoc,   setEditLoc]   = useState(null);
  const [editOpen,  setEditOpen]  = useState(false);
  const [toast,     setToast]     = useState({ open:false, msg:"", severity:"success" });

  const showToast = (msg, severity = "success") => setToast({ open:true, msg, severity });

  const activeCount = locations.filter(l => l.status === "Active").length;

  const handleSave = (form) => {
    const codeStr   = form.code.replace(/[^A-Za-z0-9-]/g,"").toUpperCase();
    const palette   = CODE_PALETTE[locations.length % CODE_PALETTE.length];
    const newLoc = {
      id:          codeStr,
      code:        codeStr,
      codeBg:      palette.bg,
      codeColor:   palette.color,
      codeBorder:  palette.border,
      codeAccent:  palette.accent,
      name:        form.name,
      sub:         form.notes || "",
      type:        form.type,
      inCharge:    form.inCharge || "—",
      phone:       form.phone   || "—",
      address:     form.address || "—",
      users:       0,
      status:      "Active",
    };
    setLocations(p => [...p, newLoc]);
    setModalOpen(false);
    showToast(`"${form.name}" added successfully.`);
  };

  const handleEditSave = (id, form) => {
    setLocations(p => p.map(l => l.id !== id ? l : {
      ...l,
      name:     form.name     || l.name,
      type:     form.type     || l.type,
      inCharge: form.inCharge || l.inCharge,
      phone:    form.phone    || l.phone,
      address:  form.address  || l.address,
      sub:      form.sub      || l.sub,
    }));
    showToast("Location updated successfully.");
  };

  const handleDelete = (id) => {
    setLocations(p => p.filter(l => l.id !== id));
    showToast("Location removed.", "warning");
  };

  return (
    <Box sx={{ background: "#f8fafc", minHeight: "100vh", padding: "26px 24px" }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>

        {/* ── Title row ── */}
        <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", mb:2.5 }}>
          <Box>
            <Typography sx={{ fontWeight:700, fontSize:22, color:C.textPrimary, letterSpacing:-0.3 }}>
              Locations
            </Typography>
            <Typography sx={{ fontSize:13, color:C.textSecondary, mt:0.3 }}>
              {locations.length} locations · {activeCount} active
            </Typography>
          </Box>
          <Button startIcon={<Add sx={{ fontSize:16 }} />} variant="contained"
            onClick={() => setModalOpen(true)}
            sx={{
              bgcolor:"#2563eb", textTransform:"none", fontWeight:700, fontSize:13,
              borderRadius:"8px", height:36, px:2.5,
              boxShadow:"0 1px 4px #2563eb",
              "&:hover":{ bgcolor:"#2563eb" },
            }}>
            Add Location
          </Button>
        </Box>

        {/* ── MAIN OUTER CARD ── */}
        <Card sx={{ 
          width: '100%',
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
        }}>
          <CardContent sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            '&:last-child': { pb: { xs: 2, sm: 3, md: 4 } },
          }}>
            <TableContainer component={Paper} elevation={0}
              sx={{
                border:`1px solid ${C.border}`, borderRadius:"10px", overflow:"hidden",
                "&::-webkit-scrollbar":{ height:4 },
                "&::-webkit-scrollbar-thumb":{ background:"#d1d5db", borderRadius:4 },
              }}>
              <Table size="small"   sx={{
    width: "100%",
    tableLayout: "fixed", // important
  }} >
                <TableHead>
                  <TableRow>
                    <TH >Code</TH>
                    <TH >Name</TH>
                    <TH >Type</TH>
                    <TH >In-Charge</TH>
                    <TH >Phone</TH>
                    <TH >Address</TH>
                    <TH >Users</TH>
                    <TH >Status</TH>
                    <TH >Actions</TH>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py:5, fontSize:13, color:C.textSecondary }}>
                        No locations found.
                      </TableCell>
                    </TableRow>
                  )}
                  {locations.map((loc, idx) => (
                    <TableRow key={loc.id}
                      sx={{ bgcolor: idx%2===0 ? "#fff" : "#FAFAFA", "&:hover":{ bgcolor:"#EFF6FF" }, transition:"background 0.15s" }}>

                      {/* Code badge */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Chip label={loc.code} size="small" sx={{
                          bgcolor:loc.codeBg, color:loc.codeColor, border:`1px solid ${loc.codeBorder}`,
                          fontWeight:700, fontSize:11, height:22,
                        }} />
                      </TableCell>

                      {/* Name + sub */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Typography sx={{ fontSize:13, fontWeight:700, color:C.textPrimary, lineHeight:1.3 }}>
                          {loc.name}
                        </Typography>
                        {loc.sub && (
                          <Typography sx={{ fontSize:11, color:C.textSecondary, mt:0.1 }}>
                            {loc.sub}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Type */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Typography sx={{ fontSize:12, color:C.textSecondary }}>{loc.type}</Typography>
                      </TableCell>

                      {/* In-Charge */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Typography sx={{ fontSize:12, color:C.textPrimary, fontWeight:500 }}>{loc.inCharge}</Typography>
                      </TableCell>

                      {/* Phone */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Typography sx={{ fontSize:12, color:C.textSecondary }}>{loc.phone}</Typography>
                      </TableCell>

                      {/* Address */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Typography sx={{ fontSize:12, color:C.textSecondary }}>{loc.address}</Typography>
                      </TableCell>

                      {/* Users */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Typography sx={{ fontSize:12, color:C.textSecondary, fontWeight:600 }}>{loc.users}</Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Chip label="Active" size="small" sx={{
                          bgcolor:"#F0FDF4", color:"#16A34A", border:"1px solid #BBF7D0",
                          fontWeight:700, fontSize:11, height:22,
                        }} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell sx={{ px:1.5, py:1.2 }}>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => { setEditLoc(loc); setEditOpen(true); }} sx={{
                              bgcolor:"#EFF6FF", color:"#1D4ED8",
                              "&:hover":{ bgcolor:"#DBEAFE" }, width:26, height:26, borderRadius:"6px",
                            }}>
                              <Edit sx={{ fontSize:13 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton size="small" onClick={() => handleDelete(loc.id)} sx={{
                              bgcolor:"#FEF2F2", color:"#DC2626",
                              "&:hover":{ bgcolor:"#FEE2E2" }, width:26, height:26, borderRadius:"6px",
                            }}>
                              <Delete sx={{ fontSize:13 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* ── Edit Modal ── */}
        <EditLocationDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          loc={editLoc}
          onSave={handleEditSave}
        />

        {/* ── Add Modal ── */}
        <AddLocationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />

        <Snackbar open={toast.open} autoHideDuration={3000}
          onClose={() => setToast(t => ({...t, open:false}))}
          anchorOrigin={{ vertical:"bottom", horizontal:"right" }}>
          <Alert severity={toast.severity} sx={{ borderRadius:"10px", fontWeight:600, fontSize:13 }}
            onClose={() => setToast(t => ({...t, open:false}))}>
            {toast.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}