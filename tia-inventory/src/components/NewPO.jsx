import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Divider,
  InputAdornment,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SaveIcon from '@mui/icons-material/Save';
import DraftsIcon from '@mui/icons-material/Drafts';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import dayjs from 'dayjs';

// ── Shared style tokens (mirrors GRN) ──────────────────────────────────────

const labelSx = {
  fontSize: 11, fontWeight: 700, color: '#6b7280',
  letterSpacing: '0.06em', textTransform: 'uppercase',
  mb: 0.5, display: 'block',
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    fontSize: 13, borderRadius: '6px', bgcolor: '#fff',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '1.5px' },
  },
  '& .MuiInputBase-input': { py: '8px', px: '12px' },
  '& .MuiInputBase-input::placeholder': { color: '#9ca3af', opacity: 1 },
};

const disabledInputSx = {
  ...inputSx,
  '& .MuiOutlinedInput-root': {
    ...inputSx['& .MuiOutlinedInput-root'],
    bgcolor: '#f9fafb',
  },
};

const selectSx = {
  fontSize: 13, borderRadius: '6px',
  '& fieldset': { borderColor: '#d1d5db' },
  '&:hover fieldset': { borderColor: '#9ca3af' },
  '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '1.5px' },
  '& .MuiSelect-select': { py: '8px', px: '12px' },
};

const smallSelectSx = {
  fontSize: 12, borderRadius: '6px',
  '& fieldset': { borderColor: '#d1d5db' },
  '&:hover fieldset': { borderColor: '#9ca3af' },
  '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  '& .MuiSelect-select': { py: '6px', px: '8px', fontSize: 12 },
};

const rowFieldSx = (extraInput = {}) => ({
  '& .MuiOutlinedInput-root': {
    fontSize: 13, borderRadius: '6px', bgcolor: '#fff',
    '& fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
  },
  '& .MuiInputBase-input': { py: '6px', px: '8px', ...extraInput },
  '& input[type=number]': { MozAppearance: 'textfield' },
  '& input::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
  '& input::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
});

const btnBase = {
  fontSize: 13, fontWeight: 600, textTransform: 'none', borderRadius: '8px',
  px: '20px', py: '9px', outline: 'none',
  '&:focus': { outline: 'none' },
};

// ── Date field (matches GRN DateField) ────────────────────────────────────

function DateField({ value, onChange }) {
  const ref = useRef(null);
  const openPicker = () => {
    try { ref.current?.showPicker(); } catch { ref.current?.click(); }
  };
  return (
    <Box
      onClick={openPicker}
      sx={{
        display: 'flex', alignItems: 'center', border: '1px solid #d1d5db',
        borderRadius: '6px', bgcolor: '#fff', px: 1, height: 34,
        cursor: 'pointer', width: '100%',
        '&:hover': { borderColor: '#9ca3af' },
        '&:focus-within': { borderColor: '#2563eb', outline: '2px solid #dbeafe', outlineOffset: '-1px' },
        transition: 'border-color 0.15s', boxSizing: 'border-box',
      }}
    >
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none', outline: 'none', background: 'transparent',
          fontSize: 12, color: value ? '#111827' : '#9ca3af',
          flex: 1, cursor: 'pointer', minWidth: 0, WebkitAppearance: 'none',
          width: '100%',
        }}
      />
      <CalendarTodayOutlinedIcon
        sx={{ fontSize: 13, color: '#9ca3af', flexShrink: 0 }}
        onClick={(e) => { e.stopPropagation(); openPicker(); }}
      />
    </Box>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

