import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
import NavigationBar from './components/NavigationBar'
import { useAuth } from './services/AuthContext'
import './App.css'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function App() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const hideNavbar =
    location.pathname === '/' || location.pathname === '/register'

  return (
    <>
      {!hideNavbar && <NavigationBar onLogout={logout} />}

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Registration />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
