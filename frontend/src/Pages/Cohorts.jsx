import React, { useState } from 'react'
import './Cohorts.css'

const Cohorts = () => {
  const [selectedCohort, setSelectedCohort] = useState('all')

  const cohorts = [
    {
      id: 'refugees',
      name: 'Refugees & Displaced',
      icon: '🏕️',
      count: 234,
      successRate: 89,
      avgAge: 28,
      literacyRate: 65,
      financialInclusion: 45,
      description: 'Individuals displaced from their homes due to conflict, persecution, or natural disasters'
    },
    {
      id: 'lgbtq',
      name: 'LGBTQ+ Community',
      icon: '🌈',
      count: 156,
      successRate: 92,
      avgAge: 24,
      literacyRate: 78,
      financialInclusion: 52,
      description: 'Lesbian, gay, bisexual, transgender, queer, and other sexual/gender minorities'
    },
    {
      id: 'disabled',
      name: 'Persons with Disabilities',
      icon: '♿',
      count: 189,
      successRate: 87,
      avgAge: 32,
      literacyRate: 58,
      financialInclusion: 38,
      description: 'Individuals with physical, sensory, intellectual, or mental health disabilities'
    },
    {
      id: 'creatives',
      name: 'Creative Artists',
      icon: '🎨',
      count: 298,
      successRate: 94,
      avgAge: 26,
      literacyRate: 82,
      financialInclusion: 61,
      description: 'Artists, musicians, writers, performers, and other creative professionals'
    },
    {
      id: 'low-income',
      name: 'Low Income Families',
      icon: '💰',
      count: 445,
      successRate: 76,
      avgAge: 35,
      literacyRate: 52,
      financialInclusion: 28,
      description: 'Families living below the poverty line or with limited financial resources'
    },
    {
      id: 'rural',
      name: 'Rural Communities',
      icon: '🌾',
      count: 62,
      successRate: 81,
      avgAge: 29,
      literacyRate: 48,
      financialInclusion: 34,
      description: 'Individuals living in rural areas with limited access to services'
    }
  ]

  const selectedCohortData = cohorts.find(cohort => cohort.id === selectedCohort) || cohorts[0]

  return (
    <div className="cohorts-container">
      <div className="cohorts-header">
        <h1>Vulnerable Groups Cohorts</h1>
        <p>Detailed analysis of different vulnerable groups and their inclusion metrics</p>
      </div>

      {/* Cohort Selection */}
      <div className="cohort-selection">
        <h2>Select Cohort</h2>
        <div className="cohort-cards">
          {cohorts.map(cohort => (
            <div 
              key={cohort.id}
              className={`cohort-card ${selectedCohort === cohort.id ? 'active' : ''}`}
              onClick={() => setSelectedCohort(cohort.id)}
            >
              <div className="cohort-icon">{cohort.icon}</div>
              <div className="cohort-info">
                <h3>{cohort.name}</h3>
                <p>{cohort.count} beneficiaries</p>
              </div>
              <div className="cohort-success">
                <span className="success-rate">{cohort.successRate}%</span>
                <span className="success-label">Success</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cohort Details */}
      <div className="cohort-details">
        <div className="cohort-header">
          <div className="cohort-title">
            <span className="cohort-icon-large">{selectedCohortData.icon}</span>
            <div>
              <h2>{selectedCohortData.name}</h2>
              <p>{selectedCohortData.description}</p>
            </div>
          </div>
          <div className="cohort-stats-overview">
            <div className="stat-item">
              <span className="stat-number">{selectedCohortData.count}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{selectedCohortData.successRate}%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Demographics</h3>
            <div className="metric-content">
              <div className="metric-row">
                <span>Average Age:</span>
                <span className="metric-value">{selectedCohortData.avgAge} years</span>
              </div>
              <div className="metric-row">
                <span>Literacy Rate:</span>
                <span className="metric-value">{selectedCohortData.literacyRate}%</span>
              </div>
              <div className="metric-row">
                <span>Financial Inclusion:</span>
                <span className="metric-value">{selectedCohortData.financialInclusion}%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3>Program Participation</h3>
            <div className="metric-content">
              <div className="metric-row">
                <span>Active Programs:</span>
                <span className="metric-value">8</span>
              </div>
              <div className="metric-row">
                <span>Training Completed:</span>
                <span className="metric-value">156</span>
              </div>
              <div className="metric-row">
                <span>Employment Rate:</span>
                <span className="metric-value">67%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3>Support Services</h3>
            <div className="metric-content">
              <div className="metric-row">
                <span>Mental Health Support:</span>
                <span className="metric-value">89%</span>
              </div>
              <div className="metric-row">
                <span>Legal Assistance:</span>
                <span className="metric-value">45%</span>
              </div>
              <div className="metric-row">
                <span>Housing Support:</span>
                <span className="metric-value">23%</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h3>Digital Inclusion</h3>
            <div className="metric-content">
              <div className="metric-row">
                <span>Device Access:</span>
                <span className="metric-value">78%</span>
              </div>
              <div className="metric-row">
                <span>Internet Access:</span>
                <span className="metric-value">65%</span>
              </div>
              <div className="metric-row">
                <span>Digital Literacy:</span>
                <span className="metric-value">52%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <h4>Literacy Program Enrollment</h4>
                <p>15 new beneficiaries enrolled in literacy program</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💼</div>
              <div className="activity-content">
                <h4>Job Placement Success</h4>
                <p>8 beneficiaries successfully placed in employment</p>
                <span className="activity-time">1 week ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🏠</div>
              <div className="activity-content">
                <h4>Housing Support</h4>
                <p>12 families received housing assistance</p>
                <span className="activity-time">2 weeks ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cohorts
