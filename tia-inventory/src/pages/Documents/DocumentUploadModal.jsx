import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import EventIcon from '@mui/icons-material/Event';

const DocumentUploadModal = ({ open, onClose, onSave, document }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    issuedDate: '',
    expiryDate: '',
    linkedType: '',
    linkedId: '',
    linkedName: '',
    size: '',
    notes: '',
  });

  const [linkedOptions, setLinkedOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const issuedDateInputRef = useRef(null);
  const expiryDateInputRef = useRef(null);

  const mockLinkedRecords = {
    supplier: [
      { id: 'SUP-001', name: 'McKesson Medical-Surgical' },
      { id: 'SUP-002', name: 'Medline Industries' },
      { id: 'SUP-003', name: 'Fisher Scientific' },
      { id: 'SUP-004', name: 'Cardinal Health' },
    ],
    po: [
      { id: 'PO-2026-0001', name: 'PO-2026-0001 - Medical Supplies' },
      { id: 'PO-2026-0002', name: 'PO-2026-0002 - Pharmaceuticals' },
      { id: 'PO-2026-0003', name: 'PO-2026-0003 - Equipment' },
      { id: 'PO-2026-0004', name: 'PO-2026-0004 - Lab Supplies' },
    ],
    grn: [
      { id: 'GRN-2026-0001', name: 'GRN-2026-0001 - McKesson Delivery' },
      { id: 'GRN-2026-0002', name: 'GRN-2026-0002 - Medline Shipment' },
      { id: 'GRN-2026-0003', name: 'GRN-2026-0003 - Fisher Scientific' },
    ],
    item: [
      { id: 'ITEM-001', name: 'Amoxicillin 500mg Capsules' },
      { id: 'ITEM-002', name: 'Sodium Chloride 0.9% IV 1L' },
      { id: 'ITEM-003', name: 'Surgical Mask Level 3' },
      { id: 'ITEM-004', name: 'Nitrile Gloves Large' },
    ],
  };

  useEffect(() => {
    if (open) {
      if (document) {
        setFormData({
          title: document.title || '',
          type: document.type || '',
          issuedDate: document.issuedDate || '',
          expiryDate: document.expiryDate || '',
          linkedType: document.linkedTo?.type || '',
          linkedId: document.linkedTo?.id || '',
          linkedName: document.linkedTo?.name || '',
          size: document.size || '',
          notes: document.description || '',
        });
        if (document.linkedTo?.type) loadLinkedOptions(document.linkedTo.type);
      } else {
        setFormData({ title: '', type: '', issuedDate: '', expiryDate: '', linkedType: '', linkedId: '', linkedName: '', size: '', notes: '' });
        setLinkedOptions([]);
        setSelectedFile(null);
      }
    }
  }, [open, document]);

  const loadLinkedOptions = (type) => {
    setLinkedOptions(mockLinkedRecords[type] || []);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    if (field === 'linkedType') {
      loadLinkedOptions(value);
      setFormData((prev) => ({ ...prev, linkedType: value, linkedId: '', linkedName: '' }));
    } else if (field === 'linkedId') {
      const selected = linkedOptions.find((opt) => opt.id === value);
      setFormData((prev) => ({ ...prev, linkedId: value, linkedName: selected?.name || '' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const kb = (file.size / 1024).toFixed(1);
      setFormData((prev) => ({
        ...prev,
        size: kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`,
      }));
    }
  };

  const handleSubmit = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Please enter document title');
    if (!formData.linkedType) errors.push('Please select record type');
    if (!formData.linkedId) errors.push('Please select linked record');
    if (errors.length > 0) { alert(errors.join('\n')); return; }

    const saveData = {
      id: document?.id || `DOC-${Date.now()}`,
      docNo: document?.docNo || `DOC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      title: formData.title,
      description: formData.notes,
      type: formData.type || 'Other',
      linkedTo: { type: formData.linkedType, name: formData.linkedName, id: formData.linkedId },
      issuedDate: formData.issuedDate || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || null,
      uploadedBy: 'Current User',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: formData.size || '0 KB',
      status: formData.expiryDate && new Date(formData.expiryDate) < new Date() ? 'Expired'
        : formData.expiryDate && new Date(formData.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 3)) ? 'Expiring Soon' : 'Active',
      fileUrl: '#',
    };
    onSave(saveData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ title: '', type: '', issuedDate: '', expiryDate: '', linkedType: '', linkedId: '', linkedName: '', size: '', notes: '' });
    setLinkedOptions([]);
    setSelectedFile(null);
    onClose();
  };

  const documentTypes = ['Contract', 'PO Acknowledgement', 'Quality Certificate', 'Regulatory Notice', 'MSDS / Safety Sheet', 'Delivery Note', 'Invoice', 'Warranty', 'Inspection Report', 'Other'];
  const linkedTypes = [
    { value: 'supplier', label: 'Supplier', icon: '🏢' },
    { value: 'po', label: 'Purchase Order', icon: '🛒' },
    { value: 'grn', label: 'Goods Receipt Note', icon: '📥' },
    { value: 'item', label: 'Inventory Item', icon: '📦' },
  ];

  // Shared field label style
  const labelSx = {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    mb: '4px',
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#f8fafc',
      fontSize: '0.82rem',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#2563eb' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '1.5px' },
    },
    '& .MuiInputBase-input': {
      fontSize: '0.82rem',
      padding: '8px 12px',
      color: '#1e293b',
      '&::placeholder': { color: '#94a3b8', opacity: 1 },
    },
  };

  const selectSx = {
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    fontSize: '0.82rem',
    '& .MuiSelect-select': { padding: '8px 12px', fontSize: '0.82rem', color: '#1e293b' },
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#2563eb' },
    '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '1.5px' },
  };

  const sectionLabelSx = {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    mb: 1.5,
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '14px',
          maxWidth: '520px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Title ── */}
      <DialogTitle
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '9px',
              bgcolor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: '#d97706' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {document ? 'Edit Document' : 'Upload Document'}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: '1px' }}>
              Attach a document to a supplier, PO, GRN or Inventory item
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: '#94a3b8',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            width: 28,
            height: 28,
            '&:hover': { bgcolor: '#f1f5f9', color: '#374151' },
            '&:focus': { outline: 'none' },
          }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent
        sx={{
          px: 2.5,
          py: 2,
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': { background: '#e2e8f0', borderRadius: 4 },
        }}
      >
        {/* ── DOCUMENT INFO ── */}
        <Box>
          <Typography sx={sectionLabelSx}>Document Info</Typography>

          {/* Document Title */}
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={labelSx}>Document Title <span style={{ color: '#ef4444' }}>*</span></Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. McKesson Supply Agreement 2026"
              value={formData.title}
              onChange={handleChange('title')}
              sx={inputSx}
            />
          </Box>

          {/* Document Type + Issued Date side by side */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>Document Type</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.type}
                  onChange={handleChange('type')}
                  displayEmpty
                  sx={selectSx}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>Contract</MenuItem>
                  {documentTypes.map((t) => (
                    <MenuItem key={t} value={t} sx={{ fontSize: '0.8rem' }}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>Issued Date</Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={formData.issuedDate}
                onChange={(e) => setFormData((p) => ({ ...p, issuedDate: e.target.value }))}
                inputRef={issuedDateInputRef}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => issuedDateInputRef.current?.showPicker?.()}
                        sx={{ color: '#94a3b8', p: '2px', '&:focus': { outline: 'none' }, '&:hover': { color: '#2563eb' } }}
                      >
                        <EventIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputSx}
              />
            </Box>
          </Box>

          {/* Expiry Date — full width */}
          <Box>
            <Typography sx={labelSx}>Expiry Date (if applicable)</Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={formData.expiryDate}
              onChange={(e) => setFormData((p) => ({ ...p, expiryDate: e.target.value }))}
              inputRef={expiryDateInputRef}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => expiryDateInputRef.current?.showPicker?.()}
                      sx={{ color: '#94a3b8', p: '2px', '&:focus': { outline: 'none' }, '&:hover': { color: '#2563eb' } }}
                    >
                      <EventIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* ── LINK TO RECORD ── */}
        <Box>
          <Typography sx={sectionLabelSx}>Link to Record</Typography>

          {/* Record Type + Linked Record side by side */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>Record Type <span style={{ color: '#ef4444' }}>*</span></Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.linkedType}
                  onChange={handleChange('linkedType')}
                  displayEmpty
                  sx={selectSx}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>Select type…</MenuItem>
                  {linkedTypes.map((t) => (
                    <MenuItem key={t.value} value={t.value} sx={{ fontSize: '0.8rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{t.icon}</span><span>{t.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={labelSx}>Linked Record <span style={{ color: '#ef4444' }}>*</span></Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.linkedId}
                  onChange={handleChange('linkedId')}
                  displayEmpty
                  disabled={!formData.linkedType}
                  sx={selectSx}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {formData.linkedType ? 'Select record…' : 'Select type first…'}
                  </MenuItem>
                  {linkedOptions.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id} sx={{ fontSize: '0.8rem' }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 500 }}>{opt.name}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#64748b' }}>ID: {opt.id}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* ── FILE DETAILS ── */}
        <Box>
          <Typography sx={sectionLabelSx}>File Details</Typography>

          {/* File Size */}
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={labelSx}>File Size (e.g. 1.2 MB)</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. 540 KB"
              value={formData.size}
              onChange={handleChange('size')}
              sx={inputSx}
            />
          </Box>

          {/* Notes */}
          <Box>
            <Typography sx={labelSx}>Notes / Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Brief description of the document…"
              value={formData.notes}
              onChange={handleChange('notes')}
              sx={{
                ...inputSx,
                '& .MuiInputBase-input': {
                  fontSize: '0.82rem',
                  color: '#1e293b',
                  '&::placeholder': { color: '#94a3b8', opacity: 1 },
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* ── Footer ── */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: '1px solid #f1f5f9',
          bgcolor: '#fff',
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          disableRipple
          sx={{
            color: '#64748b',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8rem',
            px: 2,
            py: 0.7,
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            '&:hover': { bgcolor: '#f8fafc' },
            '&:focus': { outline: 'none' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon sx={{ fontSize: 15 }} />}
          disableRipple
          sx={{
            bgcolor: '#2563eb',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            px: 2.5,
            py: 0.7,
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(37,99,235,0.25)',
            '&:hover': { bgcolor: '#1d4ed8' },
            '&:focus': { outline: 'none' },
          }}
        >
          {document ? 'Update Document' : 'Save Document'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploadModal;