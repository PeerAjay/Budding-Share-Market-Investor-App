import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
import NavigationBar from './components/NavigationBar'
import './App.css'

function App() {
  const handleRegister = () => {
    console.log('Register function called')
  }

  const handleDashboardAction = () => {
    console.log('Dashboard function called')
  }

  const handleLogout = () => {
    console.log('Logout function called')
  }

  return (
    <>
      <NavigationBar onLogout={handleLogout} />

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
      </Routes>
    </>
  )
}

export default App
