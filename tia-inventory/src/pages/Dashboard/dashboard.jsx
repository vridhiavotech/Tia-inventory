import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AddIcon from "@mui/icons-material/Add";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const stockStatusData = [
  { name: "In Stock", value: 68, color: "#22c55e" },
  { name: "Low Stock", value: 22, color: "#f97316" },
  { name: "Out of Stock", value: 10, color: "#ef4444" },
];

const stockByLocation = [
  { location: "Central", value: 4000 },
  { location: "ICU", value: 3500 },
  { location: "Emergency", value: 2800 },
  { location: "Pharmacy", value: 2200 },
  { location: "OR", value: 1800 },
  { location: "Laboratory", value: 1200 },
];

const categoryData = [
  { name: "Pharmaceuticals", value: 4200 },
  { name: "Surgical", value: 3800 },
  { name: "PPE", value: 2500 },
  { name: "Lab", value: 1900 },
  { name: "Equipment", value: 1400 },
  { name: "Wound", value: 900 },
];

const BAR_COLORS = [
  "#6366f1",
  "#a855f7",
  "#f59e0b",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
];

const stockItems = [
  {
    name: "Epinephrine 1mg/mL 10mL Vial",
    location: "CS-01 · Qty: 4 / PAR: 20",
    tags: [{ label: "Low Stock", color: "#f97316", bg: "#fff7ed" }],
  },
  {
    name: "Sodium Chloride 0.9% IV 1L",
    location: "CS-01 · Qty: 12 / PAR: 40",
    tags: [
      { label: "Low Stock", color: "#f97316", bg: "#fff7ed" },
      { label: "Expired", color: "#ef4444", bg: "#fef2f2" },
    ],
  },
  {
    name: "Morphine Sulfate 10mg/mL",
    location: "CS-01 · Qty: 18 / PAR: 10",
    tags: [
      { label: "In Stock", color: "#22c55e", bg: "#f0fdf4" },
      { label: "Expiring", color: "#f59e0b", bg: "#fffbeb" },
    ],
  },
  {
    name: "Epinephrine 1mg/mL 10mL Vial",
    location: "ICU-01 · Qty: 4 / PAR: 10",
    tags: [{ label: "Low Stock", color: "#f97316", bg: "#fff7ed" }],
  },
];

