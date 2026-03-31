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
  Paper,
  Divider,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EventIcon from '@mui/icons-material/Event';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DocumentUploadModal = ({ open, onClose, onSave, document }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    issuedDate: "",
    expiryDate: "",
    linkedType: "",
    linkedId: "",
    linkedName: "",
    size: "",
    notes: "",
  });

  const [linkedOptions, setLinkedOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showIssuedDatePicker, setShowIssuedDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const issuedDateInputRef = useRef(null);
  const expiryDateInputRef = useRef(null);

  const mockLinkedRecords = {
    supplier: [
      { id: "SUP-001", name: "McKesson Medical-Surgical" },
      { id: "SUP-002", name: "Medline Industries" },
      { id: "SUP-003", name: "Fisher Scientific" },
      { id: "SUP-004", name: "Cardinal Health" },
    ],
    po: [
      { id: "PO-2026-0001", name: "PO-2026-0001 - Medical Supplies" },
      { id: "PO-2026-0002", name: "PO-2026-0002 - Pharmaceuticals" },
      { id: "PO-2026-0003", name: "PO-2026-0003 - Equipment" },
      { id: "PO-2026-0004", name: "PO-2026-0004 - Lab Supplies" },
    ],
    grn: [
      { id: "GRN-2026-0001", name: "GRN-2026-0001 - McKesson Delivery" },
      { id: "GRN-2026-0002", name: "GRN-2026-0002 - Medline Shipment" },
      { id: "GRN-2026-0003", name: "GRN-2026-0003 - Fisher Scientific" },
    ],
    item: [
      { id: "ITEM-001", name: "Amoxicillin 500mg Capsules" },
      { id: "ITEM-002", name: "Sodium Chloride 0.9% IV 1L" },
      { id: "ITEM-003", name: "Surgical Mask Level 3" },
      { id: "ITEM-004", name: "Nitrile Gloves Large" },
    ],
  };

  useEffect(() => {
    if (open) {
      if (document) {
        setFormData({
          title: document.title || "",
          type: document.type || "",
          issuedDate: document.issuedDate || "",
          expiryDate: document.expiryDate || "",
          linkedType: document.linkedTo?.type || "",
          linkedId: document.linkedTo?.id || "",
          linkedName: document.linkedTo?.name || "",
          size: document.size || "",
          notes: document.description || "",
        });
        if (document.linkedTo?.type) {
          loadLinkedOptions(document.linkedTo.type);
        }
      } else {
        setFormData({
          title: "",
          type: "",
          issuedDate: "",
          expiryDate: "",
          linkedType: "",
          linkedId: "",
          linkedName: "",
          size: "",
          notes: "",
        });
        setLinkedOptions([]);
        setSelectedFile(null);
      }
    }
  }, [open, document]);

  const loadLinkedOptions = (type) => {
    if (type && mockLinkedRecords[type]) {
      setLinkedOptions(mockLinkedRecords[type]);
    } else {
      setLinkedOptions([]);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });

    if (field === "linkedType") {
      loadLinkedOptions(value);
      setFormData((prev) => ({ ...prev, linkedId: "", linkedName: "" }));
    }

    if (field === "linkedId") {
      const selected = linkedOptions.find(opt => opt.id === value);
      setFormData((prev) => ({ 
        ...prev, 
        linkedId: value,
        linkedName: selected?.name || ""
      }));
    }
  };

  const handleIssuedDateIconClick = () => {
    if (issuedDateInputRef.current) {
      if (showIssuedDatePicker) {
        issuedDateInputRef.current.blur();
        setShowIssuedDatePicker(false);
      } else {
        if (issuedDateInputRef.current.showPicker) {
          issuedDateInputRef.current.showPicker();
        } else {
          issuedDateInputRef.current.focus();
        }
        setShowIssuedDatePicker(true);
      }
    }
  };

  const handleExpiryDateIconClick = () => {
    if (expiryDateInputRef.current) {
      if (showExpiryDatePicker) {
        expiryDateInputRef.current.blur();
        setShowExpiryDatePicker(false);
      } else {
        if (expiryDateInputRef.current.showPicker) {
          expiryDateInputRef.current.showPicker();
        } else {
          expiryDateInputRef.current.focus();
        }
        setShowExpiryDatePicker(true);
      }
    }
  };

  const handleIssuedDateChange = (e) => {
    setFormData({ ...formData, issuedDate: e.target.value });
    setShowIssuedDatePicker(false);
  };

  const handleExpiryDateChange = (e) => {
    setFormData({ ...formData, expiryDate: e.target.value });
    setShowExpiryDatePicker(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileSize = (file.size / 1024).toFixed(1);
      setFormData({
        ...formData,
        size: fileSize > 1024 ? `${(fileSize / 1024).toFixed(1)} MB` : `${fileSize} KB`,
      });
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) {
      errors.push('Please enter document title');
    }
    if (!formData.linkedType) {
      errors.push('Please select record type');
    }
    if (!formData.linkedId) {
      errors.push('Please select linked record');
    }
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const saveData = {
      id: document?.id || `DOC-${Date.now()}`,
      docNo: document?.docNo || `DOC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      title: formData.title,
      description: formData.notes,
      type: formData.type || "Other",
      linkedTo: {
        type: formData.linkedType,
        name: formData.linkedName,
        id: formData.linkedId
      },
      issuedDate: formData.issuedDate || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || null,
      uploadedBy: "Current User",
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: formData.size || "0 KB",
      status: formData.expiryDate && new Date(formData.expiryDate) < new Date() ? "Expired" : 
              formData.expiryDate && new Date(formData.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 3)) ? "Expiring Soon" : "Active",
      fileUrl: "#"
    };

    onSave(saveData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      type: "",
      issuedDate: "",
      expiryDate: "",
      linkedType: "",
      linkedId: "",
      linkedName: "",
      size: "",
      notes: "",
    });
    setLinkedOptions([]);
    setSelectedFile(null);
    onClose();
  };

  const documentTypes = [
    "Contract",
    "PO Acknowledgement",
    "Quality Certificate",
    "Regulatory Notice",
    "MSDS / Safety Sheet",
    "Delivery Note",
    "Invoice",
    "Warranty",
    "Inspection Report",
    "Other"
  ];

  const linkedTypes = [
    { value: "supplier", label: "Supplier", icon: "🏢" },
    { value: "po", label: "Purchase Order", icon: "🛒" },
    { value: "grn", label: "Goods Receipt Note", icon: "📥" },
    { value: "item", label: "Inventory Item", icon: "📦" },
  ];

  const inputStyles = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      width: '100%',
      '&:hover fieldset': {
        borderColor: '#2563eb',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563eb',
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '0.8rem',
      padding: '6px 10px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.75rem',
      '&.Mui-focused': {
        color: '#2563eb',
      },
    },
  };

  const selectStyles = {
    width: '100%',
    borderRadius: '8px',
    '& .MuiSelect-select': {
      fontSize: '0.8rem',
      padding: '6px 10px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2563eb',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2563eb',
    },
  };

  const dateInputStyles = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      width: '100%',
      '&:hover fieldset': {
        borderColor: '#2563eb',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563eb',
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '0.8rem',
      padding: '6px 10px',
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: '550px',
          margin: { xs: 1.5, sm: 2 },
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: { xs: '0.9rem', sm: '0.95rem' },
        py: { xs: 0.8, sm: 1 },
        px: { xs: 1.5, sm: 2 },
        fontWeight: 600,
        color: '#1e293b',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        minHeight: { xs: 44, sm: 48 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon sx={{ fontSize: '1.1rem', color: '#3b82f6' }} />
          <span>{document ? "Edit Document" : "Upload Document"}</span>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: '#64748b',
            padding: 0.5,
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent 
        dividers 
        sx={{ 
          p: { xs: 1.5, sm: 2 },
          '& .MuiDialogContent-dividers': {
            borderColor: '#e2e8f0',
          },
          // Scrollbar styling matching UserModal (Assign Hospitals/Locations)
          '&::-webkit-scrollbar': {
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 1.2, sm: 1.5 }, 
              border: '1px solid #e2e8f0', 
              borderRadius: 2,
              backgroundColor: '#f9fafc'
            }}
          >
            <Typography sx={{ 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: '#3b82f6',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Document Info
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                fullWidth
                label="Document Title"
                value={formData.title}
                onChange={handleChange('title')}
                required
                size="small"
                placeholder="e.g. McKesson Supply Agreement 2026"
                sx={inputStyles}
              />

              <FormControl fullWidth size="small">
                <Select
                  value={formData.type}
                  onChange={handleChange('type')}
                  displayEmpty
                  sx={selectStyles}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Select document type…</MenuItem>
                  {documentTypes.map((type) => (
                    <MenuItem key={type} value={type} sx={{ fontSize: '0.8rem' }}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    id="issued-date"
                    type="date"
                    label="Issued Date"
                    value={formData.issuedDate}
                    onChange={handleIssuedDateChange}
                    inputRef={issuedDateInputRef}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleIssuedDateIconClick}
                            edge="end"
                            size="small"
                            disableFocusRipple
                            disableRipple
                            sx={{
                              color: '#64748b',
                              padding: '2px',
                              '&:hover': {
                                backgroundColor: '#f1f5f9',
                                color: '#2563eb',
                              },
                              '&:focus': { outline: 'none' },
                              '&.Mui-focusVisible': { outline: 'none' },
                            }}
                          >
                            <EventIcon sx={{ fontSize: '14px' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={dateInputStyles}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    id="expiry-date"
                    type="date"
                    label="Expiry Date (if applicable)"
                    value={formData.expiryDate}
                    onChange={handleExpiryDateChange}
                    inputRef={expiryDateInputRef}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleExpiryDateIconClick}
                            edge="end"
                            size="small"
                            disableFocusRipple
                            disableRipple
                            sx={{
                              color: '#64748b',
                              padding: '2px',
                              '&:hover': {
                                backgroundColor: '#f1f5f9',
                                color: '#2563eb',
                              },
                              '&:focus': { outline: 'none' },
                              '&.Mui-focusVisible': { outline: 'none' },
                            }}
                          >
                            <EventIcon sx={{ fontSize: '14px' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={dateInputStyles}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 1.2, sm: 1.5 }, 
              border: '1px solid #e2e8f0', 
              borderRadius: 2,
              backgroundColor: '#f9fafc'
            }}
          >
            <Typography sx={{ 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: '#3b82f6',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Link to Record
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControl fullWidth size="small" required>
                <Select
                  value={formData.linkedType}
                  onChange={handleChange('linkedType')}
                  displayEmpty
                  sx={selectStyles}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Select record type…</MenuItem>
                  {linkedTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value} sx={{ fontSize: '0.8rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" required>
                <Select
                  value={formData.linkedId}
                  onChange={handleChange('linkedId')}
                  displayEmpty
                  disabled={!formData.linkedType}
                  sx={selectStyles}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>
                    {formData.linkedType ? "Select record…" : "Select type first…"}
                  </MenuItem>
                  {linkedOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id} sx={{ fontSize: '0.8rem' }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                          {option.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: '#64748b' }}>
                          ID: {option.id}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 1.2, sm: 1.5 }, 
              border: '1px solid #e2e8f0', 
              borderRadius: 2,
              backgroundColor: '#f9fafc'
            }}
          >
            <Typography sx={{ 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              color: '#3b82f6',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              File Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  fontSize: '0.75rem',
                  borderColor: '#e2e8f0',
                  color: '#3b82f6',
                  py: 1,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#eff6ff',
                  },
                }}
              >
                {selectedFile ? selectedFile.name : "Choose File"}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>

              <TextField
                fullWidth
                label="File Size"
                value={formData.size}
                onChange={handleChange('size')}
                size="small"
                placeholder="e.g. 540 KB"
                helperText="File size will be auto-filled when you select a file"
                sx={inputStyles}
              />

              <TextField
                fullWidth
                label="Notes / Description"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange('notes')}
                size="small"
                placeholder="Brief description of the document…"
                sx={inputStyles}
              />
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        gap: 1, 
        borderTop: '1px solid #e2e8f0',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        flexWrap: 'wrap',
      }}>
        <Button 
          onClick={handleClose}
          sx={{
            color: '#64748b',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8rem',
            py: 0.5,
            px: 1.5,
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{
            backgroundColor: '#2563eb',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8rem',
            py: 0.5,
            px: 2,
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          }}
        >
          {document ? "Update Document" : "Save Document"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUploadModal;