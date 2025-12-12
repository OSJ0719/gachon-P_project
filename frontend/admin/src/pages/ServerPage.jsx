import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { getServerLogs, getServerMetrics } from '../api';

export default function ServerPage() {
  const [metrics, setMetrics] = useState({
    api: { status: '-', uptime: '-' },
    ai: { status: '-', latencyMs: 0 },
    db: { status: '-', active: 0, max: 0 },
  });

  const [logs, setLogs] = useState([]);

  const loadMetricsAndLogs = async () => {
    // 1) 서버 메트릭
    const metricsRes = await getServerMetrics();
    if (metricsRes && metricsRes.success && metricsRes.data) {
      const data = metricsRes.data; // { api, ai, db }

      setMetrics({
        api: {
          status: data.api?.status ?? '-',
          uptime: data.api?.uptime ?? '-',
        },
        ai: {
          status: data.ai?.status ?? '-',
          latencyMs: data.ai?.latencyMs ?? 0,
        },
        db: {
          status: data.db?.status ?? '-',
          active: data.db?.active ?? 0,
          max: data.db?.max ?? 0,
        },
      });
    }

    // 2) 서버 로그
    const logsRes = await getServerLogs();
    if (logsRes && logsRes.success && logsRes.data) {
      const data = logsRes.data;
      // 백엔드가 [ "2025-... [INFO] xxx", ... ] or { logs: [...] } 중 어떤 걸 주더라도 대응
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.logs)
        ? data.logs
        : [];

      setLogs(list);
    }
  };

  useEffect(() => {
    loadMetricsAndLogs();
  }, []);

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExportLogs = () => {
    if (!logs.length) return;
    const blob = new Blob([logs.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `server-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

=======
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

>>>>>>> ca6d91913bd473678d8f7e37f37286ee52ffcb6b
  return (
    <div>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '24px',
        }}
      >
        서버 관리 및 로그
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* 1. 운영 상태 점검 */}
<<<<<<< HEAD
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '24px',
            }}
          >
            운영 상태 점검
          </h3>

          <StatusItem
            title="Spring Boot API Server"
            desc={`Uptime: ${metrics.api.uptime}`}
          />
          <StatusItem
            title="AI Model Server (Gemma)"
            desc={`Latency: ${metrics.ai.latencyMs} ms`}
          />
          <StatusItem
            title="Database (MySQL)"
            desc={`Connections: ${metrics.db.active} / ${metrics.db.max}`}
          />
=======
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>운영 상태 점검</h3>
          
          <StatusItem title="Spring Boot API Server" desc={`Uptime: ${metrics.apiUptime}`} />
          <StatusItem title="AI Model Server (Gemma)" desc={`Latency: ${metrics.aiLatency}`} />
          <StatusItem title="Database (PostgreSQL)" desc={`Connections: ${metrics.dbConnections}`} />
>>>>>>> ca6d91913bd473678d8f7e37f37286ee52ffcb6b
        </div>

        {/* 2. 시스템 로그 */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              시스템 로그 (Real-time)
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleClearLogs}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
              <button
                onClick={handleExportLogs}
                style={{
                  padding: '4px 12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Export
              </button>
            </div>
          </div>
<<<<<<< HEAD

          <div
            style={{
              flex: 1,
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '1.8',
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: '#64748b' }}>표시할 로그가 없습니다.</div>
            ) : (
              logs.map((log, idx) => {
              // 1️⃣ 문자열 로그인 경우
                if (typeof log === 'string') {
                  const color = log.includes('[ERROR]')
                    ? '#ef4444'
                    : log.includes('[WARN]')
                    ? '#eab308'
                    : '#22c55e';

                  return (
                    <div key={idx} style={{ color }}>
                      {log}
                    </div>
                  );
                }

                // 2️⃣ 객체 로그(DashboardLogLineDto)인 경우
                const level = log.level?.toUpperCase() ?? 'INFO';
                const color =
                  level === 'ERROR'
                    ? '#ef4444'
                    : level === 'WARN'
                    ? '#eab308'
                    : '#22c55e';

                return (
                  <div key={idx} style={{ color }}>
                    <span style={{ color: '#9ca3af' }}>
                      [{log.time}]
                    </span>{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      [{level}]
                    </span>{' '}
                    <span>{log.message}</span>
                  </div>
                );
              })
            )}
=======
          
          <div style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: '8px', padding: '16px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ color: log.includes('[ERROR]') ? '#ef4444' : log.includes('[WARN]') ? '#eab308' : '#22c55e' }}>
                {log}
              </div>
            ))}
>>>>>>> ca6d91913bd473678d8f7e37f37286ee52ffcb6b
          </div>
        </div>
      </div>
    </div>
  );
}

const StatusItem = ({ title, desc }) => (
  <div
    style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}
  >
    <div
      style={{
        width: '12px',
        height: '12px',
        borderRadius: '6px',
        backgroundColor: '#22c55e',
        marginRight: '16px',
      }}
    />
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#1e293b',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#64748b',
        }}
      >
        {desc}
      </div>
    </div>
  </div>
);