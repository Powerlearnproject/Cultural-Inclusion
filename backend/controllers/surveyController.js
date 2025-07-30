import Survey from '../models/Survey.js';
import SurveyResponse from '../models/SurveyResponse.js';

// Get all surveys
export const getSurveys = async (req, res) => {
  try {
    const { page = 1, limit = 10, targetGroup } = req.query;
    
    const filter = {};
    if (targetGroup) filter.targetGroup = { $in: [targetGroup] };

    const surveys = await Survey.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Survey.countDocuments(filter);

    res.json({
      surveys,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ message: 'Error fetching surveys', error: error.message });
  }
};

// Create new survey
export const createSurvey = async (req, res) => {
  try {
    const { title, description, fields, targetGroup } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Survey title is required' });
    }

    const survey = new Survey({
      title,
      description,
      fields: fields || [],
      targetGroup: targetGroup || [],
      createdBy: req.user?.id
    });

    const savedSurvey = await survey.save();
    res.status(201).json(savedSurvey);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ message: 'Error creating survey', error: error.message });
  }
};

// Get survey by ID
export const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ message: 'Error fetching survey', error: error.message });
  }
};

// Submit survey response
export const submitSurveyResponse = async (req, res) => {
  try {
    const { surveyId, responses, beneficiaryId } = req.body;

    if (!surveyId || !responses) {
      return res.status(400).json({ message: 'Survey ID and responses are required' });
    }

    const surveyResponse = new SurveyResponse({
      surveyId,
      responses,
      beneficiaryId,
      submittedBy: req.user?.id
    });

    const savedResponse = await surveyResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    console.error('Error submitting survey response:', error);
    res.status(500).json({ message: 'Error submitting survey response', error: error.message });
  }
};

// Get survey analytics
export const getSurveyAnalytics = async (req, res) => {
  try {
    const { surveyId } = req.params;

    // Get survey details
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Get response count
    const responseCount = await SurveyResponse.countDocuments({ surveyId });

    // Get responses by target group
    const responsesByGroup = await SurveyResponse.aggregate([
      { $match: { surveyId: survey._id } },
      { $lookup: { from: 'beneficiaries', localField: 'beneficiaryId', foreignField: '_id', as: 'beneficiary' } },
      { $unwind: '$beneficiary' },
      { $unwind: '$beneficiary.vulnerabilityFactors' },
      { $group: { _id: '$beneficiary.vulnerabilityFactors', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get response trends over time
    const responseTrends = await SurveyResponse.aggregate([
      { $match: { surveyId: survey._id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      survey,
      responseCount,
      responsesByGroup,
      responseTrends
    });
  } catch (error) {
    console.error('Error fetching survey analytics:', error);
    res.status(500).json({ message: 'Error fetching survey analytics', error: error.message });
  }
};

// Get all survey responses
export const getSurveyResponses = async (req, res) => {
  try {
    const { surveyId, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (surveyId) filter.surveyId = surveyId;

    const responses = await SurveyResponse.find(filter)
      .populate('beneficiaryId', 'name vulnerabilityFactors location')
      .populate('surveyId', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await SurveyResponse.countDocuments(filter);

    res.json({
      responses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    res.status(500).json({ message: 'Error fetching survey responses', error: error.message });
  }
}; 