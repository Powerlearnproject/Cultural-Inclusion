import React from 'react'
import Dashboard from './Pages/Dashboard'
import Navbar from './Components/Navbar'
import Sidebar from './Components/Sidebar'
import './App.css'
import ChartCard from './Components/ChartCard'

const App = () => {
  return (
    <div className='app-container'>
      <Navbar />
      <div className='layout'>
        <Sidebar />
        <main className='main-content'>
          <Dashboard />
        </main>
      </div>
      
    </div>
  )
}

export default App
