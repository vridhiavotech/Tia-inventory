import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";

// ── Chart Data ────────────────────────────────────────────────────────────────
const MONTHLY_SPEND = [
  { month: "Sep", value: 48500 },
  { month: "Oct", value: 51200 },
  { month: "Nov", value: 63800 },
  { month: "Dec", value: 56400 },
  { month: "Jan", value: 54200 },
  { month: "Feb", value: 60100 },
  { month: "Mar", value: 68700 },
];

const STOCK_BY_LOCATION = [
  { loc: "CS-01",  value: 2850 },
  { loc: "ICU-01", value: 320  },
  { loc: "ED-01",  value: 180  },
  { loc: "PH-01",  value: 1100 },
  { loc: "OR-01",  value: 950  },
  { loc: "LAB-01", value: 640  },
];

const ISSUE_BY_DEPT = [
  { dept: "CS-01",  value: 1 },
  { dept: "ICU-01", value: 1 },
  { dept: "ED-01",  value: 5 },
  { dept: "PH-01",  value: 1 },
  { dept: "OR-01",  value: 1 },
  { dept: "LAB-01", value: 0 },
];

const PO_STATUS = [
  { name: "Draft",    value: 14, color: "#2563EB" },
  { name: "Pending",  value: 31, color: "#F59E0B" },
  { name: "Approved", value: 22, color: "#0EA5E9" },
  { name: "Received", value: 18, color: "#16A34A" },
];

// ── Stat Cards config ─────────────────────────────────────────────────────────
const statCards = [
  {
    label:  "Inventory Turnover",
    value:  "8.4×",
    sub:    "vs 7.2× prior year",
    iconBg: "#10b981",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    label:  "Fill Rate",
    value:  "97.8%",
    sub:    "↑ 0.4% vs last month",
    iconBg: "#2563eb",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label:  "Waste / Shrinkage",
    value:  "$4,820",
    sub:    "↑ $620 due to expiries",
    iconBg: "#ef4444",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 17 9 11 13 15 21 7"/>
        <polyline points="15 7 21 7 21 13"/>
      </svg>
    ),
  },
  {
    label:  "Stockout Events",
    value:  "3",
    sub:    "↑ 1 vs last month",
    iconBg: "#f59e0b",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
];

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children }) {
  return (
    <Paper elevation={0} sx={{
      border: "1px solid #f0f0f0", borderRadius: "14px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", bgcolor: "#fff",
    }}>
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: "28px", py: "14px", borderBottom: "1px solid #f3f4f6", background: "#fafafa",
      }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#111827", letterSpacing: "0.05em" }}>{title}</Typography>
          {subtitle && <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: 0.2 }}>{subtitle}</Typography>}
        </Box>
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "$", suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", px: 1.5, py: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#6b7280", mb: 0.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
        {prefix}{typeof payload[0].value === "number" && prefix === "$" ? payload[0].value.toLocaleString() : payload[0].value}{suffix}
      </Typography>
    </Box>
  );
}

// ── CSV helpers ───────────────────────────────────────────────────────────────
function downloadCSV(filename, headers, rows) {
  const content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  a.download = filename;
  a.click();
}

function exportInventoryCSV() { downloadCSV("inventory-report.csv", ["Location","Stock Value ($)"], STOCK_BY_LOCATION.map((r) => [r.loc, r.value])); }
function exportPOCSV()        { downloadCSV("po-status-report.csv", ["Status","Count"],             PO_STATUS.map((r) => [r.name, r.value])); }

