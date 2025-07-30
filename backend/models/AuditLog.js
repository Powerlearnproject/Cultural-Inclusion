import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  entityAffected: String,
  timestamp: { type: Date, default: Date.now },
  changes: mongoose.Schema.Types.Mixed,
});

export default mongoose.model('AuditLog', auditLogSchema);