const formatToK = (value) => {
  return `$${(value / 1000).toFixed(1).replace(".0", "")}k`;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ title, value, subtitle, accent }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "12px 14px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Title */}
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: "#9ca3af",
          fontWeight: 500,
        }}
      >
        {title}
      </p>

      {/* Value + Subtitle inline */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline", // 🔥 important
          gap: 6,
          marginTop: 4,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: accent || "#111827",
          }}
        >
          {value}
        </p>

        {subtitle && (
          <span
            style={{
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Pending Card ─────────────────────────────────────────────────────────────

function PendingCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "12px 14px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Title */}
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: "#9ca3af",
          fontWeight: 500,
        }}
      >
        {title}
      </p>

      {/* Value + Subtitle inline */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline", // 🔥 key
          gap: 6,
          marginTop: 4,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {value}
        </p>

        {subtitle && (
          <span
            style={{
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Custom Donut Label ────────────────────────────────────────────────────────

function DonutCenter({ cx, cy, total }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan
        x={cx}
        dy="-8"
        style={{ fontSize: 28, fontWeight: 700, fill: "#111827" }}
      >
        {total.toLocaleString()}
      </tspan>
      <tspan
        x={cx}
        dy="22"
        style={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
      >
        PRODUCTS
      </tspan>
    </text>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Add this custom tooltip component above Dashboard
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          fontSize: 13,
          fontWeight: 600,
          color: data.payload.color,
        }}
      >
         {data.value}%
      </div>
    );
  }
  return null;
};
  const navigate = useNavigate();
  return (
    <div
   
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Inventory Dashboard
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>
            All locations &nbsp;·&nbsp; Live stock overview &nbsp;·&nbsp;{" "}
            {today}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/inventory/add")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            outline: "none",
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
          Add Item
        </button>
      </div>

      {/* ── Top KPI Row ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <StatCard
          title="Total SKUs"
          value="15"
          subtitle="2,019 units on hand"
        />
        <StatCard
          title="Stock Value"
          value="$3.8K"
          subtitle="At current unit cost"
        />
        <StatCard title="Low Stock" value="2,432" />
        <StatCard
          title="Expiry Alerts"
          value="4"
          subtitle="1 expired · 3 expiring ≤60d"
        />
      </div>

      {/* ── Pending Row ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <PendingCard
          title="Pending POs"
          value="1"
          subtitle="Awaiting approval"
        />
        <PendingCard
          title="Pending Transfers"
          value="1"
          subtitle="Awaiting approval"
        />
        <PendingCard
          title="Pending Issues"
          value="1"
          subtitle="Awaiting approval"
        />
        <PendingCard
          title="Open Replacements"
          value="1"
          subtitle="Awaiting approval"
        />
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {/* Stock Status Donut */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "20px 24px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            flex: 1,
            overflow: "visible", // ✅ IMPORTANT
            minHeight: 240,
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
            }}
          >
            Stock Status
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
         <PieChart width={180} height={180}>
  <Pie
    data={stockStatusData}
    cx={85}
    cy={85}
    innerRadius={70}
    outerRadius={82}
    paddingAngle={2}
    dataKey="value"
    startAngle={90}
    endAngle={-270}
    label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 2.2;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
    }}
    labelLine={false}
  >
    {stockStatusData.map((entry, i) => (
      <Cell key={i} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip content={<CustomPieTooltip />} />
  <DonutCenter cx={90} cy={95} total={3986} />
</PieChart>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {stockStatusData.map((s) => (
                <div
                  key={s.name}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    style={{
                      width: 90,
                      height: 28,
                      borderRadius: 5,
                      background: s.color,
                      fontSize: 11,
                      color: "#fff",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.name === "In Stock"
                      ? "IN STOCK"
                      : s.name === "Low Stock"
                        ? "LOW STOCK"
                        : "OUT OF STOCK"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Value by Location */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "20px 24px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            flex: 2,
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
            }}
          >
            Stock Value by Location
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={stockByLocation}
              barSize={18}
              margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
            >
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="location"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 4500]}
                interval={0} // 🔥 IMPORTANT (forces all ticks to show)
                ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]} // 👈 include decimals
                tickFormatter={(value) =>
                  `$${(value / 1000).toFixed(1).replace(".0", "")}k`
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [formatToK(value), "Value"]}
              />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {stockByLocation.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* Category Distribution */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "20px 24px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            flex: 2,
             minHeight: 240, // 👈 increase card height
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
            }}
          >
            Category Distribution
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} barSize={18}   margin={{ top: 10, right: 10, left: 20, bottom: 5 }} >
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 4500]}
                interval={0} // 🔥 IMPORTANT (forces all ticks to show)
                ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000]} // 👈 include decimals
                tickFormatter={(value) =>
                  `$${(value / 1000).toFixed(1).replace(".0", "")}k`
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [formatToK(value), "Value"]}
              />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status List */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "20px 24px",
            border: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            flex: 1,
            minWidth: 260,
          }}
        >
          <p
            style={{
              margin: "0 0 16px",
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
            }}
          >
            Stock Status
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {stockItems.map((item, i) => (
              <div
                key={i}
                style={{
                  paddingBottom: i < stockItems.length - 1 ? 14 : 0,
                  borderBottom:
                    i < stockItems.length - 1 ? "1px solid #f3f4f6" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#111827",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </p>
                  <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag.label}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: tag.color,
                          background: tag.bg,
                          borderRadius: 5,
                          padding: "2px 7px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
                <p
                  style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af" }}
                >
                  {item.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
