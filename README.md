# Backend Developer Technical Assessment

## Setup and Execution Instructions:

To get started with the application, follow these setup instructions:

### 1. Clone the Repository and Switch to the 'klebercurvelo' Branch

First, clone the repository from GitHub and switch to the 'klebercurvelo' branch:

```bash
git clone -b klebercurvelo https://github.com/KleberASGC/backend-developer-test.git
```

### 2. Install Dependencies

Navigate to the directory where you cloned the repository and install the dependencies using npm:

```bash
cd backend-developer-test
npm install
```

This will install all the necessary dependencies for the project.

### 3. Configure Database Connection

Next, you'll need to configure the database connection by updating the values of the environment variables in the `.env` file. Open the `.env` file and modify the following variables:

```bash
POSTGRES_HOST=your-database-host
POSTGRES_PORT=your-database-port
POSTGRES_USER=your-database-user
POSTGRES_DB=your-database-name
POSTGRES_PASSWORD=your-database-password
```

Replace `your-database-host`, `your-database-port`, `your-database-user`, `your-database-name` and `your-database-password` with the appropriate values for your database configuration.

### 4. Run the Application

Once you've configured the database connection, you can run the application using the following command:

```bash
npm run start:dev
```
This will start the application in development mode.

### Bonus Questions

1. Discuss scalability solutions for the job moderation feature under high load conditions. Consider that over time the system usage grows significantly, to the point where we will have thousands of jobs published every hour. Consider the API will be able to handle the requests, but the serverless component will be overwhelmed with requests to moderate the jobs. This will affect the database connections and calls to the OpenAI API. How would you handle those issues and what solutions would you implement to mitigate the issues?

> I believe that a good way to solve this problem and avoid overloading the serverless components would be not to consume the service directly when receiving the request through the API. For example: let's say we're receiving thousands of requests to publish job listings on our platform, what I suggest is, instead of uploading the job listing to S3 with each request, the request can be modified to simply update the status of the Job in the database (to an intermediary status, something like 'waiting_upload') and then we configure another service to run periodically, which retrieves these Jobs with this status, uploads them to S3, and if everything goes well, updates their statuses in the database to 'published'. This gives us control over how many calls to the service will be made in a certain period of time and prevents the AWS service from being overloaded by being called thousands of times in a scenario with thousands of requests.

2. Propose a strategy for delivering the job feed globally with sub-millisecond latency. Consider now that we need to provide a low latency endpoint that can serve the job feed content worldwide. Using AWS as a cloud provider, what technologies would you need to use to implement this feature and how would you do it?

>While I haven't directly utilized CloudFront, Lambda@Edge, or Amazon Route 53, my research suggests their suitability for our goal of delivering the job feed globally with sub-millisecond latency. CloudFront's edge caching optimizes content distribution worldwide, while Lambda@Edge enables personalized content delivery based on user location. Additionally, Amazon Route 53 efficiently directs users to the nearest CloudFront edge location, minimizing latency. Despite lacking direct experience, these services appear well-suited for our requirements, warranting further exploration and testing to confirm their effectiveness in our scenario.