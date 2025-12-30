import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRulerCombined, faBed, faBuilding, faKey } from '@fortawesome/free-solid-svg-icons';
import './PropertyCard.css';
import type { Property } from './Property.types.ts';

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const placeholderImg =
    'https://via.placeholder.com/400x300?text=Property+Photo';
  const isSale = property.purpose === 'sale';
 // const badgeText = isSale ? 'ΠΩΛΗΣΗ' : 'ΕΝΟΙΚΙΑΣΗ';
 // const badgeClass = isSale ? 'badge-sale' : 'badge-rent';
  const formattedPrice = new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0, 
  }).format(Number(property.price));

  const formattedDate = new Date(property.creation_date).toLocaleDateString('el-GR');

return (
    <div className="property-card">
      {/* 1. Αριστερό Μέρος: Εικόνα */}
      <div className="card-image-container">
        <span className={`property-badge ${isSale ? 'badge-sale' : 'badge-rent'}`}>
          {isSale ? 'BUY' : 'RENT'}
        </span>
        <img
          src={property.photo_url}
          alt="Property"
          className="property-image"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholderImg;
          }}
        />
      </div>

      {/* 2. Δεξί Μέρος: Περιεχόμενο (ΟΛΑ ΜΕΣΑ ΕΔΩ) */}
      <div className="property-content">
        
        {/* Τίτλος */}
        <h3 className="property-title">
          {property.city}, {property.area}
        </h3>

        {/* Διεύθυνση */}
        <p className="property-address">
          <FontAwesomeIcon icon={faLocationDot} className="icon-address" />
          {property.address} {property.number}
        </p>

        {/* Χαρακτηριστικά (τμ, δωμάτια, κλπ) */}
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
            <span>{isSale ? 'Πώληση' : 'Ενοικίαση'}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="amenities-container">
          {property.amenities.slice(0, 3).map((a, index) => (
            <span key={index} className="amenity-pill">{a}</span>
          ))}
          {property.amenities.length > 3 && (
            <span className="amenity-pill">
              +{property.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Footer: Ημερομηνία & Τιμή  */}
        <div className="price-footer">
          {/* Αριστερά: Ημερομηνία */}
          <span className="creation-date">
            Published: {formattedDate}
          </span>

          {/* Δεξιά: Τιμή */}
          <div className="price-container">
            <span className="price-amount">{formattedPrice}</span>
            {!isSale && <span className="price-period"> /month</span>}
          </div>
        </div>

      </div> 
    </div> 
  );

}
