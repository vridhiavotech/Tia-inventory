import { useState, useRef, useEffect } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const today = new Date("2026-03-30");

const calcDaysLeft = (dateStr) => {
  const d = new Date(dateStr);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const initialItems = [
  {
    id: 1,
    item: "Sodium Chloride 0.9% IV 1L",
    ndc: "0338-0049-04",
    location: "CS-01",
    locationFull: "Central Store",
    lot: "NS2023F",
    qty: 12,
    expiry: "2026-01-31",
  },
  {
    id: 2,
    item: "Morphine Sulfate 10mg/mL",
    ndc: "0641-6083-25",
    location: "CS-01",
    locationFull: "Central Store",
    lot: "MS24C",
    qty: 18,
    expiry: "2026-04-15",
  },
  {
    id: 3,
    item: "Morphine Sulfate 10mg/mL",
    ndc: "0641-6083-25",
    location: "PH-01",
    locationFull: "Pharmacy",
    lot: "MS24C",
    qty: 12,
    expiry: "2026-04-15",
  },
  {
    id: 4,
    item: "Lidocaine 1% 20mL Vial",
    ndc: "0409-4277-01",
    location: "OR-01",
    locationFull: "Operating Room",
    lot: "LI24A",
    qty: 24,
    expiry: "2026-05-10",
  },
];

const getStatus = (days) => {
  if (days < 0) return "Expired";
  if (days <= 60) return "Expiring Soon";
  return "OK";
};

const SUPPLIERS = [
  "Select...",
  "MedSupply Co.",
  "PharmaDirect",
  "GlobalMed",
  "HealthCore Ltd.",
  "BioPharm Inc.",
];
const URGENCY_OPTIONS = [
  "Critical — Within 24h",
  "High — Within 48h",
  "Medium — Within 1 week",
  "Low — No rush",
];
const THERAPEUTIC_EQ = [
  "AB-Rated — Bioequivalent",
  "Therapeutically Equivalent",
  "Partial — Physician Approval Required",
  "Emergency Substitute Only",
];

// ─── Styles ─────────────────────────────────────────────────────────────────

const inputSt = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e2e8f0",
  borderRadius: 8,
  fontSize: 13,
  boxSizing: "border-box",
  outline: "none",
  color: "#0f172a",
  background: "#f8fafc",
};
const selectSt = {
  ...inputSt,
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 36,
  cursor: "pointer",
};
const autoSt = {
  ...inputSt,
  background: "#f1f5f9",
  color: "#374151",
  cursor: "not-allowed",
};

const SecLabel = ({ text }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: "#2563eb",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 14,
      marginTop: 4,
    }}
  >
    {text}
  </div>
);
const FLabel = ({ text }) => (
  <label
    style={{
      display: "block",
      fontSize: 11,
      fontWeight: 700,
      color: "#64748b",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginBottom: 6,
    }}
  >
    {text}
  </label>
);
const Divider = () => (
  <div style={{ borderTop: "1px solid #e2e8f0", margin: "18px 0" }} />
);

// ─── Modal ───────────────────────────────────────────────────────────────────

