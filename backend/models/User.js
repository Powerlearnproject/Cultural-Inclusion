import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Analyst', 'FieldAgent'], default: 'FieldAgent' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
