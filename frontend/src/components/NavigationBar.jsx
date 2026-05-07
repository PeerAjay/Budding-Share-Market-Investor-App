import { Link } from 'react-router-dom'
import './NavigationBar.css'

function NavigationBar({ user, onLogout }) {
  return (
    <nav className="app-navbar">
      <div className="app-navbar__left">
        <Link to="/dashboard" className="app-navbar__brand">
          Share Market App
        </Link>
      </div>

      <div className="app-navbar__right">
        <Link to="/dashboard" className="app-navbar__link">
          Dashboard
        </Link>

        <Link to="/portfolio" className="app-navbar__link">
          Portfolio
        </Link>

        <Link to="/market" className="app-navbar__link">
          Market
        </Link>

        <Link to="/profile" className="app-navbar__link">
          Profile
        </Link>

        <div className="app-navbar__user">
          <span className="app-navbar__user-label">
            {user?.identity || 'User'}
          </span>
        </div>

        <button className="app-navbar__logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default NavigationBar