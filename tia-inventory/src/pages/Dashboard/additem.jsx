import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useInventory } from "../InventoryItems/useInventory";

// ─── Custom Back Arrow ────────────────────────────────────────────────────────
function BackArrow() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="15"
        height="31"
        viewBox="0 0 20 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.7886 2L2.78857 16.7115L17.7886 32.8942"
          stroke="#015DFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─── Custom QR / Scan Icon — clickable, opens device scanner ─────────────────
function QrScanIcon({ onClick }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", display: "block" }}
    >
      <path
        d="M5.33333 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V5.33333M14 5.33333V3.33333C14 2.97971 13.8595 2.64057 13.6095 2.39052C13.3594 2.14048 13.0203 2 12.6667 2H10.6667M10.6667 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V10.6667M2 10.6667V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H5.33333"
        stroke="#8F9098"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Custom Calendar Icon ─────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.41667 0.75V3.41667M4.08333 0.75V3.41667M0.75 6.08333H12.75M2.08333 2.08333H11.4167C12.153 2.08333 12.75 2.68029 12.75 3.41667V12.75C12.75 13.4864 12.153 14.0833 11.4167 14.0833H2.08333C1.34695 14.0833 0.75 13.4864 0.75 12.75V3.41667C0.75 2.68029 1.34695 2.08333 2.08333 2.08333Z"
        stroke="#8F9098"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Reusable Field Components ────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: "#2F3036",
        marginBottom: 2,
        display: "block",
      }}
    >
      {children}
      {required && <span style={{ color: "#2F3036" }}> *</span>}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  height: 48,
  padding: "12px 16px",
  fontSize: 13,
  color: "#111827",
  border: "1px solid #C5C6CC",
  borderRadius: 12,
  outline: "none",
  boxSizing: "border-box",
  background: "#f9fafb",
  colorScheme: "light",
  transition: "background-color 0.2s",
};

// ─── Text Input — scan icon is clickable via hidden file input ────────────────
function TextInput({ placeholder, value, onChange, icon, onScan }) {
  const fileRef = useRef(null);

  const handleScanClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...inputStyle,
          padding: icon ? "12px 40px 12px 16px" : "12px 16px",
        }}
      />
      {icon && (
        <span
          onClick={handleScanClick}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          {icon}
        </span>
      )}
      {/* Hidden camera/file input for barcode scanning */}
      {onScan && (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={onScan}
        />
      )}
    </div>
  );
}

// ─── Date Input — custom icon, picker opens downward ─────────────────────────
function DateInput({ value, onChange }) {
  const nativeRef = useRef(null);

  const openPicker = () => {
    if (nativeRef.current) nativeRef.current.showPicker?.();
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Visible styled input */}
      <input
        readOnly
        value={value ? value.split("-").reverse().join("/") : ""}
        placeholder="DD/MM/YYYY"
        onClick={openPicker}
        style={{
          ...inputStyle,
          padding: "12px 40px 12px 16px",
          cursor: "pointer",
          color: value ? "#111827" : "#9ca3af",
        }}
      />
      {/* Native date input anchored at bottom edge so picker drops downward */}
      <input
        ref={nativeRef}
        type="date"
        value={value}
        onChange={onChange}
        style={{
          position: "absolute",
          left: 0,
          top: "100%",
          width: "100%",
          height: 0,
          opacity: 0,
          pointerEvents: "none",
          border: "none",
          padding: 0,
        }}
      />
      {/* Custom calendar icon */}
      <span
        onClick={openPicker}
        style={{
          position: "absolute", right: 12, top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer", display: "flex", alignItems: "center", zIndex: 1,
        }}
      >
        <CalendarIcon />
      </span>
    </div>
  );
}

function SelectInput({ placeholder, value, onChange, options = [], icon: Icon, iconColor }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          ...inputStyle,
          padding: Icon ? "12px 40px 12px 40px" : "12px 40px 12px 16px",
          appearance: "none",
          cursor: "pointer",
          color: value ? "#111827" : "#9ca3af",
        }}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ color: "#111827" }}>{o}</option>
        ))}
      </select>
      {Icon && (
        <span
          style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)", color: iconColor || "#9ca3af",
            display: "flex", pointerEvents: "none",
          }}
        >
          <Icon style={{ fontSize: 18 }} />
        </span>
      )}
      <KeyboardArrowDownIcon
        style={{
          position: "absolute", right: 12, top: "50%",
          transform: "translateY(-50%)", color: "#9ca3af",
          pointerEvents: "none", fontSize: 20,
        }}
      />
    </div>
  );
}

