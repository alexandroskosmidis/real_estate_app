import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { mockProperties } from '../../mock/mockProperties';

export default function HomePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>Available Properties</h1>

      {mockProperties.map(property => (
        <PropertyCard
          key={property.property_id}
          property={property}
        />
      ))}
    </div>
  );
}
