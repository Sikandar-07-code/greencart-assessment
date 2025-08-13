import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import Header from '../components/Header';

const COLORS = ['#4CAF50', '#FF6384']; // Green for On-time, Red for Late

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    // Fetch KPI data from backend
    axios.get('http://localhost:4000/api/simulation/latest')  // replace with deployed URL if needed
      .then(res => setKpis(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!kpis) return <p style={{ padding: 20 }}>Loading dashboard...</p>;

  const onTimeLateData = [
    { name: 'On-time Deliveries', value: kpis.onTimeDeliveries },
    { name: 'Late Deliveries', value: kpis.lateDeliveries }
  ];

  const fuelCostData = [
    { name: 'Base Fuel Cost', value: kpis.baseFuelCost },
    { name: 'Traffic Surcharge', value: kpis.trafficSurcharge }
  ];

  return (
    <>
      <Header />
      <div style={{ padding: '30px', maxWidth: '1200px', margin: 'auto' }}>
        <h1 style={{ marginBottom: '30px', color: '#222' }}>Dashboard</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          <Card title="Total Profit">
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>
              ₹{kpis.totalProfit.toLocaleString()}
            </p>
          </Card>

          <Card title="Efficiency Score">
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>
              {kpis.efficiencyScore.toFixed(2)}%
            </p>
          </Card>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px'
          }}
        >
          <Card title="On-time vs Late Deliveries">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={onTimeLateData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {onTimeLateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Fuel Cost Breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={fuelCostData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
