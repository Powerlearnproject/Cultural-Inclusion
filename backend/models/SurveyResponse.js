import mongoose from 'mongoose';

const surveyResponseSchema = new mongoose.Schema({
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' },
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
  responses: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('SurveyResponse', surveyResponseSchema); 