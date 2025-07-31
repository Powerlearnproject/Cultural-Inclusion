import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'officer', 'beneficiary'], 
    default: 'beneficiary' 
  },
  // Role-specific fields
  isApproved: { type: Boolean, default: false },
  approvalStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'under_review'], 
    default: 'pending' 
  },
  approvalComment: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  rejectionReason: String,
  appealStatus: { 
    type: String, 
    enum: ['none', 'pending', 'approved', 'rejected'], 
    default: 'none' 
  },
  appealComment: String,
  appealSubmittedAt: Date,
  
  // Officer-specific fields
  officerId: String,
  assignedRegions: [String],
  totalBeneficiariesRegistered: { type: Number, default: 0 },
  verificationLevel: { 
    type: String, 
    enum: ['basic', 'verified', 'trusted'], 
    default: 'basic' 
  },
  
  // Beneficiary-specific fields
  beneficiaryId: String,
  vulnerabilityFactors: [String],
  registrationSource: { 
    type: String, 
    enum: ['self', 'officer', 'referral'], 
    default: 'self' 
  },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Data verification fields
  verificationData: {
    idDocument: {
      type: { type: String, enum: ['national_id', 'passport', 'refugee_id', 'other'] },
      number: String,
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date
    },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    locationVerified: { type: Boolean, default: false },
    references: [{
      name: String,
      relationship: String,
      phone: String,
      verified: { type: Boolean, default: false }
    }],
    documents: [{
      type: String,
      filename: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false }
    }]
  },
  
  // Trust scoring
  trustScore: { type: Number, min: 0, max: 100, default: 50 },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  
  // Common fields
  phoneNumber: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate trust score based on verification data
userSchema.methods.calculateTrustScore = function() {
  let score = 50; // Base score
  
  // Email verification
  if (this.verificationData.emailVerified) score += 10;
  
  // Phone verification
  if (this.verificationData.phoneVerified) score += 10;
  
  // Location verification
  if (this.verificationData.locationVerified) score += 5;
  
  // ID document verification
  if (this.verificationData.idDocument.verified) score += 15;
  
  // References verification
  const verifiedReferences = this.verificationData.references.filter(ref => ref.verified).length;
  score += verifiedReferences * 5;
  
  // Documents verification
  const verifiedDocuments = this.verificationData.documents.filter(doc => doc.verified).length;
  score += verifiedDocuments * 3;
  
  // Role-based adjustments
  if (this.role === 'officer') score += 10;
  if (this.role === 'admin') score += 20;
  
  return Math.min(100, Math.max(0, score));
};

// Update risk level based on trust score
userSchema.methods.updateRiskLevel = function() {
  const score = this.trustScore;
  if (score >= 80) this.riskLevel = 'low';
  else if (score >= 50) this.riskLevel = 'medium';
  else this.riskLevel = 'high';
};

export default mongoose.model('User', userSchema);
