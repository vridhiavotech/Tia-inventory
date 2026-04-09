import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicationIcon from "@mui/icons-material/Medication";
import CategoryIcon from "@mui/icons-material/Category";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import DevicesIcon from "@mui/icons-material/Devices";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { useInventory } from "../InventoryItems/useInventory";

// ─── Reusable Field Components ────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label style={{ fontSize: 15, fontWeight: 500, color: "#2F3036", marginBottom: 6, display: "block" }}>
      {children}
      {required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 13,
  color: "#111827",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  outline: "none",
  boxSizing: "border-box",
  background: "#f9fafb",
  colorScheme: "light",
  transition: "background-color 0.2s",
};

function TextInput({ placeholder, value, onChange, icon }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, padding: icon ? "10px 36px 10px 12px" : "10px 12px" }}
      />
      {icon && (
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color:"#C5C6CC", display: "flex" }}>
          {icon}
        </span>
      )}
    </div>
  );
}

function DateInput({ value, onChange }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        type="date"
        value={value}
        onChange={onChange}
        style={{
          ...inputStyle,
          padding: "10px 36px 10px 12px",
          colorScheme: "light",
          color: value ? "#111827" : "#9ca3af",
        }}
        onFocus={(e) => { e.target.style.background = "#f3f4f6"; }}
        onBlur={(e) => { e.target.style.background = "#f9fafb"; }}
      />
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          display: none;
          pointer-events: none;
        }
      `}</style>
      <CalendarMonthIcon
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setTimeout(() => {
            const inputs = document.querySelectorAll('input[type="date"]');
            if (inputs && inputs.length > 0) {
              inputs[inputs.length - 1].showPicker?.();
            }
          }, 0);
        }}
        style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          color: "#3b82f6", fontSize: 18, cursor: "pointer", userSelect: "none",
          pointerEvents: "auto", zIndex: 10,
        }}
      />
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
          padding: Icon ? "10px 36px 10px 36px" : "10px 36px 10px 12px",
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
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: iconColor || "#9ca3af", display: "flex", pointerEvents: "none" }}>
          <Icon style={{ fontSize: 18 }} />
        </span>
      )}
      <KeyboardArrowDownIcon
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none", fontSize: 20 }}
      />
    </div>
  );
}

function NumberSpinInput({ value, onChange, placeholder, step = 1, min = 0 }) {
  const num = parseFloat(value) || 0;
  const increment = () => onChange({ target: { value: String(parseFloat((num + step).toFixed(2))) } });
  const decrement = () => onChange({ target: { value: String(parseFloat((Math.max(min, num - step)).toFixed(2))) } });

  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, padding: "10px 36px 10px 12px" }}
      />
      <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 0 }}>
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

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #f0f0f0",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      overflow: "hidden",
      marginBottom: 16,
    }}>
      {/* Card header strip */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 28px",
      }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#111827", letterSpacing: "0.05em" }}>
          {title}
        </h3>
      </div>

      {/* Card body */}
      <div style={{ padding: "24px 28px" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ children, cols = 3 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 20, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function ItemTypeTab({ label, icon: Icon, isSelected, onClick, description }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "12px 20px",
        border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: 8,
        background: isSelected ? "#eff6ff" : "#fff",
        cursor: "pointer", outline: "none", transition: "all 0.2s ease",
      }}
    >
      <Icon style={{ fontSize: 24, color: isSelected ? "#2563eb" : "#9ca3af" }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#2563eb" : "#374151" }}>{label}</span>
      {description && <span style={{ fontSize: 12, color: "#9ca3af" }}>{description}</span>}
    </button>
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddItem() {
  const navigate = useNavigate();
  const { items: inventoryItems, addItem, updateItem } = useInventory();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("id");
  const isEdit = searchParams.get("edit") === "true" && editId;

  const [itemType, setItemType] = useState("consumable");
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (isEdit) {
      const existing = inventoryItems.find((i) => String(i.id) === String(editId));
      if (existing) {
        setForm({
          ...EMPTY_FORM,
          itemName:   existing.name        || "",
          ndc:        existing.ndc         || "",
          category:   existing.category    || "",
          subcategory: existing.subcategory || "",
          location:   existing.location    || "Central Store",
          qtyInHand:  String(existing.qty  ?? ""),
          parLevel:   String(existing.par  ?? ""),
          unitCost:   String(existing.cost ?? ""),
          lotNumber:  existing.lot         || "",
          expireDate: existing.expiryRaw
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
      name:       form.itemName,
      ndc:        form.ndc,
      category:   form.category,
      subcategory: form.subcategory,
      location:   form.location,
      qty:        parseFloat(form.qtyInHand) || 0,
      par:        parseFloat(form.parLevel)  || 0,
      cost:       parseFloat(form.unitCost)  || 0,
      lot:        form.lotNumber,
      expireDate: form.expireDate,
      notes:      form.notes,
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
    <div style={{ maxWidth: 860, margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 28 }}>
        <button
          onClick={() => navigate("/admin/inventory/items")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#2563eb", display: "flex", alignItems: "center", marginTop: 3, outline: "none" }}
        >
          <ChevronLeftIcon style={{ fontSize: 28 }} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
            {isEdit ? "Edit Item" : "Add to Inventory"}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>
            {isEdit
              ? "Update the item details below."
              : `Complete the ${itemType === "consumable" ? "medicine" : itemType} details.`}
          </p>
        </div>
      </div>


      {/* ── Item Details Card ── */}
      <SectionCard title="ITEM DETAILS">
        <Row>
          <div>
            <Label required>Item Name</Label>
            <TextInput placeholder="E.g. Amoxicillin 500mg capsules" value={form.itemName} onChange={set("itemName")} />
            {errors.itemName && <span style={{ fontSize: 11, color: "#ef4444" }}>Required</span>}
          </div>
          <div>
            <Label required>NDC / SKU / Barcode</Label>
            <TextInput
              placeholder="e.g. 0093-4155-01 or scan barcode"
              value={form.ndc}
              onChange={set("ndc")}
              icon={<QrCodeScannerIcon style={{ fontSize: 18 }} />}
            />
            {errors.ndc && <span style={{ fontSize: 11, color: "#ef4444" }}>Required</span>}
          </div>
          <div>
            <Label required>Category</Label>
            <SelectInput
              placeholder="Select"
              value={form.category}
              onChange={set("category")}
              options={["Pharmaceuticals","Surgical Supplies","PPE & Protective","Lab Supplies","Equipment/Devices","Wound Care"]}
              icon={CategoryIcon}
              iconColor="#f59e0b"
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
              options={["Antibiotics","Analgesics/Pain Management","IV Fluids & Electrolytes","Emergency Drugs","Anaesthetics","Vitamins & Supplements"]}
              icon={MedicationIcon}
              iconColor="#10b981"
            />
          </div>
          <div>
            <Label>Manufacturer</Label>
            <SelectInput
              placeholder="Select manufacturer..."
              value={form.manufacturer}
              onChange={set("manufacturer")}
              options={["Cardinal Health","Teva","Pfizer","Abbott","Baxter","B. Braun","Johnson & Johnson","Medtronic"]}
            />
          </div>
          <div>
            <Label>Unit of Measure</Label>
            <SelectInput
              placeholder="Select"
              value={form.unitOfMeasure}
              onChange={set("unitOfMeasure")}
              options={["Each (EA)","Box","Vial","mL","Tablet","Pack","Set","Unit"]}
            />
          </div>
        </Row>


      
      </SectionCard>

      {/* ── Equipment / Device Details Card ── */}
      {(itemType === "equipment" || itemType === "device") && !isEdit && (
        <SectionCard title={itemType === "equipment" ? "EQUIPMENT DETAILS" : "DEVICE DETAILS"}>
          <Row cols={3}>
            <div><Label>Model No.</Label><TextInput placeholder="e.g. BeneVision N15" value={form.modelNo} onChange={set("modelNo")} /></div>
            <div><Label>Serial No.</Label><TextInput placeholder="e.g. MR2024-0012" value={form.serialNo} onChange={set("serialNo")} /></div>
            <div>
              <Label>Condition</Label>
              <SelectInput placeholder="Select" value={form.condition} onChange={set("condition")} options={["Good","Fair","Poor","Needs Repair"]} />
            </div>
          </Row>
          <Row cols={2}>
            <div><Label>Purchase Date</Label><DateInput value={form.purchaseDate} onChange={set("purchaseDate")} /></div>
            <div><Label>Warranty Expiry</Label><DateInput value={form.warrantyExpiry} onChange={set("warrantyExpiry")} /></div>
          </Row>
          <Row cols={2}>
            <div><Label>Next Service Due</Label><DateInput value={form.nextServiceDue} onChange={set("nextServiceDue")} /></div>
            <div><Label>Calibration Due</Label><DateInput value={form.calibrationDue} onChange={set("calibrationDue")} /></div>
          </Row>
        </SectionCard>
      )}

      {/* ── Stock & Pricing Card ── */}
      {(isConsumable || itemType === "equipment" || itemType === "device") && (
        <SectionCard title="STOCK &amp; PRICING">
          <Row>
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
          <Row cols={2}>
            <div>
              <Label>Location</Label>
              <SelectInput
                placeholder="Select"
                value={form.location}
                onChange={set("location")}
                options={["Central Store","ICU","Emergency Dept","Pharmacy","Surgery","Laboratory"]}
              />
            </div>
            <Row cols={3}>
          <div>
            <Label>Supplier</Label>
            <SelectInput
              placeholder="Select supplier..."
              value={form.supplier}
              onChange={set("supplier")}
              options={["Cardinal Health","McKesson","Medline","Owens & Minor","Henry Schein"]}
            />
          </div>
          <div /><div />
        </Row>
            <div />
            
          </Row>
          
        </SectionCard>
      )}

      {/* ── Lot & Expiry Card (consumable only) ── */}
      {isConsumable && (
        <SectionCard title="LOT &amp; EXPIRY">
          <Row cols={2}>
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
                width: "100%", padding: "10px 12px", fontSize: 13,
                border: "1px solid #e5e7eb", borderRadius: 8, outline: "none",
                resize: "vertical", color: "#111827", backgroundColor: "#f9fafb",
                boxSizing: "border-box",
              }}
            />
          </div>
        </SectionCard>
      )}

      {/* Notes for equipment/device */}
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
                width: "100%", padding: "10px 12px", fontSize: 13,
                border: "1px solid #e5e7eb", borderRadius: 8, outline: "none",
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
          style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", cursor: "pointer", outline: "none" }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "10px 24px", fontSize: 13, fontWeight: 600, border: "none",
            borderRadius: 8, background: saving ? "#93c5fd" : "#2563eb",
            color: "#fff", cursor: saving ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)", outline: "none",
          }}
        >
          {saving ? "Saving…" : isEdit ? "Update Item" : "Save Item"}
        </button>
      </div>
    </div>
  );
}