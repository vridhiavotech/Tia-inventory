import { useState } from "react";
import {
  Box, Typography, InputBase, IconButton, Avatar, Menu, MenuItem, Divider,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleClose();
    // your logout logic here
  };

  return (
    <Box
      sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 3.5, py: 1.5, bgcolor: "#fff", borderBottom: "1px solid #ececec",
        gap: 2, flexShrink: 0,
      }}
    >
      {/* Search */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f9fafb",
        border: "1px solid #e5e7eb", borderRadius: "10px", px: 1.5, py: 0.8, width: 480, flexShrink: 0 }}>
        <SearchOutlinedIcon sx={{ color: "#bbb", fontSize: 16 }} />
        <InputBase placeholder="Search"
          sx={{ fontSize: 13, color: "#555", "& input::placeholder": { color: "#bbb" }, flex: 1 }} />
      </Box>

      {/* Right Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Bell */}
        <IconButton sx={{ bgcolor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px",
          p: 0.9, "&:hover": { bgcolor: "#f3f4f6" } }}>
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 20, color: "#666" }} />
        </IconButton>

        {/* User Pill */}
        <Box onClick={handleOpen}
          sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: open ? "#f3f4f6" : "#f9fafb",
            border: "1px solid #e5e7eb", borderRadius: "10px", px: 1.2, py: 0.7,
            cursor: "pointer", flexShrink: 0, "&:hover": { bgcolor: "#f3f4f6" } }}>
          <Avatar sx={{ width: 28, height: 28, background: "linear-gradient(135deg, #6366f1, #a855f7)",
            fontSize: 11, fontWeight: 700 }}>SA</Avatar>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.3 }}>
              System Admin
            </Typography>
            <Typography sx={{ fontSize: 10, color: "#aaa", lineHeight: 1.3 }}>Administrator</Typography>
          </Box>
          <KeyboardArrowDownOutlinedIcon
            sx={{ fontSize: 16, color: "#aaa", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
        </Box>
         <Menu anchorEl={anchorEl} open={open} onClose={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{ sx: { mt: 1, borderRadius: "10px", border: "1px solid #e5e7eb",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)", minWidth: 150 } }}>
          <MenuItem onClick={handleLogout}
            sx={{ gap: 1.5, py: 1.2, px: 2, fontSize: 13, color: "#dc2626",
              "&:hover": { bgcolor: "#fef2f2" } }}>
            <LogoutIcon sx={{ fontSize: 17, color: "#dc2626" }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}