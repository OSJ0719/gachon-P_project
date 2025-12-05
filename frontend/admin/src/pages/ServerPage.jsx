import React from 'react';

export default function ServerPage() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>서버 관리 및 로그</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 1. 운영 상태 점검 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>운영 상태 점검</h3>
          
          <StatusItem title="Spring Boot API Server" desc="Uptime: 14d 2h 15m" />
          <StatusItem title="AI Model Server (Gemma)" desc="Latency: 120ms" />
          <StatusItem title="Database (PostgreSQL)" desc="Connections: 45/100" />
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
            <div style={{ color: '#94a3b8' }}>2025-11-28 14:20:00 [INFO] System Monitor Started</div>
            <div style={{ color: '#22c55e' }}>2025-11-28 14:20:01 [INFO] Fetch API: Crawling Success (Target: bokjiro.go.kr)</div>
            <div style={{ color: '#3b82f6' }}>2025-11-28 14:20:02 [DEBUG] AI Request: Summarize Text (Length: 1500 chars)</div>
            <div style={{ color: '#22c55e' }}>2025-11-28 14:20:05 [INFO] AI Response: Success (Token Usage: 350)</div>
            <div style={{ color: '#eab308' }}>2025-11-28 14:21:00 [WARN] Memory Usage Spike: 78% - Optimizing...</div>
            <div style={{ color: '#22c55e' }}>2025-11-28 14:21:05 [INFO] Garbage Collection Completed</div>
            <div style={{ color: '#ef4444' }}>2025-11-28 14:25:00 [ERROR] Image OCR Failed (User ID: 8821, Reason: Low Quality)</div>
            <div style={{ color: '#94a3b8' }}>2025-11-28 14:25:01 [INFO] Retry logic triggered...</div>
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