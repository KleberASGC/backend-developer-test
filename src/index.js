const express = require('express');
const database = require('../infra/database');
const uuidValidate = require('uuid-validate');

const app = express();

app.use(express.json());

const NOT_FOUND = 0;

const getCompanyById = async (companyId) => {
  const company = await database.query({
    text: 'SELECT * from companies WHERE id = $1;',
    values: [companyId]
  });
  return company.rowCount ? company.rows[0] : NOT_FOUND;
};

const getJobById = async (jobId) => {
  const job = await database.query({
    text: 'SELECT * from jobs WHERE id = $1;',
    values: [jobId]
  });
  return job.rowCount ? job.rows[0] : NOT_FOUND;
};

app.get('/companies', async (request, response) => {
  const result = await database.query('SELECT * from companies;');
  return response.status(200).json(result.rows);
});

app.get('/companies/:company_id', async (request, response) => {
  if(!uuidValidate(request.params.company_id)) {
    return response.status(400).json({
      error: 'invalid company_id'
    });
  }
  const company = await getCompanyById(request.params.company_id);
  return company ? response.status(200).json(company) : response.status(404).json({ error: 'id not found' });
  
});

app.post('/job', async (request, response) => {
  const bodyParams = [
    request.body.company_id,
    request.body.title,
    request.body.description,
    request.body.location
  ];

  if (bodyParams.includes('') || bodyParams.includes(undefined)) {
    return response.status(400).json({
      error: 'bad request, missing fields'
    });
  }

  if(!uuidValidate(request.body.company_id)) {
    return response.status(400).json({
      error: 'invalid company_id'
    });
  }
  const company = await getCompanyById(request.body.company_id);
  if (!company) {
    return response.status(404).json({
      error: 'company not found'
    });
  }

  const result = await database.query({
    text: 'INSERT INTO jobs (company_id, title, description, location, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description',
    values: [
      request.body.company_id,
      request.body.title,
      request.body.description,
      request.body.location,
      request.body.notes || null]
  });
  if (result.rowCount === 1 && result.rows.length === 1) {
    return response.status(201).json({
      message: 'the job was created',
      ...result.rows[0]
    });
  } else {
    return response.status(500).json({
      error: 'an error has occurred'
    });
  }
});

// TO DO
// app.put('/job/:job_id/publish', async (request, response) => {
//   return
// });

app.put('/job/:job_id', async (request, response) => {
  const jobId = request.params.job_id;

  if(!uuidValidate(jobId)) {
    return response.status(400).json({
      error: 'invalid job_id'
    });
  }

  const job = await getJobById(jobId);
  if (!job) {
    return response.status(404).json({
      error: 'job not found'
    });
  }

  const { title, location, description } = request.body;

  if (title === undefined && location === undefined && description === undefined) {
    return response.status(400).json({ error: 'no fields to update' });
  }

  let query = 'UPDATE jobs SET';
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

  query += ' ' + fieldsToUpdate.join(', ');
  query += ' WHERE id = $' + (values.length + 1);

  values.push(jobId);

  const result = await database.query({
    text: query,
    values: values
  });

  if (result.rowCount > 0) {
    return response.status(200).json({
      message: 'the job was updated',
      id: jobId
    });
  } else if (result.rowCount === 0) {
    response.status(404).json({
      error: 'job not found'
    });
  } else {
    return response.status(500).json({
      error: 'an error has occurred'
    });
  }

});

app.delete('/job/:job_id', async (request, response) => {
  const jobId = request.params.job_id;

  if(!uuidValidate(jobId)) {
    return response.status(400).json({
      error: 'invalid job_id'
    });
  }

  const result = await database.query({
    text: 'DELETE FROM jobs WHERE id = $1',
    values: [jobId]
  });

  if (result.rowCount > 0) {
    response.status(200).json({
      message: 'job was deleted',
      id: jobId
    });
  } else if (result.rowCount === 0){
    response.status(404).json({
      error: 'job not found'
    });
  } else {
    return response.status(500).json({
      error: 'an error has occurred'
    });
  }
});

// TO DO
// app.put('/job/:job_id/archive', async (request, response) => {
//   return
// });

app.listen(3333, () => console.log('Server running on port 3333'));