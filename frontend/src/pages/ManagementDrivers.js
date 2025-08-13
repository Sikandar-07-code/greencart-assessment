import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import ManagementMenu from '../components/ManagementMenu';

import Card from '../components/Card';

const ManagementDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', currentShiftHours: '', past7DayHours: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch all drivers
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reset form
  const resetForm = () => {
    setForm({ name: '', currentShiftHours: '', past7DayHours: '' });
    setEditingId(null);
    setError('');
  };

  // Add or update driver
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.currentShiftHours || !form.past7DayHours) {
      setError('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        // Update
        await axios.put(`http://localhost:4000/api/drivers/${editingId}`, {
          name: form.name,
          currentShiftHours: Number(form.currentShiftHours),
          past7DayHours: Number(form.past7DayHours),
        });
      } else {
        // Create
        await axios.post('http://localhost:4000/api/drivers', {
          name: form.name,
          currentShiftHours: Number(form.currentShiftHours),
          past7DayHours: Number(form.past7DayHours),
        });
      }
      resetForm();
      fetchDrivers();
    } catch (err) {
      setError('Failed to save driver');
    }
  };

  // Edit driver
  const handleEdit = (driver) => {
    setForm({
      name: driver.name,
      currentShiftHours: driver.currentShiftHours,
      past7DayHours: driver.past7DayHours,
    });
    setEditingId(driver._id);
    setError('');
  };

  // Delete driver
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/drivers/${id}`);
      fetchDrivers();
    } catch (err) {
      setError('Failed to delete driver');
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
        <h1>Manage Drivers</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: 30, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
          <input
            name="name"
            placeholder="Driver Name"
            value={form.name}
            onChange={handleChange}
            style={{ flex: '1 1 200px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            name="currentShiftHours"
            type="number"
            min="0"
            placeholder="Current Shift Hours"
            value={form.currentShiftHours}
            onChange={handleChange}
            style={{ flex: '1 1 150px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            name="past7DayHours"
            type="number"
            min="0"
            placeholder="Past 7-Day Work Hours"
            value={form.past7DayHours}
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
            {editingId ? 'Update Driver' : 'Add Driver'}
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
          <p>Loading drivers...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Current Shift Hours</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Past 7-Day Hours</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver._id}>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{driver.name}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{driver.currentShiftHours}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{driver.past7DayHours}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleEdit(driver)}
                      style={{ marginRight: 10, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(driver._id)}
                      style={{ cursor: 'pointer', color: 'red' }}
                    >
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

export default ManagementDrivers;
