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
  Grid,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ManufacturerModal from '../components/ManufacturerModal';

// Add this color object right after your imports or at the top of the component
const C = {
  bg:            "#F8FAFC",
  border:        "#E5E7EB",
  textPrimary:   "#111827",
  textSecondary: "#6B7280",
  primary:       "#1976D2",
};

const initialManufacturers = [
  {
    id: "m1",
    name: "Teva Pharmaceuticals",
    website: "www.tevapharm.com",
    code: "TEVA",
    type: "Pharma",
    country: "Israel",
    contactPhone: "1-888-838-2872",
    contactEmail: "",
    regNumber: "TEVA-US-001",
    suppliedBy: ["McKesson"],
    status: "Active",
    notes: ""
  },
  {
    id: "m2",
    name: "Pfizer Inc.",
    website: "www.pfizer.com",
    code: "PFZ",
    type: "Pharma",
    country: "USA",
    contactPhone: "1-800-879-3477",
    contactEmail: "",
    regNumber: "PFZ-US-001",
    suppliedBy: ["McKesson", "Cardinal"],
    status: "Active",
    notes: ""
  },
  {
    id: "m3",
    name: "Baxter International",
    website: "www.baxter.com",
    code: "BAX",
    type: "Pharma",
    country: "USA",
    contactPhone: "1-800-422-9837",
    contactEmail: "",
    regNumber: "BAX-US-001",
    suppliedBy: ["Cardinal"],
    status: "Active",
    notes: ""
  },
  {
    id: "m4",
    name: "Ansell Healthcare",
    website: "www.ansell.com",
    code: "ANSELL",
    type: "PPE",
    country: "Australia",
    contactPhone: "1-800-952-9916",
    contactEmail: "",
    regNumber: "ANS-AU-001",
    suppliedBy: ["Medline"],
    status: "Active",
    notes: ""
  },
  {
    id: "m5",
    name: "3M Health Care",
    website: "www.3m.com",
    code: "3M",
    type: "PPE",
    country: "USA",
    contactPhone: "1-800-364-3577",
    contactEmail: "",
    regNumber: "3M-US-001",
    suppliedBy: ["Medline"],
    status: "Active",
    notes: ""
  },
  {
    id: "m6",
    name: "Becton Dickinson (BD)",
    website: "www.bd.com",
    code: "BD",
    type: "Diagnostics",
    country: "USA",
    contactPhone: "1-888-237-2762",
    contactEmail: "",
    regNumber: "BD-US-001",
    suppliedBy: ["Fisher"],
    status: "Active",
    notes: ""
  },
  {
    id: "m7",
    name: "West-Ward Pharmaceuticals",
    website: "www.westwardpharm.com",
    code: "WWPH",
    type: "Pharma",
    country: "USA",
    contactPhone: "1-800-631-2174",
    contactEmail: "",
    regNumber: "WW-US-001",
    suppliedBy: ["McKesson"],
    status: "Active",
    notes: ""
  },
  {
    id: "m8",
    name: "Medline Industries",
    website: "www.medline.com",
    code: "MDL",
    type: "Surgical",
    country: "USA",
    contactPhone: "1-800-633-5463",
    contactEmail: "",
    regNumber: "MDL-US-001",
    suppliedBy: ["Medline"],
    status: "Active",
    notes: ""
  }
];