function exportFullReport() {
  const sections = [
    "=== MONTHLY SPEND TREND ===", ["Month","Spend ($)"].join(","), ...MONTHLY_SPEND.map((r) => [r.month, r.value].join(",")), "",
    "=== STOCK VALUE BY LOCATION ===", ["Location","Value ($)"].join(","), ...STOCK_BY_LOCATION.map((r) => [r.loc, r.value].join(",")), "",
    "=== ISSUE VOLUME BY DEPARTMENT ===", ["Department","Issues"].join(","), ...ISSUE_BY_DEPT.map((r) => [r.dept, r.value].join(",")), "",
    "=== PO STATUS BREAKDOWN ===", ["Status","Count"].join(","), ...PO_STATUS.map((r) => [r.name, r.value].join(",")),
  ].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([sections], { type: "text/csv" }));
  a.download = "full-report-fy2026.csv";
  a.click();
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Reports() {
  return (
    <Box sx={{ background: "#f8f9fb", minHeight: "100vh", p: "28px 32px", boxSizing: "border-box" }}>

      {/* Title row */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "20px" }}>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
            Reports &amp; Analytics
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: "4px" }}>
            FY 2026 inventory performance
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button startIcon={<FileDownload sx={{ fontSize: 16 }} />} variant="outlined" onClick={exportInventoryCSV}
            sx={{ border: "1px solid #e5e7eb", color: "#374151", textTransform: "none", fontWeight: 400, fontSize: 13, borderRadius: "8px", height: 36, px: 2, bgcolor: "#fff", "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" } }}>
            Inventory CSV
          </Button>
          <Button startIcon={<FileDownload sx={{ fontSize: 16 }} />} variant="outlined" onClick={exportPOCSV}
            sx={{ border: "1px solid #e5e7eb", color: "#374151", textTransform: "none", fontWeight: 400, fontSize: 13, borderRadius: "8px", height: 36, px: 2, bgcolor: "#fff", "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" } }}>
            PO CSV
          </Button>
          <Button startIcon={<FileDownload sx={{ fontSize: 16 }} />} variant="contained" onClick={exportFullReport}
            sx={{ background: "#2563eb", color: "#fff", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "8px", height: 36, px: "18px", boxShadow: "0 2px 8px rgba(37,99,235,0.25)", "&:hover": { background: "#1d4ed8" } }}>
            Full Report
          </Button>
        </Stack>
      </Box>

      {/* Stat Cards — GRN icon style */}
      <Box sx={{ display: "flex", gap: "12px", mb: "20px" }}>
        {statCards.map((s) => (
          <Box
            key={s.label}
            sx={{
              flex: 1, bgcolor: "#fff", border: "1px solid #e5e7eb",
              borderRadius: "10px", px: 2, py: 1.5, minWidth: 0,
              display: "flex", alignItems: "center", gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 44, height: 44, borderRadius: "50%", bgcolor: s.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              {s.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 11, fontWeight: 600, color: "#9ca3af",
                  letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5,
                }}
              >
                {s.label}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
               <Typography
  sx={{
    fontSize: typeof s.value === "string" && s.value.length > 8 ? 15 : 22,
    fontWeight: 600,
    color: "#111827",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    flexShrink: 0,
  }}
>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#6b7280", whiteSpace: "normal", wordBreak: "break-word", }}>
                  {s.sub}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Charts Row 1 */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, minWidth: 0 }}>
        <Box sx={{ flex: "0 0 58%", minWidth: 0 }}>
          <SectionCard title="Monthly Spend Trend ($K)" subtitle="Sep 2025 – Mar 2026">
            <Box sx={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_SPEND} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0EA5E9" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40000, 70000]} ticks={[40000, 45000, 50000, 55000, 60000, 65000, 70000]} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={50} />
                  <RTooltip content={<CustomTooltip prefix="$" />} />
                  <Area type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#spendGrad)" dot={{ r: 4, fill: "#0EA5E9", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </Box>
        <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
          <SectionCard title="Stock Value by Location" subtitle="Current on-hand value ($)">
            <Box sx={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={STOCK_BY_LOCATION} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="loc" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 3000]} ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={50} />
                  <RTooltip content={<CustomTooltip prefix="$" />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {STOCK_BY_LOCATION.map((_, i) => (
                      <Cell key={i} fill={["#7C3AED","#0EA5E9","#6B7280","#16A34A","#F87171","#F59E0B"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </Box>
      </Box>

      {/* Charts Row 2 */}
      <Box sx={{ display: "flex", gap: 2, minWidth: 0 }}>
        <Box sx={{ flex: "0 0 58%", minWidth: 0 }}>
          <SectionCard title="Issue Volume by Department" subtitle="Total stock issues per department">
            <Box sx={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ISSUE_BY_DEPT} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <RTooltip content={<CustomTooltip prefix="" suffix=" issues" />} />
                  <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </Box>
        <Box sx={{ flex: "1 1 0", minWidth: 0 }}>
          <SectionCard title="PO Status Breakdown" subtitle="Purchase order distribution">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 200 }}>
              <Box sx={{ width: 140, height: 140, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PO_STATUS} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={2}>
                      {PO_STATUS.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={1}>
                {PO_STATUS.map((s) => (
                  <Box key={s.name} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "1px", bgcolor: s.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>{s.name}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </SectionCard>
        </Box>
      </Box>

    </Box>
  );
}