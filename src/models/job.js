const database = require('../../infra/database');

const NOT_FOUND = 0;
const getJobById = async (jobId, status) => {
  let queryText = 'SELECT * FROM jobs WHERE id = $1';
  const queryValues = [jobId];
      
  if (status !== undefined) {
    queryText += ' AND status = $2';
    queryValues.push(status);
  }
      
  const job = await database.query({
    text: queryText,
    values: queryValues
  });
      
  return job.rowCount ? job.rows[0] : NOT_FOUND;
};

const addJob = async (values) => {
  const result = await database.query({
    text: 'INSERT INTO jobs (company_id, title, description, location, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description',
    values
  });
  return result;
};

const updateJob = async (jobId, title, location, description) => {
  const values = [];
  const fieldsToUpdate = [];
  
  if (title !== undefined) {
    fieldsToUpdate.push('title = $' + (values.length + 1));
    values.push(title);
  }
  if (location !== undefined) {
    fieldsToUpdate.push('location = $' + (values.length + 1));
    values.push(location);
  }
  if (description !== undefined) {
    fieldsToUpdate.push('description = $' + (values.length + 1));
    values.push(description);
  }
  fieldsToUpdate.push('updated_at = now()');
  values.push(jobId);

  let query = 'UPDATE jobs SET';
  query += ' ' + fieldsToUpdate.join(', ');
  query += ' WHERE id = $' + (values.length);

  const result = await database.query({
    text: query,
    values
  });

  return result;
};

const deleteJob = async (jobId) => {
  const result = await database.query({
    text: 'DELETE FROM jobs WHERE id = $1',
    values: [jobId]
  });
  return result;
};

module.exports = {
  getJobById,
  addJob,
  updateJob,
  deleteJob
};