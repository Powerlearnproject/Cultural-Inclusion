import mongoose from 'mongoose';

const fundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amountAllocated: { type: Number, required: true },
  amountSpent: { type: Number, default: 0 },
  source: String,
  status: { type: String, enum: ['Active', 'Suspended', 'Flagged'], default: 'Active' },
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Fund', fundSchema);
