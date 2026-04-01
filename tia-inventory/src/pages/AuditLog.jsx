    import React, { useState, useMemo } from 'react';
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
    Chip,
    Typography,
    Stack,
    InputAdornment,
    useMediaQuery,
    useTheme,
    } from '@mui/material';
    import SearchIcon from '@mui/icons-material/Search';
    import FileDownloadIcon from '@mui/icons-material/FileDownload';

    
    const auditData = [
    {
        id: 1,
        timestamp: '2026-03-19 09:30',
        user: { name: 'S. Anderson', id: 'u1' },
        action: 'APPROVED',
        module: 'PO',
        record: 'PO-2026-0004',
        detail: 'PO approved for McKesson Medical-Surgical',
    },
    {
        id: 2,
        timestamp: '2026-03-20 14:32',
        user: { name: 'T. Williams', id: 'u4' },
        action: 'GRN_COMPLETE',
        module: 'GRN',
        record: 'GRN-2026-0003',
        detail: 'GRN confirmed, stock updated — 2 items received',
    },
    {
        id: 3,
        timestamp: '2026-03-19 09:30',
        user: { name: 'S. Anderson', id: 'u1' },
        action: 'ISSUE',
        module: 'StockIssue',
        record: 'ISS-2026-0008',
        detail: '50 × Amoxicillin 500mg issued to ICU',
    },
    ];

    
    const getActionChipProps = (action) => {
    switch (action) {
        case 'APPROVED':
        return { color: 'success', label: 'APPROVED' };
        case 'GRN_COMPLETE':
        return { color: 'info', label: 'GRN_COMPLETE', sx: { bgcolor: '#14b8a6', '& .MuiChip-label': { color: '#fff' } } };
        case 'ISSUE':
        return { color: 'warning', label: 'ISSUE', sx: { bgcolor: '#f59e0b', '& .MuiChip-label': { color: '#fff' } } };
        default:
        return { color: 'default', label: action };
    }
    };

    const AuditLog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    // Helper: check if a log matches the search term across all relevant fields
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
        return searchableFields.some(field => field.toLowerCase().includes(searchLower));
    };

    // Filtered logs based on search, module, and action
    const filteredLogs = useMemo(() => {
        return auditData.filter(log => {
        const matchesModule = moduleFilter ? log.module === moduleFilter : true;
        const matchesAction = actionFilter ? log.action === actionFilter : true;
        const matchesSearchTerm = matchesSearch(log, searchTerm);
        return matchesModule && matchesAction && matchesSearchTerm;
        });
    }, [searchTerm, moduleFilter, actionFilter]);

    // Export current filtered logs to CSV 
    const handleExportCSV = () => {
        if (filteredLogs.length === 0) {
        alert('No logs to export.');
        return;
        }

        // Define CSV headers
        const headers = ['Timestamp', 'User', 'Action', 'Module', 'Record', 'Detail'];
        const rows = filteredLogs.map(log => [
        log.timestamp,
        `${log.user.name} (${log.user.id})`,
        log.action,
        log.module,
        log.record,
        log.detail,
        ]);

        // Convert to CSV string
        const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `audit_log_export_${new Date().toISOString().slice(0, 19)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '1400px', mx: 'auto' }}>

  
  <Box
    sx={{
      mb: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 2,
      marginTop: -3,
      //marginLeft: -3,
    }}
  >
    <Box>
      <Typography variant="h5" fontWeight={600}>
        Audit Log
      </Typography>
      <Typography variant="body2" color="text.secondary">
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
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

  {/* ✅ CARD */}
  <Paper
    elevation={0}
    sx={{
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",
      marginLeft: -3,
    }}
  >    
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    px: 3,
    py: 2,
    borderBottom: "1px solid #eee",
    background: "#fff",
   
  }}
>
  {/*  Search */}
   <TextField
      placeholder="Search GRN ID or Supplier..."
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        width: 550, 
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />

  {/*  Module */}
  <Select
    value={moduleFilter}
    onChange={(e) => setModuleFilter(e.target.value)}
    displayEmpty
    size="small"
    sx={{ minWidth: 140 }}
  >
    <MenuItem value="">All Modules</MenuItem>
    <MenuItem value="PO">PO</MenuItem>
    <MenuItem value="GRN">GRN</MenuItem>
    <MenuItem value="StockIssue">StockIssue</MenuItem>
  </Select>

  {/*  Action */}
  <Select
    value={actionFilter}
    onChange={(e) => setActionFilter(e.target.value)}
    displayEmpty
    size="small"
    sx={{ minWidth: 150 }}
  >
    <MenuItem value="">All Actions</MenuItem>
    <MenuItem value="APPROVED">APPROVED</MenuItem>
    <MenuItem value="GRN_COMPLETE">GRN_COMPLETE</MenuItem>
    <MenuItem value="ISSUE">ISSUE</MenuItem>
  </Select>

  {/*  Spacer*/}
  <Box sx={{ flex: 1 }} />

  {/*  Entries */}
  <Typography sx={{ fontSize: "12px", color: "#9ca3af" }}>
    {filteredLogs.length} entries
  </Typography>
</Box>

            
<TableContainer sx={{ overflowX: "auto" }}>
  <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
    
    {/* HEADER */}
    <TableHead>
      <TableRow sx={{ background: "#f9fafb" }}>
        {["Timestamp", "User", "Action", "Module", "Record", "Detail"].map((head) => (
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

    {/* BODY */}
    <TableBody>
      {filteredLogs.map((log) => (
        <TableRow
          key={log.id}
          sx={{
            "&:hover": { background: "#f9fafb" },
            borderBottom: "1px solid #eee",
          }}
        >
          {/* Timestamp */}
          <TableCell
            sx={{
              fontFamily: "monospace",
              fontSize: "11px",
              whiteSpace: "nowrap",
              color: "#6b7280",
            }}
          >
            {log.timestamp}
          </TableCell>

          {/* User */}
          <TableCell>
            <Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                {log.user.name}
              </Typography>
              <Typography sx={{ fontSize: "10px", color: "#9ca3af" }}>
                {log.user.id}
              </Typography>
            </Box>
          </TableCell>

          {/* Action Badge */}
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

          {/* Module */}
          <TableCell sx={{ fontSize: "12px" }}>
            {log.module}
          </TableCell>

          {/* Record */}
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

          {/* Detail */}
          <TableCell sx={{ fontSize: "12px", color: "#6b7280" }}>
            {log.detail}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
</Paper>
</Box>
);
};

export default AuditLog;