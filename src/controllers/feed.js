const awsService = require('../services/awsService');
const cache = {}; // Object to store cached results

const getPublishedJobs = async (request, response) => {
  try {
    const cacheKey = 'published_jobs'; // Unique cache key for this route
    
    // Check if data is in cache
    if (cache[cacheKey]) {
      console.log('Returning data from cache...');
      return response.status(200).json({ jobs: cache[cacheKey] });
    }
    
    const jobContent = await awsService.getPublishedJobsFromS3();
    
    // Store data in cache for a certain period of time (e.g., 5 minutes)
    cache[cacheKey] = jobContent;
    setTimeout(() => {
      console.log('Removing data from cache...');
      delete cache[cacheKey];
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    return response.status(200).json({ jobs: jobContent });
  } catch (error) {
    console.error('An error has occurred', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getPublishedJobs
};