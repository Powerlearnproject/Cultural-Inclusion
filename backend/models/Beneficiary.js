import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  identityTags: [String],
  literacyLevel: String,
  financialLiteracyScore: Number,
  location: String,
  deviceAccess: {
    internet: Boolean,
    deviceType: String,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Beneficiary', beneficiarySchema);
