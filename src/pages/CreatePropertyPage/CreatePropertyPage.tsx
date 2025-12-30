import { useEffect, useState } from "react";
import { createProperty } from "../../services/propertyService";
import { fetchAmenities } from "../../services/amenityService";
import "./CreateProperty.css";

type CreatePropertyForm = {
  purpose: "sale" | "rent";
  square_meters: string;
  price: string;
  creation_date: string;
  rooms: string;
  floor: string;
  city: string;
  area: string;
  address: string;
  number: string;
  postal_code: string;
};


export default function CreatePropertyPage() {
  // -----------------------------
  // Form state
  // -----------------------------
  const [form, setForm] = useState<CreatePropertyForm>({
    purpose: "sale",
    square_meters: "",
    price: "",
    creation_date: "",
    rooms: "",
    floor: "",
    city: "",
    area: "",
    address: "",
    number: "",
    postal_code: ""
  });

  // -----------------------------
  // Amenities state
  // -----------------------------
  const [amenities, setAmenities] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [otherAmenity, setOtherAmenity] = useState("");

  // -----------------------------
  // UI state
  // -----------------------------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch amenities on load
  // -----------------------------
  useEffect(() => {
    fetchAmenities()
      .then(setAmenities)
      .catch(() => setError("Failed to load amenities"));
  }, []);

  // -----------------------------
  // Helpers
  // -----------------------------
  const updateField = (
    field: keyof CreatePropertyForm,
    value: string
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string, checked: boolean) => {
    setSelectedAmenities(prev =>
      checked
        ? [...prev, amenity]
        : prev.filter(a => a !== amenity)
    );
  };

  // -----------------------------
  // Submit handler
  // -----------------------------
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        purpose: form.purpose,
        square_meters: Number(form.square_meters),
        price: Number(form.price),
        creation_date: form.creation_date,
        rooms: Number(form.rooms),
        floor: Number(form.floor),
        city: form.city,
        area: form.area,
        address: form.address,
        number: form.number,
        postal_code: form.postal_code,
        amenities: otherAmenity
          ? [...selectedAmenities, otherAmenity]
          : selectedAmenities
      };

      await createProperty(payload);
      alert("Property created successfully");

      // optional: reset form
      setForm({
        purpose: "sale",
        square_meters: "",
        price: "",
        creation_date: "",
        rooms: "",
        floor: "",
        city: "",
        area: "",
        address: "",
        number: "",
        postal_code: ""
      });
      setSelectedAmenities([]);
      setOtherAmenity("");
    } catch {
      setError("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
return (
    <div className="create-property-page">
      <div className="create-card">
        <h2 className="page-title">Create New Property</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submit} className="property-form">
          
          {/* --- Section 1: Basic Info --- */}
          <div className="form-group">
            <label className="form-label">Purpose</label>
            <select
              className="form-select"
              value={form.purpose}
              onChange={e => updateField("purpose", e.target.value as "sale" | "rent")}
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div className="form-group">
             <label className="form-label">Price (€)</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 250000"
              value={form.price}
              onChange={e => updateField("price", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Size (sqm)</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 95"
              value={form.square_meters}
              onChange={e => updateField("square_meters", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rooms</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 3"
              value={form.rooms}
              onChange={e => updateField("rooms", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Floor</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 2"
              value={form.floor}
              onChange={e => updateField("floor", e.target.value)}
            />
          </div>

          <div></div>

          {/* --- Section 2: Location (Full Width or Split) --- */}
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              className="form-input"
              placeholder="City"
              value={form.city}
              onChange={e => updateField("city", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Area</label>
            <input
              className="form-input"
              placeholder="Area"
              value={form.area}
              onChange={e => updateField("area", e.target.value)}
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Address</label>
            <input
              className="form-input"
              placeholder="Street name"
              value={form.address}
              onChange={e => updateField("address", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number</label>
            <input
              className="form-input"
              placeholder="No."
              value={form.number}
              onChange={e => updateField("number", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Postal Code</label>
            <input
              className="form-input"
              placeholder="P.C."
              value={form.postal_code}
              onChange={e => updateField("postal_code", e.target.value)}
            />
          </div>

          {/* --- Section 3: Amenities --- */}
          <div className="amenities-section full-width">
            <h4 className="amenities-title">Amenities</h4>
            <div className="amenities-grid">
              {amenities.map(a => (
                <label key={a} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={e => toggleAmenity(a, e.target.checked)}
                  />
                  {a}
                </label>
              ))}
            </div>
            
            <div style={{ marginTop: '1rem' }}>
                <input
                className="form-input"
                placeholder="Add other amenity..."
                value={otherAmenity}
                onChange={e => setOtherAmenity(e.target.value)}
                />
            </div>
          </div>

          {/* --- Submit --- */}
          <div className="full-width">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Property"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
















  /*
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Create Property</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submit}>
        <label>
          Purpose
          <select
            value={form.purpose}
            onChange={e =>
              updateField("purpose", e.target.value as "sale" | "rent")
            }
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </label>

        <input
          placeholder="Square meters"
          value={form.square_meters}
          onChange={e => updateField("square_meters", e.target.value)}
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={e => updateField("price", e.target.value)}
        />

        <input
          type="date"
          value={form.creation_date}
          onChange={e => updateField("creation_date", e.target.value)}
        />

        <input
          placeholder="Rooms"
          value={form.rooms}
          onChange={e => updateField("rooms", e.target.value)}
        />

        <input
          placeholder="Floor"
          value={form.floor}
          onChange={e => updateField("floor", e.target.value)}
        />

        <input
          placeholder="City"
          value={form.city}
          onChange={e => updateField("city", e.target.value)}
        />

        <input
          placeholder="Area"
          value={form.area}
          onChange={e => updateField("area", e.target.value)}
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={e => updateField("address", e.target.value)}
        />

        <input
          placeholder="Number"
          value={form.number}
          onChange={e => updateField("number", e.target.value)}
        />

        <input
          placeholder="Postal code"
          value={form.postal_code}
          onChange={e => updateField("postal_code", e.target.value)}
        />

        <h4>Amenities</h4>
        {amenities.map(a => (
          <label key={a} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedAmenities.includes(a)}
              onChange={e => toggleAmenity(a, e.target.checked)}
            />
            {a}
          </label>
        ))}

        <input
          placeholder="Other amenity (optional)"
          value={otherAmenity}
          onChange={e => setOtherAmenity(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Property"}
        </button>
      </form>
    </div>
  );
}
*/