const Manufacturers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLargeTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const [manufacturers, setManufacturers] = useState(initialManufacturers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  const typeStats = {
    Pharma: manufacturers.filter(m => m.type === "Pharma").length,
    PPE: manufacturers.filter(m => m.type === "PPE").length,
    Surgical: manufacturers.filter(m => m.type === "Surgical").length,
    Diagnostics: manufacturers.filter(m => m.type === "Diagnostics").length,
  };

  const statCards = [
    { title: "Pharma", value: typeStats.Pharma, subtitle: "manufacturers" },
    { title: "PPE", value: typeStats.PPE, subtitle: "manufacturers"},
    { title: "Surgical", value: typeStats.Surgical, subtitle: "manufacturers" },
    { title: "Diagnostics", value: typeStats.Diagnostics, subtitle: "manufacturers"},
  ];

  const handleEdit = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this manufacturer?")) {
      setManufacturers(manufacturers.filter(m => m.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setManufacturers(manufacturers.map(m => 
      m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m
    ));
  };

  const handleAddManufacturer = () => {
    setSelectedManufacturer(null);
    setModalOpen(true);
  };

  const handleSaveManufacturer = (manufacturerData) => {
    const manufacturerToSave = {
      name: manufacturerData.name,
      website: manufacturerData.website,
      code: manufacturerData.code,
      type: manufacturerData.type,
      country: manufacturerData.country,
      contactPhone: manufacturerData.phone,
      contactEmail: manufacturerData.email,
      regNumber: manufacturerData.regNumber,
      notes: manufacturerData.notes,
      suppliedBy: selectedManufacturer?.suppliedBy || [],
      status: manufacturerData.status || "Active"
    };

    if (selectedManufacturer) {
      setManufacturers(manufacturers.map(m => 
        m.id === selectedManufacturer.id ? { ...m, ...manufacturerToSave } : m
      ));
    } else {
      const newManufacturer = {
        id: `m${manufacturers.length + 1}`,
        ...manufacturerToSave,
      };
      setManufacturers([...manufacturers, newManufacturer]);
    }
    setModalOpen(false);
    setSelectedManufacturer(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mobile card view
  const MobileManufacturerCard = ({ manufacturer }) => {
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
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>
              {manufacturer.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#64748b', mt: 0.25 }}>
              {manufacturer.website}
            </Typography>
          </Box>
          <Chip 
            label={manufacturer.status} 
            size="small" 
            sx={{ 
              backgroundColor: manufacturer.status === "Active" ? '#e8f5e9' : '#ffebee',
              color: manufacturer.status === "Active" ? '#2e7d32' : '#d32f2f',
              fontSize: '0.65rem',
              height: '22px'
            }} 
          />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              CODE
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6' }}>
              {manufacturer.code}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              TYPE
            </Typography>
            <Chip 
              label={manufacturer.type} 
              size="small" 
              sx={{ 
                backgroundColor: '#e3f2fd', 
                color: '#1976d2', 
                fontSize: '10px',
                height: '22px'
              }} 
            />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              COUNTRY
            </Typography>
            <Typography sx={{ fontSize: 12 }}>{manufacturer.country}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              REG. NO.
            </Typography>
            <Typography sx={{ fontSize: 12 }}>{manufacturer.regNumber}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600, mb: 0.5 }}>
            CONTACT
          </Typography>
          <Typography sx={{ fontSize: 11 }}>{manufacturer.contactPhone || '—'}</Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 10, color: '#64748b', fontWeight: 600, mb: 0.5 }}>
            SUPPLIED BY
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {manufacturer.suppliedBy.map(supplier => (
              <Chip 
                key={supplier} 
                label={supplier} 
                size="small" 
                sx={{ 
                  backgroundColor: '#e0f2fe', 
                  color: '#0284c7', 
                  fontSize: '10px',
                  height: '22px'
                }} 
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(manufacturer)} sx={{ color: '#f59e0b', p: 0.5 }}>
              <EditIcon sx={{ fontSize: '0.875rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={manufacturer.status === "Active" ? "Deactivate" : "Activate"}>
            <IconButton size="small" onClick={() => handleToggleStatus(manufacturer.id)} sx={{ color: manufacturer.status === "Active" ? '#ef4444' : '#10b981', p: 0.5 }}>
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
        { id: 'name', label: 'Manufacturer', minWidth: 100, render: (row) => (
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>{row.name}</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#64748b' }}>{row.website}</Typography>
          </Box>
        )},
        { id: 'code', label: 'Code', minWidth: 60, render: (row) => (
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#8b5cf6' }}>{row.code}</Typography>
        )},
        { id: 'type', label: 'Type', minWidth: 60, render: (row) => (
          <Chip label={row.type} size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontSize: '0.6rem', height: '20px' }} />
        )},
        { id: 'status', label: 'Status', minWidth: 60, render: (row) => (
          <Chip label={row.status} size="small" sx={{ 
            backgroundColor: row.status === "Active" ? '#e8f5e9' : '#ffebee',
            color: row.status === "Active" ? '#2e7d32' : '#d32f2f',
            fontSize: '0.6rem', height: '20px' 
          }} />
        )},
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 60,
          align: 'right',
          render: (row) => (
            <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'flex-end' }}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleEdit(row)} sx={{ color: '#f59e0b', p: 0.25 }}>
                  <EditIcon sx={{ fontSize: '0.7rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={row.status === "Active" ? "Deactivate" : "Activate"}>
                <IconButton size="small" onClick={() => handleToggleStatus(row.id)} sx={{ color: row.status === "Active" ? '#ef4444' : '#10b981', p: 0.25 }}>
                  <DeleteIcon sx={{ fontSize: '0.7rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      ];
    } else if (isLargeTablet) {
      return [
        { id: 'name', label: 'Manufacturer', minWidth: 120, render: (row) => (
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>{row.name}</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#64748b' }}>{row.website}</Typography>
          </Box>
        )},
        { id: 'code', label: 'Code', minWidth: 70, render: (row) => (
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b5cf6' }}>{row.code}</Typography>
        )},
        { id: 'type', label: 'Type', minWidth: 80, render: (row) => (
          <Chip label={row.type} size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontSize: '0.7rem', height: '22px' }} />
        )},
        { id: 'country', label: 'Country', minWidth: 80, render: (row) => (
          <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{row.country}</Typography>
        )},
        { id: 'regNumber', label: 'Reg. No.', minWidth: 90, render: (row) => (
          <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>{row.regNumber}</Typography>
        )},
        { id: 'status', label: 'Status', minWidth: 70, render: (row) => (
          <Chip label={row.status} size="small" sx={{ 
            backgroundColor: row.status === "Active" ? '#e8f5e9' : '#ffebee',
            color: row.status === "Active" ? '#2e7d32' : '#d32f2f',
            fontSize: '0.7rem', height: '22px' 
          }} />
        )},
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 70,
          align: 'right',
          render: (row) => (
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleEdit(row)} sx={{ color: '#f59e0b' }}>
                  <EditIcon sx={{ fontSize: '0.75rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={row.status === "Active" ? "Deactivate" : "Activate"}>
                <IconButton size="small" onClick={() => handleToggleStatus(row.id)} sx={{ color: row.status === "Active" ? '#ef4444' : '#10b981' }}>
                  <DeleteIcon sx={{ fontSize: '0.75rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      ];
    } else {
      return [
        { id: 'name', label: 'Manufacturer', minWidth: 150, render: (row) => (
          <Box>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>{row.name}</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#64748b' }}>{row.website}</Typography>
          </Box>
        )},
        { id: 'code', label: 'Code', minWidth: 80, render: (row) => (
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#8b5cf6' }}>{row.code}</Typography>
        )},
        { id: 'type', label: 'Type', minWidth: 90, render: (row) => (
          <Chip label={row.type} size="small" sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontSize: '0.75rem' }} />
        )},
        { id: 'country', label: 'Country', minWidth: 90, render: (row) => (
          <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{row.country}</Typography>
        )},
        { id: 'contact', label: 'Contact', minWidth: 100, render: (row) => (
          <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>{row.contactPhone || '—'}</Typography>
        )},
        { id: 'regNumber', label: 'Reg. No.', minWidth: 100, render: (row) => (
          <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>{row.regNumber}</Typography>
        )},
        { id: 'suppliedBy', label: 'Supplied By', minWidth: 100, render: (row) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {row.suppliedBy.map(supplier => (
              <Chip key={supplier} label={supplier} size="small" sx={{ backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '0.65rem', height: '22px' }} />
            ))}
          </Box>
        )},
        { id: 'status', label: 'Status', minWidth: 80, render: (row) => (
          <Chip label={row.status} size="small" sx={{ 
            backgroundColor: row.status === "Active" ? '#e8f5e9' : '#ffebee',
            color: row.status === "Active" ? '#2e7d32' : '#d32f2f',
            fontSize: '0.7rem' 
          }} />
        )},
        {
          id: 'actions',
          label: 'Actions',
          minWidth: 80,
          align: 'right',
          render: (row) => (
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => handleEdit(row)} sx={{ color: '#f59e0b' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={row.status === "Active" ? "Deactivate" : "Activate"}>
                <IconButton size="small" onClick={() => handleToggleStatus(row.id)} sx={{ color: row.status === "Active" ? '#ef4444' : '#10b981' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ),
        },
      ];
    }
  };

  return (
    <Box sx={{ width: '100%', px: 0, overflow: 'hidden', background: "#f8fafc", minHeight: "100vh", padding: "26px 24px" }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 0 },
        mb: { xs: 2, sm: 3 },
      }}>
      <Box>
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: 22,
      color: C.textPrimary,
      letterSpacing: -0.3,
    }}
  >
    Manufacturer Master
  </Typography>

  <Typography
    sx={{
      fontSize: 13,
      color: C.textSecondary,
      mt: 0.3,
    }}
  >
    {manufacturers.filter(m => m.status === "Active").length} active manufacturers registered
  </Typography>
</Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddManufacturer}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            background: '#2563eb',
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
            fontWeight: 500,
            padding: { xs: '6px 16px', sm: '7px 20px', md: '8px 24px' },
            '&:hover': {
              background: "#2563eb"
            }
          }}
        >
          Add Manufacturer
        </Button>
      </Box>

     <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr",
      md: "repeat(4, 1fr)",
    },
    gap: 2,
    mb: 3,
  }}
