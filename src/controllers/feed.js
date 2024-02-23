const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const getPublishedJobs = async (request, response) => {
  try {
    const params = {
      Bucket: 'jobs-published-plooraltest'
    };
    
    const jobs = [];
    
    // Lista todos os objetos no bucket
    const data = await s3.listObjectsV2(params).promise();
    
    for (const job of data.Contents) {
      const jobParams = {
        Bucket: params.Bucket,
        Key: job.Key
      };
    
      // Obtém o conteúdo do objeto JSON
      const jobData = await s3.getObject(jobParams).promise();
      const jobContent = JSON.parse(jobData.Body.toString('utf-8'));
      jobs.push(jobContent);
    }
    
    return response.status(200).json({
      message: 'published jobs',
      jobs
    });
  } catch (error) {
    console.error('an error has occurred', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getPublishedJobs
};