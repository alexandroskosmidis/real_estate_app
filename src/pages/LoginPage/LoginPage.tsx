import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import "./LoginPage.css";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login(username, password);

      if (res.success && res.user) {
        // προσωρινή αποθήκευση
        localStorage.setItem('user', JSON.stringify(res.user));
        navigate('/home');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch {
      setError('Server error');
    }
  };

    return (
    <main className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1 className="login-title">Real Estate App</h1>
          <p className="login-subtitle">Find your next home easily</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email or Username
            </label>
            <input
              placeholder="Enter your email or Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="login-button">Login</button>
        </form>

        <footer className="login-footer">
          <p>© 2025 Real Estate App</p>
        </footer>
      </div>
    </main>
  );

}


  // return (
  //   <form onSubmit={handleSubmit}>
  //     <h2>Login</h2>

  //     <input
  //       placeholder="Username"
  //       value={username}
  //       onChange={e => setUsername(e.target.value)}
  //     />

  //     <input
  //       type="password"
  //       placeholder="Password"
  //       value={password}
  //       onChange={e => setPassword(e.target.value)}
  //     />

  //     <button type="submit">Login</button>

  //     {error && <p style={{ color: 'red' }}>{error}</p>}
  //   </form>
  // );