function NumberSpinInput({ value, onChange, placeholder, step = 1, min = 0 }) {
  const num = parseFloat(value) || 0;
  const increment = () =>
    onChange({ target: { value: String(parseFloat((num + step).toFixed(2))) } });
  const decrement = () =>
    onChange({ target: { value: String(parseFloat((Math.max(min, num - step)).toFixed(2))) } });

  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, padding: "12px 40px 12px 16px" }}
      />
      <div
        style={{
          position: "absolute", right: 10, top: "50%",
          transform: "translateY(-50%)", display: "flex",
          flexDirection: "column", gap: 0,
        }}
      >
        <button type="button" onClick={increment}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af", display: "flex", lineHeight: 1, outline: "none" }}>
          <KeyboardArrowUpIcon style={{ fontSize: 16 }} />
        </button>
        <button type="button" onClick={decrement}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af", display: "flex", lineHeight: 1, outline: "none" }}>
          <KeyboardArrowDownIcon style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "12px 28px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h3>
      </div>

      <div style={{ padding: "12px 28px" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ children, cols = 3 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 20,
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  );
}

const EMPTY_FORM = {
  itemName: "", ndc: "", category: "", subcategory: "", manufacturer: "",
  unitOfMeasure: "Vial", qtyInHand: "", parLevel: "", unitCost: "",
  supplier: "", location: "Central Store", lotNumber: "", expireDate: "",
  notes: "", modelNo: "", serialNo: "", purchaseDate: "", warrantyExpiry: "",
  nextServiceDue: "", calibrationDue: "", condition: "Good",
  itemStatus: "Active", deaSchedule: "None — Not Controlled",
};

export default function AddItem() {
  const navigate = useNavigate();
  const { items: inventoryItems, addItem, updateItem } = useInventory();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("id");
  const isEdit = searchParams.get("edit") === "true" && editId;

  const [itemType] = useState("consumable");
  const [form, setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const existing = inventoryItems.find((i) => String(i.id) === String(editId));
      if (existing) {
        setForm({
          ...EMPTY_FORM,
          itemName:    existing.name        || "",
          ndc:         existing.ndc         || "",
          category:    existing.category    || "",
          subcategory: existing.subcategory || "",
          location:    existing.location    || "Central Store",
          qtyInHand:   String(existing.qty  ?? ""),
          parLevel:    String(existing.par  ?? ""),
          unitCost:    String(existing.cost ?? ""),
          lotNumber:   existing.lot         || "",
          expireDate:  existing.expiryRaw
            ? existing.expiryRaw.toISOString().split("T")[0]
            : "",
        });
      }
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editId, isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => { const n = { ...er }; delete n[key]; return n; });
  };

  const validate = () => {
    const errs = {};
    if (!form.itemName.trim()) errs.itemName = true;
    if (!form.ndc.trim())      errs.ndc      = true;
    if (!form.category)        errs.category = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    const payload = {
      name:        form.itemName,
      ndc:         form.ndc,
      category:    form.category,
      subcategory: form.subcategory,
      location:    form.location,
      qty:         parseFloat(form.qtyInHand) || 0,
      par:         parseFloat(form.parLevel)  || 0,
      cost:        parseFloat(form.unitCost)  || 0,
      lot:         form.lotNumber,
      expireDate:  form.expireDate,
      notes:       form.notes,
    };
    if (isEdit) {
      updateItem(Number(editId), payload);
    } else {
      addItem(payload);
    }
    setSaving(false);
    navigate("/admin/inventory/items");
  };

  const isConsumable = itemType === "consumable" || isEdit;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", overflow: "visible" }}>

      {/* ── Page Header ── */}
      <div style={{ position: "relative", marginBottom: 28 }}>
        <button
          onClick={() => navigate("/admin/inventory/items")}
          style={{
            position: "absolute",
            left: -48,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            padding: 0, display: "flex", alignItems: "center",
            justifyContent: "center", outline: "none",
          }}
        >
          <BackArrow />
        </button>

        <h2 style={{ margin: 5, fontSize: 20, fontWeight: 700, color: "#111827" }}>
          {isEdit ? "Edit Item" : "Add to Inventory"}
        </h2>
        <p style={{ margin: "5px 0 0", fontSize: 13, color: "#1A1A1A" }}>
          {isEdit
            ? "Update the item details below."
            : "Complete the provider profile, credentials and location assignment.."}
        </p>
      </div>

      {/* ── Item Details Card ── */}
      <SectionCard title="ITEM DETAILS">
        <Row>
          <div>
            <Label>Item Name</Label>
            <TextInput
              placeholder="E.g. Amoxicillin 500mg capsules"
              value={form.itemName}
              onChange={set("itemName")}
            />
            {errors.itemName && <span style={{ fontSize: 11, color: "#ef4444" }}>Required</span>}
          </div>

          <div>
            <Label required>NDC / SKU / Barcode</Label>
            <TextInput
              placeholder="e.g. 0093-4155-01 or scan barcode"
              value={form.ndc}
              onChange={set("ndc")}
              icon={<QrScanIcon />}
              onScan={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // file is ready for barcode processing via a library
                  console.log("Scan file:", file.name);
                }
              }}
            />
            {errors.ndc && <span style={{ fontSize: 11, color: "#ef4444" }}>Required</span>}
          </div>

          <div>
            <Label required>Category</Label>
            <SelectInput
              placeholder="Select"
              value={form.category}
              onChange={set("category")}
              options={[
                "Pharmaceuticals", "Surgical Supplies", "PPE & Protective",
                "Lab Supplies", "Equipment/Devices", "Wound Care",
              ]}
            />
            {errors.category && <span style={{ fontSize: 11, color: "#ef4444" }}>Required</span>}
          </div>
        </Row>

        <Row>
          <div>
            <Label>Subcategory</Label>
            <SelectInput
              placeholder="Select category first..."
              value={form.subcategory}
              onChange={set("subcategory")}
              options={[
                "Antibiotics", "Analgesics/Pain Management", "IV Fluids & Electrolytes",
                "Emergency Drugs", "Anaesthetics", "Vitamins & Supplements",
              ]}
            />
          </div>
          <div>
            <Label>Manufacturer</Label>
            <SelectInput
              placeholder="Select manufacturer..."
              value={form.manufacturer}
              onChange={set("manufacturer")}
              options={[
                "Cardinal Health", "Teva", "Pfizer", "Abbott",
                "Baxter", "B. Braun", "Johnson & Johnson", "Medtronic",
              ]}
            />
          </div>
          <div>
            <Label>Unit of Measure</Label>
            <SelectInput
              placeholder="Select"
              value={form.unitOfMeasure}
              onChange={set("unitOfMeasure")}
              options={["Each (EA)", "Box", "Vial", "mL", "Tablet", "Pack", "Set", "Unit"]}
            />
          </div>
        </Row>
      </SectionCard>

      {/* ── Stock & Pricing Card ── */}
      {(isConsumable || itemType === "equipment" || itemType === "device") && (
        <SectionCard title="STOCK &amp; PRICING">
          <Row cols={3}>
            <div>
              <Label required>QTY in Hand</Label>
              <NumberSpinInput value={form.qtyInHand} onChange={set("qtyInHand")} placeholder="0" step={1} />
            </div>
            <div>
              <Label>{itemType === "consumable" || isEdit ? "PAR Level" : "Min. QTY Required"}</Label>
              <NumberSpinInput value={form.parLevel} onChange={set("parLevel")} placeholder="0" step={1} />
            </div>
            <div>
              <Label>Unit Cost ($)</Label>
              <NumberSpinInput value={form.unitCost} onChange={set("unitCost")} placeholder="0.00" step={0.01} />
            </div>
          </Row>

          <Row cols={3}>
            <div>
              <Label>Supplier</Label>
              <SelectInput
                placeholder="Select"
                value={form.supplier}
                onChange={set("supplier")}
                options={["Cardinal Health", "McKesson", "Medline", "Owens & Minor", "Henry Schein"]}
              />
            </div>
            <div>
              <Label>Location</Label>
              <SelectInput
                placeholder="Select location..."
                value={form.location}
                onChange={set("location")}
                options={["Central Store", "ICU", "Emergency Dept", "Pharmacy", "Surgery", "Laboratory"]}
              />
            </div>
          </Row>
        </SectionCard>
      )}

      {isConsumable && (
        <SectionCard title="LOT &amp; EXPIRY">
          <Row cols={3}>
            <div>
              <Label>LOT Number</Label>
              <TextInput placeholder="LOT2025A" value={form.lotNumber} onChange={set("lotNumber")} />
            </div>
            <div>
              <Label>Expire Date</Label>
              <DateInput value={form.expireDate} onChange={set("expireDate")} />
            </div>
          </Row>
          <div>
            <Label>Notes</Label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Type here"
              rows={1}
              style={{
                width: "100%", padding: "12px 16px", fontSize: 13,
                border: "1px solid #C5C6CC", borderRadius: 12, outline: "none",
                resize: "vertical", color: "#111827", backgroundColor: "#f9fafb",
                boxSizing: "border-box",
              }}
            />
          </div>
        </SectionCard>
      )}

      {(itemType === "equipment" || itemType === "device") && !isEdit && (
        <SectionCard title="NOTES">
          <div>
            <Label>Notes</Label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Type here"
              rows={3}
              style={{
                width: "100%", padding: "12px 16px", fontSize: 13,
                border: "1px solid #C5C6CC", borderRadius: 12, outline: "none",
                resize: "vertical", color: "#111827", backgroundColor: "#f9fafb",
                boxSizing: "border-box",
              }}
            />
          </div>
        </SectionCard>
      )}

      {/* ── Footer Buttons ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingBottom: 32 }}>
        <button
          onClick={() => navigate("/admin/inventory/items")}
          style={{
            height: 48, padding: "12px 24px", fontSize: 16, fontWeight: 600,
            fontFamily: "Inter, sans-serif", border: "1px solid #3182CE",
            borderRadius: 12, background: "#fff", color: "#3182CE",
            cursor: "pointer", outline: "none", lineHeight: "24px",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            height: 48, padding: "12px 24px", fontSize: 16, fontWeight: 600,
            fontFamily: "Inter, sans-serif", border: "none", borderRadius: 12,
            background: saving ? "#93c5fd" : "#2563eb", color: "#fff",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)", outline: "none", lineHeight: "24px",
          }}
        >
          {saving ? "Saving…" : isEdit ? "Update Item" : "Save Item"}
        </button>
      </div>

    </div>
  );
}