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
      {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f9fafb",
        border: "1px solid #F0F0F0", borderRadius: "10px", px: 1.5, py: 0.8, width: 480, flexShrink: 0 }}>
        <SearchOutlinedIcon sx={{ color: "#bbb", fontSize: 16 }} />
        <InputBase placeholder="Search"
          sx={{ fontSize: 13, color: "#7F7F7F", "& input::placeholder": { color: "#F2F2F7" }, flex: 1 }} />
      </Box> */}
      <Box sx={{ 
  display: "flex", 
  alignItems: "center", 
  gap: 1, 
  bgcolor: "#f5f6fa",  // Changed from #f9fafb to a slightly darker gray
  border: "1px solid #D0D0D0",  // Slightly darker border
  borderRadius: "10px", 
  px: 1.5, 
  py: 0.8, 
  width: 480, 
  flexShrink: 0 
}}>
  <SearchOutlinedIcon sx={{ color: "#888", fontSize: 16 }} />  {/* Slightly darker icon */}
  <InputBase 
    placeholder="Search"  // Changed from "Search" to "search"
    sx={{ 
      fontSize: 13, 
      color: "#333",  // Darker text color
      "& input::placeholder": { 
        color: "#999",  // Darker placeholder color
        opacity: 0.8
      }, 
      flex: 1 
    }} 
  />
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
        
      </Box>
    </Box>
  );
}