import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import './SignUpPage.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'renter' 
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password || !formData.email) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const res = await signup({ ...formData, /*role: 'renter'*/ });
      
      if (res.success) {
        alert("Account created! Please log in.");
        navigate('/'); 
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="signup-container" style={{maxWidth: '500px', margin: '50px auto'}}>
      <div className="login-card"> 
        <header className="login-header">
           <FontAwesomeIcon icon={faHouse} style={{ color: "#6e1c09", fontSize: "2.8rem" }} />
           <h2 className="login-title">Create Account</h2>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          
          <input className="input-field" name="username" placeholder="Username *" onChange={handleChange} />
          
          <input className="input-field" type="password" name="password" placeholder="Password *" onChange={handleChange} />

          <input className="input-field" type="email" name="email" placeholder="Email *" onChange={handleChange} />

          <input className="input-field" name="phone" placeholder="Phone Number" onChange={handleChange} />

          {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}

          <button type="submit" className="login-button" style={{marginTop: '20px'}}>Sign Up</button>
          
          <p style={{marginTop: '15px', textAlign: 'center'}}>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}