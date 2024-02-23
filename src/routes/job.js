const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job');

router.post('/', jobController.createJob);
  
router.put('/:job_id/publish', jobController.publishJob);
  
router.put('/:job_id', jobController.editJob);
  
router.delete('/:job_id', jobController.deleteJob);
  
router.put('/:job_id/archive', jobController.archiveJob);

module.exports = router;