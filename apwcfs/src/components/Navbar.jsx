import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">APWCFS</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">About</Link>
        <Link to="/science" className="nav-link">Science</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </div>
    </nav>
  );
}
