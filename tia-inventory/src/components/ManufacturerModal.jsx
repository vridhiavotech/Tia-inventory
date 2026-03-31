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
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import DraftsIcon from '@mui/icons-material/Drafts';
import EventIcon from '@mui/icons-material/Event';

const ManufacturerModal = ({ open, onClose, onSave, manufacturer }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    country: "",
    email: "",
    phone: "",
    website: "",
    regNumber: "",
    notes: "",
  });

  useEffect(() => {
    if (manufacturer) {
      setFormData({
        name: manufacturer.name || "",
        code: manufacturer.code || "",
        type: manufacturer.type || "",
        country: manufacturer.country || "",
        email: manufacturer.contactEmail || "",
        phone: manufacturer.contactPhone || "",
        website: manufacturer.website || "",
        regNumber: manufacturer.regNumber || "",
        notes: manufacturer.notes || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        type: "",
        country: "",
        email: "",
        phone: "",
        website: "",
        regNumber: "",
        notes: "",
      });
    }
  }, [manufacturer]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (isDraft = false) => {
    if (!formData.name.trim()) {
      alert("Please enter manufacturer name");
      return;
    }

    const manufacturerData = {
      name: formData.name,
      code: formData.code,
      type: formData.type,
      country: formData.country,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      regNumber: formData.regNumber,
      notes: formData.notes,
      status: isDraft ? "Inactive" : "Active"
    };
    
    onSave(manufacturerData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      code: "",
      type: "",
      country: "",
      email: "",
      phone: "",
      website: "",
      regNumber: "",
      notes: "",
    });
    onClose();
  };

  const manufacturerTypes = [
    "Pharma", "PPE", "Surgical", "Diagnostics", 
    "Medical Devices", "Consumables", "Equipment", "Other"
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BusinessIcon sx={{ fontSize: '1.2rem', color: '#0284c7' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {manufacturer ? "Edit Manufacturer" : "Add Manufacturer"}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#64748b', mt: 0.2 }}>
              Register a manufacturer / brand
            </Typography>
          </Box>
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
              Manufacturer Info
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                fullWidth
                label="Manufacturer Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                size="small"
                placeholder="e.g. Pfizer Inc."
                sx={inputStyles}
              />
              
              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Code / Short Name"
                    value={formData.code}
                    onChange={handleChange('code')}
                    size="small"
                    placeholder="e.g. PFZ"
                    sx={inputStyles}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.type}
                      onChange={handleChange('type')}
                      displayEmpty
                      sx={selectStyles}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Type</MenuItem>
                      {manufacturerTypes.map((type) => (
                        <MenuItem key={type} value={type} sx={{ fontSize: '0.8rem' }}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              
              <TextField
                fullWidth
                label="Country of Origin"
                value={formData.country}
                onChange={handleChange('country')}
                size="small"
                placeholder="e.g. USA, India"
                sx={inputStyles}
              />
              
              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    size="small"
                    placeholder="contact@manufacturer.com"
                    sx={inputStyles}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    size="small"
                    placeholder="1-800-000-0000"
                    sx={inputStyles}
                  />
                </Box>
              </Box>
              
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={handleChange('website')}
                size="small"
                placeholder="www.manufacturer.com"
                sx={inputStyles}
              />
              
              <TextField
                fullWidth
                label="Reg. / License No."
                value={formData.regNumber}
                onChange={handleChange('regNumber')}
                size="small"
                placeholder="e.g. FDA-REG-123456"
                sx={inputStyles}
              />
              
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange('notes')}
                size="small"
                placeholder="Product specializations, certifications…"
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
          onClick={() => handleSubmit(true)} 
          variant="outlined"
          startIcon={<DraftsIcon />}
          sx={{
            color: '#64748b',
            borderColor: '#e2e8f0',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8rem',
            py: 0.5,
            px: 2,
            '&:hover': {
              borderColor: '#2563eb',
              color: '#2563eb',
              backgroundColor: '#f8fafc',
            },
          }}
        >
          Save as Draft
        </Button>
        <Button 
          onClick={() => handleSubmit(false)} 
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
          {manufacturer ? "Update" : "Save"} Manufacturer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManufacturerModal;