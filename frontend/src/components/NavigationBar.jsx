import { Link } from 'react-router-dom'

function NavigationBar({ onLogout }) {
  return (
    <nav
      style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <h2 style={{ margin: 0 }}>Share Market App</h2>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/home">Home</Link>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default NavigationBar