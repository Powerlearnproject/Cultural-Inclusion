import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  // System-wide metrics
  totalUsers: {
    admin: { type: Number, default: 0 },
    officer: { type: Number, default: 0 },
    beneficiary: { type: Number, default: 0 }
  },
  
  // Approval metrics
  approvalMetrics: {
    totalPending: { type: Number, default: 0 },
    totalApproved: { type: Number, default: 0 },
    totalRejected: { type: Number, default: 0 },
    totalUnderReview: { type: Number, default: 0 },
    approvalRate: { type: Number, default: 0 },
    averageApprovalTime: { type: Number, default: 0 } // in hours
  },
  
  // Appeal metrics
  appealMetrics: {
    totalAppeals: { type: Number, default: 0 },
    appealsGranted: { type: Number, default: 0 },
    appealsDenied: { type: Number, default: 0 },
    appealSuccessRate: { type: Number, default: 0 },
    averageAppealTime: { type: Number, default: 0 } // in hours
  },
  
  // Vulnerability analysis
  vulnerabilityAnalysis: {
    refugees: { type: Number, default: 0 },
    lgbtq: { type: Number, default: 0 },
    disabled: { type: Number, default: 0 },
    lowIncome: { type: Number, default: 0 },
    creatives: { type: Number, default: 0 },
    rural: { type: Number, default: 0 },
    youth: { type: Number, default: 0 },
    singleParent: { type: Number, default: 0 },
    unemployed: { type: Number, default: 0 }
  },
  
  // Trust and risk analysis
  trustAnalysis: {
    averageTrustScore: { type: Number, default: 50 },
    lowRiskUsers: { type: Number, default: 0 },
    mediumRiskUsers: { type: Number, default: 0 },
    highRiskUsers: { type: Number, default: 0 },
    verificationRate: { type: Number, default: 0 }
  },
  
  // Geographic distribution
  geographicDistribution: {
    regions: [{
      name: String,
      count: Number,
      approvalRate: Number,
      averageTrustScore: Number
    }]
  },
  
  // Temporal trends
  temporalTrends: {
    dailyRegistrations: [{
      date: Date,
      count: Number,
      approvals: Number,
      rejections: Number
    }],
    weeklyMetrics: [{
      week: String,
      registrations: Number,
      approvals: Number,
      appeals: Number,
      averageTrustScore: Number
    }],
    monthlyImpact: [{
      month: String,
      totalBeneficiaries: Number,
      newApprovals: Number,
      supportPrograms: Number,
      impactScore: Number
    }]
  },
  
  // Predictive analytics
  predictiveMetrics: {
    expectedRegistrations: { type: Number, default: 0 },
    predictedApprovalRate: { type: Number, default: 0 },
    riskTrends: {
      increasing: { type: Number, default: 0 },
      decreasing: { type: Number, default: 0 },
      stable: { type: Number, default: 0 }
    },
    fundingRecommendations: [{
      category: String,
      amount: Number,
      priority: String,
      expectedImpact: Number
    }]
  },
  
  // Impact measurements
  impactMetrics: {
    totalImpactScore: { type: Number, default: 0 },
    socialInclusionIndex: { type: Number, default: 0 },
    economicEmpowermentScore: { type: Number, default: 0 },
    digitalInclusionRate: { type: Number, default: 0 },
    communityEngagementLevel: { type: Number, default: 0 }
  },
  
  // Performance indicators
  kpis: {
    userSatisfactionScore: { type: Number, default: 0 },
    systemEfficiency: { type: Number, default: 0 },
    dataQualityScore: { type: Number, default: 0 },
    securityCompliance: { type: Number, default: 0 },
    accessibilityScore: { type: Number, default: 0 }
  },
  
  // Generated at
  generatedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

// Update timestamp on save
analyticsSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model('Analytics', analyticsSchema); 