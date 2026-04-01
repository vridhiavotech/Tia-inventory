import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
  GlobalStyles,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import EventIcon from '@mui/icons-material/Event';

const IndentProcurement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef(null);
  
  const [indentDetails, setIndentDetails] = useState({
    indentNo: 'IND-2026-371',
    indentDate: '2026-03-27',
    department: '',
    requiredBy: '',
    priority: 'Normal',
    requestedBy: '',
    remarks: '',
  });

  const [materialItems, setMaterialItems] = useState([
    {
      id: 1,
      itemCode: 'ITM-001',
      description: 'Item description',
      uom: 'Nos',
      quantityReq: 1,
      currentStock: 0,
      category: 'Raw Material',
    },
    {
      id: 2,
      itemCode: 'ITM-001',
      description: 'Item description',
      uom: 'Nos',
      quantityReq: 1,
      currentStock: '',
      category: 'Raw Material',
    },
  ]);

  const steps = ['Indent', 'Quotation', 'Purchase Order', 'Order Acceptance'];
  const departments = ['Select...', 'Production', 'Maintenance', 'Quality Control', 'R&D', 'Administration', 'Warehouse', 'Pharmacy'];
  const priorityOptions = ['Normal', 'Urgent', 'Critical'];
  const uomOptions = ['Nos', 'Kg', 'Ltr', 'Mtr', 'Box', 'Set', 'Pcs'];
  const categoryOptions = ['Raw Material', 'Spare Parts', 'Consumable', 'Electrical', 'Mechanical', 'IT / Office'];

  const handleIndentChange = (field) => (event) => {
    setIndentDetails({ ...indentDetails, [field]: event.target.value });
  };

  const handleDateIconClick = () => {
    if (dateInputRef.current) {
      if (showDatePicker) {
        dateInputRef.current.blur();
        setShowDatePicker(false);
      } else {
        if (dateInputRef.current.showPicker) {
          dateInputRef.current.showPicker();
        } else {
          dateInputRef.current.focus();
        }
        setShowDatePicker(true);
      }
    }
  };

  const handleDateChange = (e) => {
    setIndentDetails({ ...indentDetails, indentDate: e.target.value });
    setShowDatePicker(false);
  };

  const handleItemChange = (id, field) => (event) => {
    setMaterialItems(materialItems.map(item =>
      item.id === id ? { ...item, [field]: event.target.value } : item
    ));
  };

  const addItemRow = () => {
    const newId = materialItems.length + 1;
    setMaterialItems([
      ...materialItems,
      {
        id: newId,
        itemCode: '',
        description: '',
        uom: 'Nos',
        quantityReq: 1,
        currentStock: '',
        category: 'Raw Material',
      },
    ]);
  };

  const removeItemRow = (id) => {
    if (materialItems.length > 1) {
      setMaterialItems(materialItems.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setIndentDetails({
      indentNo: 'IND-2026-371',
      indentDate: new Date().toISOString().split('T')[0],
      department: '',
      requiredBy: '',
      priority: 'Normal',
      requestedBy: '',
      remarks: '',
    });
    setMaterialItems([
      {
        id: 1,
        itemCode: 'ITM-001',
        description: 'Item description',
        uom: 'Nos',
        quantityReq: 1,
        currentStock: 0,
        category: 'Raw Material',
      },
      {
        id: 2,
        itemCode: 'ITM-001',
        description: 'Item description',
        uom: 'Nos',
        quantityReq: 1,
        currentStock: '',
        category: 'Raw Material',
      },
    ]);
  };

  const saveIndent = () => {
    console.log('Indent Details:', indentDetails);
    console.log('Material Items:', materialItems);
    alert('Indent saved successfully!');
    setActiveStep(1);
  };

  const handleNewIndent = () => {
    const newIndentNo = `IND-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
    
    setIndentDetails({
      indentNo: newIndentNo,
      indentDate: new Date().toISOString().split('T')[0],
      department: '',
      requiredBy: '',
      priority: 'Normal',
      requestedBy: '',
      remarks: '',
    });
    
    setMaterialItems([
      {
        id: 1,
        itemCode: 'ITM-001',
        description: 'Item description',
        uom: 'Nos',
        quantityReq: 1,
        currentStock: 0,
        category: 'Raw Material',
      },
      {
        id: 2,
        itemCode: 'ITM-001',
        description: 'Item description',
        uom: 'Nos',
        quantityReq: 1,
        currentStock: '',
        category: 'Raw Material',
      },
    ]);
    
    setActiveStep(0);
  };

  const getGridSize = () => {
    if (isMobile) return { xs: 12 };
    if (isTablet) return { xs: 12, sm: 6 };
    return { xs: 12, sm: 6, md: 2.4 };
  };

  return (
    <>
      <GlobalStyles
        styles={{
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: '#f1f5f9',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '4px',
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f1f1',
          },
        }}
      />
      
      <Box sx={{ 
        width: '100%',
        overflowX: 'hidden',
        px: { xs: 0.5, sm: 0.5, md: 0.5 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
          mb: { xs: 2, sm: 3 }
        }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 600, 
                color: '#1a1a2e', 
                mb: 0.5,
                fontSize: { xs: '20px', sm: '22px', md: '24px' }
              }}
            >
              Indent & Procurement
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6c757d',
                fontSize: { xs: '12px', sm: '13px', md: '14px' }
              }}
            >
              Manage the full procurement cycle: Indent → Quotation → Purchase Order → Order Acceptance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '11px', 
                color: '#6c757d', 
                fontFamily: "'Syne', sans-serif" 
              }}
            >
              {indentDetails.indentNo}
            </Typography>
            <Button 
              variant="outlined"  
              onClick={handleNewIndent}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                borderColor: '#e9ecef',
                color: '#6c757d',
                fontSize: '12px',
                fontWeight: 500,
                padding: '6px 16px',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  backgroundColor: '#f8f9fa',
                }
              }}
            >
              🔄 New Indent
            </Button>
          </Box>
        </Box>

        <Box sx={{ 
          maxWidth: { xs: '100%', sm: '560px' }, 
          mb: { xs: 2, sm: 3, md: 4 },
          overflowX: 'auto'
        }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '& .MuiStepIcon-root': {
                        width: { xs: 24, sm: 28, md: 32 },
                        height: { xs: 24, sm: 28, md: 32 },
                      },
                      '& .MuiStepIcon-root.Mui-active': { 
                        color: '#2563eb',
                      },
                      '& .MuiStepIcon-root.Mui-completed': { 
                        color: '#2563eb',
                      },
                    }
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: activeStep === index ? 600 : 400, 
                      color: activeStep === index ? '#2563eb' : '#6c757d',
                      fontSize: { xs: '10px', sm: '11px', md: '12px' }
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Paper 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            borderRadius: '12px', 
            border: '1px solid #e9ecef', 
            boxShadow: 'none',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            p: { xs: 1.5, sm: 2, md: 2.5 }, 
            borderBottom: '1px solid #e9ecef', 
            bgcolor: '#f8f9fa' 
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '14px', sm: '15px', md: '16px' }, 
              color: '#1a1a2e' 
            }}>
              📋 Indent Details
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              <Grid size={getGridSize()}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5, 
                    color: '#6c757d', 
                    fontSize: { xs: '10px', sm: '10px', md: '11px' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  INDENT NO.
                </Typography>
                <TextField
                  value={indentDetails.indentNo}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#e9ecef',
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '11px', sm: '11px', md: '12px' },
                      color: '#6c757d',
                      padding: { xs: '8px 10px', sm: '9px 12px', md: '10px 14px' },
                    }
                  }}
                />
              </Grid>
              <Grid size={getGridSize()}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5, 
                    color: '#6c757d', 
                    fontSize: { xs: '10px', sm: '10px', md: '11px' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  INDENT DATE
                </Typography>
                <TextField
                  id="indent-date"
                  type="date"
                  value={indentDetails.indentDate}
                  onChange={handleDateChange}
                  inputRef={dateInputRef}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleDateIconClick}
                          edge="end"
                          size="small"
                          disableFocusRipple
                          disableRipple
                          sx={{
                            color: '#64748b',
                            padding: { xs: '2px', sm: '3px', md: '4px' },
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              color: '#2563eb',
                            },
                            '&:focus': { outline: 'none' },
                            '&.Mui-focusVisible': { outline: 'none' },
                          }}
                        >
                          <EventIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#e9ecef',
                      },
                      '&:hover fieldset': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '11px', sm: '11px', md: '12px' },
                      padding: { xs: '8px 10px', sm: '9px 12px', md: '10px 14px' },
                    }
                  }}
                />
              </Grid>
              <Grid size={getGridSize()}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5, 
                    color: '#6c757d', 
                    fontSize: { xs: '10px', sm: '10px', md: '11px' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  DEPARTMENT
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={indentDetails.department}
                    onChange={handleIndentChange('department')}
                    displayEmpty
                    sx={{ 
                      borderRadius: '8px',
                      '& .MuiSelect-select': {
                        fontSize: { xs: '11px', sm: '11px', md: '12px' },
                        padding: { xs: '8px 10px', sm: '9px 12px', md: '10px 14px' },
                        color: indentDetails.department ? '#1a1a2e' : '#6c757d',
                      }
                    }}
                  >
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept === 'Select...' ? '' : dept} sx={{ fontSize: { xs: '11px', sm: '11px', md: '12px' } }}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={getGridSize()}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5, 
                    color: '#6c757d', 
                    fontSize: { xs: '10px', sm: '10px', md: '11px' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  REQUIRED BY
                </Typography>
                <TextField
                  type="date"
                  value={indentDetails.requiredBy}
                  onChange={handleIndentChange('requiredBy')}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#e9ecef',
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '11px', sm: '11px', md: '12px' },
                      padding: { xs: '8px 10px', sm: '9px 12px', md: '10px 14px' },
                    }
                  }}
                />
              </Grid>
              <Grid size={getGridSize()}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5, 
                    color: '#6c757d', 
                    fontSize: { xs: '10px', sm: '10px', md: '11px' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  PRIORITY
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={indentDetails.priority}
                    onChange={handleIndentChange('priority')}
                    sx={{ 
                      borderRadius: '8px',
                      '& .MuiSelect-select': {
                        fontSize: { xs: '11px', sm: '11px', md: '12px' },
                        padding: { xs: '8px 10px', sm: '9px 12px', md: '10px 14px' },
                      }
                    }}
                  >
                    {priorityOptions.map(opt => (
                      <MenuItem key={opt} value={opt} sx={{ fontSize: { xs: '11px', sm: '11px', md: '12px' } }}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5, 
                    color: '#6c757d', 
                    fontSize: { xs: '10px', sm: '10px', md: '11px' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  REQUESTED BY
                </Typography>
                <Box sx={{ maxWidth: { xs: '100%', sm: '100%', md: '250px' } }}>
                  <TextField
                    placeholder="Name / Employee ID"
                    value={indentDetails.requestedBy}
                    onChange={handleIndentChange('requestedBy')}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: '#e9ecef',
                        }
                      },
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '11px', sm: '11px', md: '12px' },
                        padding: { xs: '8px 10px', sm: '9px 12px', md: '10px 14px' },
                      }
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5, 
                    color: '#6c757d', 
                    fontSize: { xs: '10px', sm: '10px', md: '11px' },
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  PURPOSE / REMARKS
                </Typography>
                <TextField
                  placeholder="Reason for indent, current stock level, usage details…"
                  value={indentDetails.remarks}
                  onChange={handleIndentChange('remarks')}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#e9ecef',
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '11px', sm: '11px', md: '12px' },
                      padding: { xs: '8px 10px', sm: '9px 12px', md: '10px 14px' },
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Paper 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            borderRadius: '12px', 
            border: '1px solid #e9ecef', 
            boxShadow: 'none',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            p: { xs: 1.5, sm: 2, md: 2.5 }, 
            borderBottom: '1px solid #e9ecef', 
            bgcolor: '#f8f9fa', 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              fontSize: { xs: '14px', sm: '15px', md: '16px' }, 
              color: '#1a1a2e' 
            }}>
              📦 Material Items
            </Typography>
            <Button 
              startIcon={<AddIcon />} 
              onClick={addItemRow}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                color: '#2563eb',
                fontSize: { xs: '12px', sm: '12px', md: '13px' },
                fontWeight: 500,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: '#ede9fe',
                }
              }}
            >
              Add Item
            </Button>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer sx={{ minWidth: '100%' }}>
              <Table size="small" sx={{ 
                '& .MuiTableCell-root': {
                  padding: { xs: '6px 8px', sm: '8px 10px', md: '10px 12px' },
                }
              }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '40px',
                      whiteSpace: 'nowrap'
                    }}>
                      #
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '110px',
                      whiteSpace: 'nowrap'
                    }}>
                      ITEM CODE
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '180px',
                      whiteSpace: 'nowrap'
                    }}>
                      DESCRIPTION
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '70px',
                      whiteSpace: 'nowrap'
                    }}>
                      UOM
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '70px',
                      whiteSpace: 'nowrap'
                    }}>
                      QTY REQ.
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '70px',
                      whiteSpace: 'nowrap'
                    }}>
                      CURR. STOCK
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '120px',
                      whiteSpace: 'nowrap'
                    }}>
                      CATEGORY
                    </TableCell>
                    <TableCell sx={{ 
                      fontSize: { xs: '10px', sm: '10px', md: '11px' }, 
                      fontWeight: 600, 
                      color: '#6c757d', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.5px',
                      width: '50px',
                      whiteSpace: 'nowrap'
                    }}>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materialItems.map((item, index) => (
                    <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#fafbfc' } }}>
                      <TableCell sx={{ 
                        color: '#6c757d', 
                        fontSize: { xs: '11px', sm: '12px', md: '13px' } 
                      }}>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <TextField 
                          placeholder="ITM-001" 
                          value={item.itemCode} 
                          onChange={handleItemChange(item.id, 'itemCode')} 
                          size="small" 
                          sx={{ 
                            width: '100%',
                            minWidth: '90px',
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: '6px',
                              '& fieldset': {
                                borderColor: '#e9ecef',
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontSize: { xs: '11px', sm: '11px', md: '12px' },
                              padding: { xs: '6px 6px', sm: '6px 8px', md: '7px 10px' },
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          placeholder="Item description" 
                          value={item.description} 
                          onChange={handleItemChange(item.id, 'description')} 
                          size="small" 
                          sx={{ 
                            width: '100%',
                            minWidth: '150px',
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: '6px',
                              '& fieldset': {
                                borderColor: '#e9ecef',
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontSize: { xs: '11px', sm: '11px', md: '12px' },
                              padding: { xs: '6px 6px', sm: '6px 8px', md: '7px 10px' },
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ width: '100%', minWidth: '70px' }}>
                          <Select 
                            value={item.uom} 
                            onChange={handleItemChange(item.id, 'uom')}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  mt: '4px',
                                  borderRadius: '4px',
                                  border: '1px solid #ccc',
                                  boxShadow: 'none',
                                  width: '80px',
                                  '& .MuiList-root': {
                                    padding: 0,
                                  },
                                }
                              }
                            }}
                            sx={{ 
                              borderRadius: '6px',
                              '& .MuiSelect-select': {
                                fontSize: { xs: '11px', sm: '11px', md: '12px' },
                                padding: { xs: '6px 6px', sm: '6px 8px', md: '7px 10px' },
                              }
                            }}
                          >
                            {uomOptions.map(uom => (
                              <MenuItem 
                                key={uom} 
                                value={uom}
                                sx={{
                                  fontSize: '12px',
                                  padding: '6px 10px',
                                  minHeight: 'auto',
                                  '&.Mui-selected': {
                                    backgroundColor: '#2d6cdf',
                                    color: '#fff',
                                  },
                                  '&.Mui-selected:hover': {
                                    backgroundColor: '#2d6cdf',
                                  },
                                  '&:hover': {
                                    backgroundColor: '#f1f5f9',
                                  }
                                }}
                              >
                                {uom}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField 
                          type="number" 
                          value={item.quantityReq} 
                          onChange={handleItemChange(item.id, 'quantityReq')} 
                          size="small" 
                          sx={{ 
                            width: '100%',
                            minWidth: '70px',
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: '6px',
                              '& fieldset': {
                                borderColor: '#e9ecef',
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontSize: { xs: '11px', sm: '11px', md: '12px' },
                              padding: { xs: '6px 6px', sm: '6px 8px', md: '7px 10px' },
                            }
                          }}
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField 
                          type="number" 
                          value={item.currentStock} 
                          onChange={handleItemChange(item.id, 'currentStock')} 
                          size="small" 
                          sx={{ 
                            width: '100%',
                            minWidth: '70px',
                            '& .MuiOutlinedInput-root': { 
                              borderRadius: '6px',
                              '& fieldset': {
                                borderColor: '#e9ecef',
                              }
                            },
                            '& .MuiInputBase-input': {
                              fontSize: { xs: '11px', sm: '11px', md: '12px' },
                              padding: { xs: '6px 6px', sm: '6px 8px', md: '7px 10px' },
                            }
                          }}
                          inputProps={{ min: 0 }}
                          placeholder="-"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ width: '100%', minWidth: '110px' }}>
                          <Select 
                            value={item.category} 
                            onChange={handleItemChange(item.id, 'category')}
                            sx={{ 
                              borderRadius: '6px',
                              '& .MuiSelect-select': {
                                fontSize: { xs: '11px', sm: '11px', md: '12px' },
                                padding: { xs: '6px 6px', sm: '6px 8px', md: '7px 10px' },
                              }
                            }}
                          >
                            {categoryOptions.map(cat => (
                              <MenuItem key={cat} value={cat} sx={{ fontSize: { xs: '11px', sm: '11px', md: '12px' } }}>{cat}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={() => removeItemRow(item.id)} 
                          disabled={materialItems.length === 1}
                          sx={{ 
                            color: '#dc3545',
                            padding: { xs: '2px', sm: '3px', md: '4px' },
                            '&:hover': {
                              backgroundColor: '#ffe6e6',
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-end', 
          gap: { xs: 1, sm: 2 },
          mt: { xs: 2, sm: 2, md: 3 }
        }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={resetForm}
            fullWidth={isMobile}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#e9ecef',
              color: '#6c757d',
              fontSize: { xs: '12px', sm: '13px', md: '14px' },
              fontWeight: 500,
              padding: { xs: '6px 16px', sm: '7px 20px', md: '8px 24px' },
              '&:hover': {
                borderColor: '#2563eb',
                color: '#2563eb',
                backgroundColor: '#f8f9fa',
              }
            }}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />} 
            onClick={saveIndent}
            fullWidth={isMobile}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb, #818cf8)',
              fontSize: { xs: '12px', sm: '13px', md: '14px' },
              fontWeight: 500,
              padding: { xs: '6px 20px', sm: '7px 24px', md: '8px 28px' },
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
              }
            }}
          >
            Save Indent & Continue →
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default IndentProcurement;