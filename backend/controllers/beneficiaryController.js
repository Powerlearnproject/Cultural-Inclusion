import Beneficiary from '../models/Beneficiary.js';

// Get all beneficiaries with filtering and pagination
export const getBeneficiaries = async (req, res) => {
  try {
    const { page = 1, limit = 10, group, location, literacyLevel } = req.query;
    
    // Build filter object
    const filter = {};
    if (group) filter.identityTags = { $in: [group] };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (literacyLevel) filter.literacyLevel = literacyLevel;

    const beneficiaries = await Beneficiary.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Beneficiary.countDocuments(filter);

    res.json({
      beneficiaries,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    res.status(500).json({ message: 'Error fetching beneficiaries', error: error.message });
  }
};

// Create new beneficiary
export const createBeneficiary = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      identityTags,
      literacyLevel,
      financialLiteracyScore,
      location,
      deviceAccess,
      incomeLevel,
      businessType,
      vulnerabilityFactors
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const beneficiary = new Beneficiary({
      name,
      age,
      gender,
      identityTags: identityTags || [],
      literacyLevel,
      financialLiteracyScore,
      location,
      deviceAccess: deviceAccess || { internet: false, deviceType: '' },
      incomeLevel,
      businessType,
      vulnerabilityFactors: vulnerabilityFactors || [],
      createdBy: req.user?.id // If authentication is implemented
    });

    const savedBeneficiary = await beneficiary.save();
    res.status(201).json(savedBeneficiary);
  } catch (error) {
    console.error('Error creating beneficiary:', error);
    res.status(500).json({ message: 'Error creating beneficiary', error: error.message });
  }
};

// Get beneficiary by ID
export const getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }
    res.json(beneficiary);
  } catch (error) {
    console.error('Error fetching beneficiary:', error);
    res.status(500).json({ message: 'Error fetching beneficiary', error: error.message });
  }
};

// Update beneficiary
export const updateBeneficiary = async (req, res) => {
  try {
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBeneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }
    
    res.json(updatedBeneficiary);
  } catch (error) {
    console.error('Error updating beneficiary:', error);
    res.status(500).json({ message: 'Error updating beneficiary', error: error.message });
  }
};

// Delete beneficiary
export const deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);
    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }
    res.json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    console.error('Error deleting beneficiary:', error);
    res.status(500).json({ message: 'Error deleting beneficiary', error: error.message });
  }
};

// Get analytics data
export const getBeneficiaryAnalytics = async (req, res) => {
  try {
    const totalBeneficiaries = await Beneficiary.countDocuments();
    
    // Group by vulnerability factors
    const vulnerabilityStats = await Beneficiary.aggregate([
      { $unwind: '$vulnerabilityFactors' },
      { $group: { _id: '$vulnerabilityFactors', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Group by location
    const locationStats = await Beneficiary.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Group by literacy level
    const literacyStats = await Beneficiary.aggregate([
      { $group: { _id: '$literacyLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Device access stats
    const deviceStats = await Beneficiary.aggregate([
      { $group: { _id: '$deviceAccess.deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Internet access stats
    const internetStats = await Beneficiary.aggregate([
      { $group: { _id: '$deviceAccess.internet', count: { $sum: 1 } } }
    ]);

    res.json({
      totalBeneficiaries,
      vulnerabilityStats,
      locationStats,
      literacyStats,
      deviceStats,
      internetStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
