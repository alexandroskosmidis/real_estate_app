import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '10px' }}>
        Home
      </Link>

      <Link to="/property/create" style={{ marginRight: '10px' }}>
        Add Property
      </Link>

      <Link to="/login">Login</Link>
    </nav>
  );
};

export default Navbar;
