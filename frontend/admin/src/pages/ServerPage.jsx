import React, { useEffect, useState } from 'react';
import { getServerMetrics, getServerLogs } from '../api';

export default function ServerPage() {
  const [metrics, setMetrics] = useState({
    apiUptime: '-',
    aiLatency: '-',
    dbConnections: '-'
  });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getServerMetrics().then(res => { if(res) setMetrics(res); });
    getServerLogs().then(res => { if(Array.isArray(res)) setLogs(res); });
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>서버 관리 및 로그</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 1. 운영 상태 점검 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>운영 상태 점검</h3>
          
          <StatusItem title="Spring Boot API Server" desc={`Uptime: ${metrics.apiUptime}`} />
          <StatusItem title="AI Model Server (Gemma)" desc={`Latency: ${metrics.aiLatency}`} />
          <StatusItem title="Database (PostgreSQL)" desc={`Connections: ${metrics.dbConnections}`} />
        </div>

        {/* 2. 시스템 로그 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>시스템 로그 (Real-time)</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '4px 12px', border: '1px solid #cbd5e1', backgroundColor: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Clear</button>
              <button style={{ padding: '4px 12px', border: '1px solid #cbd5e1', backgroundColor: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Export</button>
            </div>
          </div>
          
          <div style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: '8px', padding: '16px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ color: log.includes('[ERROR]') ? '#ef4444' : log.includes('[WARN]') ? '#eab308' : '#22c55e' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatusItem = ({ title, desc }) => (
  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', marginBottom: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
    <div style={{ width: '12px', height: '12px', borderRadius: '6px', backgroundColor: '#22c55e', marginRight: '16px' }}></div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>{title}</div>
      <div style={{ fontSize: '14px', color: '#64748b' }}>{desc}</div>
    </div>
  </div>
);