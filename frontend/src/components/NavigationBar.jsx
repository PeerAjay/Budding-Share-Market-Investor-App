import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./NavigationBar.css";

function NavigationBar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? "app-navbar__link app-navbar__link--active" : "app-navbar__link";

  return (
    <nav className="app-navbar">
      <div className="app-navbar__left">
        <NavLink
          to="/dashboard"
          className="app-navbar__brand"
          onClick={handleCloseMenu}
        >
          <div className="app-navbar__brand-mark">SM</div>
          <div className="app-navbar__brand-text">
            <span className="app-navbar__brand-title">Share Market App</span>
            <span className="app-navbar__brand-subtitle">
              Budding Investor Platform
            </span>
          </div>
        </NavLink>
      </div>

      <button
        className={`app-navbar__toggle ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`app-navbar__right ${menuOpen ? "is-open" : ""}`}>
        <div className="app-navbar__links">
          <NavLink
            to="/dashboard"
            className={getLinkClass}
            onClick={handleCloseMenu}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/portfolio"
            className={getLinkClass}
            onClick={handleCloseMenu}
          >
            Portfolio
          </NavLink>

          <NavLink
            to="/market"
            className={getLinkClass}
            onClick={handleCloseMenu}
          >
            Market
          </NavLink>

          <NavLink
            to="/transactions"
            className={getLinkClass}
            onClick={handleCloseMenu}
          >
            Transactions
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={getLinkClass}
            onClick={handleCloseMenu}
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/admin"
            className={getLinkClass}
            onClick={handleCloseMenu}
          >
            Admin
          </NavLink>

          <NavLink
            to="/profile"
            className={getLinkClass}
            onClick={handleCloseMenu}
          >
            Profile
          </NavLink>
        </div>

        <div className="app-navbar__actions">
          <div className="app-navbar__user">
            <div className="app-navbar__user-avatar">
              {(user?.identity || "U").charAt(0).toUpperCase()}
            </div>
            <div className="app-navbar__user-text">
              <span className="app-navbar__user-welcome">Signed in as</span>
              <span className="app-navbar__user-label">
                {user?.identity || "User"}
              </span>
            </div>
          </div>

          <button className="app-navbar__logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
