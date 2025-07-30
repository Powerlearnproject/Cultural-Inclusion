import Beneficiary from '../models/Beneficiary.js';

export const getBeneficiaries = (req, res) => {
  res.send('Get all beneficiaries');
};

export const createBeneficiary = (req, res) => {
  res.send('Create beneficiary');
};
