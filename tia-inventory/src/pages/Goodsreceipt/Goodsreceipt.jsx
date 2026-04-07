// import { useState } from "react";
// import {
//   Box, Typography, Button, Table, TableBody, TableCell,
//   TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
//   Dialog, DialogContent, InputBase, Divider, Menu, MenuItem,
// } from "@mui/material";
// import NewGRNDialog from "./newgrnmodal";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import CloseIcon from "@mui/icons-material/Close";
// import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

// export default function GoodsReceipt() {
//   const [receipts, setReceipts] = useState([
//     { id:"GRN-2026-0003", linkedPO:"PO-2026-0002", supplier:"Medline Industries",        location:"CS-01", items:2, totalValue:"$696",   receivedBy:"S. Anderson", date:"Mar 20, 2026", condition:"Good",           status:"Completed"   },
//     { id:"GRN-2026-0002", linkedPO:"PO-2026-0004", supplier:"McKesson Medical-Surgical", location:"CS-01", items:1, totalValue:"$360",   receivedBy:"S. Anderson", date:"Mar 19, 2026", condition:"Short Delivery", status:"Discrepancy" },
//     { id:"GRN-2026-0001", linkedPO:"PO-2026-0001", supplier:"Cardinal Health",           location:"CS-02", items:5, totalValue:"$1,240", receivedBy:"T. Williams", date:"Mar 15, 2026", condition:"Good",           status:"Pending"     },
//   ]);

//   const [newGRNOpen,      setNewGRNOpen]      = useState(false);
//   const [viewReceipt,     setViewReceipt]     = useState(null);
//   const [searchTerm,      setSearchTerm]      = useState("");
//   const [statusFilter,    setStatusFilter]    = useState("All Statuses");
//   const [conditionFilter, setConditionFilter] = useState("All Conditions");
//   const [statusAnchor,    setStatusAnchor]    = useState(null);
//   const [conditionAnchor, setConditionAnchor] = useState(null);

//   const stats = [
//     { label:"Total GRNs",    value:receipts.length,                                    sub:"All receipts",          color:"#f59e0b" },
//     { label:"Pending GRN",   value:receipts.filter(r=>r.status==="Pending").length,    sub:"Awaiting action",       color:"#8b5cf6" },
//     { label:"Discrepancies", value:receipts.filter(r=>r.status==="Discrepancy").length,sub:"Needs review",          color:"#ef4444" },
//     { label:"Completed",     value:receipts.filter(r=>r.status==="Completed").length,  sub:"Successfully received", color:"#10b981" },
//   ];

//   const filteredReceipts = receipts.filter((r) => {
//     const matchesSearch    = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus    = statusFilter    === "All Statuses"   || r.status    === statusFilter;
//     const matchesCondition = conditionFilter === "All Conditions" || r.condition === conditionFilter;
//     return matchesSearch && matchesStatus && matchesCondition;
//   });

//   const handleNewGRNSave = (grn) => setReceipts((prev) => [grn, ...prev]);

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "Completed":   return { bg:"#dcfce7", color:"#16a34a" };
//       case "Discrepancy": return { bg:"#fef9c3", color:"#ca8a04" };
//       case "Pending":     return { bg:"#e0f2fe", color:"#0284c7" };
//       default:            return { bg:"#f3f4f6", color:"#6b7280" };
//     }
//   };

//   const getConditionStyle = (condition) => {
//     if (condition === "Good")                                      return { color:"#16a34a" };
//     if (condition === "Short Delivery" || condition === "Damaged") return { color:"#dc2626" };
//     return { color:"#6b7280" };
//   };

