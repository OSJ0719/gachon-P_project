import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PolicyPage from './pages/PolicyPage';
import ReportPage from './pages/ReportPage';
import ServerPage from './pages/ServerPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="policies" element={<PolicyPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="server" element={<ServerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;