import { useState } from "react";
import {
  Box, Typography, Button, Chip, Stack, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Grid,
} from "@mui/material";
import {
  FileDownload, TrendingUp, TrendingDown,
} from "@mui/icons-material";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";

// ── Design tokens (same as StockIssue) ────────────────────────────────────────
const C = {
  bg:            "#F5F6FA",
  surface:       "#FFFFFF",
  primary:       "#1976D2",
  primaryDark:   "#1256A0",
  border:        "#E5E7EB",
  textPrimary:   "#111827",
  textSecondary: "#6B7280",
};

// ── Chart Data ────────────────────────────────────────────────────────────────
const MONTHLY_SPEND = [
  { month:"Sep", value:48500 }, { month:"Oct", value:51200 },
  { month:"Nov", value:63800 }, { month:"Dec", value:56400 },
  { month:"Jan", value:54200 }, { month:"Feb", value:60100 },
  { month:"Mar", value:68700 },
];

const STOCK_BY_LOCATION = [
  { loc:"CS-01", value:2850 }, { loc:"ICU-01", value:320 },
  { loc:"ED-01", value:180 }, { loc:"PH-01", value:1100 },
  { loc:"OR-01", value:950 }, { loc:"LAB-01", value:640 },
];

const ISSUE_BY_DEPT = [
  { dept:"CS-01", value:1 }, { dept:"ICU-01", value:1 },
  { dept:"ED-01", value:5 }, { dept:"PH-01", value:1 },
  { dept:"OR-01", value:1 }, { dept:"LAB-01", value:0 },
];

const PO_STATUS = [
  { name:"Draft",    value:14, color:"#2563EB" },
  { name:"Pending",  value:31, color:"#F59E0B" },
  { name:"Approved", value:22, color:"#0EA5E9" },
  { name:"Received", value:18, color:"#16A34A" },
];

const TOP_ITEMS = [
  { name:"Paracetamol 500mg", category:"Medicine",   issued:142, value:284.00,  turnover:"9.2x" },
  { name:"Surgical Gloves L", category:"Consumable", issued:98,  value:196.00,  turnover:"7.8x" },
  { name:"IV Cannula 20G",    category:"Consumable", issued:87,  value:348.00,  turnover:"6.5x" },
  { name:"Amoxicillin 250mg", category:"Medicine",   issued:74,  value:222.00,  turnover:"8.1x" },
  { name:"Surgical Mask",     category:"PPE",        issued:210, value:105.00,  turnover:"11.4x"},
];

// ── Stat Card (identical structure to StockIssue StatCard) ────────────────────
function StatCard({ label, value, sub, color, trend }) {
  return (
    <Box sx={{
      flex:1, bgcolor:"#fff",
      border:`1px solid ${C.border}`,
      borderLeft:`3px solid ${color}`,
      borderRadius:"8px",
      px:2, py:1.5, minWidth:0,
    }}>
      <Typography sx={{ fontSize:10, fontWeight:700, color:C.textSecondary, letterSpacing:0.7, textTransform:"uppercase", mb:0.4 }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: typeof value === "string" && value.length > 8 ? 15 : 22,
        fontWeight:800, color:C.textPrimary, lineHeight:1.2,
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
      }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize:11, fontWeight:600, color, mt:0.3, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:0.3 }}>
          {trend === "up"   && <TrendingUp   sx={{ fontSize:12 }} />}
          {trend === "down" && <TrendingDown sx={{ fontSize:12 }} />}
          {sub}
        </Typography>
      )}
    </Box>
  );
}

// ── Category Chip ─────────────────────────────────────────────────────────────
function CatChip({ cat }) {
  const map = {
    Medicine:   { bg:"#EFF6FF", color:"#1D4ED8", border:"#BFDBFE" },
    Consumable: { bg:"#F0FDF4", color:"#15803D", border:"#BBF7D0" },
    PPE:        { bg:"#FFF7ED", color:"#C2410C", border:"#FED7AA" },
  };
  const c = map[cat] || { bg:"#F9FAFB", color:"#374151", border:"#E5E7EB" };
  return (
    <Chip label={cat} size="small" sx={{
      bgcolor:c.bg, color:c.color, border:`1px solid ${c.border}`,
      fontWeight:600, fontSize:11, height:22,
    }} />
  );
}

// ── Section Card wrapper ──────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children, action }) {
  return (
    <Paper elevation={0} sx={{
      border:`1px solid ${C.border}`, borderRadius:"10px",
      overflow:"hidden", bgcolor:"#fff",
    }}>
      <Box sx={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        px:2.5, py:1.6, borderBottom:`1px solid ${C.border}`, bgcolor:"#F9FAFB",
      }}>
        <Box>
          <Typography sx={{ fontWeight:700, fontSize:13, color:C.textPrimary }}>{title}</Typography>
          {subtitle && <Typography sx={{ fontSize:11, color:C.textSecondary, mt:0.2 }}>{subtitle}</Typography>}
        </Box>
        {action}
      </Box>
      <Box sx={{ p:2.5 }}>{children}</Box>
    </Paper>
  );
}

