import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fields: [Object],
  targetGroup: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Survey', surveySchema);
  