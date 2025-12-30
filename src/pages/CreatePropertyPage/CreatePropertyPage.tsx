import { useEffect, useState } from "react";
import {
  createProperty,
  uploadPropertyPhoto
} from "../../services/propertyService";
import { fetchAmenities } from "../../services/amenityService";

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
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Create Property</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submit}>
        <input placeholder="Square meters" value={form.square_meters}
          onChange={e => updateField("square_meters", e.target.value)} />

        <input placeholder="Price" value={form.price}
          onChange={e => updateField("price", e.target.value)} />

        <input type="date" value={form.creation_date}
          onChange={e => updateField("creation_date", e.target.value)} />

        <input placeholder="Rooms" value={form.rooms}
          onChange={e => updateField("rooms", e.target.value)} />

        <input placeholder="Floor" value={form.floor}
          onChange={e => updateField("floor", e.target.value)} />

        <input placeholder="City" value={form.city}
          onChange={e => updateField("city", e.target.value)} />

        <input placeholder="Area" value={form.area}
          onChange={e => updateField("area", e.target.value)} />

        <input placeholder="Address" value={form.address}
          onChange={e => updateField("address", e.target.value)} />

        <input placeholder="Number" value={form.number}
          onChange={e => updateField("number", e.target.value)} />

        <input placeholder="Postal code" value={form.postal_code}
          onChange={e => updateField("postal_code", e.target.value)} />

        <h4>Amenities</h4>
        {amenities.map(a => (
          <label key={a}>
            <input
              type="checkbox"
              checked={selectedAmenities.includes(a)}
              onChange={e => toggleAmenity(a, e.target.checked)}
            />
            {a}
          </label>
        ))}

        <input
          placeholder="Other amenity"
          value={otherAmenity}
          onChange={e => setOtherAmenity(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Property"}
        </button>
      </form>

      {/* ---------- PHOTO UPLOAD ---------- */}
      {propertyId && (
        <>
          <hr />
          <h3>Upload Property Photo</h3>

          <input
            type="file"
            accept="image/*"
            onChange={e => setPhoto(e.target.files?.[0] || null)}
          />

          <button onClick={uploadPhoto} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload a photo"}
          </button>
        </>
      )}
    </div>
  );
}
