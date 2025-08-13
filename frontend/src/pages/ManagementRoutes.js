import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const ManagementRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ routeId: '', distance: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch routes
  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/routes');
      setRoutes(res.data);
    } catch (err) {
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
    setForm({ routeId: '', distance: '' });
    setEditingId(null);
    setError('');
  };

  // Add or update route
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.routeId || !form.distance) {
      setError('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:4000/api/routes/${editingId}`, {
          routeId: form.routeId,
          distance: Number(form.distance),
        });
      } else {
        await axios.post('http://localhost:4000/api/routes', {
          routeId: form.routeId,
          distance: Number(form.distance),
        });
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
      distance: route.distance,
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
      <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
        <h1>Manage Routes</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: 30, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
          <input
            name="routeId"
            placeholder="Route ID"
            value={form.routeId}
            onChange={handleChange}
            style={{ flex: '1 1 200px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            name="distance"
            type="number"
            min="0"
            placeholder="Distance (km)"
            value={form.distance}
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
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route._id}>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{route.routeId}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{route.distance}</td>
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
