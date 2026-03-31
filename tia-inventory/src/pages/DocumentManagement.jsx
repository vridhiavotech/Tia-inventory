import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Tooltip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DocumentUploadModal from '../components/DocumentUploadModal';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { bg: '#e8f5e9', color: '#2e7d32', text: 'Active' };
      case 'expiring soon':
        return { bg: '#fff3e0', color: '#ed6c02', text: 'Expiring Soon' };
      case 'expired':
        return { bg: '#ffebee', color: '#d32f2f', text: 'Expired' };
      case 'inactive':
        return { bg: '#f5f5f5', color: '#757575', text: 'Inactive' };
      default:
        return { bg: '#f5f5f5', color: '#757575', text: status || 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        bgcolor: config.bg,
        color: config.color,
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {config.text}
    </Box>
  );
};

const initialDocuments = [
  {
    id: "doc1",
    docNo: "DOC-2026-001",
    title: "McKesson Master Supply Agreement",
    description: "Annual supply contract — auto-renews",
    type: "Contract",
    linkedTo: {
      type: "supplier",
      name: "McKesson Medical-Surgical",
      id: "SUP-001"
    },
    issuedDate: "2024-01-15",
    expiryDate: "2026-12-31",
    uploadedBy: "S. Anderson",
    uploadDate: "Mar 10, 2026",
    size: "1.2 MB",
    status: "Active",
    fileUrl: "#"
  },
  {
    id: "doc2",
    docNo: "DOC-2026-002",
    title: "PO-2026-0004 Acknowledgement",
    description: "Supplier confirmed receipt of PO",
    type: "PO Acknowledgement",
    linkedTo: {
      type: "po",
      name: "PO-2026-0004",
      id: "PO-2026-0004"
    },
    issuedDate: "2026-03-19",
    expiryDate: null,
    uploadedBy: "S. Anderson",
    uploadDate: "Mar 19, 2026",
    size: "320 KB",
    status: "Active",
    fileUrl: "#"
  },
  {
    id: "doc3",
    docNo: "DOC-2026-003",
    title: "Medline Industries — ISO Certificate",
    description: "ISO 9001:2015 certification",
    type: "Quality Certificate",
    linkedTo: {
      type: "supplier",
      name: "Medline Industries",
      id: "SUP-002"
    },
    issuedDate: "2024-06-01",
    expiryDate: "2026-05-31",
    uploadedBy: "T. Williams",
    uploadDate: "Mar 5, 2026",
    size: "540 KB",
    status: "Expiring Soon",
    fileUrl: "#"
  },
  {
    id: "doc4",
    docNo: "DOC-2026-004",
    title: "Amoxicillin 500mg — FDA Recall Notice",
    description: "FDA Class II recall — Lot AM2024B",
    type: "Regulatory Notice",
    linkedTo: {
      type: "item",
      name: "Amoxicillin 500mg Capsules",
      id: "ITEM-001"
    },
    issuedDate: "2026-03-10",
    expiryDate: null,
    uploadedBy: "S. Anderson",
    uploadDate: "Mar 10, 2026",
    size: "188 KB",
    status: "Active",
    fileUrl: "#"
  },
  {
    id: "doc5",
    docNo: "DOC-2026-005",
    title: "Cardinal Health — MSDS Sodium Chloride",
    description: "Material safety data sheet",
    type: "MSDS / Safety Sheet",
    linkedTo: {
      type: "item",
      name: "Sodium Chloride 0.9% IV 1L",
      id: "ITEM-002"
    },
    issuedDate: "2023-08-01",
    expiryDate: "2028-08-01",
    uploadedBy: "P. Chen",
    uploadDate: "Feb 20, 2026",
    size: "210 KB",
    status: "Active",
    fileUrl: "#"
  },
  {
    id: "doc6",
    docNo: "DOC-2026-006",
    title: "GRN-2026-0003 Delivery Note",
    description: "Medline signed delivery note",
    type: "Delivery Note",
    linkedTo: {
      type: "grn",
      name: "GRN-2026-0003",
      id: "GRN-2026-0003"
    },
    issuedDate: "2026-03-20",
    expiryDate: null,
    uploadedBy: "T. Williams",
    uploadDate: "Mar 20, 2026",
    size: "95 KB",
    status: "Active",
    fileUrl: "#"
  },
  {
    id: "doc7",
    docNo: "DOC-2026-007",
    title: "Fisher Scientific — Lab Supply Agreement",
    description: "Expired — renewal pending",
    type: "Contract",
    linkedTo: {
      type: "supplier",
      name: "Fisher Scientific",
      id: "SUP-003"
    },
    issuedDate: "2025-01-01",
    expiryDate: "2025-12-31",
    uploadedBy: "S. Anderson",
    uploadDate: "Jan 5, 2026",
    size: "890 KB",
    status: "Expired",
    fileUrl: "#"
  }
];

const DocumentManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [documents, setDocuments] = useState(initialDocuments);
  const [filteredDocs, setFilteredDocs] = useState(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [linkedFilter, setLinkedFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Statistic
  const stats = {
    totalDocuments: documents.length,
    active: documents.filter(d => d.status === "Active").length,
    expiringSoon: documents.filter(d => d.status === "Expiring Soon").length,
    expired: documents.filter(d => d.status === "Expired").length
  };

  const statCards = [
    { 
      title: "Total Documents", 
      value: stats.totalDocuments, 
      subtitle: "All records",
      color: "#3b82f6",
    },
    { 
      title: "Active", 
      value: stats.active, 
      subtitle: "Valid & current",
      color: "#10b981",
    },
    { 
      title: "Expiring Soon", 
      value: stats.expiringSoon, 
      subtitle: "Within 90 days",
      color: "#f59e0b",
    },
    { 
      title: "Expired", 
      value: stats.expired, 
      subtitle: "Renewal required",
      color: "#ef4444",
    },
  ];

  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.docNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    if (linkedFilter) {
      filtered = filtered.filter(doc => doc.linkedTo.type === linkedFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocs(filtered);
    setPage(0);
  }, [searchTerm, typeFilter, linkedFilter, statusFilter, documents]);

  const getLinkedIcon = (type) => {
    switch (type) {
      case "supplier": return <BusinessIcon sx={{ fontSize: '0.875rem', color: '#3b82f6' }} />;
      case "po": return <ShoppingCartIcon sx={{ fontSize: '0.875rem', color: '#f59e0b' }} />;
      case "grn": return <ReceiptIcon sx={{ fontSize: '0.875rem', color: '#10b981' }} />;
      case "item": return <InventoryIcon sx={{ fontSize: '0.875rem', color: '#8b5cf6' }} />;
      default: return <DescriptionIcon sx={{ fontSize: '0.875rem', color: '#64748b' }} />;
    }
  };

  const handleViewDoc = (doc) => {
    alert(`Document Details:\n\nTitle: ${doc.title}\nType: ${doc.type}\nLinked To: ${doc.linkedTo.name}\nStatus: ${doc.status}\nSize: ${doc.size}`);
  };

  const handleEditDoc = (doc) => {
    setSelectedDoc(doc);
    setModalOpen(true);
  };

  const handleDeleteDoc = (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments(documents.filter(doc => doc.id !== docId));
    }
  };

  const handleUploadDoc = () => {
    setSelectedDoc(null);
    setModalOpen(true);
  };

  const handleSaveDoc = (newDocument) => {
    if (selectedDoc) {
      setDocuments(documents.map(doc => doc.id === selectedDoc.id ? { ...doc, ...newDocument } : doc));
    } else {
      setDocuments([...documents, newDocument]);
    }
    setModalOpen(false);
    setSelectedDoc(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const MobileDocumentCard = ({ doc }) => {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 1.5,
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#008080' }}>
              {doc.docNo}
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#1e293b', mt: 0.5 }}>
              {doc.title}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#64748b', mt: 0.25 }}>
              {doc.description}
            </Typography>
          </Box>
          <StatusBadge status={doc.status} />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              TYPE
            </Typography>
            <Typography sx={{ fontSize: 12 }}>{doc.type}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              LINKED TO
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              {getLinkedIcon(doc.linkedTo.type)}
              <Typography sx={{ fontSize: 12 }}>{doc.linkedTo.name}</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              ISSUED DATE
            </Typography>
            <Typography sx={{ fontSize: 12 }}>{doc.issuedDate}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              EXPIRY DATE
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: doc.status === 'Expired' ? 600 : 400, color: doc.status === 'Expired' ? '#ef4444' : doc.status === 'Expiring Soon' ? '#f59e0b' : 'inherit' }}>
              {doc.expiryDate || '-'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600, mb: 0.5 }}>
            UPLOADED BY
          </Typography>
          <Typography sx={{ fontSize: 12 }}>
            {doc.uploadedBy} ({doc.uploadDate})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
          <Tooltip title="View/Download" arrow>
            <IconButton size="small" onClick={() => handleViewDoc(doc)} sx={{ color: '#3b82f6', p: 0.5 }}>
              <ViewIcon sx={{ fontSize: '0.875rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" arrow>
            <IconButton size="small" onClick={() => handleEditDoc(doc)} sx={{ color: '#f59e0b', p: 0.5 }}>
              <EditIcon sx={{ fontSize: '0.875rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton size="small" onClick={() => handleDeleteDoc(doc.id)} sx={{ color: '#ef4444', p: 0.5 }}>
              <DeleteIcon sx={{ fontSize: '0.875rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    );
  };

  const getColumns = () => {
    if (isSmallTablet) {
      return [
        { id: 'docNo', label: 'Doc No.', minWidth: 70, render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#008080' }}>{row.docNo}</Typography> },
        { id: 'title', label: 'Title', minWidth: 90, render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#1e293b' }}>{row.title.length > 20 ? row.title.substring(0, 20) + '...' : row.title}</Typography> },
        { id: 'type', label: 'Type', minWidth: 60, render: (row) => <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6' }}>{row.type}</Typography> },
        { 
          id: 'linkedTo', 
          label: 'Linked', 
          minWidth: 70,
          render: (row) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getLinkedIcon(row.linkedTo.type)}
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                {row.linkedTo.name.length > 10 ? row.linkedTo.name.substring(0, 10) + '...' : row.linkedTo.name}
              </Typography>
            </Box>
          )
        },
        {
          id: 'status',
          label: 'Status',
          minWidth: 60,
          render: (row) => <StatusBadge status={row.status} />,
        },
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 60,
          align: 'right',
          render: (row) => (
            <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'flex-end' }}>
              <Tooltip title="View" arrow>
                <IconButton size="small" onClick={() => handleViewDoc(row)} sx={{ color: '#3b82f6', p: 0.25 }}>
                  <ViewIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit" arrow>
                <IconButton size="small" onClick={() => handleEditDoc(row)} sx={{ color: '#f59e0b', p: 0.25 }}>
                  <EditIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton size="small" onClick={() => handleDeleteDoc(row.id)} sx={{ color: '#ef4444', p: 0.25 }}>
                  <DeleteIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      ];
    } else if (isLargeTablet) {
      return [
        { id: 'docNo', label: 'Doc No.', minWidth: 80, render: (row) => <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#008080' }}>{row.docNo}</Typography> },
        { id: 'title', label: 'Title', minWidth: 100, render: (row) => <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b' }}>{row.title.length > 25 ? row.title.substring(0, 25) + '...' : row.title}</Typography> },
        { id: 'type', label: 'Type', minWidth: 80, render: (row) => <Typography sx={{ fontSize: '0.8rem', color: '#3b82f6' }}>{row.type}</Typography> },
        { 
          id: 'linkedTo', 
          label: 'Linked To', 
          minWidth: 90,
          render: (row) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getLinkedIcon(row.linkedTo.type)}
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                {row.linkedTo.name.length > 15 ? row.linkedTo.name.substring(0, 15) + '...' : row.linkedTo.name}
              </Typography>
            </Box>
          )
        },
        { id: 'issuedDate', label: 'Issued', minWidth: 70, render: (row) => <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{row.issuedDate}</Typography> },
        { id: 'expiryDate', label: 'Expiry', minWidth: 70, render: (row) => (
          <Typography sx={{ fontSize: '0.8rem', fontWeight: row.status === 'Expired' ? 600 : 400, color: row.status === 'Expired' ? '#ef4444' : row.status === 'Expiring Soon' ? '#f59e0b' : '#64748b' }}>
            {row.expiryDate || '-'}
          </Typography>
        )},
        {
          id: 'status',
          label: 'Status',
          minWidth: 70,
          render: (row) => <StatusBadge status={row.status} />,
        },
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 70,
          align: 'right',
          render: (row) => (
            <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'flex-end' }}>
              <Tooltip title="View" arrow>
                <IconButton size="small" onClick={() => handleViewDoc(row)} sx={{ color: '#3b82f6', p: 0.25 }}>
                  <ViewIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit" arrow>
                <IconButton size="small" onClick={() => handleEditDoc(row)} sx={{ color: '#f59e0b', p: 0.25 }}>
                  <EditIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton size="small" onClick={() => handleDeleteDoc(row.id)} sx={{ color: '#ef4444', p: 0.25 }}>
                  <DeleteIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      ];
    } else {
      return [
        { id: 'docNo', label: 'Document No.', minWidth: 100, render: (row) => <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#008080' }}>{row.docNo}</Typography> },
        { id: 'title', label: 'Title', minWidth: 130, render: (row) => <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' }}>{row.title}</Typography> },
        { id: 'type', label: 'Type', minWidth: 100, render: (row) => <Typography sx={{ fontSize: '0.85rem', color: '#3b82f6' }}>{row.type}</Typography> },
        { id: 'linkedTo', label: 'Linked To', minWidth: 130, render: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getLinkedIcon(row.linkedTo.type)}
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>{row.linkedTo.name}</Typography>
          </Box>
        )},
        { id: 'issuedDate', label: 'Issued Date', minWidth: 90, render: (row) => <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>{row.issuedDate}</Typography> },
        { id: 'expiryDate', label: 'Expiry Date', minWidth: 90, render: (row) => (
          <Typography sx={{ fontSize: '0.85rem', fontWeight: row.status === 'Expired' ? 600 : 400, color: row.status === 'Expired' ? '#ef4444' : row.status === 'Expiring Soon' ? '#f59e0b' : '#64748b' }}>
            {row.expiryDate || '-'}
          </Typography>
        )},
        { id: 'uploadedBy', label: 'Uploaded By', minWidth: 90, render: (row) => <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>{row.uploadedBy}</Typography> },
        { id: 'size', label: 'Size', minWidth: 70, render: (row) => <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>{row.size}</Typography> },
        {
          id: 'status',
          label: 'Status',
          minWidth: 90,
          render: (row) => <StatusBadge status={row.status} />,
        },
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 90,
          align: 'right',
          render: (row) => (
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
              <Tooltip title="View/Download" arrow>
                <IconButton size="small" onClick={() => handleViewDoc(row)} sx={{ color: '#3b82f6' }}>
                  <ViewIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit" arrow>
                <IconButton size="small" onClick={() => handleEditDoc(row)} sx={{ color: '#f59e0b' }}>
                  <EditIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton size="small" onClick={() => handleDeleteDoc(row.id)} sx={{ color: '#ef4444' }}>
                  <DeleteIcon sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      ];
    }
  };

  return (
    <Box sx={{ width: '100%', px: 0, overflow: 'hidden' }}>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {statCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: '#ffffff',
              borderLeft: `4px solid ${card.color}`,
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: card.color, mt: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#64748b', mt: 0.5 }}>
                    {card.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.7 }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ 
        width: '100%',
        borderRadius: { xs: 1, sm: 2 },
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <CardHeader
          title="Document Management"
          action={
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleUploadDoc}
              size={isMobile ? 'small' : 'medium'}
              disableFocusRipple
              disableRipple
              sx={{
                background: '#2563eb',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                padding: { xs: '4px 10px', sm: '6px 16px' },
                whiteSpace: 'nowrap',
                '&:focus': { outline: 'none' },
                '&.Mui-focusVisible': { outline: 'none' },
                '&:hover': {
                  background: '#1d4ed8',
                },
              }}
            >
              {isMobile ? 'Upload' : 'Upload Document'}
            </Button>
          }
          sx={{
            '& .MuiCardHeader-title': {
              fontSize: { xs: 16, sm: 18 },
              fontWeight: 600,
              color: '#1e293b',
            },
            '& .MuiCardHeader-action': {
              margin: 0,
              alignSelf: 'center',
            },
            px: { xs: 1.5, sm: 2, md: 3 },
            py: { xs: 1, sm: 1.5, md: 2 },
            borderBottom: '1px solid #e2e8f0',
          }}
        />
        
        <CardContent sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          '&:last-child': { pb: { xs: 2, sm: 3 } },
        }}>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: '0.9rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiInputBase-root': { fontSize: '0.8rem' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    displayEmpty
                    sx={{ 
                      fontSize: '0.8rem',
                      minWidth: '200px',
                      width: '100%',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#cbd5e1',
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: '0.8rem' }}>All Types</MenuItem>
                    <MenuItem value="Contract" sx={{ fontSize: '0.8rem' }}>Contract</MenuItem>
                    <MenuItem value="PO Acknowledgement" sx={{ fontSize: '0.8rem' }}>PO Acknowledgement</MenuItem>
                    <MenuItem value="Quality Certificate" sx={{ fontSize: '0.8rem' }}>Quality Certificate</MenuItem>
                    <MenuItem value="Regulatory Notice" sx={{ fontSize: '0.8rem' }}>Regulatory Notice</MenuItem>
                    <MenuItem value="MSDS / Safety Sheet" sx={{ fontSize: '0.8rem' }}>MSDS / Safety Sheet</MenuItem>
                    <MenuItem value="Delivery Note" sx={{ fontSize: '0.8rem' }}>Delivery Note</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <Select
                    value={linkedFilter}
                    onChange={(e) => setLinkedFilter(e.target.value)}
                    displayEmpty
                    sx={{ 
                      fontSize: '0.8rem',
                      minWidth: '200px',
                      width: '100%',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#cbd5e1',
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: '0.8rem' }}>All Linked Records</MenuItem>
                    <MenuItem value="supplier" sx={{ fontSize: '0.8rem' }}>Suppliers</MenuItem>
                    <MenuItem value="po" sx={{ fontSize: '0.8rem' }}>Purchase Orders</MenuItem>
                    <MenuItem value="grn" sx={{ fontSize: '0.8rem' }}>GRN</MenuItem>
                    <MenuItem value="item" sx={{ fontSize: '0.8rem' }}>Items</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    sx={{ 
                      fontSize: '0.8rem',
                      minWidth: '200px',
                      width: '100%',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#cbd5e1',
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: '0.8rem' }}>All Statuses</MenuItem>
                    <MenuItem value="Active" sx={{ fontSize: '0.8rem' }}>Active</MenuItem>
                    <MenuItem value="Expiring Soon" sx={{ fontSize: '0.8rem' }}>Expiring Soon</MenuItem>
                    <MenuItem value="Expired" sx={{ fontSize: '0.8rem' }}>Expired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {isMobile ? (
            <Box>
              {filteredDocs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((doc) => (
                  <MobileDocumentCard key={doc.id} doc={doc} />
                ))}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 2,
                px: 1,
              }}>
                <Typography sx={{ fontSize: 12, color: '#64748b' }}>
                  {filteredDocs.length} total
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    sx={{ minWidth: 'auto', px: 1.5, fontSize: '0.75rem' }}
                  >
                    Prev
                  </Button>
                  <Typography sx={{ fontSize: 13 }}>
                    {page + 1} / {Math.ceil(filteredDocs.length / rowsPerPage)}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={page >= Math.ceil(filteredDocs.length / rowsPerPage) - 1}
                    onClick={() => setPage(page + 1)}
                    sx={{ minWidth: 'auto', px: 1.5, fontSize: '0.75rem' }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                  width: '100%',
                  overflowX: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  '&::-webkit-scrollbar': {
                    height: '6px',
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f5f9',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#cbd5e1',
                    borderRadius: '3px',
                    '&:hover': {
                      background: '#94a3b8',
                    },
                  },
                }}
              >
                <Table 
                  size="small"
                  sx={{ 
                    tableLayout: 'auto',
                    width: '100%',
                    minWidth: isSmallTablet ? 500 : (isLargeTablet ? 650 : 1000),
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {getColumns().map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{ 
                            minWidth: column.minWidth,
                            fontWeight: 600,
                            backgroundColor: '#f8fafc',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                            py: 1,
                            px: isTablet ? 1 : 1.5,
                            color: '#475569',
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDocs
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover key={row.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                          {getColumns().map((column) => {
                            const value = column.render(row);
                            return (
                              <TableCell 
                                key={column.id} 
                                align={column.align || 'left'}
                                sx={{ 
                                  whiteSpace: 'nowrap',
                                  py: 1,
                                  px: isTablet ? 1 : 1.5,
                                  borderBottom: '1px solid #f1f5f9',
                                }}
                              >
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 2,
                flexWrap: 'wrap',
                gap: 2,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Rows per page:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 70 }}>
                    <Select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      disableFocusRipple
                      disableRipple
                      sx={{
                        fontSize: '0.8rem',
                        height: 32,
                        width: '100%',
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSelect-select': {
                          py: 0.5,
                          px: 1,
                          backgroundColor: '#f8fafc',
                          borderRadius: 1,
                        },
                      }}
                    >
                      <MenuItem value={5} sx={{ fontSize: '0.8rem' }}>5</MenuItem>
                      <MenuItem value={10} sx={{ fontSize: '0.8rem' }}>10</MenuItem>
                      <MenuItem value={25} sx={{ fontSize: '0.8rem' }}>25</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredDocs.length)} of {filteredDocs.length}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 0}
                      sx={{
                        color: page === 0 ? '#cbd5e1' : '#2563eb',
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: page === 0 ? 'transparent' : '#eff6ff',
                        },
                      }}
                    >
                      <ChevronLeftIcon sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= Math.ceil(filteredDocs.length / rowsPerPage) - 1}
                      sx={{
                        color: page >= Math.ceil(filteredDocs.length / rowsPerPage) - 1 ? '#cbd5e1' : '#2563eb',
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: page >= Math.ceil(filteredDocs.length / rowsPerPage) - 1 ? 'transparent' : '#eff6ff',
                        },
                      }}
                    >
                      <ChevronRightIcon sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <DocumentUploadModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedDoc(null);
        }}
        onSave={handleSaveDoc}
        document={selectedDoc}
      />
    </Box>
  );
};

export default DocumentManagement;