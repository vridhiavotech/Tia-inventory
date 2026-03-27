import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export default function Header({ pageTitle = "Inventory Dashboard" }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3.5,
        py: 1.5,
        bgcolor: "#fff",
        borderBottom: "1px solid #ececec",
        gap: 2,
        flexShrink: 0, // ← prevents header from shrinking
      }}
    >
      {/* ── Page Title (left) ── */}
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 700,
          color: "#6366f1",
          whiteSpace: "nowrap",
        }}
      >
        {pageTitle}
      </Typography>

      {/* ── Right Controls ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: "auto" }}>

        {/* Search — fixed width, not stretching */}
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
            width: 220,        // ← fixed width
            flexShrink: 0,     // ← never stretches
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

        {/* Add Item Button */}
        <Button
          startIcon={<AddOutlinedIcon />}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            px: 2,
            py: 1,
            boxShadow: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              boxShadow: "none",
            },
          }}
        >
          Add Item
        </Button>
      </Box>
    </Box>
  );
}