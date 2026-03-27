import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";

const isAuthenticated = () => {
  return sessionStorage.getItem("role") === "admin";
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pathToTitle = {
      "/": "Login",
      "/admin/dashboard": "Admin Dashboard",
    };

    document.title = pathToTitle[location.pathname] || "App";
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <TitleUpdater />

      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
