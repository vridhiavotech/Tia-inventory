import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  InputBase,
  Divider,
  Menu,
} from "@mui/material";
import NewGRNDialog from "./newgrnmodal";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

export default function GoodsReceipt() {
  const [receipts, setReceipts] = useState([
    {
      id: "GRN-2026-0003",
      linkedPO: "PO-2026-0002",
      supplier: "Medline Industries",
      location: "CS-01",
      items: 2,
      totalValue: "$696",
      receivedBy: "S. Anderson",
      date: "Mar 20, 2026",
      condition: "Good",
      status: "Completed",
    },
    {
      id: "GRN-2026-0002",
      linkedPO: "PO-2026-0004",
      supplier: "McKesson Medical-Surgical",
      location: "CS-01",
      items: 1,
      totalValue: "$360",
      receivedBy: "S. Anderson",
      date: "Mar 19, 2026",
      condition: "Short Delivery",
      status: "Discrepancy",
    },
    {
      id: "GRN-2026-0001",
      linkedPO: "PO-2026-0001",
      supplier: "Cardinal Health",
      location: "CS-02",
      items: 5,
      totalValue: "$1,240",
      receivedBy: "T. Williams",
      date: "Mar 15, 2026",
      condition: "Good",
      status: "Pending",
    },
  ]);

  const [newGRNOpen, setNewGRNOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [conditionFilter, setConditionFilter] = useState("All Conditions");
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [conditionAnchor, setConditionAnchor] = useState(null);

  const [formData, setFormData] = useState({
    id: "", linkedPO: "", supplier: "", location: "",
    items: "", totalValue: "", receivedBy: "", date: "", condition: "", status: "",
  });

  const stats = [
    {
      label: "Total GRNs",
      value: receipts.length,
      sub: "All receipts",
      color: "#f59e0b",
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 22, color: "#f59e0b" }} />,
    },
    {
      label: "Pending GRN",
      value: receipts.filter((r) => r.status === "Pending").length,
      sub: "Awaiting action",
      color: "#8b5cf6",
      icon: <HourglassEmptyOutlinedIcon sx={{ fontSize: 22, color: "#8b5cf6" }} />,
    },
    {
      label: "Discrepancies",
      value: receipts.filter((r) => r.status === "Discrepancy").length,
      sub: "Needs review",
      color: "#ef4444",
      icon: <WarningAmberOutlinedIcon sx={{ fontSize: 22, color: "#ef4444" }} />,
    },
    {
      label: "Completed",
      value: receipts.filter((r) => r.status === "Completed").length,
      sub: "Successfully received",
      color: "#10b981",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 22, color: "#10b981" }} />,
    },
  ];

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || r.status === statusFilter;
    const matchesCondition = conditionFilter === "All Conditions" || r.condition === conditionFilter;
    return matchesSearch && matchesStatus && matchesCondition;
  });

  const handleOpenDialog = (receipt = null) => {
    if (receipt) {
      setEditingId(receipt.id);
      setFormData(receipt);
    } else {
      setEditingId(null);
      setFormData({
        id: `GRN-${new Date().getFullYear()}-${String(receipts.length + 1).padStart(4, "0")}`,
        linkedPO: "", supplier: "", location: "", items: "",
        totalValue: "", receivedBy: "",
        date: new Date().toISOString().split("T")[0],
        condition: "", status: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingId(null); };

  const handleSave = () => {
    if (editingId) {
      setReceipts(receipts.map((r) => (r.id === editingId ? formData : r)));
    } else {
      setReceipts([...receipts, formData]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => setReceipts(receipts.filter((r) => r.id !== id));

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed": return { bg: "#dcfce7", color: "#16a34a" };
      case "Discrepancy": return { bg: "#fef9c3", color: "#ca8a04" };
      case "Pending": return { bg: "#e0f2fe", color: "#0284c7" };
      default: return { bg: "#f3f4f6", color: "#6b7280" };
    }
  };

  const getConditionStyle = (condition) => {
    if (condition === "Good") return { color: "#16a34a" };
    if (condition === "Short Delivery" || condition === "Damaged") return { color: "#dc2626" };
    return { color: "#6b7280" };
  };

  const DropdownButton = ({ label, anchor, setAnchor, options, value, setValue }) => (
    <>
      <Button
        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          textTransform: "none",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          px: 1.5,
          py: 0.75,
          bgcolor: "#fff",
          "&:hover": { bgcolor: "#f9fafb", borderColor: "#d1d5db" },
        }}
      >
        {value}
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px", mt: 0.5 } }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt}
            onClick={() => { setValue(opt); setAnchor(null); }}
            sx={{ fontSize: 13, color: "#374151", py: 0.75 }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: "1px solid #f0f0f0" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827", mb: 0.5 }}>
              Goods Receipt (GRN)
            </Typography>
            {/* Workflow breadcrumb */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {["Purchase Order", "Receive", "Inspect", "Confirm", "Close"].map((step, i, arr) => (
                <Box key={step} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: 12, color: i === 1 ? "#6366f1" : "#9ca3af", fontWeight: i === 1 ? 600 : 400 }}>
                    {step}
                  </Typography>
                  {i < arr.length - 1 && (
                    <Typography sx={{ fontSize: 12, color: "#d1d5db" }}>→</Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: 13, fontWeight: 500, color: "#374151", textTransform: "none",
                border: "1px solid #e5e7eb", borderRadius: "6px", px: 2,
                bgcolor: "#fff", "&:hover": { bgcolor: "#f9fafb" },
              }}
            >
              Export
            </Button>
            <Button
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={() => setNewGRNOpen(true)}
              sx={{
                fontSize: 13, fontWeight: 600, color: "#fff", textTransform: "none",
                bgcolor: "#6366f1", borderRadius: "6px", px: 2,
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              New GRN
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f0f0f0" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {stats.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: "10px",
                bgcolor: "#fff",
                border: "1px solid #e5e7eb",
              }}
            >
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: "8px",
                  bgcolor: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mt: 0.25 }}>{stat.label}</Typography>
                <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>{stat.sub}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ px: 3, py: 1.5, borderBottom: "1px solid #f0f0f0", display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 1,
            border: "1px solid #e5e7eb", borderRadius: "6px",
            px: 1.5, py: 0.75, bgcolor: "#fff", width: 240,
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
          <InputBase
            sx={{ fontSize: 13, color: "#374151", flex: 1 }}
            placeholder="Search GRN ID or Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <DropdownButton
          value={conditionFilter}
          setValue={setConditionFilter}
          anchor={conditionAnchor}
          setAnchor={setConditionAnchor}
          options={["All Conditions", "Good", "Short Delivery", "Damaged"]}
        />
        <DropdownButton
          value={statusFilter}
          setValue={setStatusFilter}
          anchor={statusAnchor}
          setAnchor={setStatusAnchor}
          options={["All Statuses", "Completed", "Discrepancy", "Pending"]}
        />
      </Box>

      {/* Table */}
      <Box sx={{ px: 3, py: 2 }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #f0f0f0", borderRadius: "8px" }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                {["Request #", "Supplier", "Linked PO", "Location", "Items", "Total Value", "Received By", "Date", "Condition", "Status", "Action"].map((h) => (
                  <TableCell
                    key={h}
                    align={["Items", "Total Value", "Action"].includes(h) ? "center" : "left"}
                    sx={{ fontSize: 12, fontWeight: 600, color: "#6b7280", py: 1.25, borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map((receipt) => {
                  const statusStyle = getStatusStyle(receipt.status);
                  const conditionStyle = getConditionStyle(receipt.condition);
                  return (
                    <TableRow
                      key={receipt.id}
                      sx={{ "&:hover": { bgcolor: "#fafafa" }, borderBottom: "1px solid #f5f5f5" }}
                    >
                      <TableCell sx={{ py: 1.5, fontSize: 13, fontWeight: 600, color: "#6366f1" }}>
                        {receipt.id}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{receipt.supplier}</Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, fontSize: 13, color: "#6b7280" }}>{receipt.linkedPO || "–"}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={receipt.location}
                          size="small"
                          sx={{ height: 22, fontSize: 11, bgcolor: "#f3f4f6", color: "#374151", fontWeight: 500, border: "none" }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5, fontSize: 13, color: "#374151" }}>{receipt.items}</TableCell>
                      <TableCell align="center" sx={{ py: 1.5, fontSize: 13, fontWeight: 600, color: "#111827" }}>{receipt.totalValue}</TableCell>
                      <TableCell sx={{ py: 1.5, fontSize: 13, color: "#6b7280" }}>{receipt.receivedBy}</TableCell>
                      <TableCell sx={{ py: 1.5, fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>{receipt.date}</TableCell>
                      <TableCell sx={{ py: 1.5, fontSize: 13, fontWeight: 600, ...conditionStyle }}>{receipt.condition}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={receipt.status}
                          size="small"
                          sx={{
                            height: 22, fontSize: 11, fontWeight: 600,
                            bgcolor: statusStyle.bg, color: statusStyle.color,
                            border: "none",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(receipt)}
                          sx={{ color: "#9ca3af", p: 0.5, "&:hover": { color: "#6366f1", bgcolor: "#ede9fe" } }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 5, color: "#9ca3af", fontSize: 13 }}>
                    No receipts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ── New GRN Dialog ── */}
      <NewGRNDialog
        open={newGRNOpen}
        onClose={() => setNewGRNOpen(false)}
        onSave={(grn) => {
          setReceipts((prev) => [grn, ...prev]);
          setNewGRNOpen(false);
        }}
        nextId={`GRN-${new Date().getFullYear()}-${String(receipts.length + 1).padStart(4, "0")}`}
      />

      {/* ── View Dialog (eye icon) ── */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "12px" } }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16, color: "#111827", pb: 1 }}>
          {editingId ? "Edit GRN" : "New Goods Receipt"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField fullWidth label="GRN ID" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} disabled={!!editingId} size="small" />
            <TextField fullWidth label="Linked PO" value={formData.linkedPO} onChange={(e) => setFormData({ ...formData, linkedPO: e.target.value })} size="small" />
            <TextField fullWidth label="Supplier" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} size="small" />
            <TextField fullWidth label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} size="small" />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField fullWidth label="Number of Items" type="number" value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })} size="small" />
              <TextField fullWidth label="Total Value" value={formData.totalValue} onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })} size="small" />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField fullWidth label="Received By" value={formData.receivedBy} onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })} size="small" />
              <TextField fullWidth label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} size="small" InputLabelProps={{ shrink: true }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField fullWidth select label="Condition" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} size="small">
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Short Delivery">Short Delivery</MenuItem>
                <MenuItem value="Damaged">Damaged</MenuItem>
              </TextField>
              <TextField fullWidth select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} size="small">
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Discrepancy">Discrepancy</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ fontSize: 13, fontWeight: 600, color: "#6b7280", textTransform: "none", border: "1px solid #e5e7eb", borderRadius: "6px", px: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} sx={{ fontSize: 13, fontWeight: 600, color: "#fff", textTransform: "none", bgcolor: "#6366f1", borderRadius: "6px", px: 2, "&:hover": { bgcolor: "#4f46e5" } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}