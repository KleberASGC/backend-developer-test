const uuidValidate = require('uuid-validate');

const companiesModel = require('../models/companies');

const getAllCompanies = async (req, res) => {
  const result = await companiesModel.getAllCompanies();
  return res.status(200).json(result);
};

const getCompany = async (req, res) => {
  if(!uuidValidate(req.params.company_id)) {
    return res.status(400).json({
      error: 'invalid company_id'
    });
  }
  const company = await companiesModel.getCompanyById(req.params.company_id);
  return company ? res.status(200).json(company) : res.status(404).json({ error: 'id not found' });
};

module.exports = {
  getAllCompanies,
  getCompany
};