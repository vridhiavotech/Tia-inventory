import React, { useState, useEffect } from 'react';
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
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';

const SupplierModal = ({ open, onClose, onSave, supplier, onAddManufacturer }) => {
  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    phone: "",
    email: "",
    cityState: "",
    gpo: "",
    contractNumber: "",
    paymentTerms: "",
    leadTime: "",
    notes: "",
    manufacturers: [],
  });

  const [manufacturerSearch, setManufacturerSearch] = useState("");
  const [allManufacturers, setAllManufacturers] = useState([
    "Teva Pharmaceuticals", 
    "Pfizer Inc.", 
    "Baxter International", 
    "Ansell Healthcare", 
    "3M Health Care", 
    "Becton Dickinson (BD)", 
    "West-Ward Pharmaceuticals", 
    "Medline Industries"
  ]);

  const gpoOptions = ["Vizient", "Premier", "Provista", "Intalere", "Direct Contract", "Spot Purchase"];
  const paymentTermsOptions = ["Net-30", "Net-45", "Net-60", "Net-15", "COD"];

  useEffect(() => {
    if (supplier) {
      console.log("=== EDIT MODAL OPENED ===");
      console.log("Supplier data:", supplier);
      console.log("Supplier manufacturers array:", supplier.manufacturers);
      
      // Get the manufacturers array
      let selectedManufacturers = supplier.manufacturers || [];
      
      // IMPORTANT: Make sure we're using the exact names that match allManufacturers
      // If the supplier has manufacturer codes like "TEVA", we need to map them to full names
      // For now, let's log what we have
      console.log("Selected manufacturer names from supplier:", selectedManufacturers);
      
      // Check if the names match exactly with allManufacturers
      const exactMatches = selectedManufacturers.filter(selected => 
        allManufacturers.some(m => m === selected)
      );
      console.log("Exact matches with allManufacturers:", exactMatches);
      
      // If no exact matches, maybe the supplier has manufacturer codes like "TEVA", "PFZ" etc.
      // Let's map common codes to full names
      const codeToNameMap = {
        "TEVA": "Teva Pharmaceuticals",
        "PFZ": "Pfizer Inc.",
        "BAX": "Baxter International",
        "ANSELL": "Ansell Healthcare",
        "3M": "3M Health Care",
        "BD": "Becton Dickinson (BD)",
        "WWPH": "West-Ward Pharmaceuticals",
        "MDL": "Medline Industries"
      };
      
      // Convert codes to full names if needed
      const mappedManufacturers = selectedManufacturers.map(selected => {
        return codeToNameMap[selected] || selected;
      });
      
      console.log("Mapped manufacturers:", mappedManufacturers);
      
      // Use the mapped manufacturers
      const finalManufacturers = mappedManufacturers;
      
      setFormData({
        company: supplier.company || "",
        contactPerson: supplier.contactName || "",
        phone: supplier.phone || "",
        email: supplier.contactEmail || "",
        cityState: supplier.location || "",
        gpo: supplier.gpo || "",
        contractNumber: supplier.contractNumber || "",
        paymentTerms: supplier.terms || "",
        leadTime: supplier.leadTime?.replace('d', '') || "",
        notes: supplier.notes || "",
        manufacturers: finalManufacturers,
      });
      
      console.log("Final manufacturers set in formData:", finalManufacturers);
    } else {
      setFormData({
        company: "",
        contactPerson: "",
        phone: "",
        email: "",
        cityState: "",
        gpo: "",
        contractNumber: "",
        paymentTerms: "",
        leadTime: "",
        notes: "",
        manufacturers: [],
      });
    }
  }, [supplier, allManufacturers]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleManufacturerToggle = (manufacturer) => {
    setFormData(prev => {
      const isCurrentlySelected = prev.manufacturers.includes(manufacturer);
      const newManufacturers = isCurrentlySelected
        ? prev.manufacturers.filter(m => m !== manufacturer)
        : [...prev.manufacturers, manufacturer];
      
      console.log("Toggled manufacturer:", manufacturer);
      console.log("Updated manufacturers list:", newManufacturers);
      
      return {
        ...prev,
        manufacturers: newManufacturers
      };
    });
  };

  const handleSubmit = () => {
    if (!formData.company.trim()) {
      alert("Please enter company name");
      return;
    }

    // When saving, we can save either the full names or codes
    // For now, save the full names
    const supplierData = {
      company: formData.company,
      location: formData.cityState,
      contactName: formData.contactPerson,
      contactEmail: formData.email,
      phone: formData.phone,
      gpo: formData.gpo,
      contractNumber: formData.contractNumber,
      terms: formData.paymentTerms,
      leadTime: formData.leadTime ? `${formData.leadTime}d` : "",
      manufacturers: formData.manufacturers,
      instruments: [],
      notes: formData.notes,
      status: "Active"
    };
    
    console.log("=== SAVING SUPPLIER ===");
    console.log("Manufacturers being saved:", formData.manufacturers);
    
    onSave(supplierData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      company: "",
      contactPerson: "",
      phone: "",
      email: "",
      cityState: "",
      gpo: "",
      contractNumber: "",
      paymentTerms: "",
      leadTime: "",
      notes: "",
      manufacturers: [],
    });
    setManufacturerSearch("");
    onClose();
  };

  const filteredManufacturers = allManufacturers.filter(m => 
    m.toLowerCase().includes(manufacturerSearch.toLowerCase())
  );

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
              {supplier ? "Edit Supplier" : "Add Supplier"}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#64748b', mt: 0.2 }}>
              Approved vendor master
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
          {/* Company Info Section */}
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
              Company Info
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.company}
                onChange={handleChange('company')}
                required
                size="small"
                placeholder="e.g. McKesson Medical"
                sx={inputStyles}
              />
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  value={formData.contactPerson}
                  onChange={handleChange('contactPerson')}
                  size="small"
                  placeholder="John Reid"
                  sx={inputStyles}
                />
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
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  size="small"
                  placeholder="orders@supplier.com"
                  sx={inputStyles}
                />
                <TextField
                  fullWidth
                  label="City, State"
                  value={formData.cityState}
                  onChange={handleChange('cityState')}
                  size="small"
                  placeholder="Irving, TX"
                  sx={inputStyles}
                />
              </Box>
            </Box>
          </Paper>

          {/* Contract & Terms Section */}
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
              Contract & Terms
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.gpo}
                    onChange={handleChange('gpo')}
                    displayEmpty
                    sx={selectStyles}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Select GPO</MenuItem>
                    {gpoOptions.map((option) => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.8rem' }}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Contract #"
                  value={formData.contractNumber}
                  onChange={handleChange('contractNumber')}
                  size="small"
                  placeholder="VZ-2025-MCK"
                  sx={inputStyles}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.paymentTerms}
                    onChange={handleChange('paymentTerms')}
                    displayEmpty
                    sx={selectStyles}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Select Payment Terms</MenuItem>
                    {paymentTermsOptions.map((option) => (
                      <MenuItem key={option} value={option} sx={{ fontSize: '0.8rem' }}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Lead Time (days)"
                  type="number"
                  value={formData.leadTime}
                  onChange={handleChange('leadTime')}
                  size="small"
                  placeholder="e.g. 3"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  helperText="avg. days from order to delivery"
                  sx={inputStyles}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={formData.notes}
                onChange={handleChange('notes')}
                size="small"
                placeholder="Special terms, certifications…"
                sx={inputStyles}
              />
            </Box>
          </Paper>

          {/* Manufacturers Supplied Section */}
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
              Manufacturers Supplied
            </Typography>

            <Typography sx={{ 
              fontSize: '0.65rem', 
              color: '#64748b', 
              mb: 1 
            }}>
              Search and select all manufacturers this supplier carries or distributes for:
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="🔍 Search manufacturers…"
              value={manufacturerSearch}
              onChange={(e) => setManufacturerSearch(e.target.value)}
              sx={{ 
                mb: 1,
                '& .MuiInputBase-root': { fontSize: '0.75rem' }
              }}
            />

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 0.5,
              maxHeight: '180px',
              overflowY: 'auto',
              border: '1px solid #e2e8f0',
              borderRadius: 1,
              p: 1,
              backgroundColor: '#f8fafc',
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
            }}>
              {filteredManufacturers.map((manufacturer) => {
                // Check if this manufacturer is selected (case-insensitive)
                const isSelected = formData.manufacturers.some(selected => 
                  selected.toLowerCase() === manufacturer.toLowerCase()
                );
                
                return (
                  <Box
                    key={manufacturer}
                    onClick={() => handleManufacturerToggle(manufacturer)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 0.5,
                      cursor: 'pointer',
                      borderRadius: 1,
                      backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                      border: isSelected ? '1px solid #14b8a6' : '1px solid transparent',
                      '&:hover': {
                        backgroundColor: '#eff6ff',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: 1,
                        border: `2px solid ${isSelected ? '#14b8a6' : '#cbd5e1'}`,
                        backgroundColor: isSelected ? '#14b8a6' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && (
                        <Typography sx={{ fontSize: '10px', color: 'white' }}>✓</Typography>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', color: '#1e293b' }}>
                      {manufacturer}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mt: 1,
              fontSize: '0.65rem',
              color: '#64748b'
            }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748b' }}>
                Can't find a manufacturer? 
                <span 
                  style={{ 
                    color: '#14b8a6', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    marginLeft: '4px'
                  }}
                  onClick={() => {
                    handleClose();
                    if (onAddManufacturer) onAddManufacturer();
                  }}
                >
                  Add Manufacturer →
                </span>
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#14b8a6', fontWeight: 600 }}>
                {formData.manufacturers.length} selected
              </Typography>
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
          Save Supplier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierModal;