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
  DialogContent,
  InputBase,
  Divider,
  Menu,
  MenuItem,
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
  const [viewReceipt, setViewReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [conditionFilter, setConditionFilter] = useState("All Conditions");
  const [statusAnchor, setStatusAnchor] = useState(null);
  const [conditionAnchor, setConditionAnchor] = useState(null);

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || r.status === statusFilter;
    const matchesCondition =
      conditionFilter === "All Conditions" || r.condition === conditionFilter;
    return matchesSearch && matchesStatus && matchesCondition;
  });

  const handleNewGRNSave = (grn) => setReceipts((prev) => [grn, ...prev]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return { bg: "#dcfce7", color: "#16a34a" };
      case "Discrepancy":
        return { bg: "#fef9c3", color: "#ca8a04" };
      case "Pending":
        return { bg: "#e0f2fe", color: "#0284c7" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280" };
    }
  };

  const getConditionStyle = (condition) => {
    if (condition === "Good") return { color: "#16a34a" };
    if (condition === "Short Delivery" || condition === "Damaged")
      return { color: "#dc2626" };
    return { color: "#6b7280" };
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setStatusAnchor(null);
  };
  const handleConditionFilterChange = (value) => {
    setConditionFilter(value);
    setConditionAnchor(null);
  };

  const ViewRow = ({ label, value, valueColor }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: "10px",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: "#9ca3af",
          letterSpacing: "0.05em",
          minWidth: 130,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: valueColor || "#111827",
          textAlign: "right",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );

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

  const statCards = [
    {
      label: "Total GRNs",
      value: receipts.length,
      sub: "All receipts",
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
      label: "Pending GRN",
      value: receipts.filter((r) => r.status === "Pending").length,
      sub: "Awaiting action",
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
      label: "Discrepancies",
      value: receipts.filter((r) => r.status === "Discrepancy").length,
      sub: "Needs review",
      iconBg: "#ef4444",
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
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: receipts.filter((r) => r.status === "Completed").length,
      sub: "Successfully received",
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
  ];

  return (
    <Box>
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Goods Receipt (GRN)
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
              {receipts.length} receipts · Purchase Order → Receive → Inspect →
              Confirm → Close
            </Typography>
          </Box>
          <Button
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setNewGRNOpen(true)}
            disableRipple
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              textTransform: "none",
              bgcolor: "#2563eb",
              borderRadius: "8px",
              px: 2,
              height: 36,
              boxShadow: "0 1px 4px rgba(99,102,241,0.35)",
              "&:hover": { bgcolor: "#1d4ed8" },
              "&:focus": { outline: "none" },
            }}
          >
            New GRN
          </Button>
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
            gap: "12px",
            alignItems: "center",
            mb: "20px",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              px: 1.5,
              py: 0.75,
              bgcolor: "#fff",
              width: 260,
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

          {/* Condition Dropdown */}
          <Button
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => setConditionAnchor(e.currentTarget)}
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "#374151",
              textTransform: "none",

              border: "1px solid #e5e7eb", // default thin
              borderRadius: "20px",
              px: 1.5,
              py: 0.75,
              bgcolor: "#fff",

              "&:hover": {
                bgcolor: "#f9fafb",
                borderColor: "#015DFF", // 👈 blue
              },

              "&:active": {
                borderColor: "#015DFF", // 👈 when clicked
              },

              "&.Mui-focusVisible": {
                borderColor: "#015DFF", // 👈 keyboard focus
              },

              "&:focus": {
                borderColor: "#015DFF", // 👈 mouse focus
                outline: "none",
              },
            }}
          >
            {conditionFilter}
          </Button>
          <Menu
            anchorEl={conditionAnchor}
            open={Boolean(conditionAnchor)}
            onClose={() => setConditionAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                mt: 0.5,
                minWidth: 150,
              },
            }}
          >
            {["All Conditions", "Good", "Short Delivery", "Damaged"].map(
              (opt) => (
                <MenuItem
                  key={opt}
                  onClick={() => handleConditionFilterChange(opt)}
                  sx={{ fontSize: 13, color: "#374151", py: 0.75 }}
                >
                  {opt}
                </MenuItem>
              ),
            )}
          </Menu>

          {/* Status Dropdown */}
          <Button
  endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
  onClick={(e) => setStatusAnchor(e.currentTarget)}
  sx={{
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    textTransform: "none",

    border: "1px solid #e5e7eb", // default thin
    borderRadius: "20px",
    px: 1.5,
    py: 0.75,
    bgcolor: "#fff",

    "&:hover": {
      bgcolor: "#f9fafb",
      borderColor: "#015DFF", // 👈 blue hover
    },

    "&:active": {
      borderColor: "#015DFF", // 👈 click
    },

    "&:focus": {
      borderColor: "#015DFF", // 👈 focus
      outline: "none",
    },

    "&.Mui-focusVisible": {
      borderColor: "#015DFF", // 👈 keyboard focus
    },
  }}
>
  {statusFilter}
</Button>
          <Menu
            anchorEl={statusAnchor}
            open={Boolean(statusAnchor)}
            onClose={() => setStatusAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                mt: 0.5,
                minWidth: 150,
              },
            }}
          >
            {["All Statuses", "Completed", "Discrepancy", "Pending"].map(
              (opt) => (
                <MenuItem
                  key={opt}
                  onClick={() => handleStatusFilterChange(opt)}
                  sx={{ fontSize: 13, color: "#374151", py: 0.75 }}
                >
                  {opt}
                </MenuItem>
              ),
            )}
          </Menu>

          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
            {filteredReceipts.length} of {receipts.length} records
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            overflow: "auto",
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              background: "#d1d5db",
              borderRadius: 4,
            },
          }}
        >
          <Table sx={{ minWidth: 1100, tableLayout: "fixed" }}>
            <TableHead>
              <TableRow sx={{ background: "#EBF1FE" }}>
                {[
                  { label: "Request #", width: 130 },
                  { label: "Supplier", width: 170 },
                  { label: "Linked PO", width: 110 },
                  { label: "Location", width: 90 },
                  { label: "Items", width: 60 },
                  { label: "Total Value", width: 110 },
                  { label: "Received By", width: 110 },
                  { label: "Date", width: 110 },
                  { label: "Condition", width: 120 },
                  { label: "Status", width: 100 },
                  { label: "Action", width: 70 },
                ].map((h) => (
                  <TableCell
                    key={h.label}
                    align={
                      ["Items", "Total Value", "Action"].includes(h.label)
                        ? "center"
                        : "left"
                    }
                    sx={{ ...thSx, width: h.width }}
                  >
                    {h.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map((receipt, idx) => {
                  const ss = getStatusStyle(receipt.status);
                  const cs = getConditionStyle(receipt.condition);
                  return (
                    <TableRow
                      key={receipt.id}
                      sx={{
                        background: "#fff",
                        "&:hover": { background: "#fafafa" },
                        transition: "background 0.15s",
                        "& td": {
                          borderBottom:
                            idx < filteredReceipts.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                          py: "14px",
                          px: "16px",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ fontSize: 13, fontWeight: 500, color: "#2E2E2E" }}
                      >
                        {receipt.id}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#111827",
                          }}
                        >
                          {receipt.supplier}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, color: "#6b7280" }}>
                        {receipt.linkedPO || "–"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={receipt.location}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#7c3aed",
                            background: "#f5f3ff",
                            border: "1px solid #ede9fe",
                            borderRadius: "6px",
                            "& .MuiChip-label": { px: "8px" },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: 13, color: "#374151" }}
                      >
                        {receipt.items}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: 13, color: "#111827" }}
                      >
                        {receipt.totalValue}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, color: "#6b7280" }}>
                        {receipt.receivedBy}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 13,
                          color: "#9ca3af",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {receipt.date}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 600, ...cs }}>
                        {receipt.condition}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={receipt.status}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 600,
                            bgcolor: ss.bg,
                            color: ss.color,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => setViewReceipt(receipt)}
                          sx={{
                            color: "#9ca3af",
                            p: 0.5,
                            borderRadius: "6px",
                            "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
                            "&:focus": { outline: "none" },
                          }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{ py: 5, color: "#9ca3af", fontSize: 13 }}
                  >
                    No receipts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* New GRN Dialog */}
      <NewGRNDialog
        open={newGRNOpen}
        onClose={() => setNewGRNOpen(false)}
        onSave={handleNewGRNSave}
        nextId={`GRN-${new Date().getFullYear()}-${String(receipts.length + 1).padStart(4, "0")}`}
      />

      {/* View GRN Dialog */}
      <Dialog
        open={Boolean(viewReceipt)}
        onClose={() => setViewReceipt(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "14px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            overflow: "hidden",
          },
        }}
      >
        {viewReceipt && (
          <>
            {/* Header */}
            <Box
              sx={{
                px: "24px",
                pt: "20px",
                pb: "16px",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                borderBottom: "1px solid #f3f4f6",
                bgcolor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{ fontSize: 20, color: "#2563eb" }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}
                  >
                    {viewReceipt.id}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "#9ca3af", mt: "1px" }}
                  >
                    Goods Receipt Details
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                onClick={() => setViewReceipt(null)}
                disableRipple
                sx={{
                  color: "#9ca3af",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  width: 30,
                  height: 30,
                  "&:hover": { background: "#f3f4f6", color: "#374151" },
                  "&:focus": { outline: "none" },
                }}
              >
                <CloseIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>

            <DialogContent sx={{ px: "24px", py: "8px", bgcolor: "#fff" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  pt: "8px",
                  mb: "4px",
                }}
              >
                {(() => {
                  const ss = getStatusStyle(viewReceipt.status);
                  return (
                    <Chip
                      label={viewReceipt.status}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: ss.bg,
                        color: ss.color,
                        px: 0.5,
                      }}
                    />
                  );
                })()}
              </Box>

              {[
                { label: "Linked PO", value: viewReceipt.linkedPO },
                { label: "Supplier", value: viewReceipt.supplier },
                { label: "Location", value: viewReceipt.location },
                { label: "Items", value: String(viewReceipt.items) },
                { label: "Total Value", value: viewReceipt.totalValue },
                { label: "Received By", value: viewReceipt.receivedBy },
                { label: "Date", value: viewReceipt.date },
                {
                  label: "Condition",
                  value: viewReceipt.condition,
                  valueColor: getConditionStyle(viewReceipt.condition).color,
                },
              ].map((row) => (
                <ViewRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  valueColor={row.valueColor}
                />
              ))}

              <Box sx={{ pt: "16px", pb: "8px" }} />
            </DialogContent>

            <Divider />

            {/* Footer */}
            <Box
              sx={{
                px: "24px",
                py: "14px",
                display: "flex",
                justifyContent: "flex-end",
                bgcolor: "#fff",
              }}
            >
              <Button
                onClick={() => setViewReceipt(null)}
                disableRipple
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  textTransform: "none",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  px: "20px",
                  py: "8px",
                  bgcolor: "#fff",
                  "&:hover": { bgcolor: "#f9fafb" },
                  "&:focus": { outline: "none" },
                }}
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
