import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import NewPO from '../components/NewPO';
import UploadInvoice from '../components/UploadInvoice';
import NewGRNDialog from './Goodsreceipt/newgrnmodal';

const PurchaseOrders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [newPOModalOpen, setNewPOModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [viewInvoiceModalOpen, setViewInvoiceModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newGRNModalOpen, setNewGRNModalOpen] = useState(false);
const [selectedGRNPO, setSelectedGRNPO] = useState(null);
  
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 'PO-2026-0004',
      quotRef: '—',
      supplier: 'McKesson Medical-Surgical',
      location: 'CS-01',
      lines: 2,
      total: 850,
      createdBy: 'S. Anderson',
      date: 'Mar 19, 2026',
      delivery: 'Mar 24, 2026',
      priority: 'Urgent',
      status: 'Approved',
      invoice: { status: 'none', number: null },
      lineItems: [
        { description: 'Amoxicillin 500mg Capsules', quantity: 200, unitCost: 2.40, total: 480.00 },
        { description: 'Epinephrine 1mg/mL 10mL', quantity: 20, unitCost: 18.50, total: 370.00 },
      ],
    },
    {
      id: 'PO-2026-0003',
      quotRef: '—',
      supplier: 'Cardinal Health',
      location: 'CS-01',
      lines: 2,
      total: 525,
      createdBy: 'S. Anderson',
      date: 'Mar 17, 2026',
      delivery: 'Mar 22, 2026',
      priority: 'Normal',
      status: 'Pending',
      invoice: { status: 'none', number: null },
      lineItems: [
        { description: 'Paracetamol 500mg Tablets', quantity: 100, unitCost: 2.50, total: 250.00 },
        { description: 'Ibuprofen 200mg Tablets', quantity: 50, unitCost: 5.50, total: 275.00 },
      ],
    },
    {
      id: 'PO-2026-0002',
      quotRef: '—',
      supplier: 'Medline Industries',
      location: 'CS-01',
      lines: 2,
      total: 696,
      createdBy: 'T. Williams',
      date: 'Mar 14, 2026',
      delivery: 'Mar 20, 2026',
      priority: 'Normal',
      status: 'Received',
      invoice: { 
        status: 'verified', 
        number: 'INV-MDL-2026-4821',
        date: 'Mar 20, 2026',
        dueDate: 'May 4, 2026',
        amount: 696.00,
        paymentTerms: 'Net-45',
        fileName: 'INV-MDL-2026-4821.pdf',
        fileSize: '184 KB',
        verifiedBy: 'T. Williams',
        notes: 'Medline invoice — correct quantities confirmed.',
        uploadedAt: 'Mar 20, 2026 14:32',
      },
      lineItems: [
        { description: 'Surgical Gloves (Box of 100)', quantity: 10, unitCost: 45.60, total: 456.00 },
        { description: 'Face Masks (Box of 50)', quantity: 15, unitCost: 16.00, total: 240.00 },
      ],
    },
    {
      id: 'PO-2026-0001',
      quotRef: '—',
      supplier: 'Fisher Scientific',
      location: 'CS-01',
      lines: 1,
      total: 175,
      createdBy: 'T. Williams',
      date: 'Mar 10, 2026',
      delivery: 'Mar 18, 2026',
      priority: 'Normal',
      status: 'Draft',
      invoice: { status: 'none', number: null },
      lineItems: [
        { description: 'Lab Coats (Large)', quantity: 5, unitCost: 35.00, total: 175.00 },
      ],
    },
  ]);

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

  const stats = {
    totalPOs: purchaseOrders.length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.total, 0),
    pendingApproval: purchaseOrders.filter(po => po.status === 'Pending').length,
    approved: purchaseOrders.filter(po => po.status === 'Approved').length,
    received: purchaseOrders.filter(po => po.status === 'Received').length,
    invoicesAttached: purchaseOrders.filter(po => po.invoice.status !== 'none').length,
  };

  const statCards = [
    { 
      title: "Total Purchase Orders", 
      value: stats.totalPOs, 
      subtitle: `${stats.totalPOs} orders · $${stats.totalValue.toLocaleString()} total value`,
      color: "#3b82f6",
    },
    { 
      title: "Pending Approval", 
      value: stats.pendingApproval, 
      subtitle: "Awaiting approval",
      color: "#f59e0b",
    },
    { 
      title: "Approved / In Transit", 
      value: stats.approved, 
      subtitle: "Ready to receive GRN",
      color: "#10b981",
    },
    { 
      title: "Received", 
      value: stats.received, 
      subtitle: "Completed orders",
      color: "#8b5cf6",
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#14b8a6';
      case 'Pending': return '#f59e0b';
      case 'Received': return '#10b981';
      case 'Draft': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return '#f59e0b';
      case 'Critical': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const handleApprove = (id) => {
    setPurchaseOrders(purchaseOrders.map(po => 
      po.id === id ? { ...po, status: 'Approved' } : po
    ));
  };

  const handleReject = (id) => {
    alert(`PO ${id} has been rejected`);
  };

  const handleViewPO = (po) => {
    let lineItemsText = '';
    if (po.lineItems && po.lineItems.length > 0) {
      lineItemsText = po.lineItems.map(item => 
        `${item.description} × ${item.quantity} @ $${item.unitCost.toFixed(2)} = $${item.total.toFixed(2)}`
      ).join('\n');
    }
    
    const message = `PO Number: ${po.id}
Quotation Ref: ${po.quotRef}
Supplier: ${po.supplier}
Status: ${po.status}
Location: ${po.location}
Priority: ${po.priority}
Created By: ${po.createdBy}
Date: ${po.date}
Delivery: ${po.delivery}

Line Items:
${lineItemsText}

Total: $${po.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    alert(message);
  };

  const handleUploadInvoice = (po) => {
    setSelectedPO(po);
    setInvoiceModalOpen(true);
  };

  const handleViewInvoice = (po) => {
    setSelectedPO(po);
    setSelectedInvoice(po.invoice);
    setViewInvoiceModalOpen(true);
  };

 const handleCreateGRN = (po) => {
  setSelectedGRNPO(po);
  setNewGRNModalOpen(true);
};

  const handleNewPO = () => {
    setNewPOModalOpen(true);
  };

  const handleSavePO = (poData) => {
    const supplierLabel = suppliers.find(s => s.value === poData.supplier)?.label || '';
    const locationLabel = locations.find(l => l.value === poData.deliverTo)?.label || '';
    
    const newPO = {
      id: poData.poNumber,
      quotRef: poData.quotationRef || '—',
      supplier: supplierLabel,
      location: locationLabel,
      lines: poData.lineItems.length,
      total: poData.totalAmount,
      createdBy: 'Current User',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      delivery: new Date(poData.requiredDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      priority: poData.priority,
      status: poData.status === 'Draft' ? 'Draft' : 'Pending',
      invoice: { status: 'none', number: null },
      lineItems: poData.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitCost: item.unitCost,
        total: item.quantity * item.unitCost,
      })),
    };
    
    setPurchaseOrders([newPO, ...purchaseOrders]);
    alert(`Purchase Order ${poData.poNumber} saved as ${poData.status === 'Draft' ? 'Draft' : 'Pending'} successfully!`);
  };

  const handleSaveInvoice = (invoiceData) => {
    setPurchaseOrders(purchaseOrders.map(po => 
      po.id === invoiceData.poNumber 
        ? { 
            ...po, 
            invoice: { 
              status: 'verified', 
              number: invoiceData.invoiceNumber,
              date: invoiceData.invoiceDate,
              dueDate: invoiceData.paymentDueDate,
              amount: invoiceData.invoiceAmount,
              paymentTerms: invoiceData.paymentTerms,
              fileName: invoiceData.file?.name || 'invoice.pdf',
              fileSize: '184 KB',
              verifiedBy: 'Current User',
              notes: invoiceData.notes,
              uploadedAt: new Date().toLocaleString(),
            } 
          } 
        : po
    ));
    alert(`Invoice ${invoiceData.invoiceNumber} uploaded successfully for ${invoiceData.poNumber}!`);
  };

  const ViewInvoiceModal = ({ open, onClose, po, invoice }) => {
    if (!po || !invoice) return null;

    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: '560px',
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
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ fontSize: '1.2rem', color: '#14b8a6' }}>🧾</Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {invoice.number}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#64748b', mt: 0.2 }}>
                {po.id} — {po.supplier}
              </Typography>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>
                ✅ Verified
              </Typography>
              <Chip 
                label="Verified" 
                size="small" 
                sx={{ 
                  backgroundColor: '#10b981', 
                  color: '#fff', 
                  fontSize: '0.65rem',
                  height: '22px',
                }} 
              />
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.2, 
                border: '1px solid #e2e8f0', 
                borderRadius: 2,
                backgroundColor: '#f9fafc',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <Box sx={{ fontSize: '1.2rem' }}>📕</Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e293b' }}>
                  {invoice.fileName}
                </Typography>
                <Typography sx={{ fontSize: '0.6rem', color: '#64748b', mt: 0.2 }}>
                  {invoice.fileSize} · Upload original for download
                </Typography>
              </Box>
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                border: '1px solid #e2e8f0', 
                borderRadius: 2,
                backgroundColor: '#f9fafc'
              }}
            >
              <Box sx={{ mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  {invoice.number}
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748b', mt: 0.2 }}>
                  Invoice Date: {invoice.date}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>PO Reference</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#14b8a6' }}>
                    {po.id}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>Supplier</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#1e293b' }}>
                    {po.supplier}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>Payment Terms</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#1e293b' }}>
                    {invoice.paymentTerms}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>Due Date</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#1e293b' }}>
                    {invoice.dueDate}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>Invoice Amount</Typography>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1e293b' }}>
                    ${invoice.amount?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                border: '1px solid #e2e8f0', 
                borderRadius: 2,
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1e293b' }}>
                  Grand Total
                </Typography>
                <Typography sx={{ fontSize: '0.6rem', color: '#64748b', mt: 0.2 }}>
                  PO Total: ${po.total?.toLocaleString()} · ✓ Matches PO
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#2563eb' }}>
                ${invoice.amount?.toLocaleString()}
              </Typography>
            </Paper>

            {invoice.notes && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1.2, 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 2,
                  backgroundColor: '#f8fafc'
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', mb: 0.5 }}>
                  Notes:
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#1e293b' }}>
                  {invoice.notes}
                </Typography>
              </Paper>
            )}

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              px: 0.5,
              pt: 0.5
            }}>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748b' }}>
                Uploaded by: <strong style={{ color: '#1e293b' }}>{invoice.verifiedBy}</strong>
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: '#64748b' }}>
                {invoice.uploadedAt}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          gap: 1, 
          borderTop: '1px solid #e2e8f0',
        }}>
          <Button 
            onClick={onClose}
            sx={{
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5,
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            Close
          </Button>
          <Button 
            variant="outlined"
            sx={{
              color: '#ef4444',
              borderColor: '#ef4444',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              py: 0.5,
              px: 2,
              '&:hover': {
                backgroundColor: '#fef2f2',
                borderColor: '#ef4444',
              },
            }}
          >
            🚩 Mark Disputed
          </Button>
          <Button 
            variant="contained"
            sx={{
              backgroundColor: '#2563eb',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.75rem',
              py: 0.5,
              px: 2,
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            }}
          >
            ✏️ Edit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ width: '100%', px: 0, overflow: 'hidden' }}>
      {/* Page Header with Title and Button on Right */}
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
            variant="h3" 
            sx={{ 
              fontWeight: 600, 
              color: '#1a1a2e', 
              mb: 0.5,
              fontSize: { xs: '20px', sm: '22px', md: '24px' }
            }}
          >
            Purchase Orders
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#6c757d',
              fontSize: { xs: '12px', sm: '13px', md: '14px' }
            }}
          >
            {stats.totalPOs} POs · {stats.pendingApproval} pending approval · {stats.invoicesAttached} invoices attached
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleNewPO}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            background: "#2563eb",
            fontSize: { xs: '12px', sm: '13px', md: '14px' },
            fontWeight: 500,
            padding: { xs: '6px 16px', sm: '7px 20px', md: '8px 24px' },
          }}
        >
          New PO
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {statCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: '#ffffff',
              borderLeft: `4px solid ${card.color}`,
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: card.color, mt: 0.5 }}>
                    {card.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#64748b', mt: 0.5 }}>
                    {card.subtitle}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.7 }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Invoice Summary */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1.5, 
        mb: { xs: 2, sm: 3 },
        flexWrap: 'wrap',
      }}>
        <Paper sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px', 
          p: { xs: '6px 12px', sm: '8px 13px' },
          boxShadow: 'none'
        }}>
          <Typography sx={{ fontSize: '16px' }}>🧾</Typography>
          <Typography sx={{ color: '#64748b', fontSize: { xs: '11px', sm: '12px' } }}>
            Invoices attached:
          </Typography>
          <Typography sx={{ color: '#14b8a6', fontWeight: 600, fontSize: { xs: '11px', sm: '12px' } }}>
            {stats.invoicesAttached} / {stats.totalPOs}
          </Typography>
        </Paper>
      </Box>

      {/* Purchase Orders Table */}
      <Card sx={{ 
        width: '100%',
        borderRadius: { xs: 1, sm: 2 },
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        mt: { xs: 2, sm: 3 },
        border: '1px solid #e2e8f0'
      }}>
        <CardContent sx={{ 
          p: { xs: 1, sm: 2, md: 3 },
          '&:last-child': { pb: { xs: 2, sm: 3 } },
        }}>
          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer>
              <Table size="small" sx={{
                '& .MuiTableCell-root': {
                  padding: { xs: '6px 8px', sm: '8px 10px', md: '8px 10px' },
                }
              }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>PO Number</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Quot. Ref</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Supplier</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Location</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Lines</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Total</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Created By</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Date</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Delivery</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Priority</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Status</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Invoice</TableCell>
                    <TableCell sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', py: '10px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id} hover sx={{ '&:hover': { backgroundColor: '#fafbfc' } }}>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ color: '#14b8a6', fontWeight: 600, fontSize: '12px' }}>
                          {po.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>
                          {po.quotRef}
                        </Typography>
                        <Typography sx={{ fontSize: '10px', color: '#64748b' }}>
                          Quot. Ref
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>
                          {po.supplier}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Chip 
                          label={po.location} 
                          size="small" 
                          sx={{ 
                            backgroundColor: '#ede9fe', 
                            color: '#8b5cf6', 
                            fontSize: '10px', 
                            fontWeight: 500,
                            height: '22px'
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ fontSize: '12px' }}>
                          {po.lines}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '12px' }}>
                          ${po.total.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ fontSize: '12px' }}>
                          {po.createdBy}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {po.date}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Typography sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {po.delivery}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Chip 
                          label={po.priority} 
                          size="small" 
                          sx={{ 
                            backgroundColor: po.priority === 'Urgent' ? '#fef3c7' : '#eff6ff',
                            color: getPriorityColor(po.priority),
                            fontSize: '10px', 
                            fontWeight: 500,
                            height: '22px'
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Chip 
                          label={po.status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: po.status === 'Approved' ? '#e0f2fe' : 
                                          po.status === 'Pending' ? '#fef3c7' :
                                          po.status === 'Received' ? '#dcfce7' : '#f3f4f6',
                            color: getStatusColor(po.status),
                            fontSize: '10px', 
                            fontWeight: 500,
                            height: '22px'
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        {po.invoice.status === 'none' ? (
                          <Chip 
                            label="No Invoice" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#f3f4f6', 
                              color: '#64748b', 
                              fontSize: '10px',
                              height: '22px'
                            }} 
                          />
                        ) : (
                          <Box>
                            <Chip 
                              label="✓ Verified" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#dcfce7', 
                                color: '#10b981', 
                                fontSize: '10px',
                                height: '22px'
                              }} 
                            />
                            <Typography sx={{ fontSize: '10px', color: '#64748b', mt: 0.5 }}>
                              {po.invoice.number}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ py: '8px' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          {po.status === 'Pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleApprove(po.id)}
                                  sx={{ color: '#10b981', padding: '2px' }}
                                >
                                  <CheckIcon sx={{ fontSize: '16px' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleReject(po.id)}
                                  sx={{ color: '#ef4444', padding: '2px' }}
                                >
                                  <CloseIcon sx={{ fontSize: '16px' }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {po.status === 'Approved' && (
                            <Tooltip title="Create GRN">
                              <IconButton 
                                size="small" 
                                onClick={() => handleCreateGRN(po)}
                                sx={{ color: '#14b8a6', padding: '2px' }}
                              >
                                <InventoryIcon sx={{ fontSize: '16px' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {po.invoice.status === 'none' ? (
                            <Tooltip title="Upload Invoice">
                              <IconButton 
                                size="small" 
                                onClick={() => handleUploadInvoice(po)}
                                sx={{ color: '#14b8a6', padding: '2px' }}
                              >
                                <ReceiptIcon sx={{ fontSize: '16px' }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="View Invoice">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewInvoice(po)}
                                sx={{ color: '#14b8a6', padding: '2px' }}
                              >
                                <ReceiptIcon sx={{ fontSize: '16px' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="View PO">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewPO(po)}
                              sx={{ color: '#64748b', padding: '2px' }}
                            >
                              <VisibilityIcon sx={{ fontSize: '16px' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>

      {/* New PO Modal */}
      <NewPO
        open={newPOModalOpen}
        onClose={() => setNewPOModalOpen(false)}
        onSave={handleSavePO}
        onSaveAsDraft={handleSavePO}
      />

      {/* Upload Invoice Modal */}
      <UploadInvoice
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        poData={selectedPO}
      />

      {/* View Invoice Modal */}
      <ViewInvoiceModal
        open={viewInvoiceModalOpen}
        onClose={() => setViewInvoiceModalOpen(false)}
        po={selectedPO}
        invoice={selectedInvoice}
      />
         <NewGRNDialog
        open={newGRNModalOpen}
        onClose={() => {
          setNewGRNModalOpen(false);
          setSelectedGRNPO(null);
        }}
        onSave={(grnData) => {
          console.log('GRN saved:', grnData);
          setNewGRNModalOpen(false);
          setSelectedGRNPO(null);
        }}
        nextId="GRN-2026-0006"
        linkedPO={selectedGRNPO?.id}
      />      
    </Box>
  );
};

export default PurchaseOrders;