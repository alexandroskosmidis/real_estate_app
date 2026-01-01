import { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faSearch, faRotateLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Slider from 'rc-slider';

import type { Property } from "../../components/PropertyCard/Property.types";
import { fetchProperties } from "../../services/propertyService";
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import 'rc-slider/assets/index.css';
import './HomePage.css';

import UserMenu from '../../components/UserMenu/UserMenu';
import { useNavigate } from 'react-router-dom';

type Filters = {
  purpose: 'sale' | 'rent' | 'all';
  city: string;
  minPrice: string;
  maxPrice: string;
  minSqm: string;
  maxSqm: string;
  floor: string;
  rooms: string;
};

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Αρχική κατάσταση φίλτρων
  const initialFilters: Filters = {
    purpose: 'all', // Default επιλογή
    city: '',
    minPrice: '',
    maxPrice: '',
    minSqm: '',
    maxSqm: '',
    floor: '',
    rooms: ''
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    fetchProperties()
      .then(data => setProperties(data))
      .catch(() => setError("Failed to load properties"))
      .finally(() => setLoading(false));
  }, []);

  // 1. Υπολογισμός μοναδικών περιοχών για το Dropdown
  // (Ψάχνει όλα τα ακίνητα και βρίσκει ποιες περιοχές υπάρχουν)
  const uniqueCities = useMemo(() => {
    const cities = properties.map(p => p.city).filter(c => c);;
    return Array.from(new Set(cities)).sort(); 
  }, [properties]);


  const priceBounds = useMemo(() => {
    if (properties.length === 0) return { min: 0, max: 500000 }; 
    const prices = properties.map(p => p.price);
    return {
        min: Math.min(...prices), // Η χαμηλότερη τιμή που βρέθηκε
        max: Math.max(...prices)  // Η υψηλότερη τιμή που βρέθηκε
    };
  }, [properties]);

  const handlePriceSliderChange = (values: number | number[]) => {
    // Το slider επιστρέφει έναν πίνακα [min, max]
    if (Array.isArray(values)) {
        updateFilter('minPrice', values[0].toString());
        updateFilter('maxPrice', values[1].toString());
    }
  };


  const filteredProperties = properties.filter(property => {
    if (appliedFilters.purpose !== 'all' && property.purpose !== appliedFilters.purpose) return false;

    if (appliedFilters.city && property.city !== appliedFilters.city) return false;

    if (appliedFilters.minPrice && property.price < Number(appliedFilters.minPrice)) return false;
    if (appliedFilters.maxPrice && property.price > Number(appliedFilters.maxPrice)) return false;

    if (appliedFilters.minSqm && property.square_meters < Number(appliedFilters.minSqm)) return false;
    if (appliedFilters.maxSqm && property.square_meters > Number(appliedFilters.maxSqm)) return false;

    if (appliedFilters.floor && property.floor < Number(appliedFilters.floor)) return false;

    if (appliedFilters.rooms && property.rooms < Number(appliedFilters.rooms)) return false;
    return true;
  });

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };


  const togglePurpose = (clickedPurpose: 'sale' | 'rent') => {
    setFilters(prev => ({
      ...prev,
      purpose: prev.purpose === clickedPurpose ? 'all' : clickedPurpose
    }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isOwner = user && (user.role === 'seller' || user.role === 'both');
  const navigate = useNavigate();


  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div className="home-page-container">
        <nav className="navbar">
          <div className="navbar-logo">
            <div className="logo-icon">
              <FontAwesomeIcon icon={faHouse} />
            </div>
            <span className="logo-text">RealEstate<span style={{color: '#6e1c09'}}>App</span></span>
          </div>

          <div className="navbar-actions" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            {isOwner && (
              <button 
                onClick={() => navigate('/messages')} 
                style={{background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '1.2rem'}}
                title="My Messages"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
            )}
           <UserMenu /> 
          </div>


        </nav>

        <section className="home-hero">
        <h1 className="home-hero-title">Find your next home</h1>
        <p className="home-hero-subtitle">Explore properties for sale or rent across Greece</p>
        </section>  

      <div className="hero-cta" style={{ textAlign: 'right', marginBottom: '2rem', marginRight: '2rem' }}>
            <Link to="/property/create" style={{ textDecoration: 'none' }}>
            <button className="large-upload-btn">
              + Upload Property
            </button>
            </Link>
      </div>


       <div className="home-layout"></div>

        {/* --- ΚΟΥΤΙ ΦΙΛΤΡΩΝ --- */}
        <div className="filters-card">

          <div className="filter-row-top">
            <span className="filter-label-top">I am looking to:</span>
            <div className="toggle-group">
              <button 
                className={`toggle-btn ${filters.purpose === 'sale' ? 'active' : ''}`}
                onClick={() => togglePurpose('sale')}
              >
                Buy
              </button>
              <button 
                className={`toggle-btn ${filters.purpose === 'rent' ? 'active' : ''}`}
                onClick={() => togglePurpose('rent')}
              >
                Rent
              </button>
            </div>
          </div>

          <hr className="filter-divider" />
          <div className="filter-row-bottom">
            
            {/* City */}
            <div className="filter-item">
              <label>City</label>
              <select 
                value={filters.city} 
                onChange={e => updateFilter('city', e.target.value)}
                className="filter-input"
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            

            {/* Sqm */}
            <div className="filter-item">
              <label>Size (m²)</label>
              <div className="range-inputs">
                <input 
                  type="number" placeholder="Min" className="filter-input small"
                  value={filters.minSqm} onChange={e => updateFilter('minSqm', e.target.value)}
                />
                <span>-</span>
                <input 
                  type="number" placeholder="Max" className="filter-input small"
                  value={filters.maxSqm} onChange={e => updateFilter('maxSqm', e.target.value)}
                />
              </div>
            </div>

            {/* Details */}
            <div className="filter-item">
              <label>Details</label>
              <div className="range-inputs">
                <input 
                  type="number" placeholder="Floor" className="filter-input small"
                  value={filters.floor} onChange={e => updateFilter('floor', e.target.value)}
                />
                <input 
                  type="number" placeholder="Rooms" className="filter-input small"
                  value={filters.rooms} onChange={e => updateFilter('rooms', e.target.value)}
                />
              </div>
            </div>

            {/* Price */}
            <div className="filter-item" style={{ minWidth: '150px' }}> 
              <label>Price (€)</label>
              <div className="price-slider-container" >
                   <Slider
                        range 
                        min={priceBounds.min}
                        max={priceBounds.max}
                        step={5000} 
                        value={[
                            filters.minPrice ? Number(filters.minPrice) : priceBounds.min,
                            filters.maxPrice ? Number(filters.maxPrice) : priceBounds.max
                        ]}
                        onChange={handlePriceSliderChange}
                        handleRender={(node, props) => {
                          return (
                            <div {...node.props} key={props.index} >
                            
                              <div className="slider-tooltip">
                                {Number(props.value).toLocaleString('el-GR')} €
                              </div>
                            </div>
                          );
                        }}

                    />
              </div>
            </div>

            {/* SEARCH BUTTON (Δίπλα στα φίλτρα) */}
            <div className="filter-actions">
                <button className="search-btn" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} /> Search
                </button>
                <button className="reset-link" onClick={resetFilters}>
                    <FontAwesomeIcon icon={faRotateLeft} />
                </button>
            </div>

          </div>
        </div>

        {/* --- RESULTS INFO --- */}
        <div className="results-info">
           Found <strong>{filteredProperties.length}</strong> properties
        </div>

        <div className="property-list">
          {filteredProperties.map(property => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
          {filteredProperties.length === 0 && <p>No properties found.</p>}
        </div>

        <aside className="home-sidebar">
           <h3 style={{marginTop:0}}>Actions</h3>
           <Link to="/property/create">
            <button className="upload-button">Upload Property</button>
           </Link>
        </aside>
      </div>
  );
}