import React, { useEffect, useState } from 'react';
import { FileText, FileBarChart, Server, RefreshCw } from 'lucide-react';
import { getDashboardSummary, getChangeLogs, getServerLogs } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPolicies: 0,
    dailyReports: 0,
    serverStatus: 'CHECKING',
    aiApiCount: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [serverLogs, setServerLogs] = useState([]);

  useEffect(() => {
    // 1. 대시보드 요약 정보 조회
    getDashboardSummary().then(res => {
      if(res) setStats(res); 
    });

    // 2. 최근 변경 이력 (상위 3개만 표시한다고 가정)
    getChangeLogs().then(res => {
      if(Array.isArray(res)) setRecentLogs(res.slice(0, 3));
    });

    // 3. 실시간 서버 로그
    getServerLogs().then(res => {
      if(Array.isArray(res)) setServerLogs(res);
    });
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>대시보드</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <StatCard icon={<FileText size={24} color="#3b82f6" />} bg="#eff6ff" title="총 등록 사업" value={stats.totalPolicies} />
        <StatCard icon={<FileBarChart size={24} color="#a855f7" />} bg="#f3e8ff" title="오늘 수집된 리포트" value={stats.dailyReports} />
        <StatCard icon={<Server size={24} color="#22c55e" />} bg="#dcfce7" title="서버 상태" value={stats.serverStatus} color={stats.serverStatus === '정상' ? '#22c55e' : '#ea580c'} />
        <StatCard icon={<RefreshCw size={24} color="#f97316" />} bg="#ffedd5" title="AI API 요청 수" value={stats.aiApiCount} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* 최근 리포트 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>최근 변경 이력 리포트</h3>
            <span style={{ fontSize: '14px', color: '#3b82f6', cursor: 'pointer' }}>전체보기</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ textAlign: 'left', paddingBottom: '12px' }}>날짜</th>
                <th style={{ textAlign: 'left', paddingBottom: '12px' }}>리포트 제목</th>
                <th style={{ textAlign: 'center', paddingBottom: '12px' }}>상태</th>
                <th style={{ textAlign: 'center', paddingBottom: '12px' }}>담당자</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log, idx) => (
                <ReportRow key={idx} date={log.date} title={log.title} status={log.status} user={log.manager} />
              ))}
            </tbody>
          </table>
        </div>

        {/* 서버 로그 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '400px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>실시간 서버 로그</h3>
          <div style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: '8px', padding: '16px', color: '#22c55e', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6', overflowY: 'auto' }}>
            {serverLogs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, bg, title, value, color = '#1e293b' }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '14px', color: '#64748b' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
    </div>
  </div>
);

const ReportRow = ({ date, title, status, user }) => {
  const isPending = status === '검토필요';
  return (
    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
      <td style={{ padding: '12px 0', color: '#64748b' }}>{date}</td>
      <td style={{ padding: '12px 0', fontWeight: '500' }}>{title}</td>
      <td style={{ textAlign: 'center' }}>
        <span style={{ 
          backgroundColor: isPending ? '#fef3c7' : '#dcfce7', 
          color: isPending ? '#d97706' : '#16a34a',
          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' 
        }}>{status}</span>
      </td>
      <td style={{ textAlign: 'center', color: '#64748b' }}>{user}</td>
    </tr>
  );
};