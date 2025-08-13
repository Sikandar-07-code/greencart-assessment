import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const ManagementRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    routeId: '',
    distanceKm: '',
    trafficLevel: 'Low',
    baseTime: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch all routes
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/routes');
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reset form
  const resetForm = () => {
    setForm({
      routeId: '',
      distanceKm: '',
      trafficLevel: 'Low',
      baseTime: '',
    });
    setEditingId(null);
    setError('');
  };

  // Add or update route
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.routeId || !form.distanceKm || !form.baseTime) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        routeId: form.routeId,
        distanceKm: Number(form.distanceKm),
        trafficLevel: form.trafficLevel,
        baseTime: Number(form.baseTime),
      };

      if (editingId) {
        await axios.put(`http://localhost:4000/api/routes/${editingId}`, payload);
      } else {
        await axios.post('http://localhost:4000/api/routes', payload);
      }
      resetForm();
      fetchRoutes();
    } catch (err) {
      setError('Failed to save route');
    }
  };

  // Edit route
  const handleEdit = (route) => {
    setForm({
      routeId: route.routeId,
      distanceKm: route.distanceKm,
      trafficLevel: route.trafficLevel,
      baseTime: route.baseTime,
    });
    setEditingId(route._id);
    setError('');
  };

  // Delete route
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/routes/${id}`);
      fetchRoutes();
    } catch (err) {
      setError('Failed to delete route');
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
        <h1>Manage Routes</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: 30, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
          <input
            name="routeId"
            placeholder="Route ID"
            value={form.routeId}
            onChange={handleChange}
            style={{ flex: '1 1 150px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            name="distanceKm"
            type="number"
            min="0"
            placeholder="Distance (km)"
            value={form.distanceKm}
            onChange={handleChange}
            style={{ flex: '1 1 120px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <select
            name="trafficLevel"
            value={form.trafficLevel}
            onChange={handleChange}
            style={{ flex: '1 1 120px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            name="baseTime"
            type="number"
            min="0"
            placeholder="Base Time (minutes)"
            value={form.baseTime}
            onChange={handleChange}
            style={{ flex: '1 1 150px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              flex: '0 0 auto',
            }}
          >
            {editingId ? 'Update Route' : 'Add Route'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 5,
                cursor: 'pointer',
                flex: '0 0 auto',
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Loading routes...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Route ID</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Distance (km)</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Traffic Level</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Base Time (min)</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route._id}>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{route.routeId}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{route.distanceKm}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{route.trafficLevel}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{route.baseTime}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>
                    <button onClick={() => handleEdit(route)} style={{ marginRight: 10, cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(route._id)} style={{ cursor: 'pointer', color: 'red' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ManagementRoutes;