//   const DropdownButton = ({ anchor, setAnchor, options, value, setValue }) => (
//     <>
//       <Button endIcon={<KeyboardArrowDownIcon sx={{ fontSize:16 }} />} onClick={(e) => setAnchor(e.currentTarget)}
//         sx={{ fontSize:13, fontWeight:500, color:"#374151", textTransform:"none", border:"1px solid #e5e7eb",
//           borderRadius:"6px", px:1.5, py:0.75, bgcolor:"#fff", outline:"none",
//           "&:hover":{ bgcolor:"#f9fafb", borderColor:"#d1d5db" }, "&:focus":{ outline:"none" } }}>
//         {value}
//       </Button>
//       <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
//         PaperProps={{ sx:{ boxShadow:"0 4px 12px rgba(0,0,0,0.1)", borderRadius:"8px", mt:0.5 } }}>
//         {options.map((opt) => (
//           <MenuItem key={opt} onClick={() => { setValue(opt); setAnchor(null); }} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
//             {opt}
//           </MenuItem>
//         ))}
//       </Menu>
//     </>
//   );

//   // ── View-only field row
//   const ViewRow = ({ label, value, valueColor }) => (
//     <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", py:"10px", borderBottom:"1px solid #f3f4f6" }}>
//       <Typography sx={{ fontSize:12, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", minWidth:130 }}>
//         {label}
//       </Typography>
//       <Typography sx={{ fontSize:13, fontWeight:600, color: valueColor || "#111827", textAlign:"right" }}>
//         {value || "—"}
//       </Typography>
//     </Box>
//   );

//   return (
//     <Box sx={{ background: "#f8f9fb", minHeight: "100vh" }}>
//       <Box sx={{ p: "28px 32px", boxSizing: "border-box" }}>

//         {/* Header */}
//         <Box sx={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:2, mb:3 }}>
//           <Box>
//             <Typography sx={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Goods Receipt (GRN)</Typography>
//             <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
//               {receipts.length} receipts · Purchase Order → Receive → Inspect → Confirm → Close
//             </Typography>
//           </Box>
//           <Button startIcon={<AddIcon sx={{ fontSize:16 }} />} onClick={() => setNewGRNOpen(true)} disableRipple
//             sx={{ fontSize:13, fontWeight:700, color:"#fff", textTransform:"none", bgcolor:"#2563eb",
//               borderRadius:"8px", px:2, height:36, outline:"none",
//               boxShadow:"0 1px 4px rgba(99,102,241,0.35)",
//               "&:hover":{ bgcolor:"#1d4ed8" }, "&:focus":{ outline:"none" } }}>
//             New GRN
//           </Button>
//         </Box>

//         {/* Stat Cards */}
//         <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
//           {stats.map((s) => (
//             <Box key={s.label} sx={{ flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb", borderLeft: `3px solid ${s.color}`, borderRadius: "10px", px: 2, py: 1.5, minWidth: 0 }}>
//               <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>{s.label}</Typography>
//               <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{s.value}</Typography>
//               <Typography sx={{ fontSize: 11, fontWeight: 600, color: s.color, mt: 0.3 }}>{s.sub}</Typography>
//             </Box>
//           ))}
//         </Box>

//         {/* Filters */}
//         <Box sx={{ display: "flex", gap: "12px", alignItems: "center", mb: "20px", flexWrap: "wrap" }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: "1px solid #e5e7eb", borderRadius: "8px", px: 1.5, py: 0.75, bgcolor: "#fff", width: 260 }}>
//             <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
//             <InputBase sx={{ fontSize: 13, color: "#374151", flex: 1 }} placeholder="Search GRN ID or Supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           </Box>
//           <DropdownButton value={conditionFilter} setValue={setConditionFilter} anchor={conditionAnchor} setAnchor={setConditionAnchor} options={["All Conditions","Good","Short Delivery","Damaged"]} />
//           <DropdownButton value={statusFilter}    setValue={setStatusFilter}    anchor={statusAnchor}    setAnchor={setStatusAnchor}    options={["All Statuses","Completed","Discrepancy","Pending"]} />
//         </Box>

