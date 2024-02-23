const uuidValidate = require('uuid-validate');
const modelJob = require('../models/job');
const modelCompanies = require('../models/companies');
const awsService = require('../services/awsService');

const createJob = async (req, res) => {
  const bodyParams = [
    req.body.company_id,
    req.body.title,
    req.body.description,
    req.body.location
  ];
    
  if (bodyParams.includes('') || bodyParams.includes(undefined)) {
    return res.status(400).json({
      error: 'bad request, missing fields'
    });
  }
    
  if(!uuidValidate(req.body.company_id)) {
    return res.status(400).json({
      error: 'invalid company_id'
    });
  }
  const company = await modelCompanies.getCompanyById(req.body.company_id);

  if (!company) {
    return res.status(404).json({
      error: 'company not found'
    });
  }

  const values = [
    req.body.company_id,
    req.body.title,
    req.body.description,
    req.body.location,
    req.body.notes || null
  ];
  const result = await modelJob.addJob(values);
  
  if (result.rowCount === 1 && result.rows.length === 1) {
    return res.status(201).json({
      message: 'the job was created',
      ...result.rows[0]
    });
  } else {
    return res.status(500).json({
      error: 'an error has occurred'
    });
  }
};

const publishJob = async (req, res) => {
  const jobId = req.params.job_id;
  if (!uuidValidate(jobId)) {
    return res.status(400).json({
      error: 'invalid job_id'
    });
  }
  const JOB_STATUS = 'published';
  const result = await modelJob.setJobStatus(jobId, JOB_STATUS);
  if (result.rowCount === 0) {
    return res.status(404).json({
      error: 'job not found'
    });
  } else if (result.rowCount > 0) {
    console.log('Job status updated to published in the database');
  } else {
    return res.status(500).json({
      error: 'something went wrong when updating job status'
    });
  }
  
  
  const job = await modelJob.getJobById(jobId, JOB_STATUS);
  const company = await modelCompanies.getCompanyById(job.company_id);
  job.company_name = company.name;
    
  try {
    // Upload job to S3
    await awsService.uploadJobToS3(jobId, job);
    return res.status(200).json({
      message: 'job published'
    });
  } catch (error) {
    console.error('An error occurred while publishing job:', error);
    return res.status(500).json({
      error: 'something went wrong when publishing job'
    });
  }
};

const editJob = async (req, res) => {
  const jobId = req.params.job_id;
    
  if(!uuidValidate(jobId)) {
    return res.status(400).json({
      error: 'invalid job_id'
    });
  }
    
  const job = await modelJob.getJobById(jobId);
  if (!job) {
    return res.status(404).json({
      error: 'job not found'
    });
  }
    
  const { title, location, description } = req.body;
    
  if (title === undefined && location === undefined && description === undefined) {
    return res.status(400).json({ error: 'no fields to update' });
  }

  const result = await modelJob.updateJob(jobId, title, location, description);
  
  if (result.rowCount > 0) {
    return res.status(200).json({
      message: 'the job was updated',
      id: jobId
    });
  } else if (result.rowCount === 0) {
    res.status(404).json({
      error: 'job not found'
    });
  } else {
    return res.status(500).json({
      error: 'an error has occurred'
    });
  }
    
};

const deleteJob = async (req, res) => {
  const jobId = req.params.job_id;
    
  if(!uuidValidate(jobId)) {
    return res.status(400).json({
      error: 'invalid job_id'
    });
  }
    
  const result = await modelJob.deleteJob(jobId);
    
  if (result.rowCount > 0) {
    res.status(200).json({
      message: 'job was deleted',
      id: jobId
    });
  } else if (result.rowCount === 0){
    res.status(404).json({
      error: 'job not found'
    });
  } else {
    return res.status(500).json({
      error: 'an error has occurred'
    });
  }
};

const archiveJob = async (req, res) => {
  const jobId = req.params.job_id;
  if (!uuidValidate(jobId)) {
    return res.status(400).json({
      error: 'invalid job_id'
    });
  }
  const JOB_STATUS = 'archived';
  const result = await modelJob.setJobStatus(jobId, JOB_STATUS);
  if (result.rowCount === 0) {
    return res.status(404).json({
      error: 'job not found'
    });
  } else if (result.rowCount > 0) {
    console.log('Job status updated to archived in the database');
  } else {
    return res.status(500).json({
      error: 'something went wrong when updating job status'
    });
  }

  const job = await modelJob.getJobById(jobId, JOB_STATUS);
  try {
    await awsService.uploadJobToS3(jobId, job);
    return res.status(200).json({
      message: 'job archived'
    });
  } catch (error) {
    console.error('An error occurred while archiving job:', error);
    return res.status(500).json({
      error: 'something went wrong when archiving job'
    });
  }
};

module.exports = {
  createJob,
  publishJob,
  editJob,
  deleteJob,
  archiveJob
};