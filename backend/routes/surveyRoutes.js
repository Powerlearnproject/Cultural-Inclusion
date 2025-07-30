import express from 'express';
import {
  getSurveys,
  createSurvey,
  getSurveyById,
  submitSurveyResponse,
  getSurveyAnalytics,
  getSurveyResponses
} from '../controllers/surveyController.js';

const router = express.Router();

// GET /api/surveys - Get all surveys
router.get('/', getSurveys);

// POST /api/surveys - Create new survey
router.post('/', createSurvey);

// GET /api/surveys/:id - Get survey by ID
router.get('/:id', getSurveyById);

// GET /api/surveys/:id/analytics - Get survey analytics
router.get('/:id/analytics', getSurveyAnalytics);

// POST /api/surveys/responses - Submit survey response
router.post('/responses', submitSurveyResponse);

// GET /api/surveys/responses - Get all survey responses
router.get('/responses', getSurveyResponses);

export default router;
