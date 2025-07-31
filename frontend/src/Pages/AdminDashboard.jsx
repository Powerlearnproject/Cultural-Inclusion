import React, { useState, useEffect } from 'react'
import './AdminDashboard.css'

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('approvals')
  const [pendingUsers, setPendingUsers] = useState([])
  const [appeals, setAppeals] = useState([])
  const [verificationRecommendations, setVerificationRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [approvalComment, setApprovalComment] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      if (activeTab === 'approvals') {
        const response = await fetch('http://localhost:5002/api/auth/pending-approvals', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setPendingUsers(data)
        }
      } else if (activeTab === 'appeals') {
        const response = await fetch('http://localhost:5002/api/auth/appeals', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setAppeals(data)
        }
      } else if (activeTab === 'verification') {
        const response = await fetch('http://localhost:5002/api/auth/verification-recommendations', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setVerificationRecommendations(data)
        }
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproval = async (userId, approvalStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/update-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          approvalStatus,
          approvalComment: approvalComment || undefined,
          rejectionReason: rejectionReason || undefined
        })
      })

      if (response.ok) {
        setPendingUsers(prev => prev.filter(user => user._id !== userId))
        setApprovalComment('')
        setRejectionReason('')
        alert(`User ${approvalStatus} successfully`)
      } else {
        setError('Failed to update approval status')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const handleAppealResponse = async (userId, appealStatus) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/update-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          approvalStatus: appealStatus === 'approved' ? 'approved' : 'rejected',
          approvalComment: `Appeal ${appealStatus}`,
          rejectionReason: appealStatus === 'rejected' ? 'Appeal rejected' : undefined
        })
      })

      if (response.ok) {
        setAppeals(prev => prev.filter(user => user._id !== userId))
        alert(`Appeal ${appealStatus} successfully`)
      } else {
        setError('Failed to update appeal status')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'officer': return '👮'
      case 'beneficiary': return '👤'
      default: return '👤'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'officer': return 'officer'
      case 'beneficiary': return 'beneficiary'
      default: return 'default'
    }
  }

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'high-risk'
      case 'medium': return 'medium-risk'
      case 'low': return 'low-risk'
      default: return 'default'
    }
  }

  const getTrustScoreColor = (score) => {
    if (score >= 80) return 'high-trust'
    if (score >= 50) return 'medium-trust'
    return 'low-trust'
  }

  if (isLoading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading admin data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <p className="admin-subtitle">
          Manage user approvals, appeals, and verification processes
        </p>
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-number">{pendingUsers.length}</span>
            <span className="stat-label">Pending Approvals</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{appeals.length}</span>
            <span className="stat-label">Pending Appeals</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{verificationRecommendations.length}</span>
            <span className="stat-label">Verification Needed</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          📋 Pending Approvals ({pendingUsers.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'appeals' ? 'active' : ''}`}
          onClick={() => setActiveTab('appeals')}
        >
          ⚖️ Appeals ({appeals.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          🔍 Verification ({verificationRecommendations.length})
        </button>
      </div>

      {/* Pending Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="tab-content">
          <h2>📋 Pending User Approvals</h2>
          
          {pendingUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No Pending Approvals</h3>
              <p>All user registration requests have been processed.</p>
            </div>
          ) : (
            <div className="pending-users-grid">
              {pendingUsers.map(user => (
                <div key={user._id} className={`user-card ${getRoleColor(user.role)}`}>
                  <div className="user-header">
                    <div className="user-avatar">
                      <span className="role-icon">{getRoleIcon(user.role)}</span>
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <span className={`role-badge ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <div className="trust-score">
                        <span className={`trust-badge ${getTrustScoreColor(user.trustScore)}`}>
                          Trust: {user.trustScore}%
                        </span>
                        <span className={`risk-badge ${getRiskLevelColor(user.riskLevel)}`}>
                          {user.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="user-details">
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    {user.phoneNumber && (
                      <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{user.phoneNumber}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{user.location}</span>
                      </div>
                    )}
                    {user.vulnerabilityFactors && user.vulnerabilityFactors.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Vulnerability Factors:</span>
                        <div className="vulnerability-tags">
                          {user.vulnerabilityFactors.map(factor => (
                            <span key={factor} className="vulnerability-tag">{factor}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Registered:</span>
                      <span className="detail-value">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="approval-actions">
                    <div className="comment-section">
                      <label>Approval Comment (Optional):</label>
                      <textarea
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="Add a comment for approval/rejection..."
                        rows="2"
                      />
                    </div>
                    
                    <div className="rejection-section">
                      <label>Rejection Reason (if rejecting):</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide reason for rejection..."
                        rows="2"
                      />
                    </div>
                    
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleApproval(user._id, 'approved')}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleApproval(user._id, 'rejected')}
                      >
                        ❌ Reject
                      </button>
                      <button
                        className="review-btn"
                        onClick={() => handleApproval(user._id, 'under_review')}
                      >
                        🔍 Under Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Appeals Tab */}
      {activeTab === 'appeals' && (
        <div className="tab-content">
          <h2>⚖️ Pending Appeals</h2>
          
          {appeals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No Pending Appeals</h3>
              <p>All appeals have been processed.</p>
            </div>
          ) : (
            <div className="appeals-grid">
              {appeals.map(user => (
                <div key={user._id} className={`appeal-card ${getRoleColor(user.role)}`}>
                  <div className="appeal-header">
                    <div className="user-avatar">
                      <span className="role-icon">{getRoleIcon(user.role)}</span>
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <span className={`role-badge ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="appeal-details">
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Original Rejection:</span>
                      <span className="detail-value">{user.rejectionReason || 'No reason provided'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Appeal Comment:</span>
                      <span className="detail-value">{user.appealComment}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Appeal Submitted:</span>
                      <span className="detail-value">
                        {new Date(user.appealSubmittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="appeal-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleAppealResponse(user._id, 'approved')}
                    >
                      ✅ Grant Appeal
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleAppealResponse(user._id, 'rejected')}
                    >
                      ❌ Deny Appeal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Verification Tab */}
      {activeTab === 'verification' && (
        <div className="tab-content">
          <h2>🔍 Verification Recommendations</h2>
          
          {verificationRecommendations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No Verification Needed</h3>
              <p>All users have adequate trust scores.</p>
            </div>
          ) : (
            <div className="verification-grid">
              {verificationRecommendations.map(user => (
                <div key={user._id} className={`verification-card ${getRiskLevelColor(user.riskLevel)}`}>
                  <div className="verification-header">
                    <div className="user-avatar">
                      <span className="role-icon">{getRoleIcon(user.role)}</span>
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <span className={`role-badge ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="verification-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Trust Score:</span>
                      <span className={`metric-value ${getTrustScoreColor(user.trustScore)}`}>
                        {user.trustScore}%
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Risk Level:</span>
                      <span className={`metric-value ${getRiskLevelColor(user.riskLevel)}`}>
                        {user.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="verification-actions">
                    <button className="verify-btn">
                      🔍 Review Verification
                    </button>
                    <button className="contact-btn">
                      📞 Contact User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="admin-actions">
        <h2>⚙️ System Actions</h2>
        <div className="actions-grid">
          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>System Analytics</h3>
            <p>View comprehensive system statistics and user activity</p>
            <button className="action-button">View Analytics</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">👥</div>
            <h3>User Management</h3>
            <p>Manage all users, roles, and permissions</p>
            <button className="action-button">Manage Users</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">🔒</div>
            <h3>Security Settings</h3>
            <p>Configure security policies and access controls</p>
            <button className="action-button">Security Settings</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>Audit Logs</h3>
            <p>Review system activity and user actions</p>
            <button className="action-button">View Logs</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 