function ReplaceModal({ prefill, onClose, onSubmit }) {
  const [form, setForm] = useState({
    item: prefill ? `${prefill.item} — ${prefill.location}` : "",
    currentQty: prefill ? String(prefill.qty) : "",
    location: prefill ? prefill.locationFull : "",
    reason: "Expired",
    urgency: "Critical — Within 24h",
    disposed: "",
    replaceQty: "",
    useSubstitute: false,
    substitute: "",
    substituteNDC: "",
    therapeuticEq: "AB-Rated — Bioequivalent",
    supplier: "Select...",
    unitCost: "",
    notes: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const urgencyToShort = (u) => {
    if (u.startsWith("Critical")) return "Critical";
    if (u.startsWith("High")) return "High";
    if (u.startsWith("Medium")) return "Medium";
    return "Low";
  };

  const handleSave = (raisePO) => {
    if (!form.item || !form.replaceQty) return;
    onSubmit({ ...form, urgency: urgencyToShort(form.urgency), raisePO });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 560,
          boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
              Raise Replacement Request
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
              Flag item for replacement
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              cursor: "pointer",
              color: "#64748b",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          className="modal-body"
          style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}
        >
          <SecLabel text="Item Being Replaced" />

          <div style={{ marginBottom: 14 }}>
            <FLabel text="Select Item *" />
            <input
              value={form.item}
              readOnly={!!prefill}
              onChange={(e) => set("item", e.target.value)}
              style={prefill ? autoSt : inputSt}
              placeholder="Select item..."
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div>
              <FLabel text="Current QTY (Auto)" />
              <input readOnly value={form.currentQty} style={autoSt} />
            </div>
            <div>
              <FLabel text="Location (Auto)" />
              <input readOnly value={form.location} style={autoSt} />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div>
              <FLabel text="Replacement Reason *" />
              <select
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                style={selectSt}
              >
                {["Expired", "Low Stock", "Recalled", "Damaged"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <FLabel text="Urgency *" />
              <select
                value={form.urgency}
                onChange={(e) => set("urgency", e.target.value)}
                style={selectSt}
              >
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <FLabel text="QTY Disposed / Removed" />
              <input
                type="number"
                value={form.disposed}
                onChange={(e) => set("disposed", e.target.value)}
                placeholder="0"
                style={inputSt}
              />
            </div>
            <div>
              <FLabel text="QTY to Replace *" />
              <input
                type="number"
                value={form.replaceQty}
                onChange={(e) => set("replaceQty", e.target.value)}
                placeholder="0"
                style={inputSt}
              />
            </div>
          </div>

          <Divider />
          <SecLabel text="Substitute Item (If Different)" />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: form.useSubstitute ? 14 : 0,
            }}
          >
            <input
              type="checkbox"
              id="useSub"
              checked={form.useSubstitute}
              onChange={(e) => set("useSubstitute", e.target.checked)}
              style={{
                width: 16,
                height: 16,
                cursor: "pointer",
                accentColor: "#2563eb",
              }}
            />
            <label
              htmlFor="useSub"
              style={{
                fontSize: 13,
                color: "#374151",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Use a substitute / alternative item
            </label>
          </div>

          {form.useSubstitute && (
            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <FLabel text="Substitute Name" />
                  <input
                    value={form.substitute}
                    onChange={(e) => set("substitute", e.target.value)}
                    placeholder="e.g. Generic Amox 500mg"
                    style={inputSt}
                  />
                </div>
                <div>
                  <FLabel text="Substitute NDC" />
                  <input
                    value={form.substituteNDC}
                    onChange={(e) => set("substituteNDC", e.target.value)}
                    placeholder="0378-0255-01"
                    style={inputSt}
                  />
                </div>
              </div>
              <div>
                <FLabel text="Therapeutic Equivalence" />
                <select
                  value={form.therapeuticEq}
                  onChange={(e) => set("therapeuticEq", e.target.value)}
                  style={selectSt}
                >
                  {THERAPEUTIC_EQ.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <Divider />
          <SecLabel text="Procurement" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div>
              <FLabel text="Preferred Supplier" />
              <select
                value={form.supplier}
                onChange={(e) => set("supplier", e.target.value)}
                style={selectSt}
              >
                {SUPPLIERS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <FLabel text="Est. Unit Cost" />
              <input
                type="number"
                value={form.unitCost}
                onChange={(e) => set("unitCost", e.target.value)}
                placeholder="0.00"
                style={inputSt}
              />
            </div>
          </div>

          <FLabel text="Clinical Notes / Justification" />
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Reason, approval obtained, protocol followed..."
            rows={3}
            style={{ ...inputSt, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            style={{
              padding: "9px 18px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Open
          </button>
          <button
            onClick={() => handleSave(true)}
            style={{
              padding: "9px 18px",
              border: "none",
              borderRadius: 8,
              background: "rgb(37, 99, 235)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(14,116,144,0.3)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            Save &amp; Raise PO
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dispose Confirm Modal ────────────────────────────────────────────────────

function DisposeModal({ item, onClose, onConfirm }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#fee2e2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              Confirm Disposal
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              This action cannot be undone
            </div>
          </div>
        </div>
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 20,
            fontSize: 13,
            color: "#374151",
          }}
        >
          Mark <strong>{item.item}</strong> (Lot: {item.lot}, Qty: {item.qty})
          at <strong>{item.location}</strong> as disposed?
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              border: "1.5px solid #e2e8f0",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item.id)}
            style={{
              padding: "9px 20px",
              border: "none",
              borderRadius: 8,
              background: "#ef4444",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Dispose
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Location badge colors ────────────────────────────────────────────────────

const locColor = (loc) => {
  const map = {
    "CS-01": { bg: "#ede9fe", color: "#6d28d9" },
    "PH-01": { bg: "#dcfce7", color: "#166534" },
    "OR-01": { bg: "#ffedd5", color: "#c2410c" },
    "WA-01": { bg: "#dbeafe", color: "#1e40af" },
    "WA-02": { bg: "#fce7f3", color: "#9d174d" },
  };
  return map[loc] || { bg: "#f3f4f6", color: "#374151" };
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExpiryTracking() {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState("All");
  const [replaceTarget, setReplaceTarget] = useState(null);
  const [disposeTarget, setDisposeTarget] = useState(null);

  const enriched = items.map((it) => {
    const days = calcDaysLeft(it.expiry);
    return { ...it, days, status: getStatus(days) };
  });

  const expired = enriched.filter((i) => i.status === "Expired");
  const expiringSoon = enriched.filter((i) => i.status === "Expiring Soon");
  const ok = enriched.filter((i) => i.status === "OK");

  const displayed =
    filter === "Expired"
      ? expired
      : filter === "Expiring Soon"
        ? expiringSoon
        : enriched;

  const handleDispose = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setDisposeTarget(null);
  };

  const handleExport = () => {
    const headers = [
      "Item",
      "NDC",
      "Location",
      "Lot #",
      "QTY",
      "Expiry Date",
      "Days Left",
      "Status",
    ];
    const rows = displayed.map((r) => [
      r.item,
      r.ndc,
      r.location,
      r.lot,
      r.qty,
      formatDate(r.expiry),
      r.days < 0 ? `${Math.abs(r.days)}d ago` : `${r.days}d`,
      r.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expiry_tracking.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const daysDisplay = (days) => {
    if (days < 0)
      return {
        label: `${Math.abs(days)}d ago`,
        color: "#ef4444",
        bg: "#fee2e2",
      };
    if (days <= 60)
      return { label: `${days}d`, color: "#d97706", bg: "#fef3c7" };
    return { label: `${days}d`, color: "#16a34a", bg: "#dcfce7" };
  };

  const statusChip = (status) => {
    if (status === "Expired")
      return {
        label: "Expired",
        bg: "#fee2e2",
        color: "#ef4444",
        border: "#fecaca",
      };
    if (status === "Expiring Soon")
      return {
        label: "Expiring Soon",
        bg: "#fef9c3",
        color: "#d97706",
        border: "#fde68a",
      };
    return { label: "OK", bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "22px 20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .modal-body::-webkit-scrollbar { width: 5px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .modal-body::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .tbl-scroll::-webkit-scrollbar { height: 5px; }
        .tbl-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .tbl-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .tbl-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .filter-btn { padding: 6px 16px; border-radius: 99px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s; color: #374151; }
        .filter-btn:hover { background: #f1f5f9; }
        .filter-btn.active { background: #f0f9ff; border-color: #2563eb; color: #2563eb; font-weight: 700; }
        .action-btn { padding: 5px 14px; border-radius: 7px; font-size: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; cursor: pointer; border: 1.5px solid; display: inline-flex; align-items: center; gap: 5px; transition: opacity 0.15s; }
        .action-btn:hover { opacity: 0.82; }
        tr.row:hover td { background: #f8faff; }
      `}</style>

      {/* Modals */}
      {replaceTarget && (
        <ReplaceModal
          prefill={replaceTarget}
          onClose={() => setReplaceTarget(null)}
          onSubmit={() => setReplaceTarget(null)}
        />
      )}
      {disposeTarget && (
        <DisposeModal
          item={disposeTarget}
          onClose={() => setDisposeTarget(null)}
          onConfirm={handleDispose}
        />
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Expiry Tracking
          </h1>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
            <span style={{ color: "#ef4444", fontWeight: 600 }}>
              {expired.length} expired
            </span>
            <span style={{ margin: "0 6px" }}>·</span>
            <span style={{ color: "#d97706", fontWeight: 600 }}>
              {expiringSoon.length} expiring within 60 days
            </span>
          </div>
        </div>
        <button
          onClick={handleExport}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 9,
            background: "#fff",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>

      {/* Stat Cards */}

      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {[
          {
            key: "EXPIRED",
            count: expired.length,
            sub: "Must be disposed immediately",
            accent: "#ef4444",
          },
          {
            key: "EXPIRING ≤ 60 DAYS",
            count: expiringSoon.length,
            sub: "Plan replacement now",
            accent: "#d97706",
          },
          {
            key: "OK",
            count: ok.length,
            sub: "No immediate concern",
            accent: "#16a34a",
          },
        ].map(({ key, count, sub, accent }) => (
          <div
            key={key}
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              display: "flex",
            }}
          >
            <div style={{ width: 4, background: accent }} />
            <div style={{ padding: "18px 22px", flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {key}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {count}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { label: "All", dot: null },
          { label: "Expired", dot: "#ef4444" },
          { label: "Expiring Soon", dot: "#d97706" },
        ].map(({ label, dot }) => (
          <button
            key={label}
            className={`filter-btn ${filter === label ? "active" : ""}`}
            onClick={() => setFilter(label)}
          >
            {dot && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: dot,
                  display: "inline-block",
                }}
              />
            )}
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1.5px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                borderBottom: "1.5px solid #e2e8f0",
              }}
            >
              {[
                "Item",
                "NDC",
                "Location",
                "Lot #",
                "QTY",
                "Expiry Date",
                "Days Left",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 10px",
                    textAlign: "left",
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: 48,
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: 14,
                  }}
                >
                  No records found.
                </td>
              </tr>
            ) : (
              displayed.map((row, i) => {
                const dl = daysDisplay(row.days);
                const sc = statusChip(row.status);
                const lc = locColor(row.location);
                const isExpired = row.status === "Expired";
                return (
                  <tr
                    key={row.id}
                    className="row"
                    style={{
                      borderBottom:
                        i < displayed.length - 1 ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    <td style={{ padding: "11px 10px", overflow: "hidden" }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.item}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "11px 10px",
                        fontSize: 11.5,
                        color: "#64748b",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.ndc}
                    </td>
                    <td style={{ padding: "11px 10px" }}>
                      <span
                        style={{
                          background: lc.bg,
                          color: lc.color,
                          padding: "2px 8px",
                          borderRadius: 5,
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.location}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 10px",
                        fontSize: 12,
                        color: "#374151",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.lot}
                    </td>
                    <td
                      style={{
                        padding: "11px 10px",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#0f172a",
                        textAlign: "center",
                      }}
                    >
                      {row.qty}
                    </td>
                    <td
                      style={{
                        padding: "11px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: isExpired
                          ? "#ef4444"
                          : row.days <= 60
                            ? "#d97706"
                            : "#374151",
                        whiteSpace: "nowrap",
                        textDecoration: isExpired ? "line-through" : "none",
                        overflow: "hidden",
                      }}
                    >
                      {formatDate(row.expiry)}
                    </td>
                    <td style={{ padding: "11px 10px" }}>
                      <span
                        style={{
                          background: dl.bg,
                          color: dl.color,
                          padding: "2px 8px",
                          borderRadius: 5,
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {dl.label}
                      </span>
                    </td>
                    <td style={{ padding: "11px 10px" }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          border: `1.5px solid ${sc.border}`,
                          padding: "2px 8px",
                          borderRadius: 5,
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td style={{ padding: "11px 10px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        {isExpired && (
                          <button
                            className="action-btn"
                            onClick={() => setDisposeTarget(row)}
                            style={{
                              borderColor: "#fecaca",
                              color: "#ef4444",
                              background: "#fff",
                              padding: "4px 10px",
                              fontSize: 11,
                            }}
                          >
                            Dispose
                          </button>
                        )}
                        <button
                          className="action-btn"
                          onClick={() => setReplaceTarget(row)}
                          style={{
                            borderColor: "#bfdbfe",
                            color: "#1d4ed8",
                            background: "#eff6ff",
                            padding: "4px 10px",
                            fontSize: 11,
                          }}
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="17 1 21 5 17 9" />
                            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                            <polyline points="7 23 3 19 7 15" />
                            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                          </svg>
                          Replace
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div
          style={{
            padding: "11px 16px",
            borderTop: "1px solid #f1f5f9",
            fontSize: 12,
            color: "#94a3b8",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            Showing {displayed.length} of {enriched.length} records
          </span>
          <span>Expiry Tracking • TiaTELE</span>
        </div>
      </div>
    </div>
  );
}
