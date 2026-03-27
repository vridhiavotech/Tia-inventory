import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin" && password === "admin123") {
      sessionStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f2f4f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "900px",
          height: "520px",
          display: "flex",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* LEFT IMAGE */}
        <Box sx={{ width: "50%", position: "relative" }}>
          <img
            src="/images/o4qQd.jpg"   
            alt="doctor"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,123,255,0.2), rgba(0,123,255,0.6))",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: 30,
              left: 30,
              color: "#fff",
            }}
          >
            
          </Box>
        </Box>

        {/* RIGHT FORM */}
        <Box
          sx={{
            width: "50%",
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* LOGO */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 55,
                  height: 55,
                  borderRadius: "14px",
                  background: "linear-gradient(145deg, #26c6da, #00acc1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: "1.6rem", color: "#fff" }}>
                  🏥
                </Typography>
              </Box>

              {/* Text */}
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  sx={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "#0d47a1",
                  }}
                >
                  Tia-<span style={{ color: "#29b6f6" }}>Asset</span>
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#555",
                  }}
                >
                  Multi-Location Asset & Inventory Management
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* TITLE */}
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              mb: 1,
              color: "#555",
            }}
          >
            Welcome Back
          </Typography>

          

          {/* ERROR */}
          {error && (
            <Typography
              sx={{
                color: "red",
                textAlign: "center",
                fontSize: "0.8rem",
                mb: 2,
              }}
            >
              Invalid credentials
            </Typography>
          )}

          {/* FORM */}
          <form onSubmit={handleLogin}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Email"
                placeholder="Enter your email"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 1 }}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                borderRadius: "25px",
                py: 1,
                background: "linear-gradient(90deg,#42a5f5,#1e88e5)",
                textTransform: "none",
                fontWeight: 600,
                top : 20,
              }}
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
