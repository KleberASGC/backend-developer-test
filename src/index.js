const express = require('express');
const companiesRoutes = require('./routes/companies');
const jobRoutes = require('./routes/job');
const feedRoutes = require('./routes/feed');

const app = express();

app.use(express.json());

app.use('/companies', companiesRoutes);
app.use('/job', jobRoutes);
app.use('/feed', feedRoutes);

app.listen(3333, () => console.log('Server running on port 3333'));