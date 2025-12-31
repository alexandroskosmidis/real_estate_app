import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faRightFromBracket, faPhone, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import './UserMenu.css';

type User = {
  name: string;
  email: string;
  phone: string;
  role: "renter" | "seller" | "both";
};

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Κλείσιμο μενού με κλικ έξω
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Λειτουργία Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Σβήνουμε τα στοιχεία
    setUser(null);
    navigate("/"); // Τον στέλνουμε στη σελίδα login
  };

  const getRoleLabel = (role: string) => {
    if (role === 'renter') return 'Renter';
    if (role === 'seller') return 'Seller';
    return 'Seller & Renter'; // both
  };

  // Αν δεν υπάρχει χρήστης (δεν έχει κάνει login), δεν δείχνουμε το μενού
  if (!user) return null; 

  return (
    <div className="user-menu-container" ref={menuRef}>
      
      <button 
        className={`user-avatar-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faUserCircle} className="avatar-icon" />
      </button>

      {isOpen && (
        <div className="user-dropdown">
          
          <div className="dropdown-header">
            <div className="user-info">
              
              {/* ΓΡΑΜΜΗ 1: Όνομα και Ρόλος */}
              <div className="name-row">
                <span className="user-name">
                  {user.name}
                </span>
                {/* Το Ρόλος ως Badge (ταμπελάκι) */}
                <span className={`role-badge ${user.role}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              {/* ΓΡΑΜΜΗ 2: Email */}
              <div className="meta-row">
                 <FontAwesomeIcon icon={faEnvelope} className="meta-icon"/>
                 <span className="user-meta">{user.email}</span>
              </div>

              {/* ΓΡΑΜΜΗ 3: Τηλέφωνο (Αν υπάρχει) */}
              {user.phone && (
                <div className="meta-row">
                  <FontAwesomeIcon icon={faPhone} className="meta-icon"/>
                  <span className="user-meta">{user.phone}</span>
                </div>
              )}

            </div>
          </div>

          <hr className="dropdown-divider" />

          <ul className="dropdown-list">
            <li>
              <button className="dropdown-item">
                <FontAwesomeIcon icon={faUser} /> My Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </button>
            </li>
          </ul>

        </div>
      )}
    </div>
  );
}