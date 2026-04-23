import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
import NavigationBar from './components/NavigationBar'
import './App.css'

function App() {
  const location = useLocation()

  const handleRegister = () => {
    console.log('Register function called')
  }

  const handleDashboardAction = () => {
    console.log('Dashboard function called')
  }

  const handleLogout = () => {
    console.log('Logout function called')
  }

  const hideNavbar = location.pathname === '/'

  return (
    <>
      {!hideNavbar && <NavigationBar onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/register"
          element={<Registration onRegister={handleRegister} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard onDashboardAction={handleDashboardAction} />}
        />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
