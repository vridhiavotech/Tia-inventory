import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Avatar,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

export default function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // ← CHANGE 1: flex-end → space-between
        px: 3.5,
        py: 1.5,
        bgcolor: "#fff",
        borderBottom: "1px solid #ececec",
        gap: 2,
        flexShrink: 0,
      }}
    >
      {/* CHANGE 2: Search bar moved here (left side) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          px: 1.5,
          py: 0.8,
          width: 220,
          flexShrink: 0,
        }}
      >
        <SearchOutlinedIcon sx={{ color: "#bbb", fontSize: 16 }} />
        <InputBase
          placeholder="Search"
          sx={{
            fontSize: 13,
            color: "#555",
            "& input::placeholder": { color: "#bbb" },
            flex: 1,
          }}
        />
      </Box>

      {/* Right Controls (Bell + User Profile) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Bell */}
        <IconButton
          sx={{
            bgcolor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            p: 0.9,
            "&:hover": { bgcolor: "#f3f4f6" },
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 20, color: "#666" }} />
        </IconButton>

        {/* User Pill */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            px: 1.2,
            py: 0.7,
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { bgcolor: "#f3f4f6" },
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            SA
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.3 }}>
              System Admin
            </Typography>
            <Typography sx={{ fontSize: 10, color: "#aaa", lineHeight: 1.3 }}>
              Administrator
            </Typography>
          </Box>
          <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 16, color: "#aaa" }} />
        </Box>
      </Box>
    </Box>
  );
}