import { useState, useRef } from "react";
import { Typography,Box } from "@mui/material";

// Add this color object right after your imports or at the top of the component
const C = {
  bg:            "#F8FAFC",
  border:        "#E5E7EB",
  textPrimary:   "#111827",
  textSecondary: "#6B7280",
  primary:       "#1976D2",
};

// ─── Initial Documents ────────────────────────────────────────────────────────

const initialDocs = [
  {
    id: "doc-1",
    name: "Medline PPE Certificate of Compliance",
    size: "1.1 MB",
    date: "Feb 14, 2026",
    version: "v1.0",
    type: "Certificate",
    status: "active",
  },
  {
    id: "doc-2",
    name: "Controlled Substances SOP — DEA Compliance",
    size: "856 KB",
    date: "Mar 1, 2026",
    version: "Rev-5",
    type: "SOP / Policy",
    status: "active",
  },
  {
    id: "doc-3",
    name: "PO-2026-0002 — Medline Invoice",
    size: "184 KB",
    date: "Mar 20, 2026",
    version: null,
    type: "Invoice",
    status: "active",
  },
  {
    id: "doc-4",
    name: "Surgical Kit Assembly — Standard BOM",
    size: "48 KB",
    date: "Mar 5, 2026",
    version: "v2.1",
    type: "Bill of Materials",
    status: "active",
  },
  {
    id: "doc-5",
    name: "Epinephrine MSDS — Safety Data Sheet",
    size: "320 KB",
    date: "Feb 20, 2026",
    version: null,
    type: "MSDS",
    status: "active",
  },
];

const ALL_TYPES = [
  "Certificate",
  "SOP / Policy",
  "Invoice",
  "Bill of Materials",
  "MSDS",
  "Report",
  "Other",
];

const ALL_STATUSES = ["All", "Active", "Expiring Soon", "Expired"];

// ─── Type badge colors ────────────────────────────────────────────────────────

