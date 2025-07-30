import Fund from '../models/Fund.js';
import Beneficiary from '../models/Beneficiary.js';

// Get all funds with filtering
export const getFunds = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, source } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = { $regex: source, $options: 'i' };

    const funds = await Fund.find(filter)
      .populate('beneficiaryId', 'name vulnerabilityFactors')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Fund.countDocuments(filter);

    res.json({
      funds,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ message: 'Error fetching funds', error: error.message });
  }
};

// Create new fund allocation
export const createFund = async (req, res) => {
  try {
    const {
      name,
      amountAllocated,
      amountSpent,
      source,
      status,
      beneficiaryId,
      purpose
    } = req.body;

    if (!name || !amountAllocated) {
      return res.status(400).json({ message: 'Fund name and amount are required' });
    }

    const fund = new Fund({
      name,
      amountAllocated,
      amountSpent: amountSpent || 0,
      source,
      status: status || 'Active',
      beneficiaryId,
      purpose,
      createdBy: req.user?.id
    });

    const savedFund = await fund.save();
    res.status(201).json(savedFund);
  } catch (error) {
    console.error('Error creating fund:', error);
    res.status(500).json({ message: 'Error creating fund', error: error.message });
  }
};

// Get fund by ID
export const getFundById = async (req, res) => {
  try {
    const fund = await Fund.findById(req.params.id)
      .populate('beneficiaryId', 'name vulnerabilityFactors location');
    
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    res.json(fund);
  } catch (error) {
    console.error('Error fetching fund:', error);
    res.status(500).json({ message: 'Error fetching fund', error: error.message });
  }
};

// Update fund
export const updateFund = async (req, res) => {
  try {
    const updatedFund = await Fund.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('beneficiaryId', 'name vulnerabilityFactors');
    
    if (!updatedFund) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    
    res.json(updatedFund);
  } catch (error) {
    console.error('Error updating fund:', error);
    res.status(500).json({ message: 'Error updating fund', error: error.message });
  }
};

// Delete fund
export const deleteFund = async (req, res) => {
  try {
    const fund = await Fund.findByIdAndDelete(req.params.id);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found' });
    }
    res.json({ message: 'Fund deleted successfully' });
  } catch (error) {
    console.error('Error deleting fund:', error);
    res.status(500).json({ message: 'Error deleting fund', error: error.message });
  }
};

// Get fund analytics
export const getFundAnalytics = async (req, res) => {
  try {
    const totalFunds = await Fund.countDocuments();
    const totalAllocated = await Fund.aggregate([
      { $group: { _id: null, total: { $sum: '$amountAllocated' } } }
    ]);
    const totalSpent = await Fund.aggregate([
      { $group: { _id: null, total: { $sum: '$amountSpent' } } }
    ]);

    // Funds by status
    const fundsByStatus = await Fund.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amountAllocated' } } }
    ]);

    // Funds by source
    const fundsBySource = await Fund.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 }, total: { $sum: '$amountAllocated' } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    // Funds by vulnerable group
    const fundsByGroup = await Fund.aggregate([
      { $lookup: { from: 'beneficiaries', localField: 'beneficiaryId', foreignField: '_id', as: 'beneficiary' } },
      { $unwind: '$beneficiary' },
      { $unwind: '$beneficiary.vulnerabilityFactors' },
      { $group: { _id: '$beneficiary.vulnerabilityFactors', count: { $sum: 1 }, total: { $sum: '$amountAllocated' } } },
      { $sort: { total: -1 } }
    ]);

    // Monthly fund allocation trends
    const monthlyTrends = await Fund.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          allocated: { $sum: '$amountAllocated' },
          spent: { $sum: '$amountSpent' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalFunds,
      totalAllocated: totalAllocated[0]?.total || 0,
      totalSpent: totalSpent[0]?.total || 0,
      utilizationRate: totalAllocated[0]?.total ? ((totalSpent[0]?.total || 0) / totalAllocated[0].total * 100).toFixed(2) : 0,
      fundsByStatus,
      fundsBySource,
      fundsByGroup,
      monthlyTrends
    });
  } catch (error) {
    console.error('Error fetching fund analytics:', error);
    res.status(500).json({ message: 'Error fetching fund analytics', error: error.message });
  }
}; 