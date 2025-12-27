import './PropertyCard.css';
import type { Property } from './Property.types.ts';

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const placeholderImg =
    'https://via.placeholder.com/400x300?text=Property+Photo';

  const resolvePhotoUrl = (url: string) => {
    if (!url) return placeholderImg;
    if (url.startsWith('http') || url.startsWith('/')) return url;
    // Normalize Windows paths like C:\Users\... or C:/Users/...
    const normalized = url.replace(/\\/g, '/');
    return `file:///${normalized}`;
  };

  return (
    <div className="property-card">
      <img
        src={resolvePhotoUrl(property.photo_url)}
        alt="Property"
        className="property-image"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = placeholderImg;
        }}
      />

      <div className="property-content">
        <h3>
          {property.city}, {property.area}
        </h3>

        <p className="property-address">
          {property.address} {property.number}
        </p>

        <p className="property-price"><strong>Price:</strong> €{property.price}</p>
        <p><strong>Size:</strong> {property.square_meters} m²</p>
        <p><strong>Rooms:</strong> {property.rooms}</p>
        <p><strong>Floor:</strong> {property.floor}</p>
        <p><strong>Purpose:</strong> {property.purpose}</p>

        <div className="amenities">
          {property.amenities.map(a => (
            <span key={a} className="amenity">
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
