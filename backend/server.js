import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import beneficiaryRoutes from './routes/beneficiaryRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';
import fundRoutes from './routes/fundRoutes.js';

dotenv.config();

// Set environment variables directly for now
process.env.MONGO_URI = 'mongodb://localhost:27017/cultural-inclusion';
process.env.PORT = '5002';
process.env.JWT_SECRET = 'your-super-secret-jwt-key-for-hackathon';
process.env.NODE_ENV = 'development';

// Debug: Check environment variables
console.log('🔍 Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
console.log('NODE_ENV:', process.env.NODE_ENV);

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Sample routes (to add)
app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/funds', fundRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
