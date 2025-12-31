import { useEffect, useState } from "react";
import {
  createProperty,
  uploadPropertyPhoto
} from "../../services/propertyService";
import { fetchAmenities } from "../../services/amenityService";
import './CreatePropertyPage.css';

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
  // Property form state
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
  // Amenities
  // -----------------------------
  const [amenities, setAmenities] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [otherAmenity, setOtherAmenity] = useState("");

  // -----------------------------
  // Photo upload state
  // -----------------------------
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  // -----------------------------
  // UI state
  // -----------------------------
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch amenities
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
      checked ? [...prev, amenity] : prev.filter(a => a !== amenity)
    );
  };

  // -----------------------------
  // Create Property
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

      const res = await createProperty(payload);

      setPropertyId(res.property_id);
      alert("Property created successfully. You can now upload a photo.");
    } catch {
      setError("Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Upload photo
  // -----------------------------
  const uploadPhoto = async () => {
    if (!photo || !propertyId) {
      alert("Missing photo or property ID");
      return;
    }

    setUploading(true);

    try {
      await uploadPropertyPhoto(propertyId, photo);
      alert("Photo uploaded successfully");
      setPhoto(null);
    } catch {
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="create-property-page">
      <div className="create-card">
        <h2 className="page-title">Create New Property</h2>
    
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={submit} className="property-form">
          
          <div className="form-grid">
            {/* Row 1: Purpose & Price */}
            <div className="form-group">
              <label>Purpose</label>
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
              <label>Date Available</label>
              <input 
                type="date"
                className="form-input"
                value={form.creation_date}
                onChange={e => updateField("creation_date", e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Price (€)</label>
              <input 
                className="form-input"
                placeholder="e.g. 250000" 
                value={form.price}
                onChange={e => updateField("price", e.target.value)} 
              />
            </div>

            {/* Row 2: Size & Rooms */}
            <div className="form-group">
              <label>Size (sqm)</label>
              <input 
                className="form-input"
                placeholder="e.g. 95" 
                value={form.square_meters}
                onChange={e => updateField("square_meters", e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Rooms</label>
              <input 
                className="form-input"
                placeholder="e.g. 3" 
                value={form.rooms}
                onChange={e => updateField("rooms", e.target.value)} 
              />
            </div>

            {/* Row 3: Floor & City */}
            <div className="form-group">
              <label>Floor</label>
              <input 
                className="form-input"
                placeholder="e.g. 2" 
                value={form.floor}
                onChange={e => updateField("floor", e.target.value)} 
              />
            </div>
             
            <div></div>
            <div></div>

            <div className="form-group">
              <label>City</label>
              <input 
                className="form-input"
                placeholder="City" 
                value={form.city}
                onChange={e => updateField("city", e.target.value)} 
              />
            </div>

            {/* Row 4: Area & Postal Code */}
            <div className="form-group">
              <label>Area</label>
              <input 
                className="form-input"
                placeholder="Area" 
                value={form.area}
                onChange={e => updateField("area", e.target.value)} 
              />
            </div>

             <div className="form-group">
              <label>Postal Code</label>
              <input 
                className="form-input"
                placeholder="Postal Code" 
                value={form.postal_code}
                onChange={e => updateField("postal_code", e.target.value)} 
              />
            </div>

            {/* Row 5: Address & Number */}
            <div className="form-group" style={{ flex: 2 }}> {/* Πιο μεγάλο Address */}
              <label>Address</label>
              <input 
                className="form-input"
                placeholder="Street Name" 
                value={form.address}
                onChange={e => updateField("address", e.target.value)} 
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Number</label>
              <input 
                className="form-input"
                placeholder="No." 
                value={form.number}
                onChange={e => updateField("number", e.target.value)} 
              />
            </div>
          </div>

          <hr className="divider" />

          {/* Amenities Section */}
          <div className="amenities-section">
            <h4>Amenities</h4>
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

            <div className="form-group full-width" style={{marginTop: '15px'}}>
              <label>Other Amenity</label>
              <input
                className="form-input"
                placeholder="Type to add custom amenity"
                value={otherAmenity}
                onChange={e => setOtherAmenity(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating..." : "Create Property"}
          </button>
        </form>

        {/* ---------- PHOTO UPLOAD ---------- */}
        {propertyId && (
          <div className="photo-upload-section">
            <hr className="divider" />
            <h3>Upload Property Photo</h3>
            
            <div className="upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={e => setPhoto(e.target.files?.[0] || null)}
                className="file-input"
              />
              <button onClick={uploadPhoto} disabled={uploading} className="upload-btn">
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}