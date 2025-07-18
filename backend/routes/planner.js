const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { findShortestPath } = require('../utils/dijkstra');

// Load metro graph
const edges = JSON.parse(fs.readFileSync(path.join(__dirname, '../edges.json'), 'utf-8'));

// Build adjacency list once
const graph = {};
edges.forEach(edge => {
  if (!graph[edge.from]) graph[edge.from] = [];
  graph[edge.from].push({ ...edge });
});

router.post('/', (req, res) => {
  const { source, destination, mode } = req.body; // mode: 'time' or 'fare'

  if (!source || !destination || !mode)
    return res.status(400).json({ error: 'source, destination, and mode are required' });

  const result = findShortestPath(graph, source, destination, mode);
  if (!result) return res.status(404).json({ error: 'No path found' });
    let totalFare = 0;
  for (let i = 0; i < result.path.length - 1; i++) {
    const from = result.path[i];
    const to = result.path[i + 1];
    const edge = graph[from].find(n => n.to === to);
    totalFare += edge.fare;
  }
  res.json({
    path: result.path,
    totalTime: result.total, 
    totalFare
  });
});

module.exports = router;
