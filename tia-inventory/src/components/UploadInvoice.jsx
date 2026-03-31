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
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import EventIcon from '@mui/icons-material/Event';
import dayjs from 'dayjs';

const UploadInvoice = ({ open, onClose, onSave, poData }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: dayjs().format('YYYY-MM-DD'),
    paymentTerms: 'Net-30',
    paymentDueDate: '',
    invoiceAmount: '',
    tax: '',
    discount: '',
    grandTotal: 0,
    invoiceStatus: 'Pending',
    verifiedBy: '',
    notes: '',
    file: null,
  });

  const [ocrStatus, setOcrStatus] = useState('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [variance, setVariance] = useState(null);
  const [showInvoiceDatePicker, setShowInvoiceDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const invoiceDateInputRef = useRef(null);
  const dueDateInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open && poData) {
      setFormData({
        invoiceNumber: '',
        invoiceDate: dayjs().format('YYYY-MM-DD'),
        paymentTerms: 'Net-30',
        paymentDueDate: '',
        invoiceAmount: '',
        tax: '',
        discount: '',
        grandTotal: 0,
        invoiceStatus: 'Pending',
        verifiedBy: '',
        notes: '',
        file: null,
      });
      setUploadedFile(null);
      setOcrStatus('idle');
      setVariance(null);
    }
  }, [open, poData]);

  useEffect(() => {
    const amount = parseFloat(formData.invoiceAmount) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const grandTotal = amount + tax - discount;
    setFormData(prev => ({ ...prev, grandTotal }));

    if (poData && poData.total && grandTotal > 0) {
      const difference = Math.abs(grandTotal - poData.total);
      if (difference > 0.01) {
        setVariance({
          difference,
          poTotal: poData.total,
          invoiceTotal: grandTotal,
        });
      } else {
        setVariance(null);
      }
    }
  }, [formData.invoiceAmount, formData.tax, formData.discount, poData]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleInvoiceDateIconClick = () => {
    if (invoiceDateInputRef.current) {
      if (showInvoiceDatePicker) {
        invoiceDateInputRef.current.blur();
        setShowInvoiceDatePicker(false);
      } else {
        if (invoiceDateInputRef.current.showPicker) {
          invoiceDateInputRef.current.showPicker();
        } else {
          invoiceDateInputRef.current.focus();
        }
        setShowInvoiceDatePicker(true);
      }
    }
  };

  const handleDueDateIconClick = () => {
    if (dueDateInputRef.current) {
      if (showDueDatePicker) {
        dueDateInputRef.current.blur();
        setShowDueDatePicker(false);
      } else {
        if (dueDateInputRef.current.showPicker) {
          dueDateInputRef.current.showPicker();
        } else {
          dueDateInputRef.current.focus();
        }
        setShowDueDatePicker(true);
      }
    }
  };

  const handleInvoiceDateChange = (e) => {
    setFormData({ ...formData, invoiceDate: e.target.value });
    setShowInvoiceDatePicker(false);
  };

  const handleDueDateChange = (e) => {
    setFormData({ ...formData, paymentDueDate: e.target.value });
    setShowDueDatePicker(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, file }));
      
      setOcrStatus('scanning');
      setOcrProgress(0);
      
      const steps = [
        { progress: 25, field: 'Uploading and decoding file…' },
        { progress: 50, field: 'Sending to AI model…' },
        { progress: 75, field: 'Extracting invoice fields…' },
        { progress: 100, field: 'Filling form…' },
      ];
      
      steps.forEach((step, index) => {
        setTimeout(() => {
          setOcrProgress(step.progress);
          if (step.progress === 100) {
            const extractedData = {
              invoiceNumber: 'INV-MCK-2026-00482',
              invoiceDate: dayjs().format('YYYY-MM-DD'),
              invoiceAmount: '850.00',
              tax: '0.00',
              discount: '0.00',
            };
            
            setFormData(prev => ({
              ...prev,
              invoiceNumber: extractedData.invoiceNumber,
              invoiceDate: extractedData.invoiceDate,
              invoiceAmount: extractedData.invoiceAmount,
              tax: extractedData.tax,
              discount: extractedData.discount,
            }));
            setOcrStatus('done');
          }
        }, (index + 1) * 1500);
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      handleFileUpload({ target: { files: [file] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, file: null }));
    setOcrStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!formData.invoiceNumber) {
      alert('Please enter supplier invoice number');
      return;
    }
    if (!formData.invoiceAmount) {
      alert('Please enter invoice amount');
      return;
    }
    
    const invoiceData = {
      ...formData,
      poNumber: poData?.id,
      poTotal: poData?.total,
    };
    
    onSave(invoiceData);
    onClose();
  };

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

  const paymentTerms = ['Net-30', 'Net-45', 'Net-60', 'Net-15', 'Immediate / COD'];
  const invoiceStatuses = [
    { value: 'Pending', label: 'Pending — Awaiting Review' },
    { value: 'Verified', label: 'Verified — Amounts Match' },
    { value: 'Disputed', label: 'Disputed — Discrepancy Found' },
    { value: 'Paid', label: 'Paid — Payment Processed' },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: '600px',
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
          <Box sx={{ fontSize: '1.2rem' }}>🧾</Box>
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Upload Invoice</Typography>
            {poData && (
              <Typography sx={{ fontSize: '0.7rem', color: '#64748b', mt: 0.2 }}>
                {poData.id} — {poData.supplier}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
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
      
      <DialogContent dividers sx={{ 
        p: { xs: 1.5, sm: 2 },
        '& .MuiDialogContent-dividers': {
          borderColor: '#e2e8f0',
        }
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {poData && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                border: '1px solid #e2e8f0', 
                borderRadius: 2,
                backgroundColor: '#f9fafc',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                gap: 1.5
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  PO Number
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#14b8a6' }}>
                  {poData.id}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Supplier
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>
                  {poData.supplier}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  PO Total
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  ${poData.total?.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  PO Status
                </Typography>
                <Chip 
                  label={poData.status} 
                  size="small" 
                  sx={{ 
                    backgroundColor: poData.status === 'Approved' ? '#e0f2fe' : '#f3f4f6',
                    color: poData.status === 'Approved' ? '#0f766e' : '#6b7280',
                    fontSize: '0.7rem',
                    height: '22px',
                  }} 
                />
              </Box>
            </Paper>
          )}

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 1.2, sm: 1.5 }, 
              border: '1px solid #e2e8f0', 
              borderRadius: 2,
              backgroundColor: '#f9fafc'
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1.2, 
                fontWeight: 600, 
                color: '#1e293b',
                fontSize: '0.75rem',
              }}
            >
              Invoice File *
            </Typography>

            {ocrStatus === 'idle' && !uploadedFile && (
              <Box
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: 2,
                  p: 2.5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 32, color: '#94a3b8', mb: 1 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#1e293b' }}>
                  Click to browse or drag & drop
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748b', mt: 0.5 }}>
                  PDF, PNG, JPG — AI will read & auto-fill all fields
                </Typography>
              </Box>
            )}

            {ocrStatus === 'scanning' && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ fontSize: '2rem', mb: 1 }}>🔍</Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                    Reading invoice with AI OCR…
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b', mt: 0.5 }}>
                    Extracting invoice number, amounts, dates and supplier details
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={ocrProgress} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#2563eb',
                    }
                  }} 
                />
                <Typography sx={{ fontSize: '0.7rem', color: '#64748b', mt: 1 }}>
                  {ocrProgress}% complete
                </Typography>
              </Box>
            )}

            {ocrStatus === 'done' && uploadedFile && (
              <Box sx={{ p: 1.5, backgroundColor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>
                      Invoice read successfully
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#64748b', mt: 0.2 }}>
                      Extracted: Invoice #, Amount, Date
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    onClick={clearFile}
                    sx={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'none' }}
                  >
                    Change file
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          <Divider sx={{ my: 0.5 }} />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1e293b',
                  fontSize: '0.75rem',
                }}
              >
                Invoice Details
              </Typography>
              {ocrStatus === 'done' && (
                <Chip 
                  label="✨ AI filled" 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#e0f2fe', 
                    color: '#0f766e', 
                    fontSize: '0.6rem',
                    height: '20px',
                  }} 
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    label="Supplier Invoice #"
                    value={formData.invoiceNumber}
                    onChange={handleChange('invoiceNumber')}
                    required
                    fullWidth
                    size="small"
                    sx={inputStyles}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    id="invoice-date"
                    type="date"
                    label="Invoice Date"
                    value={formData.invoiceDate}
                    onChange={handleInvoiceDateChange}
                    inputRef={invoiceDateInputRef}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleInvoiceDateIconClick}
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

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.paymentTerms}
                      onChange={handleChange('paymentTerms')}
                      sx={selectStyles}
                    >
                      {paymentTerms.map(term => (
                        <MenuItem key={term} value={term} sx={{ fontSize: '0.75rem' }}>{term}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    id="due-date"
                    type="date"
                    label="Payment Due Date"
                    value={formData.paymentDueDate}
                    onChange={handleDueDateChange}
                    inputRef={dueDateInputRef}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleDueDateIconClick}
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
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1.2, 
                fontWeight: 600, 
                color: '#1e293b',
                fontSize: '0.75rem',
              }}
            >
              Amounts
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                type="number"
                label="Invoice Amount ($)"
                value={formData.invoiceAmount}
                onChange={handleChange('invoiceAmount')}
                required
                fullWidth
                size="small"
                inputProps={{ step: 0.01 }}
                sx={inputStyles}
              />
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    type="number"
                    label="Tax / VAT ($)"
                    value={formData.tax}
                    onChange={handleChange('tax')}
                    fullWidth
                    size="small"
                    inputProps={{ step: 0.01 }}
                    sx={inputStyles}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    type="number"
                    label="Discount ($)"
                    value={formData.discount}
                    onChange={handleChange('discount')}
                    fullWidth
                    size="small"
                    inputProps={{ step: 0.01 }}
                    sx={inputStyles}
                  />
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center',
                gap: 2,
                pt: 0.5,
              }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b' }}>
                  Grand Total:
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 700, 
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  px: 2,
                  py: 0.8,
                  borderRadius: 1,
                }}>
                  ${formData.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>

              {variance && (
                <Alert 
                  severity="warning" 
                  icon={<WarningIcon />}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-message': { fontSize: '0.7rem' }
                  }}
                >
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>
                    Invoice amount differs from PO total
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#a16207', mt: 0.5 }}>
                    PO Total: ${variance.poTotal.toLocaleString()} | Invoice Total: ${variance.invoiceTotal.toLocaleString()} | Difference: ${variance.difference.toLocaleString()}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 1.2, 
                fontWeight: 600, 
                color: '#1e293b',
                fontSize: '0.75rem',
              }}
            >
              Verification
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.invoiceStatus}
                  onChange={handleChange('invoiceStatus')}
                  sx={selectStyles}
                >
                  {invoiceStatuses.map(status => (
                    <MenuItem key={status.value} value={status.value} sx={{ fontSize: '0.75rem' }}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Verified / Reviewed By"
                placeholder="e.g. S. Anderson"
                value={formData.verifiedBy}
                onChange={handleChange('verifiedBy')}
                fullWidth
                size="small"
                sx={inputStyles}
              />

              <TextField
                label="Notes / Remarks"
                placeholder="Payment instructions, discrepancy notes, approvals…"
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
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        gap: 1, 
        borderTop: '1px solid #e2e8f0',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      }}>
        <Button 
          onClick={onClose}
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
          startIcon={<AttachFileIcon />}
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
          Save Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadInvoice;