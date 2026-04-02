import { useState, useEffect } from "react";

const STORAGE_KEY = "tia_inventory";

// ── Icons can't be stored in JSON, so we strip them on save
//    and re-attach the correct status array on load ─────────────────────────
const INITIAL_INVENTORY = [
  { id: 1, name: "Amoxicillin 500mg Capsules",     ndc: "0093-4155-01", category: "Pharmaceuticals",  subcategory: "Antibiotics",                  location: "CS-01",  qty: 200, par: 50,  cost: 2.4,  expiry: "Mar 1, 2027",  expiryRaw: "2027-03-01", status: [{ label: "In Stock", color: "success" }, { label: "Quarantined", color: "warning" }] },
  { id: 2, name: "Epinephrine 1mg/mL 10mL Vial",  ndc: "0409-7166-01", category: "Pharmaceuticals",  subcategory: "Emergency Drugs",              location: "CS-01",  qty: 4,   par: 20,  cost: 18.5, expiry: "Sep 15, 2026", expiryRaw: "2026-09-15", status: [{ label: "Low Stock", color: "warning" }] },
  { id: 3, name: "Sodium Chloride 0.9% IV 1L",     ndc: "0338-0049-04", category: "Pharmaceuticals",  subcategory: "IV Fluids & Electrolytes",      location: "CS-01",  qty: 12,  par: 40,  cost: 3.2,  expiry: "Jan 31, 2026", expiryRaw: "2026-01-31", expired: true,       status: [{ label: "Low Stock", color: "warning" }] },
  { id: 4, name: "Morphine Sulfate 10mg/mL",       ndc: "0641-6083-25", category: "Pharmaceuticals",  subcategory: "Analgesics / Pain Management", location: "CS-01",  qty: 18,  par: 10,  cost: 14.8, expiry: "Apr 15, 2026", expiryRaw: "2026-04-15", expiringSoon: true,  status: [{ label: "In Stock", color: "success" }, { label: "Schedule II", color: "error" }] },
  { id: 5, name: "Nitrile Exam Gloves (L) 100/bx", ndc: "SKU-GLV-L",   category: "PPE & Protective", subcategory: "Gloves",                       location: "CS-01",  qty: 30,  par: 15,  cost: 12.0, expiry: "Jun 1, 2028",  expiryRaw: "2028-06-01", status: [{ label: "In Stock", color: "success" }] },
  { id: 6, name: "Surgical Mask ASTM Level 3",     ndc: "SKU-MASK-L3",  category: "PPE & Protective", subcategory: "Masks & Respirators",          location: "CS-01",  qty: 450, par: 100, cost: 0.48, expiry: "Jan 1, 2028",  expiryRaw: "2028-01-01", status: [{ label: "In Stock", color: "success" }] },
  { id: 7, name: "4×4 Gauze Pads Sterile 10/pk",  ndc: "SKU-GAUZE-44", category: "Wound Care",       subcategory: "Dressings",                    location: "CS-01",  qty: 200, par: 50,  cost: 2.8,  expiry: "Jan 1, 2029",  expiryRaw: "2029-01-01", status: [{ label: "In Stock", color: "success" }] },
  { id: 8, name: "BD Vacutainer EDTA 10mL",        ndc: "SKU-BD-EDTA",  category: "Lab Supplies",     subcategory: "Collection Tubes",             location: "CS-01",  qty: 600, par: 150, cost: 0.35, expiry: "Dec 1, 2027",  expiryRaw: "2027-12-01", status: [{ label: "In Stock", color: "success" }] },
  { id: 9, name: "Epinephrine 1mg/mL 10mL Vial",  ndc: "0409-7166-01", category: "Pharmaceuticals",  subcategory: "Emergency Drugs",              location: "ICU-01", qty: 4,   par: 10,  cost: 18.5, expiry: "Sep 15, 2026", expiryRaw: "2026-09-15", status: [{ label: "Low Stock", color: "warning" }] },
];

// expiryRaw is stored as a string "YYYY-MM-DD" in localStorage (Date objects
// don't survive JSON). Hydrate it back to a real Date on every read.
function hydrate(items) {
  return items.map((item) => ({
    ...item,
    expiryRaw: item.expiryRaw ? new Date(item.expiryRaw) : null,
  }));
}

// Strip non-serialisable fields (React icon nodes) before writing to storage
function dehydrate(items) {
  return items.map((item) => ({
    ...item,
    expiryRaw: item.expiryRaw instanceof Date
      ? item.expiryRaw.toISOString().split("T")[0]
      : item.expiryRaw ?? null,
    // Remove icon JSX from status chips — they're re-derived in InventoryItems
    status: (item.status || []).map(({ label, color }) => ({ label, color })),
  }));
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return hydrate(JSON.parse(raw));
  } catch {
    // corrupted storage — fall through to default
  }
  return hydrate(INITIAL_INVENTORY);
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dehydrate(items)));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

// ── Public hook ───────────────────────────────────────────────────────────────
export function useInventory() {
  const [items, setItems] = useState(load);

  // Persist to localStorage whenever items change
  useEffect(() => {
    save(items);
  }, [items]);

  const addItem = (newItem) => {
    setItems((prev) => [
      ...prev,
      {
        ...newItem,
        id: Date.now(),
        expiryRaw: newItem.expireDate ? new Date(newItem.expireDate) : null,
        expiry: newItem.expireDate
          ? new Date(newItem.expireDate).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })
          : "—",
        status: newItem.qty < newItem.par
          ? [{ label: "Low Stock", color: "warning" }]
          : [{ label: "In Stock",  color: "success" }],
      },
    ]);
  };

  const updateItem = (id, updated) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updated,
              expiryRaw: updated.expireDate ? new Date(updated.expireDate) : item.expiryRaw,
              expiry: updated.expireDate
                ? new Date(updated.expireDate).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                : item.expiry,
            }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, addItem, updateItem, deleteItem };
}