import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Management from './pages/Management';
import ManagementOrders from './pages/ManagementOrders';
import ManagementRoutes from './pages/ManagementRoutes';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/management/orders"
  element={
    <ProtectedRoute>
      <ManagementOrders />
    </ProtectedRoute>
  }
/>

        <Route
          path="/simulation"
          element={
            <ProtectedRoute>
              <Simulation />
            </ProtectedRoute>
          }
        />
        <Route
         path="/management/routes"
         element={
           <ProtectedRoute>
      <ManagementRoutes />
    </ProtectedRoute>
  }
/>     
        

        <Route
          path="/management"
          element={
            <ProtectedRoute>
              <Management />
            </ProtectedRoute>
          }
        />

        {/* Redirect all other paths to Dashboard if logged in */}
        <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/management" element={<ProtectedRoute><Management /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
