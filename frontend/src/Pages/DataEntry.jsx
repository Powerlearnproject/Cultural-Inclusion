import React, { useState } from 'react'
import './DataEntry.css'

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState('beneficiary')
  const [formData, setFormData] = useState({
    beneficiary: {
      name: '',
      age: '',
      gender: '',
      identityTags: [],
      literacyLevel: '',
      financialLiteracyScore: '',
      location: '',
      deviceAccess: {
        internet: false,
        deviceType: ''
      },
      incomeLevel: '',
      businessType: '',
      vulnerabilityFactors: []
    },
    survey: {
      title: '',
      description: '',
      targetGroup: [],
      questions: []
    },
    fund: {
      name: '',
      amountAllocated: '',
      source: '',
      beneficiaryId: '',
      purpose: '',
      status: 'Active'
    }
  })

  const [csvFile, setCsvFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

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

  const deviceTypes = [
    'Smartphone',
    'Basic Phone',
    'Computer/Laptop',
    'Tablet',
    'No Device',
    'Shared Device'
  ]

  const literacyLevels = [
    'No Formal Education',
    'Primary School',
    'Secondary School',
    'High School',
    'University/College',
    'Postgraduate'
  ]

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayChange = (section, field, value, action) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: action === 'add' 
          ? [...prev[section][field], value]
          : prev[section][field].filter(item => item !== value)
      }
    }))
  }

  const handleSubmit = async (section) => {
    try {
      const response = await fetch(`/api/${section}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData[section])
      })
      
      if (response.ok) {
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} data saved successfully!`)
        // Reset form
        setFormData(prev => ({
          ...prev,
          [section]: {
            beneficiary: {
              name: '',
              age: '',
              gender: '',
              identityTags: [],
              literacyLevel: '',
              financialLiteracyScore: '',
              location: '',
              deviceAccess: {
                internet: false,
                deviceType: ''
              },
              incomeLevel: '',
              businessType: '',
              vulnerabilityFactors: []
            },
            survey: {
              title: '',
              description: '',
              targetGroup: [],
              questions: []
            },
            fund: {
              name: '',
              amountAllocated: '',
              source: '',
              beneficiaryId: '',
              purpose: '',
              status: 'Active'
            }
          }[section]
        }))
      }
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving data. Please try again.')
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const uploadCSV = async () => {
    if (!csvFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('csvFile', csvFile)
      formData.append('type', activeTab)

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully uploaded ${result.count} records!`)
        setCsvFile(null)
        setUploadProgress(0)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading CSV:', error)
      alert('Error uploading CSV file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const templates = {
      beneficiary: `Name,Age,Gender,Location,LiteracyLevel,FinancialLiteracyScore,IncomeLevel,BusinessType,VulnerabilityFactors,DeviceType,InternetAccess
John Doe,25,Male,Nairobi,High School,7,Low Income,Creative Arts,"Refugee/Displaced;Creative/Artist",Smartphone,true`,
      survey: `Title,Description,TargetGroup,Question1,Question2,Question3
Financial Literacy Survey,Assessing financial knowledge,"LGBTQ+;Low Income",Do you have a bank account?,How do you manage your money?,What financial services do you use?`,
      fund: `Name,AmountAllocated,Source,Purpose,Status,BeneficiaryId
Creative Arts Grant,15000,Government Grant,Support for artists,Active,12345`
    }

    const template = templates[activeTab]
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-template.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="data-entry-container">
      <h1>Data Entry Portal</h1>
      <p className="subtitle">Collect and manage data for cultural inclusion initiatives</p>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'beneficiary' ? 'active' : ''}`}
          onClick={() => setActiveTab('beneficiary')}
        >
          👥 Beneficiary Registration
        </button>
        <button 
          className={`tab-button ${activeTab === 'survey' ? 'active' : ''}`}
          onClick={() => setActiveTab('survey')}
        >
          📊 Survey Data
        </button>
        <button 
          className={`tab-button ${activeTab === 'fund' ? 'active' : ''}`}
          onClick={() => setActiveTab('fund')}
        >
          💰 Fund Allocation
        </button>
      </div>

      {/* CSV Upload Section */}
      <div className="csv-upload-section">
        <h2>📁 Bulk Data Upload</h2>
        <div className="upload-controls">
          <div className="file-input-group">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file-input"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="file-input-label">
              📁 Choose CSV File
            </label>
            {csvFile && <span className="file-name">{csvFile.name}</span>}
          </div>
          
          <div className="upload-actions">
            <button 
              className="template-btn"
              onClick={downloadTemplate}
            >
              📋 Download Template
            </button>
            
            <button 
              className="upload-btn"
              onClick={uploadCSV}
              disabled={!csvFile || isUploading}
            >
              {isUploading ? '📤 Uploading...' : '📤 Upload CSV'}
            </button>
          </div>
        </div>
        
        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{uploadProgress}% Complete</span>
          </div>
        )}
      </div>

      {/* Beneficiary Form */}
      {activeTab === 'beneficiary' && (
        <div className="form-container">
          <h2>Beneficiary Registration</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('beneficiary'); }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.beneficiary.name}
                  onChange={(e) => handleInputChange('beneficiary', 'name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.beneficiary.age}
                  onChange={(e) => handleInputChange('beneficiary', 'age', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.beneficiary.gender}
                  onChange={(e) => handleInputChange('beneficiary', 'gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.beneficiary.location}
                  onChange={(e) => handleInputChange('beneficiary', 'location', e.target.value)}
                  placeholder="City, Region"
                />
              </div>

              <div className="form-group">
                <label>Literacy Level</label>
                <select
                  value={formData.beneficiary.literacyLevel}
                  onChange={(e) => handleInputChange('beneficiary', 'literacyLevel', e.target.value)}
                >
                  <option value="">Select Level</option>
                  {literacyLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Financial Literacy Score (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.beneficiary.financialLiteracyScore}
                  onChange={(e) => handleInputChange('beneficiary', 'financialLiteracyScore', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Income Level</label>
                <select
                  value={formData.beneficiary.incomeLevel}
                  onChange={(e) => handleInputChange('beneficiary', 'incomeLevel', e.target.value)}
                >
                  <option value="">Select Income Level</option>
                  <option value="Below Poverty Line">Below Poverty Line</option>
                  <option value="Low Income">Low Income</option>
                  <option value="Lower Middle">Lower Middle</option>
                  <option value="Middle Income">Middle Income</option>
                  <option value="Upper Middle">Upper Middle</option>
                  <option value="High Income">High Income</option>
                </select>
              </div>

              <div className="form-group">
                <label>Business Type (if applicable)</label>
                <input
                  type="text"
                  value={formData.beneficiary.businessType}
                  onChange={(e) => handleInputChange('beneficiary', 'businessType', e.target.value)}
                  placeholder="e.g., Creative Arts, Small Business, Freelance"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Vulnerability Factors</h3>
              <div className="checkbox-grid">
                {vulnerabilityOptions.map(option => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.beneficiary.vulnerabilityFactors.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('beneficiary', 'vulnerabilityFactors', option, 'add')
                        } else {
                          handleArrayChange('beneficiary', 'vulnerabilityFactors', option, 'remove')
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Device & Internet Access</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Device Type</label>
                  <select
                    value={formData.beneficiary.deviceAccess.deviceType}
                    onChange={(e) => handleInputChange('beneficiary', 'deviceAccess', {
                      ...formData.beneficiary.deviceAccess,
                      deviceType: e.target.value
                    })}
                  >
                    <option value="">Select Device</option>
                    {deviceTypes.map(device => (
                      <option key={device} value={device}>{device}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.beneficiary.deviceAccess.internet}
                      onChange={(e) => handleInputChange('beneficiary', 'deviceAccess', {
                        ...formData.beneficiary.deviceAccess,
                        internet: e.target.checked
                      })}
                    />
                    Has Internet Access
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Register Beneficiary
            </button>
          </form>
        </div>
      )}

      {/* Survey Form */}
      {activeTab === 'survey' && (
        <div className="form-container">
          <h2>Survey Data Entry</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('survey'); }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Survey Title *</label>
                <input
                  type="text"
                  value={formData.survey.title}
                  onChange={(e) => handleInputChange('survey', 'title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.survey.description}
                  onChange={(e) => handleInputChange('survey', 'description', e.target.value)}
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Target Groups</h3>
              <div className="checkbox-grid">
                {vulnerabilityOptions.map(option => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.survey.targetGroup.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleArrayChange('survey', 'targetGroup', option, 'add')
                        } else {
                          handleArrayChange('survey', 'targetGroup', option, 'remove')
                        }
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-button">
              Save Survey
            </button>
          </form>
        </div>
      )}

      {/* Fund Form */}
      {activeTab === 'fund' && (
        <div className="form-container">
          <h2>Fund Allocation Tracking</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit('fund'); }}>
            <div className="form-grid">
              <div className="form-group">
                <label>Fund Name *</label>
                <input
                  type="text"
                  value={formData.fund.name}
                  onChange={(e) => handleInputChange('fund', 'name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount Allocated *</label>
                <input
                  type="number"
                  value={formData.fund.amountAllocated}
                  onChange={(e) => handleInputChange('fund', 'amountAllocated', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Source</label>
                <input
                  type="text"
                  value={formData.fund.source}
                  onChange={(e) => handleInputChange('fund', 'source', e.target.value)}
                  placeholder="e.g., Government Grant, Private Donor"
                />
              </div>

              <div className="form-group">
                <label>Purpose</label>
                <textarea
                  value={formData.fund.purpose}
                  onChange={(e) => handleInputChange('fund', 'purpose', e.target.value)}
                  rows="3"
                  placeholder="Describe the purpose of this fund allocation"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.fund.status}
                  onChange={(e) => handleInputChange('fund', 'status', e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Allocate Fund
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default DataEntry