const typeColor = (type) => {
  const map = {
    "Certificate":      { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
    "SOP / Policy":     { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" },
    "Invoice":          { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "Bill of Materials":{ bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "MSDS":             { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" },
    "Report":           { bg: "#f3e8ff", color: "#7c3aed", border: "#ddd6fe" },
    "Other":            { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" },
  };
  return map[type] || { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({ onClose, onUpload }) {
  const [name,    setName]    = useState("");
  const [type,    setType]    = useState("Certificate");
  const [version, setVersion] = useState("");
  const [file,    setFile]    = useState(null);
  const [dragging,setDragging]= useState(false);
  const [error,   setError]   = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    if (!name) setName(f.name.replace(/\.[^.]+$/, ""));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError("Document name is required."); return; }
    if (!file)        { setError("Please select a file to upload."); return; }
    const sizeKB = file.size / 1024;
    const sizeStr = sizeKB >= 1024
      ? `${(sizeKB / 1024).toFixed(1)} MB`
      : `${Math.round(sizeKB)} KB`;
    onUpload({
      id: `doc-${Date.now()}`,
      name: name.trim(),
      size: sizeStr,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      version: version.trim() || null,
      type,
      status: "active",
    });
    onClose();
  };

  const inputSt = {
    width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0",
    borderRadius: 8, fontSize: 13, 
    boxSizing: "border-box", outline: "none", color: "#0f172a", background: "#f8fafc",
  };
  const selectSt = {
    ...inputSt,
    appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 34, cursor: "pointer",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, boxShadow: "0 24px 64px rgba(0,0,0,0.2)",  }}>

        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a" }}>Upload Document</div>
            <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}>Add a new document to the library</div>
          </div>
          <button onClick={onClose} style={{ border: "2px solid #cbd5e1", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", cursor: "pointer", flexShrink: 0, padding: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? "#2563eb" : file ? "#22c55e" : "#cbd5e1"}`,
              borderRadius: 10, padding: "22px 16px", textAlign: "center",
              background: dragging ? "#eff6ff" : file ? "#f0fdf4" : "#f8fafc",
              cursor: "pointer", transition: "all 0.15s",
            }}>
            <input ref={inputRef} type="file" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <>
                <div style={{ fontSize: 22, marginBottom: 4 }}>📄</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>{file.name}</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{(file.size / 1024).toFixed(0)} KB · Click to change</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 22, marginBottom: 4 }}>☁️</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Drop file here or <span style={{ color: "#2563eb" }}>browse</span></div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>PDF, DOCX, XLSX, PNG — max 50MB</div>
              </>
            )}
          </div>

          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Document Name *</label>
            <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Medline PPE Certificate"
              style={{ ...inputSt, borderColor: error && !name ? "#fca5a5" : "#e2e8f0" }} />
          </div>

          {/* Type + Version */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Document Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={selectSt}>
                {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Version</label>
              <input value={version} onChange={e => setVersion(e.target.value)} placeholder="e.g. v1.0" style={inputSt} />
            </div>
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, padding: "8px 12px" }}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13,fontWeight: 600, color: "#374151" }}>Cancel</button>
          <button onClick={handleSubmit} style={{ padding: "8px 22px", border: "none", borderRadius: 8, background: "#2563eb", cursor: "pointer", fontSize: 13,  fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}>Upload</button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteModal({ doc, onClose, onConfirm }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", padding: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Delete Document</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>This cannot be undone</div>
          </div>
        </div>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "#374151" }}>
          Delete <strong>"{doc.name}"</strong>?
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13,  fontWeight: 600, color: "#374151" }}>Cancel</button>
          <button onClick={() => onConfirm(doc.id)} style={{ padding: "8px 20px", border: "none", borderRadius: 8, background: "#ef4444", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────

function DocCard({ doc, onDelete }) {
  const tc = typeColor(doc.type);
  const meta = [doc.size, doc.date, doc.version].filter(Boolean).join(" · ");

  return (
    <div style={{
      background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0",
      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative",
      transition: "box-shadow 0.15s",
      cursor: "pointer",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.09)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"}
    >
      {/* Top row: icon + name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.35, wordBreak: "break-word" }}>{doc.name}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{meta}</div>
        </div>
      </div>

      {/* Bottom row: type badge + delete */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          padding: "3px 10px", borderRadius: 6, fontSize: 11.5, fontWeight: 700,
          background: tc.bg, color: tc.color, border: `1.5px solid ${tc.border}`,
        }}>{doc.type}</span>

        <button
          onClick={e => { e.stopPropagation(); onDelete(doc); }}
          title="Delete"
          style={{ width: 28, height: 28, border: "1.5px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ value, options, onChange, minWidth = 120 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useState(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(p => !p)} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
        border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff",
        cursor: "pointer", fontSize: 13, 
        color: "#374151", fontWeight: 500, whiteSpace: "nowrap", minWidth,
        boxShadow: open ? "0 0 0 3px #dbeafe" : "none", transition: "box-shadow 0.15s",
      }}>
        <span style={{ flex: 1, textAlign: "left" }}>{value}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: "100%",
          background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 100, overflow: "hidden",
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "9px 14px", cursor: "pointer", fontSize: 13,
             
                color: value === opt ? "#2563eb" : "#374151",
                fontWeight: value === opt ? 700 : 400,
                background: value === opt ? "#eff6ff" : "transparent",
              }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { e.currentTarget.style.background = value === opt ? "#eff6ff" : "transparent"; }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type }) {
  return (
    <div style={{
      position: "fixed", top: 20, right: 22, zIndex: 2000,
      background: type === "error" ? "#fee2e2" : "#dcfce7",
      color: type === "error" ? "#991b1b" : "#166534",
      border: `1.5px solid ${type === "error" ? "#fecaca" : "#bbf7d0"}`,
      borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 7,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {msg}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocumentManagement() {
  const [docs,        setDocs]        = useState(initialDocs);
  const [typeFilter,  setTypeFilter]  = useState("All Types");
  const [statFilter,  setStatFilter]  = useState("All");
  const [showUpload,  setShowUpload]  = useState(false);
  const [deleteTarget,setDeleteTarget]= useState(null);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = (doc) => {
    setDocs(prev => [doc, ...prev]);
    showToast(`"${doc.name}" uploaded successfully.`);
  };

  const handleDelete = (id) => {
    const doc = docs.find(d => d.id === id);
    setDocs(prev => prev.filter(d => d.id !== id));
    setDeleteTarget(null);
    showToast(`"${doc?.name}" deleted.`);
  };

  const typeOptions = ["All Types", ...ALL_TYPES];

  const filtered = docs.filter(d => {
    const matchType = typeFilter === "All Types" || d.type === typeFilter;
    const matchStat = statFilter === "All" || d.status === statFilter.toLowerCase().replace(" ", "-");
    return matchType && matchStat;
  });

  const expiringSoon = 0;
  const expired = 0;

  return (
    <div style={{  background: "#f8fafc", minHeight: "100vh", padding: "26px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {toast       && <Toast msg={toast.msg} type={toast.type} />}
      {showUpload  && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
      {deleteTarget && <DeleteModal doc={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        {/* <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a"}}>Document Management</h1>
          <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 4 }}>
            <span style={{ color: "#6c757d" }}>{docs.length} documents</span>
            {" · "}
            <span style={{ color: expiringSoon > 0 ? "#d97706" : "#6c757d" }}>{expiringSoon} expiring soon</span>
            {" · "}
            <span style={{ color: expired > 0 ? "#ef4444" : "#6c757d" }}>{expired} expired</span>
          </div>
        </div> */}

        <Box>
  <Typography
    sx={{
      fontWeight: 700,
      fontSize: 22,
      color: C.textPrimary,
      letterSpacing: -0.3,
    }}
  >
    Document Management
  </Typography>

  <Typography
    sx={{
      fontSize: 13,
      color: C.textSecondary,
      mt: 0.3,
    }}
  >
    <Box component="span" sx={{ color: "#6c757d" }}>
      {docs.length} documents
    </Box>
    {" · "}
    <Box
      component="span"
      sx={{ color: expiringSoon > 0 ? "#d97706" : "#6c757d" }}
    >
      {expiringSoon} expiring soon
    </Box>
    {" · "}
    <Box
      component="span"
      sx={{ color: expired > 0 ? "#ef4444" : "#6c757d" }}
    >
      {expired} expired
    </Box>
  </Typography>
</Box>

        {/* Filters + Upload */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <FilterDropdown
            value={typeFilter}
            options={typeOptions}
            onChange={setTypeFilter}
            minWidth={130}
          />
          <FilterDropdown
            value={statFilter}
            options={ALL_STATUSES}
            onChange={setStatFilter}
            minWidth={80}
          />
          <button onClick={() => setShowUpload(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 18px", border: "none", borderRadius: 9,
            background: "#2563eb", cursor: "pointer", fontSize: 13,
            fontWeight: 700, color: "#fff", 
            boxShadow: "0 2px 8px rgba(37,99,235,0.28)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Upload Document
          </button>
        </div>
      </div>

      {/* ── Document Grid ── */}
      <div style={{ marginTop: 20 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>No documents found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              {typeFilter !== "All Types" || statFilter !== "All"
                ? "Try adjusting your filters."
                : 'Click "+ Upload Document" to add one.'}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {filtered.map(doc => (
              <DocCard key={doc.id} doc={doc} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      {/* Footer count */}
      {filtered.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8", textAlign: "right" }}>
          Showing {filtered.length} of {docs.length} documents
        </div>
      )}
    </div>
  );
}
