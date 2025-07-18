import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlannerForm.css';

const PlannerForm = () => {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load stations list from backend
    axios.get('http://localhost:5000/stations')
      .then(res => setStations(res.data))
      .catch(() => setError('Failed to load station list.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    if (!source || !destination || source === destination) {
      setError('Please select different source and destination stations.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/planner', {
        source,
        destination,
        mode: 'time' // default mode
      });
      setResult(res.data);
    } catch (err) {
      setError('Could not find route or server error.');
    }
  };

  return (
    <div className="container">
      <h2>🚇 Hyderabad Metro Trip Planner</h2>
      <form onSubmit={handleSubmit}>
        <label>From:</label>
        <select value={source} onChange={e => setSource(e.target.value)}>
          <option value="">-- Select Source --</option>
          {stations.map(st => (
            <option key={st.name} value={st.name}>{st.name}</option>
          ))}
        </select>

        <label>To:</label>
        <select value={destination} onChange={e => setDestination(e.target.value)}>
          <option value="">-- Select Destination --</option>
          {stations.map(st => (
            <option key={st.name} value={st.name}>{st.name}</option>
          ))}
        </select>

        <button type="submit">Plan Trip</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h4>🛤 Route:</h4>
          <p><strong>Stations:</strong> {result.path.join(' → ')}</p>
          <p><strong>Total Time:</strong> {result.totalTime} minutes</p>
          <p><strong>Estimated Fare:</strong> ₹{result.totalFare}</p>
        </div>
      )}
    </div>
  );
};

export default PlannerForm;
