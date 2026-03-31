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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import SaveIcon from '@mui/icons-material/Save';
import DraftsIcon from '@mui/icons-material/Drafts';
import dayjs from 'dayjs';

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
  const [showOrderDatePicker, setShowOrderDatePicker] = useState(false);
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);
  const orderDateInputRef = useRef(null);
  const deliveryDateInputRef = useRef(null);

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
    const total = formData.lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitCost);
    }, 0);
    setTotalAmount(total);
  }, [formData.lineItems]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleOrderDateIconClick = () => {
    if (orderDateInputRef.current) {
      if (showOrderDatePicker) {
        orderDateInputRef.current.blur();
        setShowOrderDatePicker(false);
      } else {
        if (orderDateInputRef.current.showPicker) {
          orderDateInputRef.current.showPicker();
        } else {
          orderDateInputRef.current.focus();
        }
        setShowOrderDatePicker(true);
      }
    }
  };

  const handleDeliveryDateIconClick = () => {
    if (deliveryDateInputRef.current) {
      if (showDeliveryDatePicker) {
        deliveryDateInputRef.current.blur();
        setShowDeliveryDatePicker(false);
      } else {
        if (deliveryDateInputRef.current.showPicker) {
          deliveryDateInputRef.current.showPicker();
        } else {
          deliveryDateInputRef.current.focus();
        }
        setShowDeliveryDatePicker(true);
      }
    }
  };

  const handleOrderDateChange = (e) => {
    setFormData({ ...formData, orderDate: e.target.value });
    setShowOrderDatePicker(false);
  };

  const handleDeliveryDateChange = (e) => {
    setFormData({ ...formData, requiredDelivery: e.target.value });
    setShowDeliveryDatePicker(false);
  };

  const handleLineItemChange = (id, field) => (event) => {
    const value = field === 'quantity' || field === 'unitCost' 
      ? parseFloat(event.target.value) || 0 
      : event.target.value;
    
    setFormData({
      ...formData,
      lineItems: formData.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const addLineItem = () => {
    const newId = Math.max(...formData.lineItems.map(item => item.id), 0) + 1;
    setFormData({
      ...formData,
      lineItems: [
        ...formData.lineItems,
        { id: newId, description: '', quantity: 1, unitCost: 0 },
      ],
    });
  };

  const removeLineItem = (id) => {
    if (formData.lineItems.length > 1) {
      setFormData({
        ...formData,
        lineItems: formData.lineItems.filter(item => item.id !== id),
      });
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.supplier) {
      errors.push('Please select a supplier');
    }
    if (!formData.deliverTo) {
      errors.push('Please select a delivery location');
    }
    if (!formData.requiredDelivery) {
      errors.push('Please enter required delivery date');
    }
    return errors;
  };

  const handleSubmit = (isDraft = false) => {
    const errors = validateForm();
    
    if (!isDraft && errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const validLineItems = formData.lineItems.filter(item => item.description.trim() !== '');
    
    const poData = {
      ...formData,
      lineItems: validLineItems,
      totalAmount: totalAmount,
      status: isDraft ? 'Draft' : 'Pending',
    };
    
    if (isDraft && onSaveAsDraft) {
      onSaveAsDraft(poData);
    } else if (onSave) {
      onSave(poData);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setFormData({
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
        <span>Create Purchase Order</span>
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
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="PO Number"
                  value={formData.poNumber}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  size="small"
                  sx={inputStyles}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Supplier Quotation Ref"
                  placeholder="e.g. QTN-2026-001"
                  value={formData.quotationRef}
                  onChange={handleChange('quotationRef')}
                  fullWidth
                  size="small"
                  sx={inputStyles}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.supplier}
                    onChange={handleChange('supplier')}
                    displayEmpty
                    sx={selectStyles}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Select supplier…</MenuItem>
                    {suppliers.map(sup => (
                      <MenuItem key={sup.value} value={sup.value} sx={{ fontSize: '0.8rem' }}>{sup.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={formData.deliverTo}
                    onChange={handleChange('deliverTo')}
                    displayEmpty
                    sx={selectStyles}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Select location…</MenuItem>
                    {locations.map(loc => (
                      <MenuItem key={loc.value} value={loc.value} sx={{ fontSize: '0.8rem' }}>{loc.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  id="order-date"
                  type="date"
                  label="Order Date"
                  value={formData.orderDate}
                  onChange={handleOrderDateChange}
                  inputRef={orderDateInputRef}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleOrderDateIconClick}
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
                  id="delivery-date"
                  type="date"
                  label="Required Delivery"
                  value={formData.requiredDelivery}
                  onChange={handleDeliveryDateChange}
                  inputRef={deliveryDateInputRef}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleDeliveryDateIconClick}
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

            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.priority}
                  onChange={handleChange('priority')}
                  displayEmpty
                  sx={selectStyles}
                >
                  <MenuItem value="" disabled sx={{ fontSize: '0.8rem' }}>Select Priority</MenuItem>
                  {priorities.map(priority => (
                    <MenuItem key={priority} value={priority} sx={{ fontSize: '0.8rem' }}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1.2, 
                fontWeight: 600, 
                color: '#1e293b',
                fontSize: '0.8rem',
              }}
            >
              Line Items
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '2fr 70px 70px 28px' },
              gap: 1, 
              mb: 1,
              px: 0.5
            }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Item Description
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>
                Qty
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>
                Unit Cost
              </Typography>
              <Typography></Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {formData.lineItems.map((item) => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '2fr 70px 70px 28px' },
                    gap: 1,
                    alignItems: 'center'
                  }}
                >
                  <TextField
                    placeholder="Item description…"
                    value={item.description}
                    onChange={handleLineItemChange(item.id, 'description')}
                    size="small"
                    fullWidth
                    sx={inputStyles}
                  />
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={handleLineItemChange(item.id, 'quantity')}
                    size="small"
                    fullWidth
                    inputProps={{ min: 1 }}
                    sx={{
                      ...inputStyles,
                      '& .MuiInputBase-input': {
                        fontSize: '0.75rem',
                        padding: '4px 6px',
                        textAlign: 'right',
                      }
                    }}
                  />
                  <TextField
                    type="number"
                    placeholder="$0.00"
                    value={item.unitCost}
                    onChange={handleLineItemChange(item.id, 'unitCost')}
                    size="small"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{
                      ...inputStyles,
                      '& .MuiInputBase-input': {
                        fontSize: '0.75rem',
                        padding: '4px 6px',
                        textAlign: 'right',
                      }
                    }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => removeLineItem(item.id)}
                    disabled={formData.lineItems.length === 1}
                    sx={{ 
                      color: '#dc3545',
                      padding: '1px',
                      '&:hover': {
                        backgroundColor: '#ffe6e6',
                      }
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: '14px' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Button 
              startIcon={<AddIcon />} 
              onClick={addLineItem}
              sx={{
                mt: 1.5,
                borderRadius: '6px',
                textTransform: 'none',
                color: '#2563eb',
                fontSize: '0.75rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#eff6ff',
                }
              }}
            >
              Add Line
            </Button>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              mt: 1.5,
              pt: 1,
              borderTop: '1px solid #e2e8f0'
            }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', mr: 1 }}>
                Total:
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb' }}>
                ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>

          <Box>
            <TextField
              label="Notes"
              placeholder="Special delivery instructions…"
              value={formData.notes}
              onChange={handleChange('notes')}
              fullWidth
              multiline
              rows={2}
              size="small"
              sx={inputStyles}
            />
          </Box>
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
          Draft
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
          Submit PO
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPO;