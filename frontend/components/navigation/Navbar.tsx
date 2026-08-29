'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          APWCFS
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link href="/dashboard" className="navbar-link">Forecast</Link>
          </li>
          <li className="navbar-item">
            <Link href="/science" className="navbar-link">Science</Link>
          </li>
          <li className="navbar-item">
            <Link href="/about" className="navbar-link">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
