const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companies');

router.get('/:company_id', companiesController.getCompany);

router.get('/', companiesController.getAllCompanies);

module.exports = router;