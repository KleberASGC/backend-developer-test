const uuidValidate = require('uuid-validate');
const modelJob = require('../models/job');
const modelCompanies = require('../models/companies');

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const createJob = async (req, res) => {
  const bodyParams = [
    req.body.company_id,
    req.body.title,
    req.body.description,
    req.body.location
  ];
    
  if (bodyParams.includes('') || bodyParams.includes(undefined)) {
    return res.status(400).json({
      error: 'bad req, missing fields'
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
    
  if(!uuidValidate(jobId)) {
    return res.status(400).json({
      error: 'invalid job_id'
    });
  }
    
  const JOB_STATUS = 'draft';
  const job = await modelJob.getJobById(jobId, JOB_STATUS);
      
  if (!job) {
    return res.status(404).json({
      error: 'job not found'
    });
  }
    
  const params = {
    Bucket: 'jobs-published-plooraltest',
    Key: `${jobId}.json`,
    Body: JSON.stringify(job),
    ContentType: 'application/json'
  };
      
  // Faz o upload do objeto para o bucket
  try {
    s3.putObject(params, (err, data) => {
      if (err) {
        console.error('Error uploading the object:', err);
      } else {
        console.log('Object successfully sent to Amazon S3:', data);
      }
    });
  } catch (error) {
    console.error('an error has occurred');
  }
    
  return res.status(200).json({
    message: 'success'
  });
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

  const values = [];
  const fieldsToUpdate = [];
    
  if (title !== undefined) {
    fieldsToUpdate.push('title = $1');
    values.push(title);
  }
  if (location !== undefined) {
    fieldsToUpdate.push('location = $2');
    values.push(location);
  }
  if (description !== undefined) {
    fieldsToUpdate.push('description = $3');
    values.push(description);
  }
    
  fieldsToUpdate.push('updated_at = now()');
    
  values.push(jobId);
    
  const result = await modelJob.updateJob(fieldsToUpdate, values);
  
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
  // TO DO
  return res.status(500);
};

module.exports = {
  createJob,
  publishJob,
  editJob,
  deleteJob,
  archiveJob
};