const NewPO = ({ open, onClose, onSave, onSaveAsDraft }) => {
  const [formData, setFormData] = useState({
    poNumber: '',
    quotationRef: '',
    supplier: '',
    orderDate: dayjs().format('YYYY-MM-DD'),
    requiredDelivery: '',
    deliverTo: '',
    priority: 'Normal',
    notes: '',
    lineItems: [
      { id: 1, description: '', quantity: 1, unitCost: 0 },
      { id: 2, description: '', quantity: 1, unitCost: 0 },
    ],
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (open) {
      const newPONumber = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
      setFormData(prev => ({
        ...prev,
        poNumber: newPONumber,
        orderDate: dayjs().format('YYYY-MM-DD'),
      }));
    }
  }, [open]);

  useEffect(() => {
    const total = formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    setTotalAmount(total);
  }, [formData.lineItems]);

  const setField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleChange = (field) => (event) => setField(field, event.target.value);

  const handleLineItemChange = (id, field) => (event) => {
    const value = field === 'quantity' || field === 'unitCost'
      ? parseFloat(event.target.value) || 0
      : event.target.value;
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  };

  const addLineItem = () => {
    const newId = Math.max(...formData.lineItems.map(item => item.id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: newId, description: '', quantity: 1, unitCost: 0 }],
    }));
  };

  const removeLineItem = (id) => {
    if (formData.lineItems.length > 1) {
      setFormData(prev => ({ ...prev, lineItems: prev.lineItems.filter(item => item.id !== id) }));
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.supplier) errors.push('Please select a supplier');
    if (!formData.deliverTo) errors.push('Please select a delivery location');
    if (!formData.requiredDelivery) errors.push('Please enter required delivery date');
    return errors;
  };

  const handleSubmit = (isDraft = false) => {
    const errors = validateForm();
    if (!isDraft && errors.length > 0) { alert(errors.join('\n')); return; }

    const validLineItems = formData.lineItems.filter(item => item.description.trim() !== '');
    const poData = { ...formData, lineItems: validLineItems, totalAmount, status: isDraft ? 'Draft' : 'Pending' };

    if (isDraft && onSaveAsDraft) onSaveAsDraft(poData);
    else if (onSave) onSave(poData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      poNumber: '', quotationRef: '', supplier: '',
      orderDate: dayjs().format('YYYY-MM-DD'), requiredDelivery: '',
      deliverTo: '', priority: 'Normal', notes: '',
      lineItems: [
        { id: 1, description: '', quantity: 1, unitCost: 0 },
        { id: 2, description: '', quantity: 1, unitCost: 0 },
      ],
    });
    onClose();
  };

  const suppliers = [
    { value: 's1', label: 'McKesson Medical-Surgical' },
    { value: 's2', label: 'Cardinal Health' },
    { value: 's3', label: 'Medline Industries' },
    { value: 's4', label: 'Fisher Scientific' },
  ];

  const locations = [
    { value: 'l1', label: 'Central Store' },
    { value: 'l2', label: 'ICU' },
    { value: 'l3', label: 'Emergency Dept' },
    { value: 'l4', label: 'Pharmacy' },
    { value: 'l5', label: 'OR / Surgery' },
    { value: 'l6', label: 'Laboratory' },
  ];

  const priorities = ['Normal', 'Urgent', 'Emergency'];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '14px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Header ── */}
      <Box sx={{
        px: '24px', pt: '20px', pb: '16px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        borderBottom: '1px solid #f3f4f6', flexShrink: 0, bgcolor: '#fff',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: '10px', background: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
              Create Purchase Order
            </Typography>
            <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: '1px' }}>
              Raise a new PO against an approved supplier
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          disableRipple
          sx={{
            color: '#9ca3af', border: '1px solid #e5e7eb', borderRadius: '8px',
            width: 30, height: 30, outline: 'none',
            '&:hover': { background: '#f3f4f6', color: '#374151' },
            '&:focus': { outline: 'none' },
          }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {/* ── Scrollable body ── */}
      <DialogContent sx={{
        px: '24px', py: '20px', overflowY: 'auto', flex: 1,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
        '&::-webkit-scrollbar-thumb:hover': { background: '#a1a1aa' },
        scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent',
      }}>

        {/* Row 1 — PO Number + Quotation Ref */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', mb: '16px' }}>
          <Box>
            <Typography sx={labelSx}>PO Number</Typography>
            <TextField
              fullWidth size="small" value={formData.poNumber} disabled
              sx={disabledInputSx} inputProps={{ style: { color: '#9ca3af' } }}
            />
          </Box>
          <Box>
            <Typography sx={labelSx}>Supplier Quotation Ref</Typography>
            <TextField
              fullWidth size="small"
              placeholder="e.g. QTN-2026-001"
              value={formData.quotationRef}
              onChange={handleChange('quotationRef')}
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* Row 2 — Supplier + Deliver To */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', mb: '16px' }}>
          <Box>
            <Typography sx={labelSx}>Supplier <span style={{ color: '#ef4444' }}>*</span></Typography>
            <Select
              fullWidth displayEmpty size="small"
              value={formData.supplier}
              onChange={handleChange('supplier')}
              sx={selectSx}
              renderValue={(v) =>
                v
                  ? suppliers.find(s => s.value === v)?.label
                  : <span style={{ color: '#9ca3af', fontSize: 13 }}>Select supplier…</span>
              }
            >
              {suppliers.map(sup => (
                <MenuItem key={sup.value} value={sup.value} sx={{ fontSize: 13 }}>{sup.label}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <Typography sx={labelSx}>Deliver To <span style={{ color: '#ef4444' }}>*</span></Typography>
            <Select
              fullWidth displayEmpty size="small"
              value={formData.deliverTo}
              onChange={handleChange('deliverTo')}
              sx={selectSx}
              renderValue={(v) =>
                v
                  ? locations.find(l => l.value === v)?.label
                  : <span style={{ color: '#9ca3af', fontSize: 13 }}>Select location…</span>
              }
            >
              {locations.map(loc => (
                <MenuItem key={loc.value} value={loc.value} sx={{ fontSize: 13 }}>{loc.label}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Row 3 — Order Date + Required Delivery */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', mb: '16px' }}>
          <Box>
            <Typography sx={labelSx}>Order Date</Typography>
            <DateField value={formData.orderDate} onChange={(v) => setField('orderDate', v)} />
          </Box>
          <Box>
            <Typography sx={labelSx}>Required Delivery <span style={{ color: '#ef4444' }}>*</span></Typography>
            <DateField value={formData.requiredDelivery} onChange={(v) => setField('requiredDelivery', v)} />
          </Box>
        </Box>

        {/* Row 4 — Priority */}
        <Box sx={{ mb: '20px' }}>
          <Typography sx={labelSx}>Priority</Typography>
          <Select
            fullWidth size="small"
            value={formData.priority}
            onChange={handleChange('priority')}
            sx={selectSx}
          >
            {priorities.map(p => (
              <MenuItem key={p} value={p} sx={{ fontSize: 13 }}>{p}</MenuItem>
            ))}
          </Select>
        </Box>

        <Divider sx={{ mb: '20px' }} />

        {/* ── Line Items ── */}
        <Box sx={{ mb: '16px' }}>
          <Typography sx={{
            fontSize: 12, fontWeight: 700, color: '#2563eb',
            letterSpacing: '0.05em', textTransform: 'uppercase', mb: '12px',
          }}>
            Line Items
          </Typography>

          {/* Column headers */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,3fr) 58px 80px 28px',
            gap: '6px', mb: '6px', px: '10px',
          }}>
            {['ITEM DESCRIPTION', 'QTY', 'UNIT COST', ''].map((h) => (
              <Typography key={h} sx={{
                fontSize: 10, fontWeight: 700, color: '#9ca3af',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {h}
              </Typography>
            ))}
          </Box>

          {/* Line rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {formData.lineItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,3fr) 58px 80px 28px',
                  gap: '6px', alignItems: 'center',
                  p: '10px', borderRadius: '8px',
                  border: '1px solid #e5e7eb', bgcolor: '#fff',
                  '&:hover': { borderColor: '#bfdbfe', bgcolor: '#f8faff' },
                  transition: 'all 0.15s',
                }}
              >
                <TextField
                  size="small"
                  placeholder="Item description…"
                  value={item.description}
                  onChange={handleLineItemChange(item.id, 'description')}
                  fullWidth
                  sx={rowFieldSx()}
                />
                <TextField
                  size="small"
                  type="number"
                  value={item.quantity}
                  onChange={handleLineItemChange(item.id, 'quantity')}
                  inputProps={{ min: 1 }}
                  sx={rowFieldSx({ textAlign: 'center' })}
                />
                <TextField
                  size="small"
                  type="number"
                  placeholder="0.00"
                  value={item.unitCost}
                  onChange={handleLineItemChange(item.id, 'unitCost')}
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={rowFieldSx({ textAlign: 'right' })}
                />
                <IconButton
                  size="small"
                  onClick={() => removeLineItem(item.id)}
                  disabled={formData.lineItems.length === 1}
                  sx={{
                    color: '#ef4444', border: '1px solid #fca5a5',
                    borderRadius: '6px', width: 28, height: 28, bgcolor: '#fff',
                    outline: 'none', flexShrink: 0,
                    '&:hover': { bgcolor: '#fef2f2' },
                    '&:focus': { outline: 'none' },
                    '&.Mui-disabled': { borderColor: '#e5e7eb', color: '#d1d5db' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Add Line */}
          <Button
            onClick={addLineItem}
            fullWidth
            disableRipple
            sx={{
              mt: '10px', border: '1.5px dashed #bfdbfe', borderRadius: '8px', py: '8px',
              fontSize: 12, fontWeight: 600, color: '#2563eb', textTransform: 'none',
              background: 'transparent', outline: 'none',
              '&:hover': { background: '#eff6ff', borderColor: '#93c5fd' },
              '&:focus': { outline: 'none' },
            }}
          >
            <AddIcon sx={{ fontSize: 14, mr: 0.5 }} /> Add Line
          </Button>

          {/* Total */}
          <Box sx={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            mt: '12px', pt: '12px', borderTop: '1px dashed #e5e7eb',
          }}>
            <Typography sx={{ fontSize: 13, color: '#6b7280', mr: 1 }}>
              Total Amount:
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: '16px' }} />

        {/* Notes */}
        <Box>
          <Typography sx={labelSx}>Notes</Typography>
          <TextField
            fullWidth multiline rows={2} size="small"
            value={formData.notes}
            onChange={handleChange('notes')}
            placeholder="Special delivery instructions…"
            sx={{ ...inputSx, '& .MuiInputBase-input': { py: '8px', px: '12px', fontSize: 13 } }}
          />
        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <Box sx={{
        px: '24px', py: '16px', borderTop: '1px solid #f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: '10px', bgcolor: '#fff', flexShrink: 0,
      }}>
        <Button
          onClick={handleClose}
          disableRipple
          sx={{ ...btnBase, color: '#374151', border: '1px solid #e5e7eb', bgcolor: '#fff', '&:hover': { bgcolor: '#f9fafb' } }}
        >
          Cancel
        </Button>
        <Button
          startIcon={<DraftsIcon sx={{ fontSize: 15 }} />}
          onClick={() => handleSubmit(true)}
          disableRipple
          sx={{ ...btnBase, color: '#374151', border: '1px solid #e5e7eb', bgcolor: '#fff', '&:hover': { bgcolor: '#f9fafb' } }}
        >
          Draft
        </Button>
        <Button
          startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
          onClick={() => handleSubmit(false)}
          disableRipple
          sx={{
            ...btnBase, fontWeight: 700, color: '#fff', bgcolor: '#2563eb',
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            '&:hover': { bgcolor: '#1d4ed8' },
          }}
        >
          Submit PO
        </Button>
      </Box>
    </Dialog>
  );
};

export default NewPO;