import React, { useState, useEffect } from 'react'
import './AnalyticsDashboard.css'

const AnalyticsDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState(null)
  const [vulnerabilityInsights, setVulnerabilityInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalyticsData()
  }, [activeTab])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      if (activeTab === 'overview') {
        const response = await fetch('http://localhost:5002/api/analytics/data', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setAnalyticsData(data)
        }
      } else if (activeTab === 'real-time') {
        const response = await fetch('http://localhost:5002/api/analytics/real-time', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setRealTimeMetrics(data)
        }
      } else if (activeTab === 'insights') {
        const response = await fetch('http://localhost:5002/api/analytics/vulnerability-insights', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setVulnerabilityInsights(data)
        }
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const generateNewAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5002/api/analytics/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        alert('Analytics generated successfully!')
        fetchAnalyticsData()
      } else {
        setError('Failed to generate analytics')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const getMetricColor = (value, threshold = 50) => {
    if (value >= threshold) return 'positive'
    if (value >= threshold * 0.7) return 'warning'
    return 'negative'
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'high-priority'
      case 'medium': return 'medium-priority'
      case 'low': return 'low-priority'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="analytics-dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-dashboard-container">
      <div className="analytics-header">
        <h1>📊 Advanced Analytics Dashboard</h1>
        <p className="analytics-subtitle">
          Comprehensive insights, predictive analytics, and impact measurements
        </p>
        <button className="generate-btn" onClick={generateNewAnalytics}>
          🔄 Generate New Analytics
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <div className="analytics-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'real-time' ? 'active' : ''}`}
          onClick={() => setActiveTab('real-time')}
        >
          ⚡ Real-Time
        </button>
        <button 
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          🔍 Insights
        </button>
        <button 
          className={`tab-button ${activeTab === 'predictive' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictive')}
        >
          🔮 Predictive
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && analyticsData && (
        <div className="tab-content">
          <div className="metrics-grid">
            {/* System Overview */}
            <div className="metric-card large">
              <h3>👥 System Overview</h3>
              <div className="metric-stats">
                <div className="stat-item">
                  <span className="stat-number">{analyticsData.totalUsers.admin}</span>
                  <span className="stat-label">Admins</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{analyticsData.totalUsers.officer}</span>
                  <span className="stat-label">Officers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{analyticsData.totalUsers.beneficiary}</span>
                  <span className="stat-label">Beneficiaries</span>
                </div>
              </div>
            </div>

            {/* Approval Metrics */}
            <div className="metric-card">
              <h3>✅ Approval Metrics</h3>
              <div className="metric-value">
                <span className={`value ${getMetricColor(analyticsData.approvalMetrics.approvalRate)}`}>
                  {analyticsData.approvalMetrics.approvalRate}%
                </span>
                <span className="label">Approval Rate</span>
              </div>
              <div className="metric-details">
                <div className="detail-item">
                  <span>Pending: {analyticsData.approvalMetrics.totalPending}</span>
                </div>
                <div className="detail-item">
                  <span>Approved: {analyticsData.approvalMetrics.totalApproved}</span>
                </div>
                <div className="detail-item">
                  <span>Rejected: {analyticsData.approvalMetrics.totalRejected}</span>
                </div>
              </div>
            </div>

            {/* Appeal Metrics */}
            <div className="metric-card">
              <h3>⚖️ Appeal Metrics</h3>
              <div className="metric-value">
                <span className={`value ${getMetricColor(analyticsData.appealMetrics.appealSuccessRate)}`}>
                  {analyticsData.appealMetrics.appealSuccessRate}%
                </span>
                <span className="label">Success Rate</span>
              </div>
              <div className="metric-details">
                <div className="detail-item">
                  <span>Total Appeals: {analyticsData.appealMetrics.totalAppeals}</span>
                </div>
                <div className="detail-item">
                  <span>Granted: {analyticsData.appealMetrics.appealsGranted}</span>
                </div>
                <div className="detail-item">
                  <span>Denied: {analyticsData.appealMetrics.appealsDenied}</span>
                </div>
              </div>
            </div>

            {/* Trust Analysis */}
            <div className="metric-card">
              <h3>🛡️ Trust Analysis</h3>
              <div className="metric-value">
                <span className={`value ${getMetricColor(analyticsData.trustAnalysis.averageTrustScore, 70)}`}>
                  {analyticsData.trustAnalysis.averageTrustScore}%
                </span>
                <span className="label">Average Trust Score</span>
              </div>
              <div className="metric-details">
                <div className="detail-item">
                  <span>Low Risk: {analyticsData.trustAnalysis.lowRiskUsers}</span>
                </div>
                <div className="detail-item">
                  <span>Medium Risk: {analyticsData.trustAnalysis.mediumRiskUsers}</span>
                </div>
                <div className="detail-item">
                  <span>High Risk: {analyticsData.trustAnalysis.highRiskUsers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vulnerability Analysis */}
          <div className="vulnerability-section">
            <h2>🎯 Vulnerability Analysis</h2>
            <div className="vulnerability-grid">
              {Object.entries(analyticsData.vulnerabilityAnalysis).map(([key, value]) => (
                <div key={key} className="vulnerability-card">
                  <div className="vulnerability-icon">
                    {key === 'refugees' && '🏕️'}
                    {key === 'lgbtq' && '🌈'}
                    {key === 'disabled' && '♿'}
                    {key === 'lowIncome' && '💰'}
                    {key === 'creatives' && '🎨'}
                    {key === 'rural' && '🌾'}
                    {key === 'youth' && '👨‍🎓'}
                    {key === 'singleParent' && '👨‍👩‍👧‍👦'}
                    {key === 'unemployed' && '💼'}
                  </div>
                  <div className="vulnerability-info">
                    <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                    <span className="vulnerability-count">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="impact-section">
            <h2>🎯 Impact Measurements</h2>
            <div className="impact-grid">
              <div className="impact-card">
                <h3>Total Impact Score</h3>
                <span className="impact-value">{analyticsData.impactMetrics.totalImpactScore}</span>
              </div>
              <div className="impact-card">
                <h3>Social Inclusion Index</h3>
                <span className="impact-value">{analyticsData.impactMetrics.socialInclusionIndex}%</span>
              </div>
              <div className="impact-card">
                <h3>Economic Empowerment</h3>
                <span className="impact-value">{analyticsData.impactMetrics.economicEmpowermentScore}%</span>
              </div>
              <div className="impact-card">
                <h3>Digital Inclusion Rate</h3>
                <span className="impact-value">{analyticsData.impactMetrics.digitalInclusionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Tab */}
      {activeTab === 'real-time' && realTimeMetrics && (
        <div className="tab-content">
          <div className="real-time-grid">
            <div className="real-time-card">
              <h3>⚡ Real-Time Metrics</h3>
              <div className="real-time-stats">
                <div className="stat-item">
                  <span className="stat-number">{realTimeMetrics.totalUsers}</span>
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{realTimeMetrics.totalBeneficiaries}</span>
                  <span className="stat-label">Beneficiaries</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{realTimeMetrics.pendingApprovals}</span>
                  <span className="stat-label">Pending Approvals</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{realTimeMetrics.pendingAppeals}</span>
                  <span className="stat-label">Pending Appeals</span>
                </div>
              </div>
            </div>

            <div className="system-health-card">
              <h3>🏥 System Health</h3>
              <div className="health-metrics">
                <div className="health-item">
                  <span className="health-label">User Activity</span>
                  <span className={`health-value ${getMetricColor(realTimeMetrics.systemHealth.userActivity)}`}>
                    {realTimeMetrics.systemHealth.userActivity}%
                  </span>
                </div>
                <div className="health-item">
                  <span className="health-label">Data Quality</span>
                  <span className={`health-value ${getMetricColor(realTimeMetrics.systemHealth.dataQuality)}`}>
                    {realTimeMetrics.systemHealth.dataQuality}%
                  </span>
                </div>
                <div className="health-item">
                  <span className="health-label">System Uptime</span>
                  <span className="health-value positive">
                    {realTimeMetrics.systemHealth.systemUptime}%
                  </span>
                </div>
                <div className="health-item">
                  <span className="health-label">Performance</span>
                  <span className={`health-value ${getMetricColor(realTimeMetrics.systemHealth.performance)}`}>
                    {realTimeMetrics.systemHealth.performance}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-activity-section">
            <h3>📋 Recent Activity</h3>
            <div className="activity-list">
              {realTimeMetrics.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.role === 'admin' && '👑'}
                    {activity.role === 'officer' && '👮'}
                    {activity.role === 'beneficiary' && '👤'}
                  </div>
                  <div className="activity-info">
                    <span className="activity-name">{activity.name}</span>
                    <span className="activity-status">{activity.status}</span>
                  </div>
                  <span className="activity-time">
                    {new Date(activity.time).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && vulnerabilityInsights && (
        <div className="tab-content">
          <div className="insights-grid">
            <div className="insight-card">
              <h3>📊 Vulnerability Distribution</h3>
              <div className="vulnerability-chart">
                {Object.entries(vulnerabilityInsights.vulnerabilityDistribution).map(([key, value]) => (
                  <div key={key} className="vulnerability-bar">
                    <span className="bar-label">{key}</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${(value / Math.max(...Object.values(vulnerabilityInsights.vulnerabilityDistribution))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="insight-card">
              <h3>🎯 Risk Analysis</h3>
              <div className="risk-analysis">
                <div className="risk-item">
                  <span className="risk-label">Low Risk</span>
                  <span className="risk-value">{vulnerabilityInsights.riskAnalysis.riskLevels.low}</span>
                </div>
                <div className="risk-item">
                  <span className="risk-label">Medium Risk</span>
                  <span className="risk-value">{vulnerabilityInsights.riskAnalysis.riskLevels.medium}</span>
                </div>
                <div className="risk-item">
                  <span className="risk-label">High Risk</span>
                  <span className="risk-value">{vulnerabilityInsights.riskAnalysis.riskLevels.high}</span>
                </div>
                <div className="risk-item">
                  <span className="risk-label">Average Trust Score</span>
                  <span className="risk-value">{vulnerabilityInsights.riskAnalysis.averageTrustScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations-section">
            <h3>💡 Intervention Recommendations</h3>
            <div className="recommendations-grid">
              {vulnerabilityInsights.interventionRecommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card ${getPriorityColor(rec.priority)}`}>
                  <div className="recommendation-header">
                    <h4>{rec.category}</h4>
                    <span className={`priority-badge ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="recommendation-action">{rec.action}</p>
                  <p className="recommendation-outcome">{rec.expectedOutcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Predictive Tab */}
      {activeTab === 'predictive' && analyticsData && (
        <div className="tab-content">
          <div className="predictive-grid">
            <div className="predictive-card">
              <h3>🔮 Predictive Analytics</h3>
              <div className="predictive-metrics">
                <div className="predictive-item">
                  <span className="predictive-label">Expected Registrations (30 days)</span>
                  <span className="predictive-value">{analyticsData.predictiveMetrics.expectedRegistrations}</span>
                </div>
                <div className="predictive-item">
                  <span className="predictive-label">Predicted Approval Rate</span>
                  <span className="predictive-value">{analyticsData.predictiveMetrics.predictedApprovalRate}%</span>
                </div>
              </div>
            </div>

            <div className="funding-card">
              <h3>💰 Funding Recommendations</h3>
              <div className="funding-list">
                {analyticsData.predictiveMetrics.fundingRecommendations.map((rec, index) => (
                  <div key={index} className={`funding-item ${getPriorityColor(rec.priority)}`}>
                    <div className="funding-header">
                      <h4>{rec.category}</h4>
                      <span className={`priority-badge ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className="funding-details">
                      <span className="funding-amount">${rec.amount.toLocaleString()}</span>
                      <span className="funding-impact">Expected Impact: {rec.expectedImpact}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsDashboard 