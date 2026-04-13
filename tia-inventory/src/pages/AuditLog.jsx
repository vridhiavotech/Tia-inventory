import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  Button,
  Typography,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Add this color object right after your imports or at the top of the component
const C = {
  bg: "#F8FAFC",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  primary: "#1976D2",
};

const auditData = [
  {
    id: 1,
    timestamp: "2026-03-19 09:30",
    user: { name: "S. Anderson", id: "u1" },
    action: "APPROVED",
    module: "PO",
    record: "PO-2026-0004",
    detail: "PO approved for McKesson Medical-Surgical",
  },
  {
    id: 2,
    timestamp: "2026-03-20 14:32",
    user: { name: "T. Williams", id: "u4" },
    action: "GRN_COMPLETE",
    module: "GRN",
    record: "GRN-2026-0003",
    detail: "GRN confirmed, stock updated — 2 items received",
  },
  {
    id: 3,
    timestamp: "2026-03-19 09:30",
    user: { name: "S. Anderson", id: "u1" },
    action: "ISSUE",
    module: "StockIssue",
    record: "ISS-2026-0008",
    detail: "50 × Amoxicillin 500mg issued to ICU",
  },
];

const AuditLog = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // filters by module
  const [locationFilter, setLocationFilter] = useState(""); // filters by action

  // Helper: search across all relevant fields
  const matchesSearch = (log, term) => {
    if (!term) return true;
    const searchLower = term.toLowerCase();
    const searchableFields = [
      log.timestamp,
      log.user.name,
      log.user.id,
      log.action,
      log.module,
      log.record,
      log.detail,
    ];
    return searchableFields.some((field) =>
      field.toLowerCase().includes(searchLower),
    );
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return auditData.filter((log) => {
      const matchesRole = roleFilter ? log.module === roleFilter : true;
      const matchesLocation = locationFilter
        ? log.action === locationFilter
        : true;
      const matchesSearchTerm = matchesSearch(log, searchTerm);
      return matchesRole && matchesLocation && matchesSearchTerm;
    });
  }, [searchTerm, roleFilter, locationFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert("No logs to export.");
      return;
    }

    const headers = [
      "Timestamp",
      "User",
      "Action",
      "Module",
      "Record",
      "Detail",
    ];
    const rows = filteredLogs.map((log) => [
      log.timestamp,
      `${log.user.name} (${log.user.id})`,
      log.action,
      log.module,
      log.record,
      log.detail,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `audit_log_export_${new Date().toISOString().slice(0, 19)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box
     
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        {/* Header with title and export button */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 22,
                color: C.textPrimary,
                letterSpacing: -0.3,
              }}
            >
              Audit Log
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: C.textSecondary,
                mt: 0.3,
              }}
            >
              Tamper-evident record of all system actions — 21 CFR Part 11
            </Typography>
          </Box>

          <Button
            onClick={handleExportCSV}
            startIcon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            }
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "9px",
              background: "#ffffff",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.06)",
              textTransform: "none",
              "&:hover": {
                background: "#f9fafb",
                borderColor: "#cbd5f5",
              },
            }}
          >
            Export
          </Button>
        </Box>

        {/* Filter bar – outside the card (matches second image) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
            p: 1.5,
            borderRadius: 2,
            borderColor: "divider",
          }}
        >
          {/* All Roles (filters by module) */}
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
            size="small"
            sx={{}}
          >
            <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
              All Roles
            </MenuItem>
            <MenuItem value="PO" sx={{ fontSize: "0.75rem" }}>
              PO
            </MenuItem>
            <MenuItem value="GRN" sx={{ fontSize: "0.75rem" }}>
              GRN
            </MenuItem>
            <MenuItem value="StockIssue" sx={{ fontSize: "0.75rem" }}>
              StockIssue
            </MenuItem>
          </Select>

          {/* All Locations (filters by action) */}
          <Select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            displayEmpty
            size="small"
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
              All Locations
            </MenuItem>
            <MenuItem value="APPROVED" sx={{ fontSize: "0.75rem" }}>
              APPROVED
            </MenuItem>
            <MenuItem value="GRN_COMPLETE" sx={{ fontSize: "0.75rem" }}>
              GRN_COMPLETE
            </MenuItem>
            <MenuItem value="ISSUE" sx={{ fontSize: "0.75rem" }}>
              ISSUE
            </MenuItem>
          </Select>

          {/* Search field */}
          <TextField
            placeholder="Search..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Entry count */}
          <Typography sx={{ fontSize: "12px", color: "#9ca3af", ml: "auto" }}>
            {filteredLogs.length} entries
          </Typography>
        </Box>

        {/* MAIN OUTER CARD - Light grey/white card wrapper */}
        <Card
          sx={{
            width: "100%",
            borderRadius: { xs: 2, sm: 3 },
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
                  <TableHead>
                    <TableRow sx={{ background: "#f9fafb" }}>
                      {[
                        "Timestamp",
                        "User",
                        "Action",
                        "Module",
                        "Record",
                        "Detail",
                      ].map((head) => (
                        <TableCell
                          key={head}
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#6b7280",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow
                        key={log.id}
                        sx={{
                          "&:hover": { background: "#f9fafb" },
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <TableCell
                          sx={{
                            fontSize: "11px",
                            whiteSpace: "nowrap",
                            color: "#6b7280",
                          }}
                        >
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              sx={{ fontSize: "12px", fontWeight: 600 }}
                            >
                              {log.user.name}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "10px", color: "#9ca3af" }}
                            >
                              {log.user.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "inline-block",
                              fontSize: "10px",
                              px: 1.2,
                              py: 0.3,
                              borderRadius: "12px",
                              fontWeight: 600,
                              color: "#fff",
                              background:
                                log.action === "APPROVED"
                                  ? "#16a34a"
                                  : log.action === "GRN_COMPLETE"
                                    ? "#14b8a6"
                                    : "#f59e0b",
                            }}
                          >
                            {log.action}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: "12px" }}>
                          {log.module}
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: "bold",
                              color: "#0f766e",
                            }}
                          >
                            {log.record}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "12px", color: "#6b7280" }}>
                          {log.detail}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AuditLog;
