// src/components/NavShell.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function NavShell() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar bg-dark">
      <div className="navbar-inner">
        {/* Brand on left */}
        <div className="navbar-brand brand-title">FinTrack</div>

        {/* Center links */}
        <div className="navbar-center">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Transactions
          </NavLink>
          <NavLink to="/summary" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Summary
          </NavLink>
        </div>

        {/* Right actions (username + Logout) */}
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="user-name">{user.displayName || user.email}</span>
              <button className="btn btn-sm btn-outline-light" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