>
  {statCards.map((card, index) => (
    <Card
      key={index}
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb", // ✅ clean border
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        {/* Title */}
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 0.5,
          }}
        >
          {card.title}
        </Typography>

        {/* Value + Subtitle INLINE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {card.value}
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: "#6b7280",
              whiteSpace: "nowrap",
            }}
          >
            {card.subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  ))}
</Box>

      {/* MAIN OUTER CARD - Light grey/white card wrapper */}
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
          {isMobile ? (
            <Box>
              {manufacturers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((manufacturer) => (
                  <MobileManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
                ))}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 2,
                px: 1,
              }}>
                <Typography sx={{ fontSize: 12, color: '#64748b' }}>
                  {manufacturers.length} total
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
                    {page + 1} / {Math.ceil(manufacturers.length / rowsPerPage)}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={page >= Math.ceil(manufacturers.length / rowsPerPage) - 1}
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
                  borderRadius: 2,
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
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      {getColumns().map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{ 
                            minWidth: column.minWidth,
                            fontWeight: 600,
                            backgroundColor: '#f8fafc',
                            whiteSpace: 'nowrap',
                            fontSize: '0.8rem',
                            py: 1.5,
                            px: isTablet ? 1.5 : 2,
                            color: '#475569',
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {manufacturers
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
                                  py: 1.5,
                                  px: isTablet ? 1.5 : 2,
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
              
              
            </>
          )}
        </CardContent>
      </Card>

      <ManufacturerModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedManufacturer(null);
        }}
        onSave={handleSaveManufacturer}
        manufacturer={selectedManufacturer}
      />
    </Box>
  );
};

export default Manufacturers;