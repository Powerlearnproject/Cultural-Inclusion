import React, { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'beneficiary',
    phoneNumber: '',
    location: '',
    vulnerabilityFactors: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const vulnerabilityOptions = [
    'Refugee/Displaced',
    'LGBTQ+',
    'Person with Disability',
    'Low Income',
    'Low Literacy',
    'Creative/Artist',
    'Rural Community',
    'Youth (18-25)',
    'Single Parent',
    'Unemployed'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleArrayChange = (field, value, action) => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }

      const API_BASE_URL = 'http://localhost:5002'
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      
      let payload
      if (isLogin) {
        payload = { email: formData.email, password: formData.password }
      } else {
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phoneNumber: formData.phoneNumber,
          location: formData.location,
          vulnerabilityFactors: formData.vulnerabilityFactors
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        onLogin(data.user, data.token)
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
        <div className="floating-elements">
          <div className="floating-icon">🌍</div>
          <div className="floating-icon">🤝</div>
          <div className="floating-icon">💡</div>
          <div className="floating-icon">📊</div>
        </div>
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-section">
              <div className="logo-icon">🌍</div>
              <div className="logo-text">
                <h1>InclusiTrack</h1>
                <p>HEVA Cultural Inclusion Data Management</p>
              </div>
            </div>
            <div className="mission-statement">
              <h2>Empowering Vulnerable Communities Through Data-Driven Inclusion</h2>
              <p>Supporting refugees, LGBTQ+ persons, persons with disabilities, and creative communities with strategic insights and targeted interventions.</p>
            </div>
          </div>

          <div className="auth-tabs">
            <button 
              className={`tab-button ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              <span className="tab-icon">🔐</span>
              <span className="tab-text">Sign In</span>
            </button>
            <button 
              className={`tab-button ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              <span className="tab-icon">📝</span>
              <span className="tab-text">Create Account</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required={!isLogin}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    required={!isLogin}
                    className="form-select"
                  >
                    <option value="beneficiary">Beneficiary</option>
                    <option value="officer">Field Officer</option>
                  </select>
                  <small className="form-help">
                    {formData.role === 'officer' 
                      ? 'Field Officers can register beneficiaries and track data in the field'
                      : 'Beneficiaries can access support programs and track their status'
                    }
                  </small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Region"
                    className="form-input"
                  />
                </div>

                {formData.role === 'beneficiary' && (
                  <div className="form-group">
                    <label>Vulnerability Factors</label>
                    <div className="checkbox-grid">
                      {vulnerabilityOptions.map(option => (
                        <label key={option} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.vulnerabilityFactors.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleArrayChange('vulnerabilityFactors', option, 'add')
                              } else {
                                handleArrayChange('vulnerabilityFactors', option, 'remove')
                              }
                            }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="Enter your email address"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                placeholder="Enter your password"
                minLength="6"
                className="form-input"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required={!isLogin}
                  placeholder="Confirm your password"
                  minLength="6"
                  className="form-input"
                />
              </div>
            )}

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                <div className="button-content">
                  <span className="button-icon">{isLogin ? '🔐' : '📝'}</span>
                  <span className="button-text">{isLogin ? 'Sign In' : 'Create Account'}</span>
                </div>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="security-badge">
              <div className="security-icon">🛡️</div>
              <div className="security-text">
                <h4>Enterprise Security</h4>
                <p>JWT Authentication • Role-Based Access • Encrypted Data</p>
              </div>
            </div>
            
            <div className="impact-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Vulnerable Groups</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Communities</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Data Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 