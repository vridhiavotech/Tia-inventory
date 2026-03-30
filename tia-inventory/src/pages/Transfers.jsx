import { useState } from "react";

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialTransfers = [
  {
    id: "TRF-2026-0003",
    from: "CS-01", fromLabel: "Central Store",
    to: "ICU-01", toLabel: "ICU",
    items: [{ item: "Amoxicillin 500mg", qty: 20 }, { item: "NS 0.9% IV 1L", qty: 10 }],
    itemsLabel: "Amoxicillin 500mg ×20, NS 0.9% IV 1L ×10",
    priority: "Urgent",
    notes: "ICU running low",
    by: "Sarah Anderson",
    date: "Mar 19, 2026",
    status: "Pending",
  },
  {
    id: "TRF-2026-0002",
    from: "CS-01", fromLabel: "Central Store",
    to: "PH-01", toLabel: "Pharmacy",
    items: [{ item: "Morphine Sulfate 10mg/mL", qty: 5 }],
    itemsLabel: "Morphine Sulfate 10mg/mL ×5",
    priority: "Normal",
    notes: "Monthly resupply",
    by: "P. Chen",
    date: "Mar 17, 2026",
    status: "Completed",
  },
  {
    id: "TRF-2026-0001",
    from: "CS-01", fromLabel: "Central Store",
    to: "OR-01", toLabel: "OR / Surgery",
    items: [{ item: "Lidocaine 1% 20mL", qty: 10 }],
    itemsLabel: "Lidocaine 1% 20mL ×10",
    priority: "Normal",
    notes: "OR prep",
    by: "T. Williams",
    date: "Mar 15, 2026",
    status: "Completed",
  },
];

const LOCATIONS = [
  { code: "CS-01", label: "Central Store" },
  { code: "PH-01", label: "Pharmacy" },
  { code: "ICU-01", label: "ICU" },
  { code: "OR-01", label: "OR / Surgery" },
  { code: "WA-01", label: "Ward A" },
  { code: "WA-02", label: "Ward B" },
];

const INVENTORY = [
  { name: "Amoxicillin 500mg Capsules", available: 60 },
  { name: "Sodium Chloride 0.9% IV 1L", available: 40 },
  { name: "Morphine Sulfate 10mg/mL", available: 18 },
  { name: "Lidocaine 1% 20mL Vial", available: 24 },
  { name: "Epinephrine 1mg/mL 10mL", available: 8 },
  { name: "Paracetamol 500mg Tablets", available: 120 },
  { name: "Insulin Glargine 100U/mL", available: 14 },
  { name: "Metformin 500mg Tablets", available: 200 },
  { name: "Heparin Sodium 5000u/mL", available: 45 },
  { name: "Ceftriaxone 1g Injection", available: 10 },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputSt = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0",
  borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box", outline: "none", color: "#0f172a", background: "#f8fafc",
};
const selectSt = {
  ...inputSt,
  appearance: "none", WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36, cursor: "pointer",
};
const autoSt = { ...inputSt, background: "#f1f5f9", color: "#64748b", cursor: "not-allowed" };

// ─── Badge helpers ─────────────────────────────────────────────────────────────

const locColor = (code) => {
  const map = {
    "CS-01":  { bg: "#ede9fe", color: "#6d28d9", border: "#ddd6fe" },
    "PH-01":  { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "ICU-01": { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "OR-01":  { bg: "#ffedd5", color: "#c2410c", border: "#fed7aa" },
    "WA-01":  { bg: "#fce7f3", color: "#9d174d", border: "#fbcfe8" },
    "WA-02":  { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
  };
  return map[code] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

const priorityStyle = (p) =>
  p === "Urgent"
    ? { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" }
    : { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };

const statusStyle = (s) => {
  if (s === "Pending")   return { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" };
  if (s === "Completed") return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
  if (s === "Rejected")  return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
  return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

const Chip = ({ label, style }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 99,
    fontSize: 12, fontWeight: 700, border: `1.5px solid ${style.border}`,
    background: style.bg, color: style.color, whiteSpace: "nowrap",
  }}>{label}</span>
);

const FLabel = ({ text }) => (
  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{text}</label>
);

// ─── Create Transfer Modal ────────────────────────────────────────────────────

function CreateTransferModal({ transfers, onClose, onSubmit }) {
  const nextNum = transfers.length + 4; // offset from existing
  const transferNumber = `TRF-2026-${String(nextNum).padStart(4, "0")}`;

  const [form, setForm] = useState({
    priority: "Normal",
    from: "",
    to: "",
    notes: "",
  });
  const [lines, setLines] = useState([
    { item: "", qty: 0 },
    { item: "", qty: 0 },
  ]);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const setLine = (i, k, v) => setLines(prev => prev.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  const addLine = () => setLines(prev => [...prev, { item: "", qty: 0 }]);
  const removeLine = (i) => setLines(prev => prev.filter((_, idx) => idx !== i));

  const getAvailable = (name) => INVENTORY.find(i => i.name === name)?.available ?? null;

  const validate = () => {
    const e = {};
    if (!form.from) e.from = true;
    if (!form.to) e.to = true;
    if (form.from && form.to && form.from === form.to) e.same = true;
    const validLines = lines.filter(l => l.item && l.qty > 0);
    if (validLines.length === 0) e.items = true;
    return e;
  };

  const handleSubmit = (requestApproval) => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const validLines = lines.filter(l => l.item && l.qty > 0);
    const fromLoc = LOCATIONS.find(l => l.code === form.from);
    const toLoc   = LOCATIONS.find(l => l.code === form.to);
    const itemsLabel = validLines.map(l => `${l.item} ×${l.qty}`).join(", ");

    onSubmit({
      id: transferNumber,
      from: form.from, fromLabel: fromLoc?.label || form.from,
      to: form.to, toLabel: toLoc?.label || form.to,
      items: validLines,
      itemsLabel,
      priority: form.priority,
      notes: form.notes || "—",
      by: "System Admin",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: requestApproval ? "Pending" : "Completed",
    });
  };

  const borderColor = (field) => errors[field] ? "#fca5a5" : "#e2e8f0";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 600, boxShadow: "0 32px 80px rgba(0,0,0,0.22)", fontFamily: "'DM Sans', sans-serif", maxHeight: "92vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "22px 26px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>Create Transfer</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>Move stock between locations</div>
          </div>
          <button onClick={onClose} style={{ border: "2px solid #cbd5e1", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: "22px 26px", overflowY: "auto", flex: 1 }}>

          {/* Transfer Number + Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <FLabel text="Transfer Number" />
              <input readOnly value={transferNumber} style={autoSt} />
            </div>
            <div>
              <FLabel text="Priority" />
              <select value={form.priority} onChange={e => set("priority", e.target.value)} style={selectSt}>
                {["Normal", "Urgent", "Low"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* From / To */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <FLabel text="From Location *" />
              <select value={form.from} onChange={e => { set("from", e.target.value); setErrors(p => ({ ...p, from: false, same: false })); }}
                style={{ ...selectSt, borderColor: borderColor("from") }}>
                <option value="">Select...</option>
                {LOCATIONS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
              {errors.from && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>Required</div>}
            </div>
            <div>
              <FLabel text="To Location *" />
              <select value={form.to} onChange={e => { set("to", e.target.value); setErrors(p => ({ ...p, to: false, same: false })); }}
                style={{ ...selectSt, borderColor: borderColor("to") }}>
                <option value="">Select...</option>
                {LOCATIONS.filter(l => l.code !== form.from).map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
              {errors.to && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>Required</div>}
              {errors.same && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>Cannot be same as From</div>}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <FLabel text="Reason / Notes" />
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
              placeholder="e.g. ICU surge — urgent request"
              rows={3} style={{ ...inputSt, resize: "vertical", lineHeight: 1.6 }} />
          </div>

          {/* Items to Transfer */}
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Items to Transfer</div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 90px 36px", gap: 8, marginBottom: 6 }}>
            {["Item", "Available", "QTY", ""].map(h => (
              <div key={h} style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {lines.map((line, i) => {
            const avail = getAvailable(line.item);
            const overQty = avail !== null && line.qty > avail;
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 130px 90px 36px", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <select value={line.item} onChange={e => setLine(i, "item", e.target.value)}
                  style={{ ...selectSt, borderColor: errors.items && !line.item ? "#fca5a5" : "#e2e8f0" }}>
                  <option value="">Select item...</option>
                  {INVENTORY.map(inv => <option key={inv.name} value={inv.name}>{inv.name}</option>)}
                </select>
                <input readOnly value={avail !== null ? avail : "—"}
                  style={{ ...autoSt, textAlign: "center" }} />
                <input type="number" min={0} value={line.qty}
                  onChange={e => setLine(i, "qty", Math.max(0, parseInt(e.target.value) || 0))}
                  style={{ ...inputSt, textAlign: "center", borderColor: overQty ? "#fca5a5" : "#e2e8f0" }} />
                <button onClick={() => removeLine(i)} style={{
                  width: 32, height: 32, border: "1.5px solid #fee2e2", borderRadius: 7,
                  background: "#fff", cursor: lines.length === 1 ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: lines.length === 1 ? 0.4 : 1,
                }} disabled={lines.length === 1}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                {overQty && <div style={{ gridColumn: "1/-1", color: "#ef4444", fontSize: 11, marginTop: -4 }}>Qty exceeds available stock ({avail})</div>}
              </div>
            );
          })}

          {errors.items && <div style={{ color: "#ef4444", fontSize: 11, marginBottom: 8 }}>Add at least one item with qty &gt; 0</div>}

          {/* Add Item */}
          <button onClick={addLine} style={{
            width: "100%", padding: "10px 0", border: "1.5px dashed #bfdbfe", borderRadius: 9,
            background: "#f0f9ff", cursor: "pointer", fontSize: 13, fontWeight: 600,
            color: "#1d4ed8", fontFamily: "'DM Sans', sans-serif", marginTop: 4,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Item
          </button>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 26px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 10, justifyContent: "flex-end", alignItems: "center" }}>
          <button onClick={onClose} style={{ padding: "10px 22px", border: "1.5px solid #e2e8f0", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#374151" }}>
            Cancel
          </button>
          <button onClick={() => handleSubmit(true)} style={{ padding: "10px 18px", border: "1.5px solid #e2e8f0", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
            <span>⏳</span> Request Approval
          </button>
          <button onClick={() => handleSubmit(false)} style={{ padding: "10px 20px", border: "none", borderRadius: 9, background: "rgb(37, 99, 235)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 2px 8px rgba(14,116,144,0.3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Transfer Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View Transfer Modal ──────────────────────────────────────────────────────

function ViewTransferModal({ transfer, onClose }) {
  const lf = locColor(transfer.from);
  const lt = locColor(transfer.to);
  const ps = priorityStyle(transfer.priority);
  const ss = statusStyle(transfer.status);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(0,0,0,0.22)", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{transfer.id}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{transfer.date} · by {transfer.by}</div>
          </div>
          <button onClick={onClose} style={{ border: "2px solid #cbd5e1", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>From</div>
              <span style={{ background: lf.bg, color: lf.color, border: `1.5px solid ${lf.border}`, padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{transfer.from}</span>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{transfer.fromLabel}</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>To</div>
              <span style={{ background: lt.bg, color: lt.color, border: `1.5px solid ${lt.border}`, padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{transfer.to}</span>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{transfer.toLabel}</div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Items</div>
            {transfer.items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 8, marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "#0f172a", fontWeight: 500 }}>{it.item}</span>
                <span style={{ color: "#64748b", fontWeight: 700 }}>×{it.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Priority</div>
              <Chip label={transfer.priority} style={ps} />
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Status</div>
              <Chip label={transfer.status} style={ss} />
            </div>
          </div>
          {transfer.notes && transfer.notes !== "—" && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 13, color: "#374151" }}>
              <span style={{ fontWeight: 600, color: "#64748b" }}>Notes: </span>{transfer.notes}
            </div>
          )}
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 22px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Transfers() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [showCreate, setShowCreate] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: "Completed" } : t));
    showToast(`${id} approved and completed.`);
  };

  const handleReject = (id) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: "Rejected" } : t));
    showToast(`${id} rejected.`, "error");
  };

  const handleCreate = (newTransfer) => {
    setTransfers(prev => [newTransfer, ...prev]);
    setShowCreate(false);
    showToast(`${newTransfer.id} created successfully.`);
  };

  const total     = transfers.length;
  const pending   = transfers.filter(t => t.status === "Pending").length;
  const completed = transfers.filter(t => t.status === "Completed").length;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "28px 28px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .modal-body::-webkit-scrollbar { width: 5px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .modal-body::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .tbl-scroll::-webkit-scrollbar { height: 5px; }
        .tbl-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 0 0 14px 14px; }
        .tbl-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .tbl-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .trow:hover td { background: #f8faff !important; }
        .icon-btn { border: 1.5px solid #e2e8f0; border-radius: 7px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; transition: all 0.15s; }
        .icon-btn:hover { transform: scale(1.08); }
        .icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 24, zIndex: 2000,
          background: toast.type === "error" ? "#fee2e2" : "#dcfce7",
          color: toast.type === "error" ? "#991b1b" : "#166534",
          border: `1.5px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`,
          borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 8,
        }}>
          {toast.type === "error"
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showCreate && <CreateTransferModal transfers={transfers} onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {viewItem && <ViewTransferModal transfer={viewItem} onClose={() => setViewItem(null)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#0f172a" }}>Stock Transfers</h1>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
            Inter-location stock movements —{" "}
            <span style={{ color: "#d97706", fontWeight: 600 }}>{pending} pending approval</span>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "10px 20px",
          border: "none", borderRadius: 10, background: "rgb(37, 99, 235)",
          cursor: "pointer", fontSize: 13.5, fontWeight: 700, color: "#fff",
          boxShadow: "0 3px 10px rgba(14,116,144,0.3)", letterSpacing: "0.01em",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Transfer
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Transfers", count: total, accent: "#0e7490", sub: null },
          { label: "Pending",         count: pending, accent: "#d97706", sub: "Awaiting approval" },
          { label: "Completed",       count: completed, accent: "#16a34a", sub: null },
        ].map(({ label, count, accent, sub }) => (
          <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ height: 4, background: accent }} />
            <div style={{ padding: "18px 22px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{count}</div>
              {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div className="tbl-scroll" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <colgroup>
            <col style={{ minWidth: 120 }} />
            <col style={{ minWidth: 100 }} />
            <col style={{ minWidth: 100 }} />
            <col style={{ minWidth: 180 }} />
            <col style={{ minWidth: 80 }} />
            <col style={{ minWidth: 110 }} />
            <col style={{ minWidth: 110 }} />
            <col style={{ minWidth: 100 }} />
            <col style={{ minWidth: 90 }} />
            <col style={{ minWidth: 110 }} />
          </colgroup>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
              {["Transfer #", "From", "To", "Items", "Priority", "Notes", "By", "Date", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "11px 8px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transfers.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No transfers found.</td></tr>
            ) : transfers.map((row, i) => {
              const lf = locColor(row.from);
              const lt = locColor(row.to);
              const ps = priorityStyle(row.priority);
              const ss = statusStyle(row.status);
              const isPending = row.status === "Pending";
              return (
                <tr key={row.id} className="trow" style={{ borderBottom: i < transfers.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "12px 8px" }}>
                    <button onClick={() => setViewItem(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, fontWeight: 700, color: "#0e7490", fontFamily: "'DM Sans', sans-serif" }}>
                      {row.id}
                    </button>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{ background: lf.bg, color: lf.color, border: `1.5px solid ${lf.border}`, padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 3 }}>{row.from}</span>
                    <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.fromLabel}</div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{ background: lt.bg, color: lt.color, border: `1.5px solid ${lt.border}`, padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 3 }}>{row.to}</span>
                    <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.toLabel}</div>
                  </td>
                  <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#374151", whiteSpace: "nowrap" }}>{row.itemsLabel}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <Chip label={row.priority} style={ps} />
                  </td>
                  <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap" }}>{row.notes}</td>
                  <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#374151", whiteSpace: "nowrap" }}>{row.by}</td>
                  <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <Chip label={row.status} style={ss} />
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {/* ✓ Approve */}
                      <button
                        title="Approve"
                        disabled={!isPending}
                        onClick={() => isPending && handleApprove(row.id)}
                        style={{
                          width: 32, height: 32,
                          border: "1.5px solid #d1d5db",
                          borderRadius: 8,
                          background: "#fff",
                          cursor: isPending ? "pointer" : "not-allowed",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          opacity: isPending ? 1 : 0.3,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isPending ? "#16a34a" : "#9ca3af"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </button>

                      {/* ✗ Reject */}
                      <button
                        title="Reject"
                        disabled={!isPending}
                        onClick={() => isPending && handleReject(row.id)}
                        style={{
                          width: 32, height: 32,
                          border: "1.5px solid #d1d5db",
                          borderRadius: 8,
                          background: "#fff",
                          cursor: isPending ? "pointer" : "not-allowed",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          opacity: isPending ? 1 : 0.3,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isPending ? "#ef4444" : "#9ca3af"} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>

                      {/* ● View — filled red circle */}
                      <button
                        title="View details"
                        onClick={() => setViewItem(row)}
                        style={{
                          width: 32, height: 32,
                          border: "1.5px solid #d1d5db",
                          borderRadius: 8,
                          background: "#fff",
                          cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block", flexShrink: 0 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        <div style={{ padding: "11px 16px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
          <span>Showing {transfers.length} transfer{transfers.length !== 1 ? "s" : ""}</span>
          <span>Stock Transfers • TiaTELE</span>
        </div>
      </div>
    </div>
  );
}