//         {/* Table */}
//         <TableContainer component={Paper} elevation={0}
//           sx={{ border:"1px solid #E5E7EB", borderRadius:"10px", overflow:"auto",
//             "&::-webkit-scrollbar":{ height:4 }, "&::-webkit-scrollbar-thumb":{ background:"#d1d5db", borderRadius:4 } }}>
//           <Table sx={{ minWidth:1100, tableLayout:"fixed" }}>
//             <TableHead>
//               <TableRow sx={{ background: "#f8f9fb" }}>
//                 {[
//                   { label:"Request #",   width:130 },
//                   { label:"Supplier",    width:170 },
//                   { label:"Linked PO",   width:110 },
//                   { label:"Location",    width:80  },
//                   { label:"Items",       width:60  },
//                   { label:"Total Value", width:90  },
//                   { label:"Received By", width:110 },
//                   { label:"Date",        width:110 },
//                   { label:"Condition",   width:120 },
//                   { label:"Status",      width:100 },
//                   { label:"Action",      width:70  },
//                 ].map((h) => (
//                   <TableCell key={h.label}
//                     align={["Items","Total Value","Action"].includes(h.label)?"center":"left"}
//                     sx={{ width: h.width, fontSize: 11, fontWeight: 600, color: "#9ca3af", py: "12px", px: "16px", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>
//                     {h.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredReceipts.length > 0 ? (
//                 filteredReceipts.map((receipt, idx) => {
//                   const ss = getStatusStyle(receipt.status);
//                   const cs = getConditionStyle(receipt.condition);
//                   return (
//                     <TableRow key={receipt.id} sx={{ background: "#fff", "&:hover": { background: "#fafafa" }, transition: "background 0.15s" }}>
//                       <TableCell sx={{ py: "14px", px: "16px", fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>{receipt.id}</TableCell>
//                       <TableCell sx={{ py:1.2 }}><Typography sx={{ fontSize:13, fontWeight:500, color:"#111827" }}>{receipt.supplier}</Typography></TableCell>
//                       <TableCell sx={{ py:1.2, fontSize:13, color:"#6b7280" }}>{receipt.linkedPO||"–"}</TableCell>
//                       <TableCell sx={{ py:1.2 }}><Chip label={receipt.location} size="small" sx={{ height: 22, fontSize: 11, fontWeight: 600, color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: "6px", "& .MuiChip-label": { px: "8px" } }} /></TableCell>
//                       <TableCell align="center" sx={{ py:1.2, fontSize:13, color:"#374151" }}>{receipt.items}</TableCell>
//                       <TableCell align="center" sx={{ py:1.2, fontSize:13, fontWeight:700, color:"#111827" }}>{receipt.totalValue}</TableCell>
//                       <TableCell sx={{ py:1.2, fontSize:13, color:"#6b7280" }}>{receipt.receivedBy}</TableCell>
//                       <TableCell sx={{ py:1.2, fontSize:13, color:"#9ca3af", whiteSpace:"nowrap" }}>{receipt.date}</TableCell>
//                       <TableCell sx={{ py:1.2, fontSize:13, fontWeight:600, ...cs }}>{receipt.condition}</TableCell>
//                       <TableCell sx={{ py:1.2 }}><Chip label={receipt.status} size="small" sx={{ height:22, fontSize:11, fontWeight:600, bgcolor:ss.bg, color:ss.color }} /></TableCell>
//                       <TableCell align="center" sx={{ py:1.2 }}>
//                         <IconButton
//                           size="small"
//                           onClick={() => setViewReceipt(receipt)}
//                           sx={{ color:"#9ca3af", p:0.5, borderRadius:"6px", outline:"none",
//                             "&:hover":{ color:"#2563eb", bgcolor:"#eff6ff" }, "&:focus":{ outline:"none" } }}
//                         >
//                           <VisibilityOutlinedIcon sx={{ fontSize:17 }} />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               ) : (
//                 <TableRow><TableCell colSpan={11} align="center" sx={{ py:5, color:"#9ca3af", fontSize:13 }}>No receipts found</TableCell></TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* ── New GRN Dialog ── */}
//       <NewGRNDialog
//         open={newGRNOpen}
//         onClose={() => setNewGRNOpen(false)}
//         onSave={handleNewGRNSave}
//         nextId={`GRN-${new Date().getFullYear()}-${String(receipts.length+1).padStart(4,"0")}`}
//       />

