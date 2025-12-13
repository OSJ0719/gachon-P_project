import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PolicyPage from './pages/PolicyPage';
import ReportPage from './pages/ReportPage';
import ServerPage from './pages/ServerPage';

function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        {/* 메인 레이아웃 + 대시보드 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="policies" element={<PolicyPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="server" element={<ServerPage />} />
        </Route>

        {/* 🔥 /index.html 로 들어오는 경우 / 로 강제 리다이렉트 */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;