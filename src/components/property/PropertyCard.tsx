import { Property } from '../../types/property.types';
import './PropertyCard.css';

interface Props {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: Props) {
  const {
    purpose,
    square_meters,
    price,
    rooms,
    floor,
    location,
    photo_url,
  } = property;

  return (
    <div className="property-card" onClick={onClick}>
      <img
        src={photo_url || '/placeholder-house.jpg'}
        alt="Property"
        className="property-image"
      />

      <div className="property-content">
        <div className="property-header">
          <span className={`property-purpose ${purpose}`}>
            {purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          <span className="property-price">{price.toLocaleString()} €</span>
        </div>

        <p className="property-location">
          {location.city}, {location.area}
        </p>

        <div className="property-details">
          <span>{square_meters} m²</span>
          <span>{rooms} rooms</span>
          <span>Floor {floor}</span>
        </div>
      </div>
    </div>
  );
}
