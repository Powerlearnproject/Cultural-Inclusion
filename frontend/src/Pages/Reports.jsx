import React, { useState } from 'react'
import './Reports.css'

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('beneficiaries')
  const [dateRange, setDateRange] = useState('last30days')
  const [vulnerabilityGroup, setVulnerabilityGroup] = useState('all')

  const reportTypes = [
    {
      id: 'beneficiaries',
      name: 'Beneficiary Report',
      icon: '👥',
      description: 'Comprehensive beneficiary data with vulnerability factors'
    },
    {
      id: 'financial',
      name: 'Financial Inclusion Report',
      icon: '💰',
      description: 'Fund allocation and financial inclusion metrics'
    },
    {
      id: 'surveys',
      name: 'Survey Analysis Report',
      icon: '📊',
      description: 'Survey responses and insights by vulnerable group'
    },
    {
      id: 'impact',
      name: 'Impact Assessment Report',
      icon: '📈',
      description: 'Success rates and intervention outcomes'
    }
  ]

  const vulnerabilityGroups = [
    { id: 'all', name: 'All Groups' },
    { id: 'refugees', name: 'Refugees & Displaced' },
    { id: 'lgbtq', name: 'LGBTQ+ Community' },
    { id: 'disabled', name: 'Persons with Disabilities' },
    { id: 'creatives', name: 'Creative Artists' },
    { id: 'low-income', name: 'Low Income Families' },
    { id: 'rural', name: 'Rural Communities' }
  ]

  const dateRanges = [
    { id: 'last7days', name: 'Last 7 Days' },
    { id: 'last30days', name: 'Last 30 Days' },
    { id: 'last3months', name: 'Last 3 Months' },
    { id: 'last6months', name: 'Last 6 Months' },
    { id: 'lastyear', name: 'Last Year' },
    { id: 'custom', name: 'Custom Range' }
  ]

  const generateReport = async (format) => {
    try {
      // Simulate report generation
      console.log(`Generating ${selectedReport} report in ${format} format`)
      
      // In real implementation, this would call the backend API
      const response = await fetch(`/api/reports/${selectedReport}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange,
          vulnerabilityGroup,
          format
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Report generation failed. Please try again.')
    }
  }

  const getReportPreview = () => {
    const previews = {
      beneficiaries: {
        title: 'Beneficiary Summary',
        data: [
          { metric: 'Total Beneficiaries', value: '1,384', change: '+12%' },
          { metric: 'New This Month', value: '156', change: '+8%' },
          { metric: 'Average Age', value: '28 years', change: '0%' },
          { metric: 'Literacy Rate', value: '67%', change: '+5%' },
          { metric: 'Financial Inclusion', value: '45%', change: '+3%' }
        ]
      },
      financial: {
        title: 'Financial Inclusion Summary',
        data: [
          { metric: 'Total Funds Allocated', value: '$2.4M', change: '+15%' },
          { metric: 'Funds Disbursed', value: '$1.8M', change: '+12%' },
          { metric: 'Beneficiaries with Bank Accounts', value: '67%', change: '+8%' },
          { metric: 'Mobile Money Adoption', value: '89%', change: '+5%' },
          { metric: 'Insurance Coverage', value: '23%', change: '+2%' }
        ]
      },
      surveys: {
        title: 'Survey Analysis Summary',
        data: [
          { metric: 'Total Surveys', value: '45', change: '+5' },
          { metric: 'Response Rate', value: '78%', change: '+3%' },
          { metric: 'Satisfaction Score', value: '4.2/5', change: '+0.2' },
          { metric: 'Program Effectiveness', value: '87%', change: '+4%' },
          { metric: 'Recommendation Rate', value: '92%', change: '+2%' }
        ]
      },
      impact: {
        title: 'Impact Assessment Summary',
        data: [
          { metric: 'Overall Success Rate', value: '94%', change: '+2%' },
          { metric: 'Employment Rate', value: '67%', change: '+8%' },
          { metric: 'Income Increase', value: '23%', change: '+5%' },
          { metric: 'Skills Development', value: '89%', change: '+3%' },
          { metric: 'Community Integration', value: '76%', change: '+4%' }
        ]
      }
    }
    return previews[selectedReport]
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports & Analytics</h1>
        <p>Generate comprehensive reports for strategic decision-making and funding pitches</p>
      </div>

      {/* Report Configuration */}
      <div className="report-config">
        <div className="config-section">
          <h2>Report Type</h2>
          <div className="report-types">
            {reportTypes.map(report => (
              <div 
                key={report.id}
                className={`report-type-card ${selectedReport === report.id ? 'active' : ''}`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="report-icon">{report.icon}</div>
                <div className="report-info">
                  <h3>{report.name}</h3>
                  <p>{report.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="config-filters">
          <div className="filter-group">
            <label>Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Vulnerability Group</label>
            <select 
              value={vulnerabilityGroup} 
              onChange={(e) => setVulnerabilityGroup(e.target.value)}
            >
              {vulnerabilityGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="report-preview">
        <h2>Report Preview</h2>
        <div className="preview-content">
          <h3>{getReportPreview().title}</h3>
          <div className="preview-metrics">
            {getReportPreview().data.map((item, index) => (
              <div key={index} className="preview-metric">
                <span className="metric-label">{item.metric}</span>
                <span className="metric-value">{item.value}</span>
                <span className={`metric-change ${item.change.startsWith('+') ? 'positive' : 'neutral'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h2>Export Report</h2>
        <div className="export-options">
          <button 
            className="export-btn csv"
            onClick={() => generateReport('csv')}
          >
            📊 Export as CSV
          </button>
          <button 
            className="export-btn pdf"
            onClick={() => generateReport('pdf')}
          >
            📄 Export as PDF
          </button>
          <button 
            className="export-btn excel"
            onClick={() => generateReport('xlsx')}
          >
            📈 Export as Excel
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="recent-reports">
        <h2>Recent Reports</h2>
        <div className="reports-list">
          <div className="report-item">
            <div className="report-info">
              <h4>Beneficiary Report - July 2024</h4>
              <p>Generated 2 days ago</p>
            </div>
            <div className="report-actions">
              <button className="download-btn">📥 Download</button>
              <button className="share-btn">📤 Share</button>
            </div>
          </div>
          <div className="report-item">
            <div className="report-info">
              <h4>Financial Inclusion Report - Q2 2024</h4>
              <p>Generated 1 week ago</p>
            </div>
            <div className="report-actions">
              <button className="download-btn">📥 Download</button>
              <button className="share-btn">📤 Share</button>
            </div>
          </div>
          <div className="report-item">
            <div className="report-info">
              <h4>Impact Assessment Report - June 2024</h4>
              <p>Generated 2 weeks ago</p>
            </div>
            <div className="report-actions">
              <button className="download-btn">📥 Download</button>
              <button className="share-btn">📤 Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
