function findShortestPath(graph, start, end, mode = 'time') {
  const pq = new Map(); // station -> { cost, path }
  const visited = new Set();

  pq.set(start, { cost: 0, path: [start] });

  while (pq.size > 0) {
    const [current, { cost, path }] = [...pq.entries()].reduce((a, b) => (a[1].cost < b[1].cost ? a : b));
    pq.delete(current);

    if (current === end) return { path, total: cost };

    if (visited.has(current)) continue;
    visited.add(current);

    (graph[current] || []).forEach(neighbor => {
      if (visited.has(neighbor.to)) return;

      const weight = neighbor[mode]; // either time or fare
      const newCost = cost + weight;

      if (!pq.has(neighbor.to) || pq.get(neighbor.to).cost > newCost) {
        pq.set(neighbor.to, {
          cost: newCost,
          path: [...path, neighbor.to]
        });
      }
    });
  }

  return null;
}

module.exports = { findShortestPath };
