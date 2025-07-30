import React, { useState, useEffect } from 'react'
import Dashboard from './Pages/Dashboard'
import DataEntry from './Pages/DataEntry'
import Reports from './Pages/Reports'
import Insights from './Pages/Insights'
import Cohorts from './Pages/Cohorts'
import Login from './Pages/Login'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import './App.css'

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // Check for existing authentication on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setIsAuthenticated(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'data-entry':
        return <DataEntry user={user} />
      case 'reports':
        return <Reports user={user} />
      case 'insights':
        return <Insights user={user} />
      case 'cohorts':
        return <Cohorts user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className='app-container'>
      <Navbar user={user} onLogout={handleLogout} />
      <div className='layout'>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />
        <main className='main-content'>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
