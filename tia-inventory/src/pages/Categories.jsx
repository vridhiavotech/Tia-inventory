import { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";

// ─── Design tokens — mirrors StockIssue ──────────────────────────────────────
const btnPrimary = {
  height: 32, px: "12px", borderRadius: "12px",
  bgcolor: "#015DFF", color: "#fff",
  textTransform: "none", fontSize: 13, fontWeight: 600,
  boxShadow: "none", gap: "8px", minWidth: 0,
  "& .MuiButton-startIcon": { mr: 0 },
  "&:hover": { bgcolor: "#0147CC", boxShadow: "none" },
};

const btnOutlined = {
  height: 32, px: "12px", borderRadius: "12px",
  border: "1px solid #015DFF", bgcolor: "#fff", color: "#015DFF",
  textTransform: "none", fontSize: 13, fontWeight: 600,
  boxShadow: "none", gap: "8px", minWidth: 0,
  "& .MuiButton-startIcon": { mr: 0 },
  "&:hover": { border: "1px solid #015DFF", bgcolor: "#EFF4FF", boxShadow: "none" },
};

const C = {
  bg:            "#F8FAFC",
  border:        "#E5E7EB",
  textPrimary:   "#111827",
  textSecondary: "#6B7280",
  primary:       "#1976D2",
};

const initialCategories = [
  {
    id: "cat-1",
    name: "Pharmaceuticals",
    code: "PH",
    icon: "💊",
    description: "Drugs, medicines, injectables",
    items: 9,
    status: "Active",
    subcategories: [
      { id: "s1-1", name: "Antibiotics",                  code: "PH-AB", icon: "🚀", description: "Antibiotic agents",                          items: 2, status: "Active" },
      { id: "s1-2", name: "Analgesics / Pain Management", code: "PH-AN", icon: "🖼️", description: "Pain relief including opioids & NSAIDs",     items: 2, status: "Active" },
      { id: "s1-3", name: "IV Fluids & Electrolytes",     code: "PH-IV", icon: "🖊️", description: "Intravenous fluids and infusions",            items: 2, status: "Active" },
      { id: "s1-4", name: "Emergency Drugs",              code: "PH-EM", icon: "🚨", description: "Critical care and crash cart medications",   items: 2, status: "Active" },
      { id: "s1-5", name: "Anaesthetics",                 code: "PH-AE", icon: "🤩", description: "Local and general anaesthetic agents",       items: 1, status: "Active" },
      { id: "s1-6", name: "Vitamins & Supplements",       code: "PH-VS", icon: "🌿", description: "Nutritional supplements",                    items: 0, status: "Active" },
    ],
  },
  {
    id: "cat-2",
    name: "Surgical Supplies",
    code: "SS",
    icon: "🩺",
    description: "Surgical instruments & disposables",
    items: 1,
    status: "Active",
    subcategories: [
      { id: "s2-1", name: "Sutures & Staples",     code: "SS-SU", icon: "🧵", description: "Wound closure materials",             items: 3, status: "Active" },
      { id: "s2-2", name: "Catheters & Drainage",  code: "SS-CD", icon: "🪡", description: "Drainage and catheter sets",          items: 2, status: "Active" },
      { id: "s2-3", name: "Needles & Syringes",    code: "SS-NS", icon: "💉", description: "Injection and infusion needles",      items: 2, status: "Active" },
      { id: "s2-4", name: "Surgical Instruments",  code: "SS-SI", icon: "🔧", description: "Operating room instruments",          items: 2, status: "Active" },
    ],
  },
  {
    id: "cat-3",
    name: "PPE & Protective",
    code: "PP",
    icon: "🦺",
    description: "Personal protective equipment",
    items: 3,
    status: "Active",
    subcategories: [
      { id: "s3-1", name: "Gloves",                code: "PP-GL", icon: "🧤", description: "Sterile and exam gloves",             items: 3, status: "Active" },
      { id: "s3-2", name: "Masks & Respirators",   code: "PP-MR", icon: "😷", description: "Surgical and N95 masks",             items: 2, status: "Active" },
      { id: "s3-3", name: "Gowns & Covers",        code: "PP-GC", icon: "🥼", description: "Sterile surgical gowns",             items: 1, status: "Active" },
      { id: "s3-4", name: "Eye & Face Protection", code: "PP-EF", icon: "🥽", description: "Goggles, shields and visors",        items: 2, status: "Active" },
    ],
  },
  {
    id: "cat-4",
    name: "Lab Supplies",
    code: "LS",
    icon: "🧪",
    description: "Laboratory consumables & reagents",
    items: 1,
    status: "Active",
    subcategories: [
      { id: "s4-1", name: "Collection Tubes",    code: "LS-CT", icon: "🔵", description: "Blood collection and specimen tubes", items: 2, status: "Active" },
      { id: "s4-2", name: "Reagents & Chemicals",code: "LS-RC", icon: "🐛", description: "Chemical reagents for testing",       items: 2, status: "Active" },
      { id: "s4-3", name: "Culture Media",       code: "LS-CM", icon: "🦠", description: "Microbiology culture materials",     items: 2, status: "Active" },
      { id: "s4-4", name: "Pipettes & Tips",     code: "LS-PT", icon: "💧", description: "Liquid handling consumables",        items: 2, status: "Active" },
    ],
  },
  {
    id: "cat-5",
    name: "Equipment / Devices",
    code: "ED",
    icon: "🖥️",
    description: "Medical devices & monitoring",
    items: 0,
    status: "Active",
    subcategories: [
      { id: "s5-1", name: "Monitoring Equipment", code: "ED-ME", icon: "📋", description: "Vital sign monitors",                items: 2, status: "Active" },
      { id: "s5-2", name: "Infusion Pumps",        code: "ED-IP", icon: "⚙️", description: "IV and medication infusion pumps", items: 2, status: "Active" },
      { id: "s5-3", name: "Diagnostic Devices",    code: "ED-DD", icon: "🔨", description: "Imaging and diagnostic tools",     items: 1, status: "Active" },
    ],
  },
  {
    id: "cat-6",
    name: "Wound Care",
    code: "WC",
    icon: "🩹",
    description: "Bandages, dressings, wound care",
    items: 1,
    status: "Active",
    subcategories: [
      { id: "s6-1", name: "Dressings",         code: "WC-DR", icon: "🖊️", description: "Primary wound dressings",          items: 2, status: "Active" },
      { id: "s6-2", name: "Bandages & Tapes",  code: "WC-BT", icon: "🎀", description: "Bandaging and adhesive tapes",     items: 1, status: "Active" },
      { id: "s6-3", name: "Antiseptics",       code: "WC-AS", icon: "🧴", description: "Wound cleaning solutions",         items: 1, status: "Active" },
    ],
  },
];

const EMOJI_OPTIONS = [
  "💊","🩺","🦺","🧪","🖥️","🩹","🚀","🧵","🥼","😷","🧤","🔬","💉","📊","🩻",
  "🌿","🚨","🛡️","🥽","⚗️","🧫","🧴","➕","🔪","🧽","🌡️","💡","🏥","🧬","📦",
  "🔵","💧","🦠","🥋","🎀","🔧","⚙️","🔨","📋","🪡","🐛","🖊️","🖼️","🗂️","📁",
  "🏷️","🤩",
];

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 34,
  cursor: "pointer",
};

const FLabel = ({ text, required }) => (
  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>
    {text}{required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
  </label>
);

const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ border: "1.5px solid #cbd5e1", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", cursor: "pointer", flexShrink: 0 }}>
    <span style={{ fontSize: 15, color: "#1e293b", fontWeight: 600 }}>✕</span>
  </button>
);

const StatusChip = ({ status }) => (
  <span style={{ padding: "3px 15px", borderRadius: 99, fontSize: 10, fontWeight: 700, background: status === "Active" ? "#dcfce7" : "#f1f5f9", color: status === "Active" ? "#166534" : "#64748b", border: `1.5px solid ${status === "Active" ? "#bbf7d0" : "#e2e8f0"}`, whiteSpace: "nowrap", marginRight: "20px" }}>
    {status}
  </span>
);

function CategoryModal({ mode, prefillParent, editItem, categories, onClose, onSave }) {
  const isEdit  = mode.startsWith("edit");
  const initSub = mode === "add-subcategory" || mode === "edit-subcategory";

  const [type,     setType]     = useState(initSub ? "subcategory" : "category");
  const [parentId, setParentId] = useState(editItem?._catId || prefillParent || "");
  const [name,     setName]     = useState(editItem?.name || "");
  const [code,     setCode]     = useState(editItem?.code || "");
  const [icon,     setIcon]     = useState(editItem?.icon || "📦");
  const [desc,     setDesc]     = useState(editItem?.description || "");
  const [status,   setStatus]   = useState(editItem?.status || "Active"); // eslint-disable-line no-unused-vars
  const [errors,   setErrors]   = useState({});
  const [showEmoji,setShowEmoji]= useState(false);

  const isSub = type === "subcategory";

  const autoCode = (val) => {
    setName(val);
    if (!isEdit && !code) {
      const words = val.trim().split(/\s+/);
      setCode(words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : val.slice(0, 2).toUpperCase());
    }
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (isSub && !parentId) e.parent = "Select a parent category";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ type, parentId, name: name.trim(), code: code.trim().toUpperCase(), icon, description: desc.trim(), status });
  };

  const title    = isEdit ? (isSub ? "Edit Subcategory" : "Edit Category")    : (isSub ? "Add Subcategory" : "Add Category");
  const subtitle = isSub ? "Belongs under a parent category" : "Create a top-level category";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.48)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px 13px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>🏷️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a" }}>{title}</div>
            <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}>{subtitle}</div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: "5px 20px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
          {/* Type toggle */}
          <div>
            <FLabel text="Category Type" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { val: "category",    label: "Category",    sub: "Top-level grouping",      emoji: "🗂️" },
                { val: "subcategory", label: "Subcategory", sub: "Belongs to a category",   emoji: "📁" },
              ].map((opt) => (
                <button key={opt.val} onClick={() => { setType(opt.val); setErrors({}); }} style={{ padding: "10px 8px", borderRadius: 9, cursor: "pointer", border: type === opt.val ? "2px solid #2563eb" : "1.5px solid #e2e8f0", background: type === opt.val ? "#f0fdfa" : "#fff", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{opt.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: type === opt.val ? "#2563eb" : "#374151" }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{opt.sub}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Parent — subcategory only */}
          {isSub && (
            <div>
              <FLabel text="Parent Category" required />
              <select value={parentId} onChange={(e) => { setParentId(e.target.value); setErrors((p) => ({ ...p, parent: null })); }} style={{ ...selectSt, borderColor: errors.parent ? "#fca5a5" : "#e2e8f0" }}>
                <option value="">Select parent category...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              {errors.parent && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 3 }}>{errors.parent}</div>}
            </div>
          )}

          {/* Name */}
          <div>
            <FLabel text="Name" required />
            <input value={name} onChange={(e) => { autoCode(e.target.value); setErrors((p) => ({ ...p, name: null })); }} placeholder="e.g. Pharmaceuticals" style={{ ...inputSt, borderColor: errors.name ? "#fca5a5" : "#e2e8f0" }} />
            {errors.name && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 3 }}>{errors.name}</div>}
          </div>

          {/* Code + Icon */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FLabel text="Code" />
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 8))} placeholder="PH" style={inputSt} maxLength={8} />
            </div>
            <div style={{ position: "relative" }}>
              <FLabel text="Icon (Emoji)" />
              <button onClick={() => setShowEmoji((p) => !p)} style={{ ...inputSt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer", border: `1.5px solid ${showEmoji ? "#2563eb" : "#e2e8f0"}`, boxShadow: showEmoji ? "0 0 0 3px #ccfbf1" : "none", padding: "3px" }}>
                {icon}
              </button>
              {showEmoji && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: "-30px", zIndex: 300, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: 10, boxShadow: "0 8px 28px rgba(0,0,0,0.14)", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 2 }}>
                  {EMOJI_OPTIONS.map((em) => (
                    <button key={em} onClick={() => { setIcon(em); setShowEmoji(false); }} style={{ fontSize: 17, background: icon === em ? "#f0fdfa" : "#f8fafc", border: icon === em ? "2px solid #2563eb" : "1.5px solid #e2e8f0", borderRadius: 7, padding: "4px", cursor: "pointer", lineHeight: 1 }}>{em}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <FLabel text="Description" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description..." rows={2} style={{ ...inputSt, resize: "vertical", lineHeight: 1 }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "13px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: "8px 22px", border: "none", borderRadius: 8, background: "#2563eb", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px rgba(14,116,144,0.25)" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

const Toast = ({ msg }) => (
  <div style={{ position: "fixed", top: 18, right: 22, zIndex: 2000, background: "#dcfce7", color: "#166534", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 7 }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    {msg}
  </div>
);

const IBtn = ({ onClick, title, border, bg, children }) => (
  <button onClick={onClick} title={title} style={{ width: 30, height: 30, border: `1.5px solid ${border}`, borderRadius: 7, background: bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: "5px" }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
  >
    {children}
  </button>
);

const PencilIcon = ({ size = 12 }) => <span style={{ fontSize: size + 2, color: "#d97706" }}>✏️</span>;
const BanIcon    = ({ size = 12 }) => <span style={{ fontSize: size + 2, color: "#ef4444" }}>🚫</span>;

export default function Categories() {
  const [cats,      setCats]      = useState(initialCategories);
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };
  const totalSubs  = cats.reduce((a, c) => a + c.subcategories.length, 0);
  const toggleCollapse = (id) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  const toggleStatus = (catId, subId) => {
    setCats((prev) => prev.map((cat) => {
      if (cat.id !== catId) return cat;
      if (subId) return { ...cat, subcategories: cat.subcategories.map((s) => s.id === subId ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s) };
      return { ...cat, status: cat.status === "Active" ? "Inactive" : "Active" };
    }));
  };

  const handleSave = ({ type, parentId, name, code, icon, description, status }) => {
    const editItem = modal?.editItem;
    if (editItem) {
      if (editItem._isSub) {
        setCats((prev) => prev.map((c) => c.id !== editItem._catId ? c : { ...c, subcategories: c.subcategories.map((s) => s.id === editItem.id ? { ...s, name, code, icon, description, status } : s) }));
      } else {
        setCats((prev) => prev.map((c) => c.id === editItem.id ? { ...c, name, code, icon, description, status } : c));
      }
      showToast(`"${name}" updated.`);
    } else if (type === "category") {
      setCats((prev) => [...prev, { id: uid(), name, code, icon, description, items: 0, status: "Active", subcategories: [] }]);
      showToast(`Category "${name}" added.`);
    } else {
      const newSub = { id: uid(), name, code, icon, description, items: 0, status: "Active" };
      setCats((prev) => prev.map((c) => c.id === parentId ? { ...c, subcategories: [...c.subcategories, newSub] } : c));
      showToast(`Subcategory "${name}" added.`);
    }
    setModal(null);
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .modal-body::-webkit-scrollbar { width: 4px; }
        .modal-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .cat-hdr:hover { background: #f8fafc !important; }
        .sub-row:hover { background: #fafbff !important; }
      `}</style>

      {toast && <Toast msg={toast} />}
      {modal && (
        <CategoryModal
          mode={modal.mode}
          prefillParent={modal.prefillParent || ""}
          editItem={modal.editItem || null}
          categories={cats}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 22, color: C.textPrimary, letterSpacing: -0.3 }}>
            Categories & Subcategories
          </Typography>
          <Typography sx={{ fontSize: 13, color: C.textSecondary, mt: 0.3 }}>
            {cats.length} categories · {totalSubs} subcategories
          </Typography>
        </Box>

        {/* ── Unified button style matching StockIssue ── */}
        <Box sx={{ display: "flex", gap: "12px" }}>
          <Button
            startIcon={<Add sx={{ fontSize: 16 }} />}
            variant="outlined"
            onClick={() => setModal({ mode: "add-subcategory", prefillParent: "" })}
            sx={btnOutlined}
          >
            Add Subcategory
          </Button>
          <Button
            startIcon={<Add sx={{ fontSize: 16 }} />}
            variant="contained"
            onClick={() => setModal({ mode: "add-category", prefillParent: "" })}
            sx={btnPrimary}
          >
            Add Category
          </Button>
        </Box>
      </div>

      {/* Category list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cats.map((cat) => (
          <div key={cat.id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {/* Category header */}
            <div className="cat-hdr" onClick={() => toggleCollapse(cat.id)} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: "#f8fafc" }}>
              <div style={{ fontSize: 24, flexShrink: 0 }}>{cat.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a" }}>{cat.name}</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}>{cat.description} · {cat.items} items · {cat.subcategories.length} subcategories</div>
              </div>
              <span style={{ background: "#f0f9ff", color: "#2563eb", border: "1.5px solid #bae6fd", padding: "2px 10px", borderRadius: 99, fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>{cat.code}</span>
              <StatusChip status={cat.status} />
              <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setModal({ mode: "add-subcategory", prefillParent: cat.id })} style={{ padding: "4px 10px", border: "1.5px solid #e2e8f0", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 11.5, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                  + Subcategory
                </button>
                <IBtn onClick={() => setModal({ mode: "edit-category", editItem: { ...cat, _isSub: false } })} title="Edit" border="#fde68a" bg="#fffbeb"><PencilIcon size={12} /></IBtn>
                <IBtn onClick={() => toggleStatus(cat.id, null)} title={cat.status === "Active" ? "Deactivate" : "Activate"} border="#fecaca" bg="#fff5f5"><BanIcon size={12} /></IBtn>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed[cat.id] ? "rotate(-90deg)" : "rotate(0)", transition: "transform 0.18s", flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Subcategories */}
            {!collapsed[cat.id] && (
              <div style={{ borderTop: "1px solid #f1f5f9" }}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(150px,1fr) 90px minmax(150px,1.2fr) 55px 90px 68px", padding: "6px 18px 6px 50px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                  {["Subcategory", "Code", "Description", "Items", "Status", ""].map((h) => (
                    <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</div>
                  ))}
                </div>

                {cat.subcategories.length === 0 && (
                  <div style={{ padding: "13px 18px 13px 50px", fontSize: 12.5, color: "#94a3b8" }}>
                    No subcategories.{" "}
                    <button onClick={() => setModal({ mode: "add-subcategory", prefillParent: cat.id })} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 12.5, fontWeight: 600, padding: 0 }}>
                      + Add one
                    </button>
                  </div>
                )}

                {cat.subcategories.map((sub, idx) => (
                  <div key={sub.id} className="sub-row" style={{ display: "grid", gridTemplateColumns: "minmax(150px,1fr) 90px minmax(150px,1.2fr) 55px 90px 68px", alignItems: "center", padding: "10px 30px 10px 15px", background: "#fff", borderBottom: idx < cat.subcategories.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ color: "#d1d5db", fontSize: 13, flexShrink: 0 }}>└</span>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>{sub.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{sub.name}</span>
                    </div>
                    <span style={{ background: "#f0f9ff", color: "#2563eb", border: "1.5px solid #bae6fd", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700, display: "inline-block", width: "fit-content" }}>{sub.code}</span>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>{sub.description}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{sub.items}</span>
                    <StatusChip status={sub.status} />
                    <div style={{ display: "flex", gap: 5 }}>
                      <IBtn onClick={() => setModal({ mode: "edit-subcategory", editItem: { ...sub, _isSub: true, _catId: cat.id } })} title="Edit" border="#fde68a" bg="#fffbeb"><PencilIcon size={11} /></IBtn>
                      <IBtn onClick={() => toggleStatus(cat.id, sub.id)} title={sub.status === "Active" ? "Deactivate" : "Activate"} border="#fecaca" bg="#fff5f5"><BanIcon size={11} /></IBtn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}