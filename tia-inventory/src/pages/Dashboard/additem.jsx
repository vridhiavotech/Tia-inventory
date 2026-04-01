import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// ─── Reusable Field Components ────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6, display: "block" }}>
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
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
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
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#3b82f6",
          fontSize: 18,
          cursor: "pointer",
          userSelect: "none",
          pointerEvents: "auto",
          zIndex: 10,
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

  const increment = () => {
    const next = parseFloat((num + step).toFixed(2));
    onChange({ target: { value: String(next) } });
  };

  const decrement = () => {
    const next = parseFloat((Math.max(min, num - step)).toFixed(2));
    onChange({ target: { value: String(next) } });
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, padding: "10px 36px 10px 12px" }}
      />
      <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 0 }}>
        <button
          type="button"
          onClick={increment}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af", display: "flex", lineHeight: 1, outline: "none" }}
        >
          <KeyboardArrowUpIcon style={{ fontSize: 16 }} />
        </button>
        <button
          type="button"
          onClick={decrement}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9ca3af", display: "flex", lineHeight: 1, outline: "none" }}
        >
          <KeyboardArrowDownIcon style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: 12, marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "0.05em" }}>
        {children}
      </h3>
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "12px 20px",
        border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: 8,
        background: isSelected ? "#eff6ff" : "#fff",
        cursor: "pointer",
        outline: "none",
        transition: "all 0.2s ease",
      }}
      onFocus={(e) => { if (!isSelected) e.target.style.borderColor = "#d1d5db"; }}
      onBlur={(e) => { if (!isSelected) e.target.style.borderColor = "#e5e7eb"; }}
    >
      <Icon style={{ fontSize: 24, color: isSelected ? "#2563eb" : "#9ca3af" }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#2563eb" : "#374151" }}>
        {label}
      </span>
      {description && (
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          {description}
        </span>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddItem() {
  const navigate = useNavigate();

  const [itemType, setItemType] = useState("consumable");

  const [form, setForm] = useState({
    itemName: "",
    ndc: "",
    category: "",
    subcategory: "",
    manufacturer: "",
    unitOfMeasure: "Vial",
    qtyInHand: "4",
    parLevel: "20",
    unitCost: "18.5",
    supplier: "Cardinal Health",
    location: "Central Store",
    lotNumber: "EP24B",
    expireDate: "2026-09-15",
    notes: "",
    // Equipment / Device fields
    modelNo: "",
    serialNo: "",
    purchaseDate: "",
    warrantyExpiry: "",
    nextServiceDue: "",
    calibrationDue: "",
    condition: "Good",
    // Consumable-only fields
    itemStatus: "Quarantined",
    deaSchedule: "None — Not Controlled",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    console.log("Saving item:", { itemType, ...form });
    navigate("/admin/dashboard");
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto"}}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 28 }}>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 0, color: "#2563eb", display: "flex", alignItems: "center", marginTop: 3,
            outline: "none",
          }}
        >
          <ChevronLeftIcon style={{ fontSize: 28 }} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Add to Inventory</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9ca3af" }}>
            Complete the {itemType === "consumable" ? "medicine" : itemType === "equipment" ? "equipment" : "device"} details.
          </p>
        </div>
      </div>

      {/* ── Form Card ── */}
      <div style={{
        background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)", padding: "28px 32px", marginBottom: 16,
      }}>

        {/* ITEM TYPE */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12, display: "block" }}>
            ITEM TYPE <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <ItemTypeTab
              label="Consumable"
              description="Medicines, supplies"
              icon={LocalPharmacyIcon}
              isSelected={itemType === "consumable"}
              onClick={() => setItemType("consumable")}
            />
            <ItemTypeTab
              label="Equipment"
              description="Reusable equipment"
              icon={DevicesIcon}
              isSelected={itemType === "equipment"}
              onClick={() => setItemType("equipment")}
            />
            <ItemTypeTab
              label="Device"
              description="Medical devices"
              icon={MedicalServicesIcon}
              isSelected={itemType === "device"}
              onClick={() => setItemType("device")}
            />
          </div>
        </div>

        {/* ── ITEM DETAILS (all types) ── */}
        <SectionTitle>ITEM DETAILS</SectionTitle>
        <Row>
          <div>
            <Label>Item Name</Label>
            <TextInput placeholder="E.g. Amoxicillin 500mg capsules" value={form.itemName} onChange={set("itemName")} />
          </div>
          <div>
            <Label required>NDC / SKU / Barcode</Label>
            <TextInput
              placeholder="e.g. 0093-4155-01 or scan barcode"
              value={form.ndc}
              onChange={set("ndc")}
              icon={<QrCodeScannerIcon style={{ fontSize: 18 }} />}
            />
          </div>
          <div>
            <Label required>Category</Label>
            <SelectInput
              placeholder="Select"
              value={form.category}
              onChange={set("category")}
              options={["Pharmaceuticals", "Surgical Supplies", "PPE & Protective", "Lab Supplies", "Equipment/Devices", "Wound Care"]}
              icon={CategoryIcon}
              iconColor="#f59e0b"
            />
          </div>
        </Row>

        <Row>
          <div>
            <Label>Subcategory</Label>
            <SelectInput
              placeholder="Select category first..."
              value={form.subcategory}
              onChange={set("subcategory")}
              options={["Antibiotics", "Analgesics/Pain Management", "IV Fluids & Electrolytes", "Emergency Drugs", "Anaesthetics", "Vitamins & Supplements"]}
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
              options={["Cardinal Health", "Teva", "Pfizer", "Abbott", "Baxter", "B. Braun", "Johnson & Johnson", "Medtronic"]}
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

        {/* Supplier — visible for all types */}
        <Row cols={3}>
          <div>
            <Label>Supplier</Label>
            <SelectInput
              placeholder="Select supplier..."
              value={form.supplier}
              onChange={set("supplier")}
              options={["Cardinal Health", "McKesson", "Medline", "Owens & Minor", "Henry Schein"]}
            />
          </div>
          <div>{/* spacer */}</div>
          <div>{/* spacer */}</div>
        </Row>

        {/* Item Status + DEA Schedule — consumable only */}
        {itemType === "consumable" && (
          <Row cols={3}>
            <div>
              <Label>Item Status</Label>
              <SelectInput
                placeholder="Select status..."
                value={form.itemStatus}
                onChange={set("itemStatus")}
                options={["Active", "Quarantined", "Recalled", "Disposed"]}
              />
            </div>
            <div>
              <Label>DEA Schedule</Label>
              <SelectInput
                placeholder="Select schedule..."
                value={form.deaSchedule}
                onChange={set("deaSchedule")}
                options={["None — Not Controlled", "Schedule I", "Schedule II", "Schedule III", "Schedule IV", "Schedule V"]}
              />
            </div>
            <div>{/* spacer */}</div>
          </Row>
        )}

        {/* ── STOCK & PRICING, LOT & EXPIRY, NOTES — consumable only ── */}
        {itemType === "consumable" && (
          <>
            <SectionTitle>STOCK &amp; PRICING</SectionTitle>
            <Row>
              <div>
                <Label required>QTY in Hand</Label>
                <NumberSpinInput value={form.qtyInHand} onChange={set("qtyInHand")} placeholder="0" step={1} />
              </div>
              <div>
                <Label>PAR Level</Label>
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
                  options={["Central Store", "ICU", "Emergency Dept", "Pharmacy", "Surgery", "Laboratory"]}
                />
              </div>
              <div>{/* spacer */}</div>
            </Row>

            <SectionTitle>LOT &amp; EXPIRY</SectionTitle>
            <Row cols={2}>
              <div>
                <Label>LOT number</Label>
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
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 13,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  outline: "none",
                  resize: "vertical",
                  color: "#111827",
                  backgroundColor: "#f9fafb",
                  boxSizing: "border-box",
                  colorScheme: "light",
                }}
              />
            </div>
          </>
        )}

        {/* ── EQUIPMENT DETAILS (equipment only) ── */}
        {itemType === "equipment" && (
          <>
            <SectionTitle>EQUIPMENT DETAILS</SectionTitle>

            {/* Row 1: Model No. | Serial No. | DEA Schedule */}
            <Row cols={3}>
              <div>
                <Label>Model No.</Label>
                <TextInput placeholder="e.g. BeneVision N15" value={form.modelNo} onChange={set("modelNo")} />
              </div>
              <div>
                <Label>Serial No.</Label>
                <TextInput placeholder="e.g. MR2024-0012" value={form.serialNo} onChange={set("serialNo")} />
              </div>
              <div>
                <Label>DEA Schedule</Label>
                <SelectInput
                  placeholder="Select schedule..."
                  value={form.deaSchedule}
                  onChange={set("deaSchedule")}
                  options={["None — Not Controlled", "Schedule I", "Schedule II", "Schedule III", "Schedule IV", "Schedule V"]}
                />
              </div>
            </Row>

            {/* Row 2: Purchase Date | Warranty Expiry */}
            <Row cols={2}>
              <div>
                <Label>Purchase Date</Label>
                <DateInput value={form.purchaseDate} onChange={set("purchaseDate")} />
              </div>
              <div>
                <Label>Warranty Expiry</Label>
                <DateInput value={form.warrantyExpiry} onChange={set("warrantyExpiry")} />
              </div>
            </Row>

            {/* Row 3: Next Service Due | Calibration Due */}
            <Row cols={2}>
              <div>
                <Label>Next Service Due</Label>
                <DateInput value={form.nextServiceDue} onChange={set("nextServiceDue")} />
              </div>
              <div>
                <Label>Calibration Due</Label>
                <DateInput value={form.calibrationDue} onChange={set("calibrationDue")} />
              </div>
            </Row>

            {/* Condition */}
            <Row cols={2}>
              <div>
                <Label>Condition</Label>
                <SelectInput
                  placeholder="Select"
                  value={form.condition}
                  onChange={set("condition")}
                  options={["Good", "Fair", "Poor", "Needs Repair"]}
                />
              </div>
              <div>{/* spacer */}</div>
            </Row>

            {/* Item Status */}
            <Row cols={2}>
              <div>
                <Label>Item Status</Label>
                <SelectInput
                  placeholder="Select status..."
                  value={form.itemStatus}
                  onChange={set("itemStatus")}
                  options={["Active", "Quarantined", "Recalled", "Disposed"]}
                />
              </div>
              <div>{/* spacer */}</div>
            </Row>

            {/* STOCK & PRICING */}
            <SectionTitle>STOCK &amp; PRICING</SectionTitle>
            <Row cols={2}>
              <div>
                <Label>Quantity (Units)</Label>
                <NumberSpinInput value={form.qtyInHand} onChange={set("qtyInHand")} placeholder="0" step={1} />
              </div>
              <div>
                <Label>Min. QTY Required</Label>
                <NumberSpinInput value={form.parLevel} onChange={set("parLevel")} placeholder="0" step={1} />
              </div>
            </Row>
            <Row cols={2}>
              <div>
                <Label>Unit Cost ($)</Label>
                <NumberSpinInput value={form.unitCost} onChange={set("unitCost")} placeholder="0.00" step={0.01} />
              </div>
              <div>
                <Label>Location</Label>
                <SelectInput
                  placeholder="Select"
                  value={form.location}
                  onChange={set("location")}
                  options={["Central Store", "ICU", "Emergency Dept", "Pharmacy", "Surgery", "Laboratory"]}
                />
              </div>
            </Row>

            {/* ASSET INFO */}
            <SectionTitle>ASSET INFO</SectionTitle>
            <Row cols={2}>
              <div>
                <Label>Asset / LOT Tag</Label>
                <TextInput placeholder="e.g. EP24B" value={form.lotNumber} onChange={set("lotNumber")} />
              </div>
              <div>
                <Label>Warranty Expiry</Label>
                <DateInput value={form.warrantyExpiry} onChange={set("warrantyExpiry")} />
              </div>
            </Row>

            <div>
              <Label>Notes</Label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                placeholder="Type here"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 13,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  outline: "none",
                  resize: "vertical",
                  color: "#111827",
                  backgroundColor: "#f9fafb",
                  boxSizing: "border-box",
                  colorScheme: "light",
                }}
              />
            </div>
          </>
        )}

        {/* ── DEVICE DETAILS (device only) ── */}
        {itemType === "device" && (
          <>
            <SectionTitle>DEVICE DETAILS</SectionTitle>

            {/* Row 1: Model No. | Serial No. | DEA Schedule */}
            <Row cols={3}>
              <div>
                <Label>Model No.</Label>
                <TextInput placeholder="e.g. BeneVision N15" value={form.modelNo} onChange={set("modelNo")} />
              </div>
              <div>
                <Label>Serial No.</Label>
                <TextInput placeholder="e.g. MR2024-0012" value={form.serialNo} onChange={set("serialNo")} />
              </div>
              <div>
                <Label>DEA Schedule</Label>
                <SelectInput
                  placeholder="Select schedule..."
                  value={form.deaSchedule}
                  onChange={set("deaSchedule")}
                  options={["None — Not Controlled", "Schedule I", "Schedule II", "Schedule III", "Schedule IV", "Schedule V"]}
                />
              </div>
            </Row>

            {/* Row 2: Purchase Date | Warranty Expiry */}
            <Row cols={2}>
              <div>
                <Label>Purchase Date</Label>
                <DateInput value={form.purchaseDate} onChange={set("purchaseDate")} />
              </div>
              <div>
                <Label>Warranty Expiry</Label>
                <DateInput value={form.warrantyExpiry} onChange={set("warrantyExpiry")} />
              </div>
            </Row>

            {/* Row 3: Next Service Due | Calibration Due */}
            <Row cols={2}>
              <div>
                <Label>Next Service Due</Label>
                <DateInput value={form.nextServiceDue} onChange={set("nextServiceDue")} />
              </div>
              <div>
                <Label>Calibration Due</Label>
                <DateInput value={form.calibrationDue} onChange={set("calibrationDue")} />
              </div>
            </Row>

            {/* Condition */}
            <Row cols={2}>
              <div>
                <Label>Condition</Label>
                <SelectInput
                  placeholder="Select"
                  value={form.condition}
                  onChange={set("condition")}
                  options={["Good", "Fair", "Poor", "Needs Repair"]}
                />
              </div>
              <div>{/* spacer */}</div>
            </Row>

            {/* Item Status */}
            <Row cols={2}>
              <div>
                <Label>Item Status</Label>
                <SelectInput
                  placeholder="Select status..."
                  value={form.itemStatus}
                  onChange={set("itemStatus")}
                  options={["Active", "Quarantined", "Recalled", "Disposed"]}
                />
              </div>
              <div>{/* spacer */}</div>
            </Row>

            {/* STOCK & PRICING */}
            <SectionTitle>STOCK &amp; PRICING</SectionTitle>
            <Row cols={2}>
              <div>
                <Label>Quantity (Units)</Label>
                <NumberSpinInput value={form.qtyInHand} onChange={set("qtyInHand")} placeholder="0" step={1} />
              </div>
              <div>
                <Label>Min. QTY Required</Label>
                <NumberSpinInput value={form.parLevel} onChange={set("parLevel")} placeholder="0" step={1} />
              </div>
            </Row>
            <Row cols={2}>
              <div>
                <Label>Unit Cost ($)</Label>
                <NumberSpinInput value={form.unitCost} onChange={set("unitCost")} placeholder="0.00" step={0.01} />
              </div>
              <div>
                <Label>Location</Label>
                <SelectInput
                  placeholder="Select"
                  value={form.location}
                  onChange={set("location")}
                  options={["Central Store", "ICU", "Emergency Dept", "Pharmacy", "Surgery", "Laboratory"]}
                />
              </div>
            </Row>

            {/* ASSET INFO */}
            <SectionTitle>ASSET INFO</SectionTitle>
            <Row cols={2}>
              <div>
                <Label>Asset / LOT Tag</Label>
                <TextInput placeholder="e.g. EP24B" value={form.lotNumber} onChange={set("lotNumber")} />
              </div>
              <div>
                <Label>Warranty Expiry</Label>
                <DateInput value={form.warrantyExpiry} onChange={set("warrantyExpiry")} />
              </div>
            </Row>

            <div>
              <Label>Notes</Label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                placeholder="Type here"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 13,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  outline: "none",
                  resize: "vertical",
                  color: "#111827",
                  backgroundColor: "#f9fafb",
                  boxSizing: "border-box",
                  colorScheme: "light",
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* ── Footer Buttons ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingBottom: 32 }}>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "10px 24px", fontSize: 13, fontWeight: 600,
            border: "1px solid #e5e7eb", borderRadius: 8,
            background: "#fff", color: "#374151", cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px #f0f0f0"}
          onBlur={(e) => e.target.style.boxShadow = "none"}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 24px", fontSize: 13, fontWeight: 600,
            border: "none", borderRadius: 8, background: "#2563eb",
            color: "#fff", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            outline: "none",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => e.target.style.boxShadow = "0 4px 12px rgba(37,99,235,0.35)"}
          onBlur={(e) => e.target.style.boxShadow = "0 2px 8px rgba(37,99,235,0.25)"}
        >
          Save Item
        </button>
      </div>
    </div>
  );
}