import React, { useState, useEffect } from 'react'
import ChartCard from "../Components/ChartCard"
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBeneficiaries: 1384,
    activePrograms: 25,
    dataPoints: 12847,
    impactScore: 94,
    vulnerableGroups: {
      refugees: 234,
      lgbtq: 156,
      disabled: 189,
      lowIncome: 445,
      creatives: 298,
      rural: 62
    },
    financialInclusion: {
      withBankAccount: 67,
      withMobileMoney: 89,
      withInsurance: 23,
      withSavings: 45
    },
    deviceAccess: {
      smartphone: 78,
      basicPhone: 15,
      computer: 12,
      noDevice: 5
    }
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'beneficiary', message: 'New refugee beneficiary registered', time: '2 hours ago' },
    { id: 2, type: 'fund', message: 'Creative arts fund allocated - $15,000', time: '4 hours ago' },
    { id: 3, type: 'survey', message: 'LGBTQ+ inclusion survey completed', time: '6 hours ago' },
    { id: 4, type: 'beneficiary', message: 'Disability support program enrollment', time: '1 day ago' }
  ])

  const [priorityAreas, setPriorityAreas] = useState([
    { area: 'Digital Literacy', priority: 'High', beneficiaries: 234, completion: 65 },
    { area: 'Financial Inclusion', priority: 'High', beneficiaries: 445, completion: 78 },
    { area: 'Creative Skills', priority: 'Medium', beneficiaries: 298, completion: 45 },
    { area: 'Mental Health Support', priority: 'Medium', beneficiaries: 156, completion: 32 }
  ])

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
      <h1>Impact Dashboard</h1>
        <p className="dashboard-subtitle">
          Real-time insights into community empowerment and cultural inclusion initiatives
        </p>
        <div className="last-updated">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{stats.totalBeneficiaries.toLocaleString()}</h3>
          <p>Total Beneficiaries</p>
            <span className="metric-trend positive">+12% this month</span>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>{stats.activePrograms}</h3>
          <p>Active Programs</p>
            <span className="metric-trend positive">+3 new programs</span>
          </div>
        </div>
        
        <div className="metric-card info">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{stats.dataPoints.toLocaleString()}</h3>
            <p>Data Points Collected</p>
            <span className="metric-trend positive">+1,247 this week</span>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>{stats.impactScore}%</h3>
          <p>Impact Score</p>
            <span className="metric-trend positive">+2% improvement</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="charts-grid">
          <ChartCard 
            title="Vulnerable Groups Distribution" 
            chartType="doughnut" 
            className="chart-card-large"
          />
          <ChartCard 
            title="Financial Inclusion Progress" 
            chartType="bar" 
            className="chart-card-large"
          />
        </div>
      </div>

      {/* Vulnerable Groups Breakdown */}
      <div className="vulnerable-groups-section">
        <h2>Vulnerable Groups Impact</h2>
        <div className="groups-grid">
          <div className="group-card refugee">
            <div className="group-header">
              <span className="group-icon">🏕️</span>
              <h3>Refugees & Displaced</h3>
            </div>
            <div className="group-stats">
              <div className="stat">
                <span className="stat-number">{stats.vulnerableGroups.refugees}</span>
                <span className="stat-label">Beneficiaries</span>
              </div>
              <div className="stat">
                <span className="stat-number">89%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="group-card lgbtq">
            <div className="group-header">
              <span className="group-icon">🌈</span>
              <h3>LGBTQ+ Community</h3>
            </div>
            <div className="group-stats">
              <div className="stat">
                <span className="stat-number">{stats.vulnerableGroups.lgbtq}</span>
                <span className="stat-label">Beneficiaries</span>
              </div>
              <div className="stat">
                <span className="stat-number">92%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="group-card disabled">
            <div className="group-header">
              <span className="group-icon">♿</span>
              <h3>Persons with Disabilities</h3>
            </div>
            <div className="group-stats">
              <div className="stat">
                <span className="stat-number">{stats.vulnerableGroups.disabled}</span>
                <span className="stat-label">Beneficiaries</span>
              </div>
              <div className="stat">
                <span className="stat-number">87%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="group-card creatives">
            <div className="group-header">
              <span className="group-icon">🎨</span>
              <h3>Creative Artists</h3>
            </div>
            <div className="group-stats">
              <div className="stat">
                <span className="stat-number">{stats.vulnerableGroups.creatives}</span>
                <span className="stat-label">Beneficiaries</span>
              </div>
              <div className="stat">
                <span className="stat-number">94%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Areas & Recent Activity */}
      <div className="bottom-section">
        <div className="priority-areas">
          <h2>Priority Intervention Areas</h2>
          <div className="priority-list">
            {priorityAreas.map((area, index) => (
              <div key={index} className="priority-item">
                <div className="priority-info">
                  <h4>{area.area}</h4>
                  <span className={`priority-badge ${area.priority.toLowerCase()}`}>
                    {area.priority} Priority
                  </span>
                </div>
                <div className="priority-stats">
                  <span>{area.beneficiaries} beneficiaries</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${area.completion}%` }}
                    ></div>
                  </div>
                  <span>{area.completion}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'beneficiary' && '👤'}
                  {activity.type === 'fund' && '💰'}
                  {activity.type === 'survey' && '📋'}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard