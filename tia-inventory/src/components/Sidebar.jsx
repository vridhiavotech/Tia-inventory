import { useState } from "react";
import { Box, Typography, ButtonBase, Badge, Divider } from "@mui/material";

import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";

const navItems = [
  { icon: <GridViewOutlinedIcon fontSize="small" />,      label: "Dashboard",       badge: null },
  { icon: <PeopleOutlinedIcon fontSize="small" />,        label: "Inventory Items", badge: null },
  { icon: <EditNoteOutlinedIcon fontSize="small" />,      label: "Purchase Orders", badge: null },
  { icon: <InboxOutlinedIcon fontSize="small" />,         label: "Goods Receipt",   badge: null },
  { icon: <CompareArrowsOutlinedIcon fontSize="small" />, label: "Transfers",       badge: null },
  { icon: <FactoryOutlinedIcon fontSize="small" />,       label: "Manufacturing",   badge: null },
  { icon: <AccessTimeOutlinedIcon fontSize="small" />,    label: "Expiry Tracking", badge: null },
  { icon: <TrendingUpOutlinedIcon fontSize="small" />,    label: "Replacement",     badge: 1    },
  { icon: <BarChartOutlinedIcon fontSize="small" />,      label: "Reports",         badge: null },
];

const adminItems = [
  { icon: <EmailOutlinedIcon fontSize="small" />,         label: "Admin Overview" },
  { icon: <GroupOutlinedIcon fontSize="small" />,         label: "Users & Roles"  },
  { icon: <LocationOnOutlinedIcon fontSize="small" />,    label: "Locations"      },
  { icon: <ViewListOutlinedIcon fontSize="small" />,      label: "Categories"     },
  { icon: <LocalShippingOutlinedIcon fontSize="small" />, label: "Suppliers"      },
  { icon: <ArticleOutlinedIcon fontSize="small" />,       label: "Documents"      },
  { icon: <KeyOutlinedIcon fontSize="small" />,           label: "Settings"       },
];

export default function Sidebar() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <Box
      sx={{
        width: 200,
        minWidth: 200,
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, pb: 3 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          T
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
          Tia<span style={{ color: "#6366f1" }}>TELE</span>
        </Typography>
      </Box>

      {/* ── Main Nav ── */}
      {navItems.map((item) => {
        const isActive = activeNav === item.label;
        return (
          <ButtonBase
            key={item.label}
            onClick={() => setActiveNav(item.label)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.2,
              px: 2.5,
              py: 1.1,
              width: "100%",
              bgcolor: isActive ? "#ede9fe" : "transparent",
              outline: "none",                              // ← no focus ring
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none" },
              transition: "background 0.15s",
              "&:hover": {
                bgcolor: isActive ? "#ede9fe" : "#f5f5f5",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                color: isActive ? "#6366f1" : "#999",
                flexShrink: 0,
              }}
            >
              {item.badge ? (
                <Badge
                  badgeContent={item.badge}
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#3b82f6",
                      color: "#fff",
                      fontSize: 10,
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                >
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#6366f1" : "#666",
                lineHeight: 1,
              }}
            >
              {item.label}
            </Typography>
          </ButtonBase>
        );
      })}

      {/* ── Divider ── */}
      <Divider sx={{ mx: 2.5, my: 1.5 }} />

      {/* ── Admin Nav ── */}
      {adminItems.map((item) => (
        <ButtonBase
          key={item.label}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1.2,
            px: 2.5,
            py: 1.1,
            width: "100%",
            outline: "none",                              // ← no focus ring
            "&:focus": { outline: "none" },
            "&:focus-visible": { outline: "none" },
            transition: "color 0.15s, background 0.15s",
            "&:hover": {
              bgcolor: "#f5f5f5",
              "& .admin-icon": { color: "#6366f1" },
              "& .admin-label": { color: "#6366f1" },
            },
          }}
        >
          <Box
            className="admin-icon"
            sx={{ display: "flex", color: "#aaa", flexShrink: 0, transition: "color 0.15s" }}
          >
            {item.icon}
          </Box>
          <Typography
            className="admin-label"
            sx={{ fontSize: 13, fontWeight: 500, color: "#777", lineHeight: 1, transition: "color 0.15s" }}
          >
            {item.label}
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}