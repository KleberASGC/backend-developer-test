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
cd your-repository
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
