import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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
    <div>
      <section className="home-hero">
        <h1 className="home-hero-title">Find your next home</h1>
        <p className="home-hero-subtitle">Explore properties for sale or rent across Greece</p>
        <div className="home-hero-actions">
          <button className="home-hero-button">Browse for Sale</button>
          <button className="home-hero-button secondary">Browse for Rent</button>
        </div>
      </section>

      <div className="home-layout">
        <div className="property-list">
          {properties.map(property => (
            <PropertyCard
              key={property.property_id}
              property={property}
            />
          ))}
        </div>

        <aside className="home-sidebar">
          <h3 style={{ marginTop: 0 }}>Actions</h3>
          <Link to="/property/create">
            <button className="upload-button">Upload a Property</button>
          </Link>
        </aside>
      </div>
    </div>
  );
}