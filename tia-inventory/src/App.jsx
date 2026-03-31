import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Login from "./pages/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard/dashboard";
import AddItem from "./pages/Dashboard/additem";
import InventoryItems from "./pages/InventoryItems/InventoryItems";

import Replacement from "./pages/Replacement";
import ExpiryTracking from "./pages/ExpiryTracking";
import Transfers from "./pages/Transfers";

import GoodsReceipt from "./pages/GoodsReceipt/GoodsReceipt";

import IndentProcurement from "./pages/IndentProcurement";
import PurchaseOrders from "./pages/PurchaseOrders";
import DocumentManagement from "./pages/DocumentManagement";
import Manufacturers from "./pages/Manufacturers";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import StockIssue from "./pages/Stockissue";
import AdminOverview from "./pages/Admin/Adminoverview";

import Categories from "./pages/Categories";

// ── Theme: removes focus outlines globally ──
const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          "&:focus": { outline: "none" },
          "&:focus-visible": { outline: "none" },
        },
      },
    },
  },
});

// ── Auth check ──
const isAuthenticated = () => sessionStorage.getItem("role") === "admin";

// ── Private route guard ──
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

// ── Updates browser tab title based on route ──
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pathToTitle = {
      "/": "Login",
      "/admin/dashboard": "Admin Dashboard",
      "/admin/indent-procurement": "Indent & Procurement",
      "/admin/purchase-orders": "Purchase Orders",
    };
    document.title = pathToTitle[location.pathname] || "App";
  }, [location.pathname]);

  return null;
};

// ── Layout: Sidebar + Header + scrollable content area ──
const DashboardLayout = ({ children }) => (
  <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    {/* Sidebar — fixed on left */}
    <Sidebar />

    {/* Right column */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header — locked at top */}
      <Header />

      {/* Scrollable content */}
      <Box sx={{ flex: 1, bgcolor: "#f5f6fa", overflowY: "auto", p: 3.5 }}>
        {children}
      </Box>
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <TitleUpdater />

        <Routes>
          {/* Public route — no sidebar/header */}
          <Route path="/" element={<Login />} />

          {/* Protected routes — wrapped in DashboardLayout */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/goods-receipt"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <GoodsReceipt />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/inventory/add"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AddItem />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/inventory/items"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <InventoryItems />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/replacement"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Replacement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/inventory/indent"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <IndentProcurement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/purchase-orders"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <PurchaseOrders />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/expiry-tracking"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ExpiryTracking />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/transfers"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Transfers />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/documents"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <DocumentManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <ReportsAnalytics />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stock-issue"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <StockIssue />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/overview"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AdminOverview />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/manufacturers"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Manufacturers />
                  </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Categories />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
