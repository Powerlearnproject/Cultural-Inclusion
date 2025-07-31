import User from '../models/User.js';
import Analytics from '../models/Analytics.js';

// Generate comprehensive analytics
export const generateAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all users
    const users = await User.find({});
    
    // Calculate system-wide metrics
    const totalUsers = {
      admin: users.filter(u => u.role === 'admin').length,
      officer: users.filter(u => u.role === 'officer').length,
      beneficiary: users.filter(u => u.role === 'beneficiary').length
    };

    // Calculate approval metrics
    const approvalMetrics = {
      totalPending: users.filter(u => u.approvalStatus === 'pending').length,
      totalApproved: users.filter(u => u.approvalStatus === 'approved').length,
      totalRejected: users.filter(u => u.approvalStatus === 'rejected').length,
      totalUnderReview: users.filter(u => u.approvalStatus === 'under_review').length,
      approvalRate: 0,
      averageApprovalTime: 0
    };

    const totalProcessed = approvalMetrics.totalApproved + approvalMetrics.totalRejected;
    approvalMetrics.approvalRate = totalProcessed > 0 ? 
      (approvalMetrics.totalApproved / totalProcessed * 100).toFixed(2) : 0;

    // Calculate appeal metrics
    const appealMetrics = {
      totalAppeals: users.filter(u => u.appealStatus !== 'none').length,
      appealsGranted: users.filter(u => u.appealStatus === 'approved').length,
      appealsDenied: users.filter(u => u.appealStatus === 'rejected').length,
      appealSuccessRate: 0,
      averageAppealTime: 0
    };

    appealMetrics.appealSuccessRate = appealMetrics.totalAppeals > 0 ? 
      (appealMetrics.appealsGranted / appealMetrics.totalAppeals * 100).toFixed(2) : 0;

    // Calculate vulnerability analysis
    const vulnerabilityAnalysis = {
      refugees: users.filter(u => u.vulnerabilityFactors?.includes('Refugee/Displaced')).length,
      lgbtq: users.filter(u => u.vulnerabilityFactors?.includes('LGBTQ+')).length,
      disabled: users.filter(u => u.vulnerabilityFactors?.includes('Person with Disability')).length,
      lowIncome: users.filter(u => u.vulnerabilityFactors?.includes('Low Income')).length,
      creatives: users.filter(u => u.vulnerabilityFactors?.includes('Creative/Artist')).length,
      rural: users.filter(u => u.vulnerabilityFactors?.includes('Rural Community')).length,
      youth: users.filter(u => u.vulnerabilityFactors?.includes('Youth (18-25)')).length,
      singleParent: users.filter(u => u.vulnerabilityFactors?.includes('Single Parent')).length,
      unemployed: users.filter(u => u.vulnerabilityFactors?.includes('Unemployed')).length
    };

    // Calculate trust and risk analysis
    const beneficiaries = users.filter(u => u.role === 'beneficiary');
    const trustScores = beneficiaries.map(u => u.trustScore || 50);
    const averageTrustScore = trustScores.length > 0 ? 
      (trustScores.reduce((a, b) => a + b, 0) / trustScores.length).toFixed(2) : 50;

    const trustAnalysis = {
      averageTrustScore: parseFloat(averageTrustScore),
      lowRiskUsers: beneficiaries.filter(u => u.riskLevel === 'low').length,
      mediumRiskUsers: beneficiaries.filter(u => u.riskLevel === 'medium').length,
      highRiskUsers: beneficiaries.filter(u => u.riskLevel === 'high').length,
      verificationRate: 0
    };

    const verifiedUsers = beneficiaries.filter(u => 
      u.verificationData?.emailVerified || 
      u.verificationData?.phoneVerified || 
      u.verificationData?.idDocument?.verified
    ).length;
    trustAnalysis.verificationRate = beneficiaries.length > 0 ? 
      (verifiedUsers / beneficiaries.length * 100).toFixed(2) : 0;

    // Calculate geographic distribution
    const locationData = {};
    beneficiaries.forEach(user => {
      const location = user.location || 'Unknown';
      if (!locationData[location]) {
        locationData[location] = {
          count: 0,
          approvals: 0,
          trustScores: []
        };
      }
      locationData[location].count++;
      if (user.approvalStatus === 'approved') {
        locationData[location].approvals++;
      }
      locationData[location].trustScores.push(user.trustScore || 50);
    });

    const geographicDistribution = {
      regions: Object.entries(locationData).map(([name, data]) => ({
        name,
        count: data.count,
        approvalRate: data.count > 0 ? (data.approvals / data.count * 100).toFixed(2) : 0,
        averageTrustScore: data.trustScores.length > 0 ? 
          (data.trustScores.reduce((a, b) => a + b, 0) / data.trustScores.length).toFixed(2) : 50
      }))
    };

    // Generate temporal trends (last 30 days)
    const temporalTrends = generateTemporalTrends(users);

    // Generate predictive analytics
    const predictiveMetrics = generatePredictiveAnalytics(users, temporalTrends);

    // Calculate impact metrics
    const impactMetrics = calculateImpactMetrics(users, vulnerabilityAnalysis);

    // Calculate KPIs
    const kpis = calculateKPIs(users, approvalMetrics, appealMetrics);

    // Create analytics object
    const analytics = new Analytics({
      totalUsers,
      approvalMetrics,
      appealMetrics,
      vulnerabilityAnalysis,
      trustAnalysis,
      geographicDistribution,
      temporalTrends,
      predictiveMetrics,
      impactMetrics,
      kpis
    });

    await analytics.save();

    res.json({
      message: 'Analytics generated successfully',
      analytics
    });

  } catch (error) {
    console.error('Generate analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const analytics = await Analytics.findOne().sort({ generatedAt: -1 });
    
    if (!analytics) {
      return res.status(404).json({ message: 'No analytics data found' });
    }

    res.json(analytics);

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get real-time metrics
export const getRealTimeMetrics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({});
    const beneficiaries = users.filter(u => u.role === 'beneficiary');
    
    const realTimeMetrics = {
      totalUsers: users.length,
      totalBeneficiaries: beneficiaries.length,
      pendingApprovals: users.filter(u => u.approvalStatus === 'pending').length,
      pendingAppeals: users.filter(u => u.appealStatus === 'pending').length,
      averageTrustScore: beneficiaries.length > 0 ? 
        (beneficiaries.reduce((sum, u) => sum + (u.trustScore || 50), 0) / beneficiaries.length).toFixed(2) : 50,
      systemHealth: calculateSystemHealth(users),
      recentActivity: await getRecentActivity()
    };

    res.json(realTimeMetrics);

  } catch (error) {
    console.error('Get real-time metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vulnerability insights
export const getVulnerabilityInsights = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({ role: 'beneficiary' });
    
    const insights = {
      vulnerabilityDistribution: calculateVulnerabilityDistribution(users),
      riskAnalysis: calculateRiskAnalysis(users),
      interventionRecommendations: generateInterventionRecommendations(users),
      successMetrics: calculateSuccessMetrics(users)
    };

    res.json(insights);

  } catch (error) {
    console.error('Get vulnerability insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper functions
function generateTemporalTrends(users) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  const dailyData = {};
  const weeklyData = {};
  
  users.forEach(user => {
    const userDate = new Date(user.createdAt);
    if (userDate >= thirtyDaysAgo) {
      const dateKey = userDate.toISOString().split('T')[0];
      const weekKey = getWeekKey(userDate);
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { count: 0, approvals: 0, rejections: 0 };
      }
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { registrations: 0, approvals: 0, appeals: 0, trustScores: [] };
      }
      
      dailyData[dateKey].count++;
      weeklyData[weekKey].registrations++;
      
      if (user.approvalStatus === 'approved') {
        dailyData[dateKey].approvals++;
        weeklyData[weekKey].approvals++;
      } else if (user.approvalStatus === 'rejected') {
        dailyData[dateKey].rejections++;
      }
      
      if (user.appealStatus !== 'none') {
        weeklyData[weekKey].appeals++;
      }
      
      weeklyData[weekKey].trustScores.push(user.trustScore || 50);
    }
  });

  return {
    dailyRegistrations: Object.entries(dailyData).map(([date, data]) => ({
      date: new Date(date),
      count: data.count,
      approvals: data.approvals,
      rejections: data.rejections
    })),
    weeklyMetrics: Object.entries(weeklyData).map(([week, data]) => ({
      week,
      registrations: data.registrations,
      approvals: data.approvals,
      appeals: data.appeals,
      averageTrustScore: data.trustScores.length > 0 ? 
        (data.trustScores.reduce((a, b) => a + b, 0) / data.trustScores.length).toFixed(2) : 50
    }))
  };
}

function generatePredictiveAnalytics(users, temporalTrends) {
  // Simple predictive model based on trends
  const recentRegistrations = temporalTrends.dailyRegistrations.slice(-7);
  const avgDailyRegistrations = recentRegistrations.length > 0 ? 
    recentRegistrations.reduce((sum, day) => sum + day.count, 0) / recentRegistrations.length : 0;
  
  const expectedRegistrations = Math.round(avgDailyRegistrations * 30); // Next 30 days
  
  const approvalRate = users.filter(u => u.approvalStatus === 'approved').length / 
    users.filter(u => u.approvalStatus !== 'pending').length * 100;
  
  const riskTrends = {
    increasing: users.filter(u => u.riskLevel === 'high').length,
    decreasing: users.filter(u => u.riskLevel === 'low').length,
    stable: users.filter(u => u.riskLevel === 'medium').length
  };

  const fundingRecommendations = [
    {
      category: 'Digital Inclusion',
      amount: 50000,
      priority: 'High',
      expectedImpact: 85
    },
    {
      category: 'Creative Arts Support',
      amount: 75000,
      priority: 'Medium',
      expectedImpact: 78
    },
    {
      category: 'Financial Literacy',
      amount: 30000,
      priority: 'High',
      expectedImpact: 92
    }
  ];

  return {
    expectedRegistrations,
    predictedApprovalRate: approvalRate.toFixed(2),
    riskTrends,
    fundingRecommendations
  };
}

function calculateImpactMetrics(users, vulnerabilityAnalysis) {
  const beneficiaries = users.filter(u => u.role === 'beneficiary' && u.approvalStatus === 'approved');
  
  const totalImpactScore = beneficiaries.length * 10; // Base impact score
  const socialInclusionIndex = calculateSocialInclusionIndex(beneficiaries);
  const economicEmpowermentScore = calculateEconomicEmpowermentScore(beneficiaries);
  const digitalInclusionRate = calculateDigitalInclusionRate(beneficiaries);
  const communityEngagementLevel = calculateCommunityEngagementLevel(beneficiaries);

  return {
    totalImpactScore,
    socialInclusionIndex,
    economicEmpowermentScore,
    digitalInclusionRate,
    communityEngagementLevel
  };
}

function calculateKPIs(users, approvalMetrics, appealMetrics) {
  const userSatisfactionScore = 85; // Mock score
  const systemEfficiency = (approvalMetrics.approvalRate * 0.6 + appealMetrics.appealSuccessRate * 0.4).toFixed(2);
  const dataQualityScore = 92; // Mock score
  const securityCompliance = 98; // Mock score
  const accessibilityScore = 88; // Mock score

  return {
    userSatisfactionScore,
    systemEfficiency: parseFloat(systemEfficiency),
    dataQualityScore,
    securityCompliance,
    accessibilityScore
  };
}

function calculateSystemHealth(users) {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isApproved).length;
  const verifiedUsers = users.filter(u => 
    u.verificationData?.emailVerified || 
    u.verificationData?.phoneVerified
  ).length;

  return {
    userActivity: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(2) : 0,
    dataQuality: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) : 0,
    systemUptime: 99.9, // Mock uptime
    performance: 95.2 // Mock performance score
  };
}

