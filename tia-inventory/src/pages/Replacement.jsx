import { useState, useRef, useEffect } from "react";

const initialData = [
  {
    id: "RPL-2026-005",
    item: "Sodium Chloride 0.9% IV 1L",
    location: "Central Store",
    reason: "Expired",
    urgency: "Critical",
    disposed: 12,
    replaceQty: 40,
    substitute: "Same item",
    linkedPO: "-",
    raisedBy: "S. Anderson",
    date: "Mar 18, 2026",
    status: "Open",
  },
  {
    id: "RPL-2026-004",
    item: "Epinephrine 1mg/mL 10mL",
    location: "Central Store",
    reason: "Low Stock",
    urgency: "Critical",
    disposed: "-",
    replaceQty: 20,
    substitute: "Same item",
    linkedPO: "PO-2026-0004",
    raisedBy: "T. Williams",
    date: "Mar 17, 2026",
    status: "PO Raised",
  },
  {
    id: "RPL-2026-003",
    item: "Amoxicillin 500mg Capsules",
    location: "Central Store",
    reason: "Recalled",
    urgency: "High",
    disposed: 50,
    replaceQty: 50,
    substitute: "Generic Amoxicillin 500mg",
    linkedPO: "-",
    raisedBy: "S. Anderson",
    date: "Mar 10, 2026",
    status: "Open",
  },
  {
    id: "RPL-2026-002",
    item: "Morphine Sulfate 10mg/mL",
    location: "Central Store",
    reason: "Expired",
    urgency: "High",
    disposed: 5,
    replaceQty: 10,
    substitute: "Same item",
    linkedPO: "PO-2026-0002",
    raisedBy: "P. Chen",
    date: "Mar 5, 2026",
    status: "Closed",
  },
];

const REASONS = ["All Reasons", "Expired", "Low Stock", "Recalled", "Damaged"];
const STATUSES = ["All Statuses", "Open", "PO Raised", "In Progress", "Closed"];

const urgencyColor = (u) => {
  if (u === "Critical") return { color: "#e53e3e", bg: "#fff5f5" };
  if (u === "High") return { color: "#d97706", bg: "#fffbeb" };
  return { color: "#3b82f6", bg: "#eff6ff" };
};

const statusStyle = (s) => {
  const map = {
    Open: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "PO Raised": { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
    "In Progress": { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    Closed: { bg: "#f0f9ff", color: "#0369a1", border: "#bae6fd" },
  };
  return map[s] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          background: "#fff",
          cursor: "pointer",
          fontSize: 13,
          color: "#374151",
          fontWeight: 500,
          whiteSpace: "nowrap",
          outline: "none",
          boxShadow: open ? "0 0 0 3px #e0f2fe" : "none",
          transition: "box-shadow 0.15s",
        }}
      >
        {value}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            minWidth: "100%",
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "9px 16px",
                cursor: "pointer",
                fontSize: 13,
                color: value === opt ? "#2563eb" : "#374151",
                fontWeight: value === opt ? 600 : 400,
                background: value === opt ? "#f0f9ff" : "transparent",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = value === opt ? "#f0f9ff" : "transparent"; }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const INVENTORY_ITEMS = [
  "Sodium Chloride 0.9% IV 1L — Central Store",
  "Epinephrine 1mg/mL 10mL — Central Store",
  "Amoxicillin 500mg Capsules — Central Store",
  "Morphine Sulfate 10mg/mL — Central Store",
  "Paracetamol 500mg Tablets — Ward A",
  "Insulin Glargine 100U/mL — Pharmacy",
  "Metformin 500mg Tablets — Pharmacy",
];

const SUPPLIERS = ["Select...", "MedSupply Co.", "PharmaDirect", "GlobalMed", "HealthCore Ltd.", "BioPharm Inc."];

const URGENCY_OPTIONS = [
  "Critical — Within 24h",
  "High — Within 48h",
  "Medium — Within 1 week",
  "Low — No rush",
];

const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0",
  borderRadius: 8, fontSize: 13,
  boxSizing: "border-box", outline: "none", color: "#0f172a",
  background: "#f8fafc",
};

const selectStyle = {
  ...inputStyle,
  appearance: "none", WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 36,
  cursor: "pointer",
};

const autoInputStyle = { ...inputStyle, background: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed" };

const sectionLabel = (text) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, marginTop: 4 }}>
    {text}
  </div>
);

const fieldLabel = (text) => (
  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, background: "none" }}>{text}</label>
);

const divider = () => (
  <div style={{ borderTop: "1px solid #e2e8f0", margin: "18px 0" }} />
);

function RaiseReplacementModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    item: "", currentQty: "", location: "",
    reason: "Expired", urgency: "Critical — Within 24h",
    disposed: "", replaceQty: "",
    useSubstitute: false, substitute: "",
    supplier: "Select...", unitCost: "", notes: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleItemChange = (val) => {
    const mock = {
      "Sodium Chloride 0.9% IV 1L — Central Store": { currentQty: "8", location: "Central Store" },
      "Epinephrine 1mg/mL 10mL — Central Store": { currentQty: "3", location: "Central Store" },
      "Amoxicillin 500mg Capsules — Central Store": { currentQty: "0", location: "Central Store" },
      "Morphine Sulfate 10mg/mL — Central Store": { currentQty: "5", location: "Central Store" },
      "Paracetamol 500mg Tablets — Ward A": { currentQty: "120", location: "Ward A" },
      "Insulin Glargine 100U/mL — Pharmacy": { currentQty: "14", location: "Pharmacy" },
      "Metformin 500mg Tablets — Pharmacy": { currentQty: "200", location: "Pharmacy" },
    };
    const info = mock[val] || { currentQty: "", location: "" };
    setForm((p) => ({ ...p, item: val, currentQty: info.currentQty, location: info.location }));
  };

  const urgencyToShort = (u) => {
    if (u.startsWith("Critical")) return "Critical";
    if (u.startsWith("High")) return "High";
    if (u.startsWith("Medium")) return "Medium";
    return "Low";
  };

  const handleSave = (raisePO) => {
    if (!form.item || !form.replaceQty) return;
    const itemName = form.item.split(" — ")[0];
    onSubmit({
      item: itemName,
      location: form.location,
      reason: form.reason,
      urgency: urgencyToShort(form.urgency),
      disposed: form.disposed || "-",
      replaceQty: form.replaceQty,
      substitute: form.useSubstitute && form.substitute ? `${form.substitute}${form.substituteNDC ? ` (${form.substituteNDC})` : ""}` : "Same item",
      raisePO,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
        boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      }}>
        {/* Modal Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Raise Replacement Request</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Flag item for replacement</div>
          </div>
          <button onClick={onClose} style={{
            border: "1.5px solid #e2e8f0", borderRadius: 8, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fff", cursor: "pointer", color: "#64748b", fontSize: 16, flexShrink: 0, outline: "none",
          }}>×</button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body" style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>

          {sectionLabel("Item Being Replaced")}

          <div style={{ marginBottom: 14 }}>
            {fieldLabel("Select Item *")}
            <div style={{ position: "relative" }}>
              <select value={form.item} onChange={(e) => handleItemChange(e.target.value)} style={selectStyle}>
                <option value="">Select item...</option>
                {INVENTORY_ITEMS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              {fieldLabel("Current QTY (Auto)")}
              <input readOnly value={form.currentQty} placeholder="" style={autoInputStyle} />
            </div>
            <div>
              {fieldLabel("Location (Auto)")}
              <input readOnly value={form.location} placeholder="" style={autoInputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              {fieldLabel("Replacement Reason *")}
              <select value={form.reason} onChange={(e) => set("reason", e.target.value)} style={selectStyle}>
                {["Expired", "Low Stock", "Recalled", "Damaged"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              {fieldLabel("Urgency *")}
              <select value={form.urgency} onChange={(e) => set("urgency", e.target.value)} style={selectStyle}>
                {URGENCY_OPTIONS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              {fieldLabel("QTY Disposed / Removed")}
              <input type="number" value={form.disposed} onChange={(e) => set("disposed", e.target.value)}
                placeholder="0" style={inputStyle} />
            </div>
            <div>
              {fieldLabel("QTY to Replace *")}
              <input type="number" value={form.replaceQty} onChange={(e) => set("replaceQty", e.target.value)}
                placeholder="0" style={inputStyle} />
            </div>
          </div>

          {divider()}

          {sectionLabel("Substitute Item (If Different)")}

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: form.useSubstitute ? 14 : 0 }}>
            <input type="checkbox" id="useSubstitute" checked={form.useSubstitute}
              onChange={(e) => set("useSubstitute", e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#2563eb" }} />
            <label htmlFor="useSubstitute" style={{ fontSize: 13, cursor: "pointer", userSelect: "none" }}>
              Use a substitute / alternative item
            </label>
          </div>

          {form.useSubstitute && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  {fieldLabel("Substitute Name")}
                  <input value={form.substitute} onChange={(e) => set("substitute", e.target.value)}
                    placeholder="e.g. Generic Amox 500mg" style={inputStyle} />
                </div>
                <div>
                  {fieldLabel("Substitute NDC")}
                  <input value={form.substituteNDC || ""} onChange={(e) => set("substituteNDC", e.target.value)}
                    placeholder="0378-0255-01" style={inputStyle} />
                </div>
              </div>
              <div>
                {fieldLabel("Therapeutic Equivalence")}
                <select value={form.therapeuticEq || "AB-Rated — Bioequivalent"} onChange={(e) => set("therapeuticEq", e.target.value)} style={selectStyle}>
                  {["AB-Rated — Bioequivalent", "Therapeutically Equivalent", "Partial — Physician Approval Required", "Emergency Substitute Only"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          )}

          {divider()}

          {sectionLabel("Procurement")}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              {fieldLabel("Preferred Supplier")}
              <select value={form.supplier} onChange={(e) => set("supplier", e.target.value)} style={selectStyle}>
                {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              {fieldLabel("Est. Unit Cost")}
              <input type="number" value={form.unitCost} onChange={(e) => set("unitCost", e.target.value)}
                placeholder="0.00" style={inputStyle} />
            </div>
          </div>

          {fieldLabel("Clinical Notes / Justification")}
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
            placeholder="Reason, approval obtained, protocol followed..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
          <button onClick={onClose} style={{
            padding: "9px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8,
            background: "#fff", cursor: "pointer", fontSize: 13,
            fontWeight: 600, color: "#374151", outline: "none",
          }}>Cancel</button>
          <button onClick={() => handleSave(false)} style={{
            padding: "9px 18px", border: "1.5px solid #e2e8f0", borderRadius: 8,
            background: "#fff", cursor: "pointer", fontSize: 13,
            fontWeight: 600, color: "#374151", outline: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Open
          </button>
          <button onClick={() => handleSave(true)} style={{
            padding: "9px 18px", border: "none", borderRadius: 8,
            background: "rgb(37,99,235)", cursor: "pointer", fontSize: 13,
            fontWeight: 700, color: "#fff", outline: "none",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            Save & Raise PO
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Replacement() {
  const [data, setData] = useState(initialData);
  const [reasonFilter, setReasonFilter] = useState("All Reasons");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = data.filter((r) => {
    const matchReason = reasonFilter === "All Reasons" || r.reason === reasonFilter;
    const matchStatus = statusFilter === "All Statuses" || r.status === statusFilter;
    const matchSearch = !search || r.item.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    return matchReason && matchStatus && matchSearch;
  });

  const counts = {
    open: data.filter((r) => r.status === "Open").length,
    poRaised: data.filter((r) => r.status === "PO Raised").length,
    inProgress: data.filter((r) => r.status === "In Progress").length,
    closed: data.filter((r) => r.status === "Closed").length,
  };

  const handleDelete = (id) => setData((prev) => prev.filter((r) => r.id !== id));

  const handleRaiseOrder = (id) => {
    setData((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "PO Raised", linkedPO: `PO-2026-${String(Math.floor(Math.random() * 9000) + 1000)}` } : r)
    );
  };

  const handleRaiseReplacement = (form) => {
    const newId = `RPL-2026-${String(data.length + 1).padStart(3, "0")}`;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newStatus = form.raisePO ? "PO Raised" : "Open";
    const newPO = form.raisePO ? `PO-2026-${String(Math.floor(Math.random() * 9000) + 1000)}` : "-";
    setData((prev) => [{
      id: newId,
      item: form.item,
      location: form.location,
      reason: form.reason,
      urgency: form.urgency,
      disposed: form.disposed || "-",
      replaceQty: form.replaceQty,
      substitute: form.substitute,
      linkedPO: newPO,
      raisedBy: "System Admin",
      date: today,
      status: newStatus,
    }, ...prev]);
    setShowModal(false);
  };

  const handleExport = () => {
    const headers = ["Request#", "Item", "Location", "Reason", "Urgency", "Disposed", "Replace QTY", "Substitute", "Linked PO", "Raised By", "Date", "Status"];
    const rows = filtered.map((r) => [r.id, r.item, r.location, r.reason, r.urgency, r.disposed, r.replaceQty, r.substitute, r.linkedPO, r.raisedBy, r.date, r.status]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "replacement_tracking.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ iconEl, label, count, sub, iconBg }) => (
    <div style={{
      flex: 1, background: "#fff", borderRadius: 14,
      padding: "18px 22px", display: "flex", alignItems: "center", gap: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {iconEl}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1.15 }}>{count}</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "24px 16px" }}>
      <style>{`
        @media (max-width: 768px) {
          .stat-cards { flex-wrap: wrap !important; }
          .stat-cards > div { flex: 1 1 calc(50% - 8px) !important; min-width: 140px; }
          .header-row { flex-direction: column !important; gap: 14px !important; }
          .header-actions { width: 100%; justify-content: flex-end; }
          .filter-row { flex-wrap: wrap !important; }
          .search-box { width: 100% !important; }
          .search-box input { width: 100% !important; box-sizing: border-box; }
        }
        @media (max-width: 480px) {
          .stat-cards > div { flex: 1 1 100% !important; }
        }
        .table-scroll::-webkit-scrollbar { height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .table-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .modal-body::-webkit-scrollbar { width: 5px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .modal-body::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        button:focus { outline: none !important; }
        button:focus-visible { outline: none !important; box-shadow: none !important; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {showModal && <RaiseReplacementModal onClose={() => setShowModal(false)} onSubmit={handleRaiseReplacement} />}

      {/* Header */}
      <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Replacement Tracking</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, fontSize: 12, color: "#94a3b8" }}>
            {["Flag", "Request", "PO", "Receive", "Close"].map((step, i, arr) => (
              <span key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: i === 1 ? "#2563eb" : "#cbd5e1", fontWeight: i === 1 ? 700 : 400 }}>{step}</span>
                {i < arr.length - 1 && <span style={{ color: "#cbd5e1" }}>→</span>}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExport} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
            border: "1.5px solid #e2e8f0", borderRadius: 9, background: "#fff",
            cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)", outline: "none",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button onClick={() => setShowModal(true)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
            border: "none", borderRadius: 9, background: "rgb(37, 99, 235)",
            cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", outline: "none",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Raise Replacement
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards" style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <StatCard
          iconEl={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Open Requests" count={counts.open} sub="Awaiting action" iconBg="#F59E0B"
        />
        <StatCard
          iconEl={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          label="PO Raised" count={counts.poRaised} sub="Pending delivery" iconBg="#a855f7"
        />
        <StatCard
          iconEl={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
          label="In Progress" count={counts.inProgress} sub="" iconBg="#3b82f6"
        />
        <StatCard
          iconEl={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>}
          label="Closed" count={counts.closed} sub="Successfully replaced" iconBg="#10b981"
        />
      </div>

      {/* Filters */}
      <div className="filter-row" style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <Dropdown options={REASONS} value={reasonFilter} onChange={setReasonFilter} />
        <Dropdown options={STATUSES} value={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div className="table-scroll" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                {["Request#", "Item", "Reason", "Urgency", "Disposed", "Replace QTY", "Substitute", "Linked PO", "Raised by", "Date", "Status", "Action"].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={12} style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No records found.</td></tr>
              ) : filtered.map((row, i) => {
                const uc = urgencyColor(row.urgency);
                const sc = statusStyle(row.status);
                return (
                  <tr key={row.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.1s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fafbff"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 14px", fontSize: 12.5, fontWeight: 700, color: "#2563eb", whiteSpace: "nowrap" }}>{row.id}</td>
                    <td style={{ padding: "14px 14px", minWidth: 160 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{row.item}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{row.location}</div>
                    </td>
                    <td style={{ padding: "14px 14px", fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>{row.reason}</td>
                    <td style={{ padding: "14px 14px" }}>
                      <span style={{ background: uc.bg, color: uc.color, padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{row.urgency}</span>
                    </td>
                    <td style={{ padding: "14px 14px", fontSize: 13, color: "#374151", textAlign: "center" }}>{row.disposed}</td>
                    <td style={{ padding: "14px 14px", fontSize: 13, fontWeight: 600, color: "#0f172a", textAlign: "center" }}>{row.replaceQty}</td>
                    <td style={{ padding: "14px 14px", fontSize: 12.5, color: "#374151", maxWidth: 140 }}>{row.substitute}</td>
                    <td style={{ padding: "14px 14px", fontSize: 12.5, color: row.linkedPO === "-" ? "#cbd5e1" : "#0284c7", fontWeight: row.linkedPO !== "-" ? 600 : 400, whiteSpace: "nowrap" }}>{row.linkedPO}</td>
                    <td style={{ padding: "14px 14px", fontSize: 12.5, color: "#374151", whiteSpace: "nowrap" }}>{row.raisedBy}</td>
                    <td style={{ padding: "14px 14px", fontSize: 12.5, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                    <td style={{ padding: "14px 14px" }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1.5px solid ${sc.border}`, padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{row.status}</span>
                    </td>
                    <td style={{ padding: "14px 14px" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                          onClick={() => handleRaiseOrder(row.id)}
                          disabled={row.status === "Closed" || row.status === "PO Raised"}
                          title="Raise PO"
                          style={{
                            border: "1.5px solid #e2e8f0", borderRadius: 7, padding: "5px 8px", background: "#fff",
                            cursor: row.status === "Closed" || row.status === "PO Raised" ? "not-allowed" : "pointer",
                            opacity: row.status === "Closed" || row.status === "PO Raised" ? 0.4 : 1,
                            display: "flex", alignItems: "center", outline: "none",
                          }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          title="Remove"
                          style={{
                            border: "1.5px solid #fee2e2", borderRadius: 7, padding: "5px 8px", background: "#fff",
                            cursor: "pointer", display: "flex", alignItems: "center", outline: "none",
                          }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
          <span>Showing {filtered.length} of {data.length} records</span>
          <span>Replacement Tracking • TiaTELE</span>
        </div>
      </div>
    </div>
  );
}