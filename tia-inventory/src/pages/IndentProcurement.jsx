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
    { id: 1, itemCode: 'ITM-001', description: 'Item description', uom: 'Nos', quantityReq: 1, currentStock: 0,  category: 'Raw Material' },
    { id: 2, itemCode: 'ITM-001', description: 'Item description', uom: 'Nos', quantityReq: 1, currentStock: '', category: 'Raw Material' },
  ]);

  const steps = ['Indent', 'Quotation', 'Purchase Order', 'Order Acceptance'];
  const departments    = ['Select...', 'Production', 'Maintenance', 'Quality Control', 'R&D', 'Administration', 'Warehouse', 'Pharmacy'];
  const priorityOptions = ['Normal', 'Urgent', 'Critical'];
  const uomOptions      = ['Nos', 'Kg', 'Ltr', 'Mtr', 'Box', 'Set', 'Pcs'];
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
    setMaterialItems([...materialItems, { id: newId, itemCode: '', description: '', uom: 'Nos', quantityReq: 1, currentStock: '', category: 'Raw Material' }]);
  };

  const removeItemRow = (id) => {
    if (materialItems.length > 1) {
      setMaterialItems(materialItems.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setIndentDetails({ indentNo: 'IND-2026-371', indentDate: new Date().toISOString().split('T')[0], department: '', requiredBy: '', priority: 'Normal', requestedBy: '', remarks: '' });
    setMaterialItems([
      { id: 1, itemCode: 'ITM-001', description: 'Item description', uom: 'Nos', quantityReq: 1, currentStock: 0,  category: 'Raw Material' },
      { id: 2, itemCode: 'ITM-001', description: 'Item description', uom: 'Nos', quantityReq: 1, currentStock: '', category: 'Raw Material' },
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
    setIndentDetails({ indentNo: newIndentNo, indentDate: new Date().toISOString().split('T')[0], department: '', requiredBy: '', priority: 'Normal', requestedBy: '', remarks: '' });
    setMaterialItems([
      { id: 1, itemCode: 'ITM-001', description: 'Item description', uom: 'Nos', quantityReq: 1, currentStock: 0,  category: 'Raw Material' },
      { id: 2, itemCode: 'ITM-001', description: 'Item description', uom: 'Nos', quantityReq: 1, currentStock: '', category: 'Raw Material' },
    ]);
    setActiveStep(0);
  };

  const getGridSize = () => {
    if (isMobile) return { xs: 12 };
    if (isTablet) return { xs: 12, sm: 6 };
    return { xs: 12, sm: 6, md: 2.4 };
  };

  // ── Shared input field styles ──────────────────────────────────────────────
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      background: '#f9fafb',
      '& fieldset': { borderColor: '#e5e7eb' },
      '&:hover fieldset': { borderColor: '#d1d5db' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
    },
    '& .MuiInputBase-input': { fontSize: 13, color: '#111827', padding: '10px 12px' },
  };

  const selectSx = {
    borderRadius: '8px',
    background: '#f9fafb',
    fontSize: 13,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
    '& .MuiSelect-select': { fontSize: 13, color: '#111827', padding: '10px 12px' },
  };

  const tableInputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      background: '#f9fafb',
      '& fieldset': { borderColor: '#e5e7eb' },
      '&:hover fieldset': { borderColor: '#d1d5db' },
    },
    '& .MuiInputBase-input': { fontSize: 12, padding: '7px 10px' },
  };

  const tableSelectSx = {
    borderRadius: '6px',
    background: '#f9fafb',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
    '& .MuiSelect-select': { fontSize: 12, padding: '7px 10px' },
  };

  // ── Table header cell ──────────────────────────────────────────────────────
  const thSx = {
    fontSize: 11, fontWeight: 600, color: '#9ca3af',
    letterSpacing: '0.05em', textTransform: 'uppercase',
    whiteSpace: 'nowrap', py: '12px', px: '16px',
    borderBottom: '1px solid #f3f4f6',
  };

  return (
    <>
      <GlobalStyles styles={{
        '*::-webkit-scrollbar': { width: '6px', height: '6px' },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: '4px' },
        '*::-webkit-scrollbar-thumb:hover': { background: '#a1a1aa' },
        '*': { scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' },
      }} />

      {/* ── Outer wrapper — matches InventoryItems / StockIssue exactly ── */}
      <Box sx={{ background: '#f8f9fb', minHeight: '100vh', p: '28px 32px', boxSizing: 'border-box' }}>

        {/* ── Page Header ── */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '20px' }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
              Indent &amp; Procurement
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: '4px' }}>
              Manage the full procurement cycle: Indent → Quotation → Purchase Order → Order Acceptance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
              {indentDetails.indentNo}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleNewIndent}
              sx={{
                 background: '#2563eb', color: '#fff', borderRadius: '8px',
            px: '18px', py: '10px', fontSize: 13, fontWeight: 600,
            textTransform: 'none', boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
            '&:hover': { background: '#1d4ed8' },
              }}
            >
              🔄 New Indent
            </Button>
          </Box>
        </Box>

        {/* ── Stepper ── */}
        <Box sx={{ maxWidth: 560, mb: '24px' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconProps={{ sx: {
                  '& .MuiStepIcon-root.Mui-active':    { color: '#2563eb' },
                  '& .MuiStepIcon-root.Mui-completed': { color: '#2563eb' },
                }}}>
                  <Typography sx={{
                    fontSize: 11, fontWeight: activeStep === index ? 600 : 400,
                    color: activeStep === index ? '#2563eb' : '#9ca3af',
                  }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* ── Indent Details Card ── */}
        <Paper elevation={0} sx={{
          mb: '16px', borderRadius: '14px',
          border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          {/* card header */}
          <Box sx={{ px: '28px', py: '14px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '0.05em' }}>
              📋 INDENT DETAILS
            </Typography>
          </Box>

          {/* card body */}
          <Box sx={{ p: '24px 28px' }}>
            <Grid container spacing={2.5}>
              {/* Indent No */}
              <Grid size={getGridSize()}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: '6px', display: 'block' }}>
                  INDENT NO.
                </Typography>
                <TextField value={indentDetails.indentNo} InputProps={{ readOnly: true }} fullWidth size="small"
                  sx={{ ...fieldSx, '& .MuiInputBase-input': { fontSize: 13, color: '#9ca3af', padding: '10px 12px' }, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], background: '#f3f4f6' } }} />
              </Grid>

              {/* Indent Date */}
              <Grid size={getGridSize()}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: '6px', display: 'block' }}>
                  INDENT DATE
                </Typography>
                <TextField
                  id="indent-date" type="date" value={indentDetails.indentDate}
                  onChange={handleDateChange} inputRef={dateInputRef}
                  fullWidth size="small" InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleDateIconClick} edge="end" size="small" disableFocusRipple disableRipple
                          sx={{ color: '#3b82f6', p: '4px', '&:hover': { background: '#f1f5f9', color: '#2563eb' }, '&:focus': { outline: 'none' } }}>
                          <EventIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx}
                />
              </Grid>

              {/* Department */}
              <Grid size={getGridSize()}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: '6px', display: 'block' }}>
                  DEPARTMENT
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={indentDetails.department} onChange={handleIndentChange('department')} displayEmpty sx={selectSx}>
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept === 'Select...' ? '' : dept} sx={{ fontSize: 13 }}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Required By */}
              <Grid size={getGridSize()}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: '6px', display: 'block' }}>
                  REQUIRED BY
                </Typography>
                <TextField type="date" value={indentDetails.requiredBy} onChange={handleIndentChange('requiredBy')} fullWidth size="small" InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Grid>

              {/* Priority */}
              <Grid size={getGridSize()}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: '6px', display: 'block' }}>
                  PRIORITY
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={indentDetails.priority} onChange={handleIndentChange('priority')} sx={selectSx}>
                    {priorityOptions.map(opt => (
                      <MenuItem key={opt} value={opt} sx={{ fontSize: 13 }}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Requested By */}
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: '6px', display: 'block' }}>
                  REQUESTED BY
                </Typography>
                <Box sx={{ maxWidth: 280 }}>
                  <TextField placeholder="Name / Employee ID" value={indentDetails.requestedBy} onChange={handleIndentChange('requestedBy')} fullWidth size="small" sx={fieldSx} />
                </Box>
              </Grid>

              {/* Remarks */}
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', mb: '6px', display: 'block' }}>
                  PURPOSE / REMARKS
                </Typography>
                <TextField
                  placeholder="Reason for indent, current stock level, usage details…"
                  value={indentDetails.remarks} onChange={handleIndentChange('remarks')}
                  fullWidth multiline rows={3} size="small"
                  sx={{ ...fieldSx, '& .MuiInputBase-input': { fontSize: 13, color: '#111827', padding: '10px 12px' } }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* ── Material Items Card ── */}
        <Paper elevation={0} sx={{
          mb: '16px', borderRadius: '14px',
          border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          {/* card header */}
          <Box sx={{ px: '28px', py: '14px', borderBottom: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '0.05em' }}>
              📦 MATERIAL ITEMS
            </Typography>
            <Button
              startIcon={<AddIcon sx={{ fontSize: 15 }} />}
              onClick={addItemRow}
              sx={{
                fontSize: 13, fontWeight: 600, textTransform: 'none',
                color: '#2563eb', borderRadius: '8px', px: '14px', py: '6px',
                '&:hover': { background: '#eff6ff' },
              }}
            >
              Add Item
            </Button>
          </Box>

          {/* table */}
          <TableContainer sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
            scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent',
          }}>
            <Table size="small" sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow sx={{ background: '#f8f9fb' }}>
                  {['#','ITEM CODE','DESCRIPTION','UOM','QTY REQ.','CURR. STOCK','CATEGORY',''].map((col, i) => (
                    <TableCell key={i} sx={thSx}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {materialItems.map((item, index) => (
                  <TableRow key={item.id} sx={{
                    background: '#fff',
                    '&:hover': { background: '#fafafa' },
                    transition: 'background 0.15s',
                    '& td': { borderBottom: index < materialItems.length - 1 ? '1px solid #f3f4f6' : 'none', py: '10px', px: '16px' },
                  }}>
                    <TableCell>
                      <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>{index + 1}</Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 110 }}>
                      <TextField placeholder="ITM-001" value={item.itemCode} onChange={handleItemChange(item.id, 'itemCode')} size="small" fullWidth sx={tableInputSx} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <TextField placeholder="Item description" value={item.description} onChange={handleItemChange(item.id, 'description')} size="small" fullWidth sx={tableInputSx} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 80 }}>
                      <FormControl size="small" fullWidth>
                        <Select value={item.uom} onChange={handleItemChange(item.id, 'uom')} sx={tableSelectSx}
                          MenuProps={{ PaperProps: { sx: { mt: '4px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', '& .MuiList-root': { padding: '4px' } } } }}>
                          {uomOptions.map(uom => (
                            <MenuItem key={uom} value={uom} sx={{ fontSize: 12, borderRadius: '6px', '&.Mui-selected': { background: '#eff6ff', color: '#2563eb' }, '&:hover': { background: '#f3f4f6' } }}>{uom}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={{ minWidth: 80 }}>
                      <TextField type="number" value={item.quantityReq} onChange={handleItemChange(item.id, 'quantityReq')} size="small" fullWidth sx={tableInputSx} inputProps={{ min: 0 }} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 90 }}>
                      <TextField type="number" value={item.currentStock} onChange={handleItemChange(item.id, 'currentStock')} size="small" fullWidth sx={tableInputSx} inputProps={{ min: 0 }} placeholder="—" />
                    </TableCell>
                    <TableCell sx={{ minWidth: 130 }}>
                      <FormControl size="small" fullWidth>
                        <Select value={item.category} onChange={handleItemChange(item.id, 'category')} sx={tableSelectSx}>
                          {categoryOptions.map(cat => (
                            <MenuItem key={cat} value={cat} sx={{ fontSize: 12 }}>{cat}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center" sx={{ minWidth: 40 }}>
                      <IconButton size="small" onClick={() => removeItemRow(item.id)} disabled={materialItems.length === 1}
                        sx={{
                          color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '6px', width: 28, height: 28,
                          '&:hover': { background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' },
                          '&.Mui-disabled': { opacity: 0.3 },
                        }}>
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* ── Footer Buttons ── */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', pb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            onClick={resetForm}
            sx={{
              fontSize: 13, fontWeight: 600, textTransform: 'none',
              border: '1px solid #e5e7eb', color: '#374151', borderRadius: '8px',
              px: '24px', py: '10px', background: '#fff',
              '&:hover': { borderColor: '#d1d5db', background: '#f9fafb' },
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
            onClick={saveIndent}
            sx={{
              fontSize: 13, fontWeight: 600, textTransform: 'none',
              background: '#2563eb', color: '#fff', borderRadius: '8px',
              px: '24px', py: '10px', boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
              '&:hover': { background: '#1d4ed8' },
            }}
          >
            Save Indent &amp; Continue →
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default IndentProcurement;