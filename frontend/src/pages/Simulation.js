import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Simulation = () => {
  const [form, setForm] = useState({
    numberOfDrivers: '',
    routeStartTime: '',
    maxHoursPerDriver: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!form.numberOfDrivers || !form.routeStartTime || !form.maxHoursPerDriver) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/simulation/run', {
        numberOfDrivers: Number(form.numberOfDrivers),
        routeStartTime: form.routeStartTime,
        maxHoursPerDriver: Number(form.maxHoursPerDriver),
      });
      setResult(res.data);
    } catch (err) {
      setError('Simulation failed. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
        <h1>Run Simulation</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input
            type="number"
            name="numberOfDrivers"
            placeholder="Number of Drivers"
            value={form.numberOfDrivers}
            onChange={handleChange}
            min="1"
            style={{ padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            type="time"
            name="routeStartTime"
            placeholder="Route Start Time"
            value={form.routeStartTime}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            type="number"
            name="maxHoursPerDriver"
            placeholder="Max Hours per Driver"
            value={form.maxHoursPerDriver}
            onChange={handleChange}
            min="1"
            style={{ padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: 10, backgroundColor: '#2196F3', color: 'white', borderRadius: 5, fontWeight: 'bold' }}
          >
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: 20 }}>{error}</p>}

        {result && (
          <div style={{ marginTop: 30 }}>
            <h2>Simulation Results</h2>
            <p><strong>Total Profit:</strong> ₹{result.totalProfit.toLocaleString()}</p>
            <p><strong>Efficiency Score:</strong> {result.efficiencyScore.toFixed(2)}%</p>
            {/* Add charts or more KPI displays here later */}
          </div>
        )}
      </div>
    </>
  );
};

export default Simulation;
