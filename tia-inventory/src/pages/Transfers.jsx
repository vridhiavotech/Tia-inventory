import { useState, useEffect } from "react";
import CreateTransferModal from "./InventoryItems/CreateTransferModal";

// ─── localStorage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = "tiatele_transfers";

const loadTransfers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saveTransfers = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

// ─── Seed Data (only used when localStorage is empty) ─────────────────────────
const seedTransfers = [
  {
    id: "TRF-2026-0003",
    from: "CS-01",
    fromLabel: "Central Store",
    to: "ICU-01",
    toLabel: "ICU",
    items: [
      { item: "Amoxicillin 500mg", qty: 20 },
      { item: "NS 0.9% IV 1L", qty: 10 },
    ],
    itemsLabel: "Amoxicillin 500mg ×20, NS 0.9% IV 1L ×10",
    priority: "Urgent",
    notes: "ICU running low",
    by: "Sarah Anderson",
    date: "Mar 19, 2026",
    status: "Pending",
  },
  {
    id: "TRF-2026-0002",
    from: "CS-01",
    fromLabel: "Central Store",
    to: "PH-01",
    toLabel: "Pharmacy",
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
    from: "CS-01",
    fromLabel: "Central Store",
    to: "OR-01",
    toLabel: "OR / Surgery",
    items: [{ item: "Lidocaine 1% 20mL", qty: 10 }],
    itemsLabel: "Lidocaine 1% 20mL ×10",
    priority: "Normal",
    notes: "OR prep",
    by: "T. Williams",
    date: "Mar 15, 2026",
    status: "Completed",
  },
];

// ─── Stat Card — matches Stock Issue style exactly ────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      flex: 1,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderLeft: `3px solid ${color}`,
      borderRadius: 10,
      padding: "12px 16px",
      minWidth: 0,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: "#9ca3af",
        letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, fontWeight: 600, color: color, marginTop: 3 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const CheckIcon = ({ size = 10 }) => (
  <span style={{ fontSize: size + 2, color: "#16a34a" }}>✅</span>
);
const CrossIcon = ({ size = 10 }) => (
  <span style={{ fontSize: size + 2, color: "#ef4444" }}>❌</span>
);
const EyeIcon = ({ size = 10 }) => (
  <span style={{ fontSize: size + 2, color: "#3b82f6" }}>👁️</span>
);

// ─── Badge helpers ────────────────────────────────────────────────────────────
const locColor = (code) => {
  const map = {
    "CS-01":  { bg: "#ede9fe", color: "#6d28d9", border: "#ddd6fe" },
    "PH-01":  { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "IC-01":  { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "ICU-01": { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "OR-01":  { bg: "#ffedd5", color: "#c2410c", border: "#fed7aa" },
    "WA-01":  { bg: "#fce7f3", color: "#9d174d", border: "#fbcfe8" },
    "WA-02":  { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
    "EM-01":  { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
    "SU-01":  { bg: "#ffedd5", color: "#c2410c", border: "#fed7aa" },
    "LA-01":  { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" },
    "OP-01":  { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    "MA-01":  { bg: "#fdf4ff", color: "#86198f", border: "#f0abfc" },
  };
  return map[code] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

const priorityStyle = (p) => {
  if (p === "Urgent")   return { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" };
  if (p === "Critical") return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
  return { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };
};

const statusStyle = (s) => {
  if (s === "Pending")   return { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" };
  if (s === "Completed") return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
  if (s === "Rejected")  return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
  return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

const Chip = ({ label, style }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 99,
    fontSize: 12, fontWeight: 700,
    border: `1.5px solid ${style.border}`,
    background: style.bg, color: style.color, whiteSpace: "nowrap",
  }}>
    {label}
  </span>
);

// ─── View Transfer Modal ──────────────────────────────────────────────────────
function ViewTransferModal({ transfer, onClose }) {
  const lf = locColor(transfer.from);
  const lt = locColor(transfer.to);
  const ps = priorityStyle(transfer.priority);
  const ss = statusStyle(transfer.status);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{transfer.id}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{transfer.date} · by {transfer.by}</div>
          </div>
          <button onClick={onClose} style={{ border: "2px solid #cbd5e1", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", cursor: "pointer", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
          <button onClick={onClose} style={{ padding: "9px 22px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Transfers() {
  const [transfers, setTransfers] = useState(() => loadTransfers() ?? seedTransfers);
  const [showCreate, setShowCreate] = useState(false);
  const [viewItem,   setViewItem]   = useState(null);
  const [toast,      setToast]      = useState(null);

  useEffect(() => {
    saveTransfers(transfers);
  }, [transfers]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setTransfers((prev) => prev.map((t) => t.id === id ? { ...t, status: "Completed" } : t));
    showToast(`${id} approved and completed.`);
  };

  const handleReject = (id) => {
    setTransfers((prev) => prev.map((t) => t.id === id ? { ...t, status: "Rejected" } : t));
    showToast(`${id} rejected.`, "error");
  };

  const handleCreate = (newTransfer) => {
    setTransfers((prev) => [newTransfer, ...prev]);
    showToast(`${newTransfer.id} created successfully.`);
  };

  const total     = transfers.length;
  const pending   = transfers.filter((t) => t.status === "Pending").length;
  const completed = transfers.filter((t) => t.status === "Completed").length;
  const rejected  = transfers.filter((t) => t.status === "Rejected").length;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "28px 28px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tbl-scroll::-webkit-scrollbar { height: 5px; }
        .tbl-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 0 0 14px 14px; }
        .tbl-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .tbl-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .trow:hover td { background: #f8faff !important; }
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
          {toast.type === "error" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <CreateTransferModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
        prefillItem={null}
      />
      {viewItem && (
        <ViewTransferModal transfer={viewItem} onClose={() => setViewItem(null)} />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Stock Transfers</h1>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
            Inter-location stock movements —{" "}
            <span style={{ color: "#d97706", fontWeight: 600 }}>{pending} pending approval</span>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 20px", border: "none", borderRadius: 10,
            background: "#2563eb", cursor: "pointer",
            fontSize: 13.5, fontWeight: 700, color: "#fff", letterSpacing: "0.01em",
            outline: "none",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Transfer
        </button>
      </div>

      {/* Stat Cards — Stock Issue style */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Transfers" value={total}     color="#f59e0b" sub="All transfers" />
        <StatCard label="Pending"         value={pending}   color="#8b5cf6" sub="Awaiting approval" />
        <StatCard label="Completed"       value={completed} color="#10b981" sub="Successfully moved" />
        <StatCard label="Rejected"        value={rejected}  color="#ef4444" sub="Needs review" />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div className="tbl-scroll" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <colgroup>
              <col style={{ minWidth: 120 }} /><col style={{ minWidth: 100 }} />
              <col style={{ minWidth: 100 }} /><col style={{ minWidth: 180 }} />
              <col style={{ minWidth: 80 }}  /><col style={{ minWidth: 110 }} />
              <col style={{ minWidth: 110 }} /><col style={{ minWidth: 100 }} />
              <col style={{ minWidth: 90 }}  /><col style={{ minWidth: 110 }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                {["Transfer #","From","To","Items","Priority","Notes","By","Date","Status","Actions"].map((h) => (
                  <th key={h} style={{ padding: "11px 8px", textAlign: "left", fontSize: 10.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                    No transfers found.
                  </td>
                </tr>
              ) : (
                transfers.map((row, i) => {
                  const lf = locColor(row.from);
                  const lt = locColor(row.to);
                  const ps = priorityStyle(row.priority);
                  const ss = statusStyle(row.status);
                  const isPending = row.status === "Pending";
                  return (
                    <tr key={row.id} className="trow" style={{ borderBottom: i < transfers.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <td style={{ padding: "12px 8px" }}>
                        <button onClick={() => setViewItem(row)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 12, fontWeight: 700, color: "#0e7490" }}>
                          {row.id}
                        </button>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{ background: lf.bg, color: lf.color, border: `1.5px solid ${lf.border}`, padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 3 }}>
                          {row.from}
                        </span>
                        <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.fromLabel}</div>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span style={{ background: lt.bg, color: lt.color, border: `1.5px solid ${lt.border}`, padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 700, display: "inline-block", marginBottom: 3 }}>
                          {row.to}
                        </span>
                        <div style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.toLabel}</div>
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#374151", whiteSpace: "nowrap" }}>{row.itemsLabel}</td>
                      <td style={{ padding: "12px 8px" }}><Chip label={row.priority} style={ps} /></td>
                      <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap" }}>{row.notes}</td>
                      <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#374151", whiteSpace: "nowrap" }}>{row.by}</td>
                      <td style={{ padding: "12px 8px", fontSize: 11.5, color: "#94a3b8", whiteSpace: "nowrap" }}>{row.date}</td>
                      <td style={{ padding: "12px 8px" }}><Chip label={row.status} style={ss} /></td>
                      <td style={{ padding: "6px 8px" }}>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <button title="Approve" disabled={!isPending} onClick={() => isPending && handleApprove(row.id)}
                            style={{ width: 28, height: 28, border: "1.5px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: isPending ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: isPending ? 1 : 0.3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                            <CheckIcon size={12} />
                          </button>
                          <button title="Reject" disabled={!isPending} onClick={() => isPending && handleReject(row.id)}
                            style={{ width: 28, height: 28, border: "1.5px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: isPending ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: isPending ? 1 : 0.3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                            <CrossIcon size={12} />
                          </button>
                          <button title="View details" onClick={() => setViewItem(row)}
                            style={{ width: 28, height: 28, border: "1.5px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                            <EyeIcon size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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