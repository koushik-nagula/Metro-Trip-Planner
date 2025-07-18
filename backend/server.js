const express = require('express');
const cors = require('cors');
const plannerRoutes = require('./routes/planner');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/planner', plannerRoutes);

const PORT = process.env.PORT || 5000;
const path = require('path');
const stations = require('./stations.json');

app.get('/stations', (req, res) => {
  res.json(stations);
});

app.listen(PORT, () => {
  console.log(`🚇 Metro Trip Planner backend running on port ${PORT}`);
});
