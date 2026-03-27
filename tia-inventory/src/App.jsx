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
      "/":                  "Login",
      "/admin/dashboard":   "Admin Dashboard",
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
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
                  {/* <Dashboard /> goes here */}
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Add more protected routes the same way:
          <Route
            path="/admin/inventory"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <InventoryPage />
                </DashboardLayout>
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;