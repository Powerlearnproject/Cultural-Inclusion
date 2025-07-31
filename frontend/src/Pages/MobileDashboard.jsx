import React, { useState, useEffect } from 'react'
import './MobileDashboard.css'

const MobileDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState('synced')
  const [quickActions, setQuickActions] = useState([])

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Set up quick actions based on user role
    setupQuickActions()
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [user])

  const setupQuickActions = () => {
    if (user?.role === 'officer') {
      setQuickActions([
        { id: 'register', label: 'Register Beneficiary', icon: '👤', color: 'primary' },
        { id: 'scan', label: 'Scan Document', icon: '📷', color: 'secondary' },
        { id: 'location', label: 'Set Location', icon: '📍', color: 'success' },
        { id: 'sync', label: 'Sync Data', icon: '🔄', color: 'warning' }
      ])
    } else if (user?.role === 'beneficiary') {
      setQuickActions([
        { id: 'profile', label: 'My Profile', icon: '👤', color: 'primary' },
        { id: 'status', label: 'Check Status', icon: '📊', color: 'info' },
        { id: 'support', label: 'Support Programs', icon: '🤝', color: 'success' },
        { id: 'appeal', label: 'Submit Appeal', icon: '⚖️', color: 'warning' }
      ])
    } else if (user?.role === 'admin') {
      setQuickActions([
        { id: 'approvals', label: 'Pending Approvals', icon: '✅', color: 'primary' },
        { id: 'analytics', label: 'Analytics', icon: '📊', color: 'secondary' },
        { id: 'reports', label: 'Reports', icon: '📋', color: 'info' },
        { id: 'settings', label: 'Settings', icon: '⚙️', color: 'warning' }
      ])
    }
  }

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'register':
        // Open camera for document scanning
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              // Handle camera stream for document scanning
              console.log('Camera access granted for document scanning')
            })
            .catch(err => {
              console.log('Camera access denied:', err)
            })
        }
        break
      case 'scan':
        // Open file picker for document upload
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.capture = 'camera'
        input.onchange = (e) => {
          const file = e.target.files[0]
          if (file) {
            // Handle document upload
            console.log('Document selected:', file.name)
          }
        }
        input.click()
        break
      case 'location':
        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('Location:', position.coords)
              // Update user location
            },
            (error) => {
              console.log('Location error:', error)
            }
          )
        }
        break
      case 'sync':
        // Sync offline data
        setSyncStatus('syncing')
        setTimeout(() => {
          setSyncStatus('synced')
        }, 2000)
        break
      default:
        console.log('Action:', actionId)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'synced': return 'success'
      case 'syncing': return 'warning'
      case 'error': return 'danger'
      default: return 'info'
    }
  }

  return (
    <div className="mobile-dashboard">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              <span className="user-icon">
                {user?.role === 'admin' ? '👑' : user?.role === 'officer' ? '👮' : '👤'}
              </span>
            </div>
            <div className="user-details">
              <h2>{user?.name}</h2>
              <span className="role-badge">{user?.role}</span>
            </div>
          </div>
          <div className="status-indicators">
            <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
            <div className={`sync-status ${getStatusColor(syncStatus)}`}>
              {syncStatus === 'syncing' && <span className="spinner"></span>}
              {syncStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map(action => (
            <button
              key={action.id}
              className={`action-button ${action.color}`}
              onClick={() => handleQuickAction(action.id)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="mobile-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          📝 Data
        </button>
        <button 
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📋 Reports
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <span className="stat-number">24</span>
                  <span className="stat-label">Total Users</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <span className="stat-number">18</span>
                  <span className="stat-label">Approved</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Pending</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-number">75%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <span className="activity-title">New beneficiary registered</span>
                    <span className="activity-time">2 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <span className="activity-title">Application approved</span>
                    <span className="activity-time">15 minutes ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📷</div>
                  <div className="activity-content">
                    <span className="activity-title">Document uploaded</span>
                    <span className="activity-time">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="data-content">
            <div className="data-actions">
              <button className="data-button primary">
                <span className="button-icon">📷</span>
                <span>Scan Document</span>
              </button>
              <button className="data-button secondary">
                <span className="button-icon">📁</span>
                <span>Upload File</span>
              </button>
              <button className="data-button success">
                <span className="button-icon">📍</span>
                <span>Add Location</span>
              </button>
            </div>

            <div className="data-list">
              <h3>Recent Data Entries</h3>
              <div className="data-items">
                <div className="data-item">
                  <div className="data-icon">📄</div>
                  <div className="data-info">
                    <span className="data-title">ID Document</span>
                    <span className="data-subtitle">Uploaded 2 hours ago</span>
                  </div>
                  <div className="data-status verified">✓ Verified</div>
                </div>
                <div className="data-item">
                  <div className="data-icon">📞</div>
                  <div className="data-info">
                    <span className="data-title">Phone Number</span>
                    <span className="data-subtitle">+254 700 123 456</span>
                  </div>
                  <div className="data-status pending">⏳ Pending</div>
                </div>
                <div className="data-item">
                  <div className="data-icon">📍</div>
                  <div className="data-info">
                    <span className="data-title">Location</span>
                    <span className="data-subtitle">Nairobi, Kenya</span>
                  </div>
                  <div className="data-status verified">✓ Verified</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-content">
            <div className="report-cards">
              <div className="report-card">
                <div className="report-header">
                  <span className="report-icon">📊</span>
                  <span className="report-title">Weekly Summary</span>
                </div>
                <div className="report-stats">
                  <div className="report-stat">
                    <span className="stat-value">12</span>
                    <span className="stat-label">New Registrations</span>
                  </div>
                  <div className="report-stat">
                    <span className="stat-value">8</span>
                    <span className="stat-label">Approvals</span>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <div className="report-header">
                  <span className="report-icon">🎯</span>
                  <span className="report-title">Vulnerability Analysis</span>
                </div>
                <div className="vulnerability-stats">
                  <div className="vuln-stat">
                    <span className="vuln-label">Refugees</span>
                    <span className="vuln-value">5</span>
                  </div>
                  <div className="vuln-stat">
                    <span className="vuln-label">LGBTQ+</span>
                    <span className="vuln-value">3</span>
                  </div>
                  <div className="vuln-stat">
                    <span className="vuln-label">Disabled</span>
                    <span className="vuln-value">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-content">
            <div className="settings-section">
              <h3>App Settings</h3>
              <div className="setting-item">
                <span className="setting-label">Offline Mode</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <span className="setting-label">Auto Sync</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <span className="setting-label">Location Services</span>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Account</h3>
              <button className="settings-button">
                <span className="button-icon">👤</span>
                <span>Edit Profile</span>
              </button>
              <button className="settings-button">
                <span className="button-icon">🔒</span>
                <span>Change Password</span>
              </button>
              <button className="settings-button">
                <span className="button-icon">📱</span>
                <span>Notification Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <button className="nav-button active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-button">
          <span className="nav-icon">📝</span>
          <span className="nav-label">Data</span>
        </button>
        <button className="nav-button">
          <span className="nav-icon">📊</span>
          <span className="nav-label">Reports</span>
        </button>
        <button className="nav-button">
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
      </div>
    </div>
  )
}

export default MobileDashboard 