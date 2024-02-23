const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadJobToS3 = async (jobId, job) => {
  const params = {
    Bucket: 'jobs-published-plooraltest',
    Key: `${jobId}.json`,
    Body: JSON.stringify(job),
    ContentType: 'application/json'
  };
  
  try {
    await s3.putObject(params).promise();
    console.log('Object successfully sent to Amazon S3');
  } catch (err) {
    console.error('Error uploading the object to Amazon S3:', err);
    throw err;
  }
};

const getPublishedJobsFromS3 = async () => {
  try {
    const params = {
      Bucket: 'jobs-published-plooraltest',
      Key: 'published_jobs.json'
    };
  
    const jobData = await s3.getObject(params).promise();
    const jobContent = JSON.parse(jobData.Body.toString('utf-8'));
    return jobContent;
  } catch (error) {
    console.error('Error fetching published jobs from S3:', error);
    throw error;
  }
};

module.exports = {
  uploadJobToS3,
  getPublishedJobsFromS3
};