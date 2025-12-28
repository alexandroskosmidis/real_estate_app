import { useEffect, useState } from "react";
import type { Property } from "../../components/PropertyCard/Property.types";
import { fetchProperties } from "../../services/propertyService";
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import './HomePage.css';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties()
      .then(data => setProperties(data))
      .catch(() => setError("Failed to load properties"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="property-list">
      {properties.map(property => (
        <PropertyCard
          key={property.property_id}
          property={property}
        />
      ))}
    </div>
  );
}
