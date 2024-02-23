const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const params = {
      Bucket: 'jobs-published-plooraltest'
    };
    const data = await s3.listObjectsV2(params).promise();
    
    const publishedJobs = [];
    for (const object of data.Contents) {
      const getObjectParams = {
        Bucket: params.Bucket,
        Key: object.Key
      };
      const objectData = await s3.getObject(getObjectParams).promise();
      const job = JSON.parse(objectData.Body.toString('utf-8'));
      if (job.status === 'published') {
        publishedJobs.push(job);
      }
    }

    const formattedPublishedJobs = publishedJobs.map(job => {
      return {
        job_id: job.id,
        job_title: job.title,
        job_description: job.description,
        company_name: job.company_name,
        job_created_at: job.created_at
      };
    });
    
    const newKey = 'published_jobs.json';
    const newParams = {
      Bucket: params.Bucket,
      Key: newKey,
      Body: JSON.stringify(formattedPublishedJobs),
      ContentType: 'application/json'
    };
    await s3.putObject(newParams).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data from published works were updated in S3.' })
    };
  } catch (error) {
    console.error('Error when executing Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error.' })
    };
  }
};
