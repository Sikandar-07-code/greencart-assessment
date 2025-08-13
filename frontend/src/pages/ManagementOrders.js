import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const ManagementOrders = () => {
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ orderId: '', value_rs: '', assignedRoute: '', deliveryTimestamp: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch orders and routes for dropdown
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [ordersRes, routesRes] = await Promise.all([
        axios.get('http://localhost:4000/api/orders'),
        axios.get('http://localhost:4000/api/routes')
      ]);
      setOrders(ordersRes.data);
      setRoutes(routesRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const resetForm = () => {
    setForm({ orderId: '', value_rs: '', assignedRoute: '', deliveryTimestamp: '' });
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.orderId || !form.value_rs || !form.assignedRoute || !form.deliveryTimestamp) {
      setError('Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:4000/api/orders/${editingId}`, {
          orderId: form.orderId,
          value_rs: Number(form.value_rs),
          assignedRoute: form.assignedRoute,
          deliveryTimestamp: form.deliveryTimestamp,
        });
      } else {
        await axios.post('http://localhost:4000/api/orders', {
          orderId: form.orderId,
          value_rs: Number(form.value_rs),
          assignedRoute: form.assignedRoute,
          deliveryTimestamp: form.deliveryTimestamp,
        });
      }
      resetForm();
      fetchOrders();
    } catch (err) {
      setError('Failed to save order');
    }
  };

  const handleEdit = (order) => {
    setForm({
      orderId: order.orderId,
      value_rs: order.value_rs,
      assignedRoute: order.assignedRoute,
      deliveryTimestamp: order.deliveryTimestamp,
    });
    setEditingId(order._id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/orders/${id}`);
      fetchOrders();
    } catch (err) {
      setError('Failed to delete order');
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
        <h1>Manage Orders</h1>

        <form onSubmit={handleSubmit} style={{ marginBottom: 30, display: 'flex', gap: 15, flexWrap: 'wrap' }}>
          <input
            name="orderId"
            placeholder="Order ID"
            value={form.orderId}
            onChange={handleChange}
            style={{ flex: '1 1 150px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <input
            name="value_rs"
            type="number"
            min="0"
            placeholder="Order Value (₹)"
            value={form.value_rs}
            onChange={handleChange}
            style={{ flex: '1 1 150px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          />
          <select
            name="assignedRoute"
            value={form.assignedRoute}
            onChange={handleChange}
            style={{ flex: '1 1 150px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
          >
            <option value="">Select Route</option>
            {routes.map(route => (
              <option key={route._id} value={route._id}>{route.routeID || route._id}</option>
            ))}
          </select>
          <input
            name="deliveryTimestamp"
            type="datetime-local"
            placeholder="Delivery Timestamp"
            value={form.deliveryTimestamp}
            onChange={handleChange}
            style={{ flex: '1 1 200px', padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
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
            {editingId ? 'Update Order' : 'Add Order'}
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
          <p>Loading orders...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Order ID</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Value (₹)</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Assigned Route</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Delivery Timestamp</th>
                <th style={{ padding: 10, border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{order.orderId}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>₹{order.value_rs}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{order.assignedRoute}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>{new Date(order.deliveryTimestamp).toLocaleString()}</td>
                  <td style={{ padding: 10, border: '1px solid #ddd' }}>
                    <button onClick={() => handleEdit(order)} style={{ marginRight: 10, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(order._id)} style={{ cursor: 'pointer', color: 'red' }}>Delete</button>
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

export default ManagementOrders;
