import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, ButtonBase, Divider } from "@mui/material";

import {
  DashboardIcon,
  InventoryIcon,
  ShoppingCartIcon,
  PurchaseOrderIcon,
  GoodsReceiptIcon,
  StockIssueIcon,
  TransfersIcon,
  ExpiryTrackingIcon,
  ReplacementIcon,
  ReportsIcon,
  AdminOverviewIcon,
  UsersIcon,
  LocationIcon,
  CategoriesIcon,
  DocumentsIcon,
  SuppliersIcon,
  ManufacturersIcon,
  AuditLogIcon,
  SettingsIcon,
} from "../assets/Icons";

import { LogoIcon } from "../assets/Assets";

const navItems = [
  { icon: <DashboardIcon />,      label: "Dashboard",          path: "/admin/dashboard",        badge: null },
  { icon: <InventoryIcon />,      label: "Inventory Items",    path: "/admin/inventory/items",  badge: null },
  { icon: <ShoppingCartIcon />,   label: "Indent/Procurement", path: "/admin/inventory/indent", badge: null },
  { icon: <PurchaseOrderIcon />,  label: "Purchase Orders",    path: "/admin/purchase-orders",  badge: null },
  { icon: <GoodsReceiptIcon />,   label: "Goods Receipt",      path: "/admin/goods-receipt",    badge: null },
  { icon: <StockIssueIcon />,     label: "Stock Issue",        path: "/admin/stock-issue",      badge: null },
  { icon: <TransfersIcon />,      label: "Transfers",          path: "/admin/transfers",        badge: null },
  { icon: <ExpiryTrackingIcon />, label: "Expiry Tracking",    path: "/admin/expiry-tracking",  badge: null },
  { icon: <ReplacementIcon />,    label: "Replacement",        path: "/admin/replacement",      badge: 1 },
  { icon: <ReportsIcon />,        label: "Reports",            path: "/admin/reports",          badge: null },
];

const adminItems = [
  { icon: <AdminOverviewIcon />, label: "Admin Overview", path: "/admin/overview" },
  { icon: <UsersIcon />,         label: "Users & Roles",  path: "/admin/users" },
  { icon: <LocationIcon />,      label: "Locations",      path: "/admin/locations" },
  { icon: <CategoriesIcon />,    label: "Categories",     path: "/admin/categories" },
  { icon: <DocumentsIcon />,     label: "Documents",      path: "/admin/documents" },
  { icon: <SuppliersIcon />,     label: "Suppliers",      path: "/admin/suppliers" },
  { icon: <ManufacturersIcon />, label: "Manufacturers",  path: "/admin/manufacturers" },
  { icon: <AuditLogIcon />,      label: "Audit Log",      path: "/admin/audit-log" },
  { icon: <SettingsIcon />,      label: "Settings",       path: "/admin/system-settings" },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        width: 220,
        minWidth: 220,
        height: "100vh",
        bgcolor: "#fff",
        borderRight: "1px solid #ececec",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
        py: 2.5,
      }}
    >
      {/* ── Logo ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, pb: 3, flexShrink: 0 }}>
        <LogoIcon />
      </Box>

      {/* ── Scrollable nav area ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "#d1d5db", borderRadius: 4 },
          "&::-webkit-scrollbar-thumb:hover": { background: "#a1a1aa" },
        }}
      >
        {/* ── Main Nav ── */}
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ButtonBase
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1.2,
                px: 2.5,
                py: 1.1,
                width: "100%",
                bgcolor: active ? "#ede9fe" : "transparent",
                outline: "none",
                "&:focus":         { outline: "none" },
                "&:focus-visible": { outline: "none" },
                transition: "background 0.15s",
                "&:hover": {
                  bgcolor: active ? "#ede9fe" : "#f5f5f5",
                  "& .nav-icon":  { color: "#6366f1" },
                  "& .nav-label": { color: "#6366f1" },
                },
              }}
            >
              {/* Icon */}
              <Box
                className="nav-icon"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? "#6366f1" : "#999",
                  flexShrink: 0,
                  transition: "color 0.15s",
                  width: 20,
                  height: 20,
                  "& svg": { width: "100%", height: "100%" },
                }}
              >
                {item.icon}
              </Box>

              {/* Label — takes all remaining space */}
              <Typography
                className="nav-label"
                sx={{
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#6366f1" : "#666",
                  lineHeight: 1,
                  transition: "color 0.15s",
                  textAlign: "left",
                }}
              >
                {item.label}
              </Typography>

              {/* Badge — pinned to the right */}
              {item.badge && (
                <Box
                  sx={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: "9px",
                    bgcolor: "#3b82f6",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: "5px",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </ButtonBase>
          );
        })}

        {/* ── Divider ── */}
        <Divider sx={{ mx: 2.5, my: 1.5 }} />

        {/* ── Admin Nav ── */}
        {adminItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ButtonBase
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1.2,
                px: 2.5,
                py: 1.1,
                width: "100%",
                bgcolor: active ? "#ede9fe" : "transparent",
                outline: "none",
                "&:focus":         { outline: "none" },
                "&:focus-visible": { outline: "none" },
                transition: "color 0.15s, background 0.15s",
                "&:hover": {
                  bgcolor: active ? "#ede9fe" : "#f5f5f5",
                  "& .admin-icon":  { color: "#6366f1" },
                  "& .admin-label": { color: "#6366f1" },
                },
              }}
            >
              {/* Icon */}
              <Box
                className="admin-icon"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? "#6366f1" : "#aaa",
                  flexShrink: 0,
                  transition: "color 0.15s",
                  width: 20,
                  height: 20,
                  "& svg": { width: "100%", height: "100%" },
                }}
              >
                {item.icon}
              </Box>

              {/* Label */}
              <Typography
                className="admin-label"
                sx={{
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#6366f1" : "#777",
                  lineHeight: 1,
                  transition: "color 0.15s",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {item.label}
              </Typography>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}