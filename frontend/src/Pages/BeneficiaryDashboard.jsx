import React, { useState, useEffect } from 'react'
import './BeneficiaryDashboard.css'

const BeneficiaryDashboard = ({ user }) => {
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [appealComment, setAppealComment] = useState('')
  const [showAppealForm, setShowAppealForm] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      } else {
        setError('Failed to fetch profile')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAppeal = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/auth/submit-appeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appealComment
        })
      })

      if (response.ok) {
        alert('Appeal submitted successfully!')
        setAppealComment('')
        setShowAppealForm(false)
        fetchUserProfile() // Refresh profile data
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to submit appeal')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'approved'
      case 'rejected': return 'rejected'
      case 'pending': return 'pending'
      case 'under_review': return 'review'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅'
      case 'rejected': return '❌'
      case 'pending': return '⏳'
      case 'under_review': return '🔍'
      default: return '❓'
    }
  }

  const getAppealStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'approved'
      case 'rejected': return 'rejected'
      case 'pending': return 'pending'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="beneficiary-dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="beneficiary-dashboard-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Profile Not Found</h3>
          <p>Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="beneficiary-dashboard-container">
      <div className="beneficiary-header">
        <h1>👤 My Profile</h1>
        <p className="beneficiary-subtitle">
          Track your application status and manage your information
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <div className="profile-grid">
        {/* Profile Information */}
        <div className="profile-card">
          <div className="card-header">
            <h2>📋 Personal Information</h2>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{userProfile.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{userProfile.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{userProfile.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">{userProfile.location || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Beneficiary ID:</span>
              <span className="info-value">{userProfile.beneficiaryId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Registration Date:</span>
              <span className="info-value">
                {new Date(userProfile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Application Status */}
        <div className="status-card">
          <div className="card-header">
            <h2>📊 Application Status</h2>
          </div>
          <div className="status-info">
            <div className={`status-badge ${getStatusColor(userProfile.approvalStatus)}`}>
              <span className="status-icon">{getStatusIcon(userProfile.approvalStatus)}</span>
              <span className="status-text">
                {userProfile.approvalStatus.charAt(0).toUpperCase() + userProfile.approvalStatus.slice(1).replace('_', ' ')}
              </span>
            </div>
            
            {userProfile.approvalComment && (
              <div className="status-comment">
                <span className="comment-label">Admin Comment:</span>
                <span className="comment-text">{userProfile.approvalComment}</span>
              </div>
            )}

            {userProfile.rejectionReason && (
              <div className="rejection-reason">
                <span className="reason-label">Rejection Reason:</span>
                <span className="reason-text">{userProfile.rejectionReason}</span>
              </div>
            )}

            {userProfile.approvalStatus === 'rejected' && userProfile.appealStatus === 'none' && (
              <div className="appeal-section">
                <button 
                  className="appeal-btn"
                  onClick={() => setShowAppealForm(true)}
                >
                  ⚖️ Submit Appeal
                </button>
              </div>
            )}

            {userProfile.appealStatus !== 'none' && (
              <div className="appeal-status">
                <span className="appeal-label">Appeal Status:</span>
                <span className={`appeal-badge ${getAppealStatusColor(userProfile.appealStatus)}`}>
                  {userProfile.appealStatus.charAt(0).toUpperCase() + userProfile.appealStatus.slice(1)}
                </span>
                {userProfile.appealComment && (
                  <div className="appeal-comment">
                    <span className="comment-label">Your Appeal:</span>
                    <span className="comment-text">{userProfile.appealComment}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Vulnerability Factors */}
        <div className="vulnerability-card">
          <div className="card-header">
            <h2>🎯 Vulnerability Factors</h2>
          </div>
          <div className="vulnerability-info">
            {userProfile.vulnerabilityFactors && userProfile.vulnerabilityFactors.length > 0 ? (
              <div className="vulnerability-tags">
                {userProfile.vulnerabilityFactors.map(factor => (
                  <span key={factor} className="vulnerability-tag">{factor}</span>
                ))}
              </div>
            ) : (
              <p className="no-factors">No vulnerability factors identified</p>
            )}
          </div>
        </div>

        {/* Trust Score */}
        <div className="trust-card">
          <div className="card-header">
            <h2>🛡️ Trust Score</h2>
          </div>
          <div className="trust-info">
            <div className="trust-score-display">
              <div className="score-circle">
                <span className="score-number">{userProfile.trustScore}%</span>
                <span className="score-label">Trust Score</span>
              </div>
            </div>
            <div className="risk-level">
              <span className="risk-label">Risk Level:</span>
              <span className={`risk-badge ${userProfile.riskLevel}`}>
                {userProfile.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Appeal Form Modal */}
      {showAppealForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚖️ Submit Appeal</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAppealForm(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Please provide additional information or clarification for your appeal:</p>
              <textarea
                value={appealComment}
                onChange={(e) => setAppealComment(e.target.value)}
                placeholder="Explain why you believe your application should be reconsidered..."
                rows="6"
                className="appeal-textarea"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowAppealForm(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={handleSubmitAppeal}
                disabled={!appealComment.trim()}
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Programs */}
      <div className="support-section">
        <h2>🤝 Available Support Programs</h2>
        <div className="programs-grid">
          <div className="program-card">
            <div className="program-icon">💰</div>
            <h3>Financial Inclusion</h3>
            <p>Access to banking services, mobile money, and financial literacy training</p>
            <button className="program-btn">Learn More</button>
          </div>
          
          <div className="program-card">
            <div className="program-icon">🎨</div>
            <h3>Creative Arts Support</h3>
            <p>Funding and resources for artists and creative professionals</p>
            <button className="program-btn">Learn More</button>
          </div>
          
          <div className="program-card">
            <div className="program-icon">📚</div>
            <h3>Education & Training</h3>
            <p>Skills development and educational opportunities</p>
            <button className="program-btn">Learn More</button>
          </div>
          
          <div className="program-card">
            <div className="program-icon">🏥</div>
            <h3>Health & Wellness</h3>
            <p>Healthcare access and mental health support services</p>
            <button className="program-btn">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeneficiaryDashboard 