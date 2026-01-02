import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faRulerCombined,
  faBed,
  faBuilding,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './PropertyCard.css';
import type { Property } from './Property.types';

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const navigate = useNavigate();

  const placeholderImg =
    'https://via.placeholder.com/400x300?text=Property+Photo';

  const isSale = property.purpose === 'sale';

  const formattedPrice = new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number(property.price));

  const formattedDate = new Date(
    property.creation_date
  ).toLocaleDateString('el-GR');

  const handleSendMessage = () => {
    navigate(`/properties/${property.property_id}/message`, {
      state: { property },
    });
  };

  return (
    <div className="property-card">
      {/* Image */}
      <div className="card-image-container">
        <span
          className={`property-badge ${
            isSale ? 'badge-sale' : 'badge-rent'
          }`}
        >
          {isSale ? 'BUY' : 'RENT'}
        </span>

        <img
          src={property.photo_url}
          alt="Property"
          className="property-image"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              placeholderImg;
          }}
        />
      </div>

      {/* Content */}
      <div className="property-content">
        <h3 className="property-title">
          {property.city}, {property.area}
        </h3>

        <p className="property-address">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="icon-address"
          />
          {property.address} {property.number}
        </p>

        <div className="features-grid">
          <div className="feature-item">
            <FontAwesomeIcon icon={faRulerCombined} />
            <span>{property.square_meters} m²</span>
          </div>

          <div className="feature-item">
            <FontAwesomeIcon icon={faBed} />
            <span>{property.rooms} rooms</span>
          </div>

          <div className="feature-item">
            <FontAwesomeIcon icon={faBuilding} />
            <span>{property.floor} floor</span>
          </div>

          <div className="feature-item">
            <FontAwesomeIcon icon={faKey} />
            <span>{isSale ? 'Buy' : 'Rent'}</span>
          </div>
        </div>

        <div className="amenities-container">
          {property.amenities.slice(0, 3).map((a, i) => (
            <span key={i} className="amenity-pill">
              {a}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="amenity-pill">
              +{property.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="price-footer">
          <span className="creation-date">
            Published: {formattedDate}
          </span>

          <div className="price-container">
            <span className="price-amount">
              {formattedPrice}
            </span>
            {!isSale && (
              <span className="price-period">
                {' '}
                /month
              </span>
            )}
          </div>
        </div>

        {/* ✅ SEND MESSAGE BUTTON */}
        <button
          className="send-message-btn"
          onClick={handleSendMessage}
        >
          Send a Message
        </button>
      </div>
    </div>
  );
}