// ── Custom tooltip for charts ─────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix="$", suffix="" }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{
      bgcolor:"#fff", border:`1px solid ${C.border}`, borderRadius:"8px",
      px:1.5, py:1, boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
    }}>
      <Typography sx={{ fontSize:11, fontWeight:700, color:C.textSecondary, mb:0.3 }}>{label}</Typography>
      <Typography sx={{ fontSize:13, fontWeight:800, color:C.textPrimary }}>
        {prefix}{typeof payload[0].value === "number" && prefix==="$"
          ? payload[0].value.toLocaleString()
          : payload[0].value}{suffix}
      </Typography>
    </Box>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Reports() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Inventory", "Procurement", "Issues"];

  return (
    <Box sx={{ bgcolor:C.bg, minHeight:"100vh" }}>
      <Box sx={{ p:"24px 28px" }}>

        {/* ── Title row ── */}
        <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", mb:2.5 }}>
          <Box>
            <Typography sx={{ fontWeight:800, fontSize:22, color:C.textPrimary, letterSpacing:-0.3 }}>
              Reports &amp; Analytics
            </Typography>
            <Typography sx={{ fontSize:13, color:C.textSecondary, mt:0.3 }}>
              FY 2026 inventory performance
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            {["Inventory CSV","PO CSV","Full Report"].map((label, i) => (
              <Button key={label}
                startIcon={<FileDownload sx={{ fontSize:15 }} />}
                variant={i === 2 ? "contained" : "outlined"}
                sx={i === 2 ? {
                  bgcolor:C.primary, textTransform:"none", fontWeight:700, fontSize:13,
                  borderRadius:"8px", height:36, px:2.5,
                  boxShadow:"0 1px 4px rgba(25,118,210,0.35)",
                  "&:hover":{ bgcolor:C.primaryDark },
                } : {
                  border:`1px solid ${C.border}`, color:C.textSecondary, textTransform:"none",
                  fontWeight:600, fontSize:13, borderRadius:"8px", height:36, px:2, bgcolor:"#fff",
                  "&:hover":{ borderColor:"#9CA3AF", bgcolor:"#F9FAFB" },
                }}>
                {label}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* ── Tabs ── */}
        <Stack direction="row" spacing={0.5} sx={{ mb:2.5 }}>
          {tabs.map(t => (
            <Button key={t} onClick={() => setActiveTab(t)}
              sx={{
                textTransform:"none", fontWeight:600, fontSize:13,
                borderRadius:"8px", height:34, px:2,
                bgcolor: activeTab===t ? "#EFF6FF" : "transparent",
                color:   activeTab===t ? C.primary  : C.textSecondary,
                border:  activeTab===t ? `1px solid #BFDBFE` : "1px solid transparent",
                "&:hover":{ bgcolor:"#F3F4F6" },
              }}>
              {t}
            </Button>
          ))}
        </Stack>

        {/* ── KPI Stat Cards ── */}
        <Stack direction="row" spacing={1.5} sx={{ mb:2.5 }}>
          <StatCard label="Inventory Turnover"  value="8.4×"    sub="vs 7.2× prior year"      color="#7C3AED" trend="up"   />
          <StatCard label="Fill Rate"           value="97.8%"   sub="↑ 0.4% vs last month"   color="#2563EB" trend="up"   />
          <StatCard label="Waste / Shrinkage"   value="$4,820"  sub="↑ $620 due to expiries"  color="#DC2626" trend="down" />
          <StatCard label="Stockout Events"     value="3"       sub="↑ 1 vs last month"       color="#D97706" trend="down" />
        </Stack>

        {/* ── Charts Row 1 ── */}
        <Grid container spacing={2} sx={{ mb:2 }}>
          {/* Monthly Spend Trend */}
          <Grid item xs={12} md={7}>
            <SectionCard title="Monthly Spend Trend ($K)" subtitle="Sep 2025 – Mar 2026">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY_SPEND} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0EA5E9" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:C.textSecondary }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} tick={{ fontSize:10, fill:C.textSecondary }} axisLine={false} tickLine={false} />
                  <RTooltip content={<CustomTooltip prefix="$" />} />
                  <Area type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#spendGrad)" dot={{ r:4, fill:"#0EA5E9", strokeWidth:0 }} activeDot={{ r:5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>
          </Grid>

          {/* Stock Value by Location */}
          <Grid item xs={12} md={5}>
            <SectionCard title="Stock Value by Location" subtitle="Current on-hand value ($)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={STOCK_BY_LOCATION} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="loc" tick={{ fontSize:11, fill:C.textSecondary }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v=>`$${(v/1000).toFixed(1)}K`} tick={{ fontSize:10, fill:C.textSecondary }} axisLine={false} tickLine={false} />
                  <RTooltip content={<CustomTooltip prefix="$" />} />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {STOCK_BY_LOCATION.map((_, i) => (
                      <Cell key={i} fill={["#7C3AED","#0EA5E9","#6B7280","#16A34A","#F87171","#F59E0B"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </Grid>
        </Grid>

        {/* ── Charts Row 2 ── */}
        <Grid container spacing={2} sx={{ mb:2 }}>
          {/* Issue Volume by Dept */}
          <Grid item xs={12} md={7}>
            <SectionCard title="Issue Volume by Department" subtitle="Total stock issues per department">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ISSUE_BY_DEPT} margin={{ top:4, right:4, left:-10, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="dept" tick={{ fontSize:11, fill:C.textSecondary }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize:10, fill:C.textSecondary }} axisLine={false} tickLine={false} />
                  <RTooltip content={<CustomTooltip prefix="" suffix=" issues" />} />
                  <Bar dataKey="value" fill="#F59E0B" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </Grid>

          {/* PO Status Breakdown */}
          <Grid item xs={12} md={5}>
            <SectionCard title="PO Status Breakdown" subtitle="Purchase order distribution">
              <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={PO_STATUS} cx="50%" cy="50%" innerRadius={44} outerRadius={68}
                      dataKey="value" paddingAngle={3}>
                      {PO_STATUS.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Stack spacing={1}>
                  {PO_STATUS.map(s => (
                    <Box key={s.name} sx={{ display:"flex", alignItems:"center", gap:1 }}>
                      <Box sx={{ width:10, height:10, borderRadius:"2px", bgcolor:s.color, flexShrink:0 }} />
                      <Typography sx={{ fontSize:12, color:C.textSecondary, fontWeight:500 }}>{s.name}</Typography>
                      <Typography sx={{ fontSize:12, fontWeight:700, color:C.textPrimary, ml:"auto", pl:2 }}>{s.value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </SectionCard>
          </Grid>
        </Grid>

        {/* ── Top Moving Items Table ── */}
        <SectionCard
          title="Top Moving Items"
          subtitle="Highest issue volume this period"
          action={
            <Chip label="FY 2026" size="small" sx={{
              bgcolor:"#EFF6FF", color:"#1D4ED8", border:"1px solid #BFDBFE",
              fontWeight:700, fontSize:11, height:22,
            }} />
          }
        >
          <TableContainer sx={{ mx:-1 }}>
            <Table size="small" sx={{ tableLayout:"fixed", minWidth:600 }}>
              <TableHead>
                <TableRow sx={{ bgcolor:"#F9FAFB" }}>
                  {["ITEM NAME","CATEGORY","ISSUES QTY","TOTAL VALUE","TURNOVER RATE"].map(h => (
                    <TableCell key={h} sx={{
                      fontWeight:700, fontSize:11, color:C.textSecondary,
                      letterSpacing:0.5, py:1.2, px:1.5,
                      borderBottom:`1px solid ${C.border}`,
                      textTransform:"uppercase",
                    }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {TOP_ITEMS.map((row, idx) => (
                  <TableRow key={row.name} sx={{
                    bgcolor: idx%2===0 ? "#fff" : "#FAFAFA",
                    "&:hover":{ bgcolor:"#EFF6FF" },
                    transition:"background 0.15s",
                  }}>
                    <TableCell sx={{ px:1.5, py:1.1 }}>
                      <Typography sx={{ fontWeight:700, color:"#1D4ED8", fontSize:12 }}>{row.name}</Typography>
                    </TableCell>
                    <TableCell sx={{ px:1.5, py:1.1 }}><CatChip cat={row.category} /></TableCell>
                    <TableCell sx={{ px:1.5, py:1.1 }}>
                      <Typography sx={{ fontSize:12, color:C.textSecondary }}>{row.issued}</Typography>
                    </TableCell>
                    <TableCell sx={{ px:1.5, py:1.1 }}>
                      <Typography sx={{ fontWeight:700, color:C.textPrimary, fontSize:12 }}>
                        ${row.value.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px:1.5, py:1.1 }}>
                      <Chip label={row.turnover} size="small" sx={{
                        bgcolor:"#F0FDF4", color:"#16A34A", border:"1px solid #BBF7D0",
                        fontWeight:700, fontSize:11, height:22,
                      }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>

      </Box>
    </Box>
  );
}