async function getRecentActivity() {
  const recentUsers = await User.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name role approvalStatus createdAt');

  return recentUsers.map(user => ({
    name: user.name,
    role: user.role,
    status: user.approvalStatus,
    time: user.createdAt
  }));
}

function calculateVulnerabilityDistribution(users) {
  const vulnerabilityCounts = {};
  const vulnerabilityFactors = [
    'Refugee/Displaced', 'LGBTQ+', 'Person with Disability', 
    'Low Income', 'Creative/Artist', 'Rural Community', 
    'Youth (18-25)', 'Single Parent', 'Unemployed'
  ];

  vulnerabilityFactors.forEach(factor => {
    vulnerabilityCounts[factor] = users.filter(u => 
      u.vulnerabilityFactors?.includes(factor)
    ).length;
  });

  return vulnerabilityCounts;
}

function calculateRiskAnalysis(users) {
  const riskLevels = {
    low: users.filter(u => u.riskLevel === 'low').length,
    medium: users.filter(u => u.riskLevel === 'medium').length,
    high: users.filter(u => u.riskLevel === 'high').length
  };

  const averageTrustScore = users.length > 0 ? 
    (users.reduce((sum, u) => sum + (u.trustScore || 50), 0) / users.length).toFixed(2) : 50;

  return {
    riskLevels,
    averageTrustScore: parseFloat(averageTrustScore),
    riskTrend: 'decreasing' // Mock trend
  };
}

function generateInterventionRecommendations(users) {
  const recommendations = [
    {
      category: 'High-Risk Users',
      action: 'Enhanced verification and support programs',
      priority: 'High',
      expectedOutcome: 'Reduce risk levels and improve trust scores'
    },
    {
      category: 'Digital Inclusion',
      action: 'Device and internet access programs',
      priority: 'Medium',
      expectedOutcome: 'Improve digital literacy and access'
    },
    {
      category: 'Creative Arts',
      action: 'Funding and mentorship programs',
      priority: 'High',
      expectedOutcome: 'Support creative professionals and artists'
    }
  ];

  return recommendations;
}

function calculateSuccessMetrics(users) {
  const approvedUsers = users.filter(u => u.approvalStatus === 'approved');
  const highTrustUsers = users.filter(u => (u.trustScore || 50) >= 80);
  
  return {
    approvalSuccessRate: users.length > 0 ? (approvedUsers.length / users.length * 100).toFixed(2) : 0,
    highTrustRate: users.length > 0 ? (highTrustUsers.length / users.length * 100).toFixed(2) : 0,
    averageTimeToApproval: 48, // Mock hours
    userRetentionRate: 92 // Mock percentage
  };
}

function getWeekKey(date) {
  const year = date.getFullYear();
  const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `${year}-W${week}`;
}

function calculateSocialInclusionIndex(beneficiaries) {
  // Mock calculation based on vulnerability factors and approval status
  return 78.5;
}

function calculateEconomicEmpowermentScore(beneficiaries) {
  // Mock calculation based on income levels and support received
  return 82.3;
}

function calculateDigitalInclusionRate(beneficiaries) {
  const digitalUsers = beneficiaries.filter(u => 
    u.verificationData?.emailVerified || 
    u.verificationData?.phoneVerified
  ).length;
  
  return beneficiaries.length > 0 ? (digitalUsers / beneficiaries.length * 100).toFixed(2) : 0;
}

function calculateCommunityEngagementLevel(beneficiaries) {
  // Mock calculation based on participation in programs
  return 75.8;
} 