//       {/* ── View GRN Dialog (read-only) ── */}
//       <Dialog
//         open={Boolean(viewReceipt)}
//         onClose={() => setViewReceipt(null)}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{ sx:{ borderRadius:"14px", boxShadow:"0 20px 60px rgba(0,0,0,0.15)", overflow:"hidden" } }}
//       >
//         {viewReceipt && (
//           <>
//             {/* Header */}
//             <Box sx={{ px:"24px", pt:"20px", pb:"16px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", borderBottom:"1px solid #f3f4f6", bgcolor:"#fff" }}>
//               <Box sx={{ display:"flex", alignItems:"center", gap:"12px" }}>
//                 <Box sx={{ width:38, height:38, borderRadius:"10px", background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                   <LocalShippingOutlinedIcon sx={{ fontSize:20, color:"#2563eb" }} />
//                 </Box>
//                 <Box>
//                   <Typography sx={{ fontSize:16, fontWeight:700, color:"#111827" }}>
//                     {viewReceipt.id}
//                   </Typography>
//                   <Typography sx={{ fontSize:12, color:"#9ca3af", mt:"1px" }}>
//                     Goods Receipt Details
//                   </Typography>
//                 </Box>
//               </Box>
//               <IconButton
//                 size="small"
//                 onClick={() => setViewReceipt(null)}
//                 disableRipple
//                 sx={{ color:"#9ca3af", border:"1px solid #e5e7eb", borderRadius:"8px", width:30, height:30, outline:"none",
//                   "&:hover":{ background:"#f3f4f6", color:"#374151" }, "&:focus":{ outline:"none" } }}
//               >
//                 <CloseIcon sx={{ fontSize:15 }} />
//               </IconButton>
//             </Box>

//             <DialogContent sx={{ px:"24px", py:"8px", bgcolor:"#fff" }}>
//               {/* Status badge at top */}
//               <Box sx={{ display:"flex", justifyContent:"flex-end", pt:"8px", mb:"4px" }}>
//                 {(() => {
//                   const ss = getStatusStyle(viewReceipt.status);
//                   return (
//                     <Chip
//                       label={viewReceipt.status}
//                       size="small"
//                       sx={{ height:24, fontSize:12, fontWeight:700, bgcolor:ss.bg, color:ss.color, px:0.5 }}
//                     />
//                   );
//                 })()}
//               </Box>

//               <ViewRow label="Linked PO"   value={viewReceipt.linkedPO} />
//               <ViewRow label="Supplier"    value={viewReceipt.supplier} />
//               <ViewRow label="Location"    value={viewReceipt.location} />
//               <ViewRow label="Items"       value={String(viewReceipt.items)} />
//               <ViewRow label="Total Value" value={viewReceipt.totalValue} valueColor="#111827" />
//               <ViewRow label="Received By" value={viewReceipt.receivedBy} />
//               <ViewRow label="Date"        value={viewReceipt.date} />
//               <ViewRow
//                 label="Condition"
//                 value={viewReceipt.condition}
//                 valueColor={getConditionStyle(viewReceipt.condition).color}
//               />

//               <Box sx={{ pt:"16px", pb:"8px" }} />
//             </DialogContent>

//             <Divider />

//             {/* Footer */}
//             <Box sx={{ px:"24px", py:"14px", display:"flex", justifyContent:"flex-end", bgcolor:"#fff" }}>
//               <Button
//                 onClick={() => setViewReceipt(null)}
//                 disableRipple
//                 sx={{ fontSize:13, fontWeight:600, color:"#374151", textTransform:"none",
//                   border:"1px solid #e5e7eb", borderRadius:"8px", px:"20px", py:"8px",
//                   bgcolor:"#fff", outline:"none",
//                   "&:hover":{ bgcolor:"#f9fafb" }, "&:focus":{ outline:"none" } }}
//               >
//                 Close
//               </Button>
//             </Box>
//           </>
//         )}
//       </Dialog>
//     </Box>
//   );
// }

import { useState } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Dialog, DialogContent, InputBase, Divider, Menu, MenuItem,
} from "@mui/material";
import NewGRNDialog from "./newgrnmodal";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function GoodsReceipt() {
  const [receipts, setReceipts] = useState([
    { id:"GRN-2026-0003", linkedPO:"PO-2026-0002", supplier:"Medline Industries",        location:"CS-01", items:2, totalValue:"$696",   receivedBy:"S. Anderson", date:"Mar 20, 2026", condition:"Good",           status:"Completed"   },
    { id:"GRN-2026-0002", linkedPO:"PO-2026-0004", supplier:"McKesson Medical-Surgical", location:"CS-01", items:1, totalValue:"$360",   receivedBy:"S. Anderson", date:"Mar 19, 2026", condition:"Short Delivery", status:"Discrepancy" },
    { id:"GRN-2026-0001", linkedPO:"PO-2026-0001", supplier:"Cardinal Health",           location:"CS-02", items:5, totalValue:"$1,240", receivedBy:"T. Williams", date:"Mar 15, 2026", condition:"Good",           status:"Pending"     },
  ]);

  const [newGRNOpen,      setNewGRNOpen]      = useState(false);
  const [viewReceipt,     setViewReceipt]     = useState(null);
  const [searchTerm,      setSearchTerm]      = useState("");
  const [statusFilter,    setStatusFilter]    = useState("All Statuses");
  const [conditionFilter, setConditionFilter] = useState("All Conditions");
  const [statusAnchor,    setStatusAnchor]    = useState(null);
  const [conditionAnchor, setConditionAnchor] = useState(null);

  const stats = [
    { label:"Total GRNs",    value:receipts.length,                                    sub:"All receipts",          color:"#f59e0b" },
    { label:"Pending GRN",   value:receipts.filter(r=>r.status==="Pending").length,    sub:"Awaiting action",       color:"#8b5cf6" },
    { label:"Discrepancies", value:receipts.filter(r=>r.status==="Discrepancy").length,sub:"Needs review",          color:"#ef4444" },
    { label:"Completed",     value:receipts.filter(r=>r.status==="Completed").length,  sub:"Successfully received", color:"#10b981" },
  ];

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch    = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus    = statusFilter    === "All Statuses"   || r.status    === statusFilter;
    const matchesCondition = conditionFilter === "All Conditions" || r.condition === conditionFilter;
    return matchesSearch && matchesStatus && matchesCondition;
  });

  const handleNewGRNSave = (grn) => setReceipts((prev) => [grn, ...prev]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":   return { bg:"#dcfce7", color:"#16a34a" };
      case "Discrepancy": return { bg:"#fef9c3", color:"#ca8a04" };
      case "Pending":     return { bg:"#e0f2fe", color:"#0284c7" };
      default:            return { bg:"#f3f4f6", color:"#6b7280" };
    }
  };

  const getConditionStyle = (condition) => {
    if (condition === "Good")                                      return { color:"#16a34a" };
    if (condition === "Short Delivery" || condition === "Damaged") return { color:"#dc2626" };
    return { color:"#6b7280" };
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setStatusAnchor(null);
  };

  const handleConditionFilterChange = (value) => {
    setConditionFilter(value);
    setConditionAnchor(null);
  };

  // ViewRow component inside
  const ViewRow = ({ label, value, valueColor }) => (
    <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", py:"10px", borderBottom:"1px solid #f3f4f6" }}>
      <Typography sx={{ fontSize:12, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", minWidth:130 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize:13, fontWeight:600, color: valueColor || "#111827", textAlign:"right" }}>
        {value || "—"}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ background: "#f8f9fb", minHeight: "100vh" }}>
      <Box sx={{ p: "28px 32px", boxSizing: "border-box" }}>

        {/* Header */}
        <Box sx={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:2, mb:3 }}>
          <Box>
            <Typography sx={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Goods Receipt (GRN)</Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
              {receipts.length} receipts · Purchase Order → Receive → Inspect → Confirm → Close
            </Typography>
          </Box>
          <Button startIcon={<AddIcon sx={{ fontSize:16 }} />} onClick={() => setNewGRNOpen(true)} disableRipple
            sx={{ fontSize:13, fontWeight:700, color:"#fff", textTransform:"none", bgcolor:"#2563eb",
              borderRadius:"8px", px:2, height:36, outline:"none",
              boxShadow:"0 1px 4px rgba(99,102,241,0.35)",
              "&:hover":{ bgcolor:"#1d4ed8" }, "&:focus":{ outline:"none" } }}>
            New GRN
          </Button>
        </Box>

        {/* Stat Cards */}
        <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
          {stats.map((s) => (
            <Box key={s.label} sx={{ flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb", borderLeft: `3px solid ${s.color}`, borderRadius: "10px", px: 2, py: 1.5, minWidth: 0 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: s.color, mt: 0.3 }}>{s.sub}</Typography>
            </Box>
          ))}
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center", mb: "20px", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: "1px solid #e5e7eb", borderRadius: "8px", px: 1.5, py: 0.75, bgcolor: "#fff", width: 260 }}>
            <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
            <InputBase sx={{ fontSize: 13, color: "#374151", flex: 1 }} placeholder="Search GRN ID or Supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Box>
          
          {/* Condition Dropdown */}
          <Button 
            ref={(ref) => {
              if (ref && conditionAnchor === ref) return;
            }}
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize:16 }} />} 
            onClick={(e) => setConditionAnchor(e.currentTarget)}
            sx={{ fontSize:13, fontWeight:500, color:"#374151", textTransform:"none", border:"1px solid #e5e7eb",
              borderRadius:"6px", px:1.5, py:0.75, bgcolor:"#fff", outline:"none",
              "&:hover":{ bgcolor:"#f9fafb", borderColor:"#d1d5db" }, "&:focus":{ outline:"none" } }}>
            {conditionFilter}
          </Button>
          <Menu 
            anchorEl={conditionAnchor} 
            open={Boolean(conditionAnchor)} 
            onClose={() => setConditionAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{ sx:{ boxShadow:"0 4px 12px rgba(0,0,0,0.1)", borderRadius:"8px", mt:0.5, minWidth:150 } }}>
            <MenuItem onClick={() => handleConditionFilterChange("All Conditions")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              All Conditions
            </MenuItem>
            <MenuItem onClick={() => handleConditionFilterChange("Good")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              Good
            </MenuItem>
            <MenuItem onClick={() => handleConditionFilterChange("Short Delivery")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              Short Delivery
            </MenuItem>
            <MenuItem onClick={() => handleConditionFilterChange("Damaged")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              Damaged
            </MenuItem>
          </Menu>

          {/* Status Dropdown */}
          <Button 
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize:16 }} />} 
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            sx={{ fontSize:13, fontWeight:500, color:"#374151", textTransform:"none", border:"1px solid #e5e7eb",
              borderRadius:"6px", px:1.5, py:0.75, bgcolor:"#fff", outline:"none",
              "&:hover":{ bgcolor:"#f9fafb", borderColor:"#d1d5db" }, "&:focus":{ outline:"none" } }}>
            {statusFilter}
          </Button>
          <Menu 
            anchorEl={statusAnchor} 
            open={Boolean(statusAnchor)} 
            onClose={() => setStatusAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{ sx:{ boxShadow:"0 4px 12px rgba(0,0,0,0.1)", borderRadius:"8px", mt:0.5, minWidth:150 } }}>
            <MenuItem onClick={() => handleStatusFilterChange("All Statuses")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              All Statuses
            </MenuItem>
            <MenuItem onClick={() => handleStatusFilterChange("Completed")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              Completed
            </MenuItem>
            <MenuItem onClick={() => handleStatusFilterChange("Discrepancy")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              Discrepancy
            </MenuItem>
            <MenuItem onClick={() => handleStatusFilterChange("Pending")} sx={{ fontSize:13, color:"#374151", py:0.75 }}>
              Pending
            </MenuItem>
          </Menu>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} elevation={0}
          sx={{ border:"1px solid #E5E7EB", borderRadius:"10px", overflow:"auto",
            "&::-webkit-scrollbar":{ height:4 }, "&::-webkit-scrollbar-thumb":{ background:"#d1d5db", borderRadius:4 } }}>
          <Table sx={{ minWidth:1100, tableLayout:"fixed" }}>
            <TableHead>
              <TableRow sx={{ background: "#f8f9fb" }}>
                {[
                  { label:"Request #",   width:130 },
                  { label:"Supplier",    width:170 },
                  { label:"Linked PO",   width:110 },
                  { label:"Location",    width:80  },
                  { label:"Items",       width:60  },
                  { label:"Total Value", width:90  },
                  { label:"Received By", width:110 },
                  { label:"Date",        width:110 },
                  { label:"Condition",   width:120 },
                  { label:"Status",      width:100 },
                  { label:"Action",      width:70  },
                ].map((h) => (
                  <TableCell key={h.label}
                    align={["Items","Total Value","Action"].includes(h.label)?"center":"left"}
                    sx={{ width: h.width, fontSize: 11, fontWeight: 600, color: "#9ca3af", py: "12px", px: "16px", borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>
                    {h.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map((receipt) => {
                  const ss = getStatusStyle(receipt.status);
                  const cs = getConditionStyle(receipt.condition);
                  return (
                    <TableRow key={receipt.id} sx={{ background: "#fff", "&:hover": { background: "#fafafa" }, transition: "background 0.15s" }}>
                      <TableCell sx={{ py: "14px", px: "16px", fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>{receipt.id}</TableCell>
                      <TableCell sx={{ py:1.2 }}><Typography sx={{ fontSize:13, fontWeight:500, color:"#111827" }}>{receipt.supplier}</Typography></TableCell>
                      <TableCell sx={{ py:1.2, fontSize:13, color:"#6b7280" }}>{receipt.linkedPO||"–"}</TableCell>
                      <TableCell sx={{ py:1.2 }}><Chip label={receipt.location} size="small" sx={{ height: 22, fontSize: 11, fontWeight: 600, color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: "6px", "& .MuiChip-label": { px: "8px" } }} /></TableCell>
                      <TableCell align="center" sx={{ py:1.2, fontSize:13, color:"#374151" }}>{receipt.items}</TableCell>
                      <TableCell align="center" sx={{ py:1.2, fontSize:13, fontWeight:700, color:"#111827" }}>{receipt.totalValue}</TableCell>
                      <TableCell sx={{ py:1.2, fontSize:13, color:"#6b7280" }}>{receipt.receivedBy}</TableCell>
                      <TableCell sx={{ py:1.2, fontSize:13, color:"#9ca3af", whiteSpace:"nowrap" }}>{receipt.date}</TableCell>
                      <TableCell sx={{ py:1.2, fontSize:13, fontWeight:600, ...cs }}>{receipt.condition}</TableCell>
                      <TableCell sx={{ py:1.2 }}><Chip label={receipt.status} size="small" sx={{ height:22, fontSize:11, fontWeight:600, bgcolor:ss.bg, color:ss.color }} /></TableCell>
                      <TableCell align="center" sx={{ py:1.2 }}>
                        <IconButton
                          size="small"
                          onClick={() => setViewReceipt(receipt)}
                          sx={{ color:"#9ca3af", p:0.5, borderRadius:"6px", outline:"none",
                            "&:hover":{ color:"#2563eb", bgcolor:"#eff6ff" }, "&:focus":{ outline:"none" } }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize:17 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow><TableCell colSpan={11} align="center" sx={{ py:5, color:"#9ca3af", fontSize:13 }}>No receipts found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ── New GRN Dialog ── */}
      <NewGRNDialog
        open={newGRNOpen}
        onClose={() => setNewGRNOpen(false)}
        onSave={handleNewGRNSave}
        nextId={`GRN-${new Date().getFullYear()}-${String(receipts.length+1).padStart(4,"0")}`}
      />

      {/* ── View GRN Dialog (read-only) ── */}
      <Dialog
        open={Boolean(viewReceipt)}
        onClose={() => setViewReceipt(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx:{ borderRadius:"14px", boxShadow:"0 20px 60px rgba(0,0,0,0.15)", overflow:"hidden" } }}
      >
        {viewReceipt && (
          <>
            {/* Header */}
            <Box sx={{ px:"24px", pt:"20px", pb:"16px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", borderBottom:"1px solid #f3f4f6", bgcolor:"#fff" }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <Box sx={{ width:38, height:38, borderRadius:"10px", background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize:20, color:"#2563eb" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize:16, fontWeight:700, color:"#111827" }}>
                    {viewReceipt.id}
                  </Typography>
                  <Typography sx={{ fontSize:12, color:"#9ca3af", mt:"1px" }}>
                    Goods Receipt Details
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={() => setViewReceipt(null)}
                disableRipple
                sx={{ color:"#9ca3af", border:"1px solid #e5e7eb", borderRadius:"8px", width:30, height:30, outline:"none",
                  "&:hover":{ background:"#f3f4f6", color:"#374151" }, "&:focus":{ outline:"none" } }}
              >
                <CloseIcon sx={{ fontSize:15 }} />
              </IconButton>
            </Box>

            <DialogContent sx={{ px:"24px", py:"8px", bgcolor:"#fff" }}>
              {/* Status badge at top */}
              <Box sx={{ display:"flex", justifyContent:"flex-end", pt:"8px", mb:"4px" }}>
                {(() => {
                  const ss = getStatusStyle(viewReceipt.status);
                  return (
                    <Chip
                      label={viewReceipt.status}
                      size="small"
                      sx={{ height:24, fontSize:12, fontWeight:700, bgcolor:ss.bg, color:ss.color, px:0.5 }}
                    />
                  );
                })()}
              </Box>

              <ViewRow label="Linked PO"   value={viewReceipt.linkedPO} />
              <ViewRow label="Supplier"    value={viewReceipt.supplier} />
              <ViewRow label="Location"    value={viewReceipt.location} />
              <ViewRow label="Items"       value={String(viewReceipt.items)} />
              <ViewRow label="Total Value" value={viewReceipt.totalValue} valueColor="#111827" />
              <ViewRow label="Received By" value={viewReceipt.receivedBy} />
              <ViewRow label="Date"        value={viewReceipt.date} />
              <ViewRow
                label="Condition"
                value={viewReceipt.condition}
                valueColor={getConditionStyle(viewReceipt.condition).color}
              />

              <Box sx={{ pt:"16px", pb:"8px" }} />
            </DialogContent>

            <Divider />

            {/* Footer */}
            <Box sx={{ px:"24px", py:"14px", display:"flex", justifyContent:"flex-end", bgcolor:"#fff" }}>
              <Button
                onClick={() => setViewReceipt(null)}
                disableRipple
                sx={{ fontSize:13, fontWeight:600, color:"#374151", textTransform:"none",
                  border:"1px solid #e5e7eb", borderRadius:"8px", px:"20px", py:"8px",
                  bgcolor:"#fff", outline:"none",
                  "&:hover":{ bgcolor:"#f9fafb" }, "&:focus":{ outline:"none" } }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Dialog>
    </Box>
  );
}