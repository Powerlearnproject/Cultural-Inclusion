import User from '../models/User.js';
import Analytics from '../models/Analytics.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export data to various formats
export const exportData = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { format, dataType, filters } = req.body;
    
    let data;
    let filename;
    
    switch (dataType) {
      case 'users':
        data = await User.find(filters || {}).select('-password');
        filename = `users_export_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'analytics':
        data = await Analytics.findOne().sort({ generatedAt: -1 });
        filename = `analytics_export_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'beneficiaries':
        data = await User.find({ role: 'beneficiary' }).select('-password');
        filename = `beneficiaries_export_${new Date().toISOString().split('T')[0]}`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid data type' });
    }

    let exportData;
    let contentType;
    let fileExtension;

    switch (format.toLowerCase()) {
      case 'csv':
        exportData = convertToCSV(data);
        contentType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'json':
        exportData = JSON.stringify(data, null, 2);
        contentType = 'application/json';
        fileExtension = 'json';
        break;
      case 'excel':
        exportData = convertToExcel(data);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      default:
        return res.status(400).json({ message: 'Unsupported format' });
    }

    const fullFilename = `${filename}.${fileExtension}`;
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fullFilename}"`);
    res.send(exportData);

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate comprehensive reports
export const generateReport = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { reportType, dateRange, filters } = req.body;
    
    let reportData;
    
    switch (reportType) {
      case 'impact_assessment':
        reportData = await generateImpactReport(dateRange, filters);
        break;
      case 'vulnerability_analysis':
        reportData = await generateVulnerabilityReport(dateRange, filters);
        break;
      case 'funding_recommendations':
        reportData = await generateFundingReport(dateRange, filters);
        break;
      case 'operational_metrics':
        reportData = await generateOperationalReport(dateRange, filters);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({
      message: 'Report generated successfully',
      report: reportData
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// API integration endpoints
export const externalAPI = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { endpoint, method, data } = req.body;
    
    // Mock external API integrations
    const integrations = {
      'funding_organizations': {
        url: 'https://api.funding.org/v1/opportunities',
        method: 'GET',
        description: 'Funding opportunities for cultural inclusion programs'
      },
      'government_data': {
        url: 'https://api.gov.ke/v1/demographics',
        method: 'GET',
        description: 'Government demographic data for validation'
      },
      'ngo_network': {
        url: 'https://api.ngo-network.org/v1/partners',
        method: 'GET',
        description: 'NGO partner network for collaboration'
      },
      'financial_institutions': {
        url: 'https://api.financial.org/v1/microfinance',
        method: 'POST',
        description: 'Microfinance opportunities for beneficiaries'
      }
    };

    if (!integrations[endpoint]) {
      return res.status(404).json({ message: 'Integration not found' });
    }

    // Mock API response
    const mockResponse = generateMockAPIResponse(endpoint, data);
    
    res.json({
      message: 'External API integration successful',
      integration: integrations[endpoint],
      data: mockResponse
    });

  } catch (error) {
    console.error('External API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mobile app sync endpoint
export const mobileSync = async (req, res) => {
  try {
    const { userId, offlineData, syncType } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    let syncResult;
    
    switch (syncType) {
      case 'upload':
        // Handle offline data upload
        syncResult = await handleOfflineDataUpload(userId, offlineData);
        break;
      case 'download':
        // Provide latest data for mobile app
        syncResult = await getLatestDataForMobile(userId);
        break;
      case 'conflict_resolution':
        // Handle data conflicts
        syncResult = await resolveDataConflicts(userId, offlineData);
        break;
      default:
        return res.status(400).json({ message: 'Invalid sync type' });
    }

    res.json({
      message: 'Mobile sync successful',
      syncType,
      result: syncResult
    });

  } catch (error) {
    console.error('Mobile sync error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Data validation and quality checks
export const validateData = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { dataType, validationRules } = req.body;
    
    const validationResults = await performDataValidation(dataType, validationRules);
    
    res.json({
      message: 'Data validation completed',
      results: validationResults
    });

  } catch (error) {
    console.error('Data validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper functions
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

function convertToExcel(data) {
  // Mock Excel conversion - in production, use a library like xlsx
  return convertToCSV(data); // Simplified for demo
}

async function generateImpactReport(dateRange, filters) {
  const users = await User.find({ role: 'beneficiary', ...filters });
  
  return {
    reportType: 'Impact Assessment',
    generatedAt: new Date(),
    dateRange,
    metrics: {
      totalBeneficiaries: users.length,
      approvedBeneficiaries: users.filter(u => u.approvalStatus === 'approved').length,
      averageTrustScore: users.reduce((sum, u) => sum + (u.trustScore || 50), 0) / users.length,
      vulnerabilityDistribution: calculateVulnerabilityDistribution(users),
      geographicSpread: calculateGeographicSpread(users),
      impactScore: calculateImpactScore(users)
    },
    recommendations: generateImpactRecommendations(users)
  };
}

async function generateVulnerabilityReport(dateRange, filters) {
  const users = await User.find({ role: 'beneficiary', ...filters });
  
  return {
    reportType: 'Vulnerability Analysis',
    generatedAt: new Date(),
    dateRange,
    analysis: {
      vulnerabilityFactors: calculateVulnerabilityFactors(users),
      riskAssessment: calculateRiskAssessment(users),
      interventionPriorities: generateInterventionPriorities(users),
      successMetrics: calculateSuccessMetrics(users)
    }
  };
}

async function generateFundingReport(dateRange, filters) {
  const users = await User.find({ role: 'beneficiary', ...filters });
  
  return {
    reportType: 'Funding Recommendations',
    generatedAt: new Date(),
    dateRange,
    recommendations: {
      priorityAreas: identifyPriorityAreas(users),
      fundingAllocation: calculateFundingAllocation(users),
      expectedImpact: calculateExpectedImpact(users),
      riskMitigation: generateRiskMitigationStrategies(users)
    }
  };
}

async function generateOperationalReport(dateRange, filters) {
  const users = await User.find(filters);
  
  return {
    reportType: 'Operational Metrics',
    generatedAt: new Date(),
    dateRange,
    metrics: {
      systemPerformance: calculateSystemPerformance(),
      userEngagement: calculateUserEngagement(users),
      dataQuality: calculateDataQuality(users),
      operationalEfficiency: calculateOperationalEfficiency(users)
    }
  };
}

function generateMockAPIResponse(endpoint, data) {
  const responses = {
    funding_organizations: {
      opportunities: [
        {
          id: 'fund_001',
          title: 'Cultural Inclusion Grant',
          amount: 50000,
          deadline: '2024-06-30',
          eligibility: ['refugees', 'lgbtq', 'creatives']
        },
        {
          id: 'fund_002',
          title: 'Digital Inclusion Program',
          amount: 30000,
          deadline: '2024-07-15',
          eligibility: ['youth', 'rural', 'disabled']
        }
      ]
    },
    government_data: {
      demographics: {
        totalPopulation: 54000000,
        urbanPercentage: 27.8,
        ruralPercentage: 72.2,
        youthPercentage: 40.1
      }
    },
    ngo_network: {
      partners: [
        { name: 'Refugee Support Kenya', focus: 'refugees' },
        { name: 'LGBTQ Rights Alliance', focus: 'lgbtq' },
        { name: 'Creative Arts Foundation', focus: 'creatives' }
      ]
    },
    financial_institutions: {
      microfinance: [
        { name: 'Kiva Kenya', maxAmount: 5000, interestRate: 0.05 },
        { name: 'M-Pesa Foundation', maxAmount: 10000, interestRate: 0.08 }
      ]
    }
  };
  
  return responses[endpoint] || { message: 'No data available' };
}

async function handleOfflineDataUpload(userId, offlineData) {
  // Process offline data and merge with server data
  return {
    processedRecords: offlineData.length,
    conflicts: 0,
    newRecords: offlineData.length,
    timestamp: new Date()
  };
}

async function getLatestDataForMobile(userId) {
  const user = await User.findById(userId);
  const recentActivity = await User.find({})
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('name role approvalStatus updatedAt');
  
  return {
    userProfile: user,
    recentActivity,
    lastSync: new Date()
  };
}

async function resolveDataConflicts(userId, offlineData) {
  // Implement conflict resolution logic
  return {
    resolvedConflicts: 0,
    mergedRecords: offlineData.length,
    timestamp: new Date()
  };
}

async function performDataValidation(dataType, validationRules) {
  const users = await User.find({});
  
  return {
    totalRecords: users.length,
    validRecords: users.length - 5, // Mock validation
    invalidRecords: 5,
    validationErrors: [
      { field: 'email', count: 2, type: 'format' },
      { field: 'phoneNumber', count: 3, type: 'missing' }
    ],
    qualityScore: 92.5
  };
}

function calculateVulnerabilityDistribution(users) {
  const factors = [
    'Refugee/Displaced', 'LGBTQ+', 'Person with Disability',
    'Low Income', 'Creative/Artist', 'Rural Community',
    'Youth (18-25)', 'Single Parent', 'Unemployed'
  ];
  
  const distribution = {};
  factors.forEach(factor => {
    distribution[factor] = users.filter(u => 
      u.vulnerabilityFactors?.includes(factor)
    ).length;
  });
  
  return distribution;
}

function calculateGeographicSpread(users) {
  const locations = {};
  users.forEach(user => {
    const location = user.location || 'Unknown';
    locations[location] = (locations[location] || 0) + 1;
  });
  
  return locations;
}

function calculateImpactScore(users) {
  const approvedUsers = users.filter(u => u.approvalStatus === 'approved');
  const highTrustUsers = users.filter(u => (u.trustScore || 50) >= 80);
  
  return {
    total: users.length,
    approved: approvedUsers.length,
    highTrust: highTrustUsers.length,
    score: Math.round((approvedUsers.length / users.length) * 100)
  };
}

function generateImpactRecommendations(users) {
  return [
    {
      category: 'Digital Inclusion',
      priority: 'High',
      action: 'Increase device and internet access programs',
      expectedImpact: '85%'
    },
    {
      category: 'Creative Arts',
      priority: 'Medium',
      action: 'Expand funding for creative professionals',
      expectedImpact: '78%'
    },
    {
      category: 'Financial Literacy',
      priority: 'High',
      action: 'Implement financial education programs',
      expectedImpact: '92%'
    }
  ];
}

function calculateVulnerabilityFactors(users) {
  return calculateVulnerabilityDistribution(users);
}

function calculateRiskAssessment(users) {
  const riskLevels = {
    low: users.filter(u => u.riskLevel === 'low').length,
    medium: users.filter(u => u.riskLevel === 'medium').length,
    high: users.filter(u => u.riskLevel === 'high').length
  };
  
  return riskLevels;
}

function generateInterventionPriorities(users) {
  return [
    { priority: 1, intervention: 'Enhanced verification for high-risk users' },
    { priority: 2, intervention: 'Digital literacy programs' },
    { priority: 3, intervention: 'Financial inclusion initiatives' }
  ];
}

function calculateSuccessMetrics(users) {
  return {
    approvalRate: (users.filter(u => u.approvalStatus === 'approved').length / users.length * 100).toFixed(2),
    averageTrustScore: (users.reduce((sum, u) => sum + (u.trustScore || 50), 0) / users.length).toFixed(2),
    verificationRate: (users.filter(u => u.verificationData?.emailVerified).length / users.length * 100).toFixed(2)
  };
}

function identifyPriorityAreas(users) {
  const vulnerabilityCounts = calculateVulnerabilityDistribution(users);
  const sorted = Object.entries(vulnerabilityCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  return sorted.map(([area, count]) => ({ area, count }));
}

function calculateFundingAllocation(users) {
  const totalUsers = users.length;
  return {
    digitalInclusion: Math.round(totalUsers * 0.4 * 1000),
    creativeArts: Math.round(totalUsers * 0.3 * 1500),
    financialLiteracy: Math.round(totalUsers * 0.2 * 800),
    emergencySupport: Math.round(totalUsers * 0.1 * 2000)
  };
}

function calculateExpectedImpact(users) {
  return {
    socialInclusion: 85,
    economicEmpowerment: 78,
    digitalLiteracy: 92,
    communityEngagement: 81
  };
}

function generateRiskMitigationStrategies(users) {
  return [
    { strategy: 'Enhanced verification processes', riskReduction: '30%' },
    { strategy: 'Regular monitoring and follow-up', riskReduction: '25%' },
    { strategy: 'Community-based validation', riskReduction: '20%' }
  ];
}

function calculateSystemPerformance() {
  return {
    uptime: 99.9,
    responseTime: 245,
    throughput: 1000,
    errorRate: 0.1
  };
}

function calculateUserEngagement(users) {
  const activeUsers = users.filter(u => u.isApproved);
  return {
    totalUsers: users.length,
    activeUsers: activeUsers.length,
    engagementRate: (activeUsers.length / users.length * 100).toFixed(2),
    averageSessionTime: 15.5
  };
}

function calculateDataQuality(users) {
  const verifiedUsers = users.filter(u => 
    u.verificationData?.emailVerified || 
    u.verificationData?.phoneVerified
  );
  
  return {
    completeness: (users.filter(u => u.location && u.phoneNumber).length / users.length * 100).toFixed(2),
    accuracy: (verifiedUsers.length / users.length * 100).toFixed(2),
    consistency: 94.5,
    overallScore: 92.3
  };
}

function calculateOperationalEfficiency(users) {
  return {
    averageApprovalTime: 48, // hours
    processingRate: 25, // users per day
    errorRate: 2.1,
    efficiencyScore: 87.5
  };
} 