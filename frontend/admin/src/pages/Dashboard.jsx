import React from 'react';
import { FileText, FileBarChart, Server, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>대시보드</h2>
      
      {/* 1. 상단 카드 4개 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <StatCard icon={<FileText size={24} color="#3b82f6" />} bg="#eff6ff" title="총 등록 사업" value="1,240" />
        <StatCard icon={<FileBarChart size={24} color="#a855f7" />} bg="#f3e8ff" title="오늘 수집된 리포트" value="12" />
        <StatCard icon={<Server size={24} color="#22c55e" />} bg="#dcfce7" title="서버 상태" value="정상" color="#22c55e" />
        <StatCard icon={<RefreshCw size={24} color="#f97316" />} bg="#ffedd5" title="AI API 요청 수" value="8,542" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* 2. 최근 변경 이력 리포트 테이블 */}
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
              <ReportRow date="2025-11-28" title="2025년 동절기 에너지바우처 지침 변경" status="검토필요" user="AI Bot" />
              <ReportRow date="2025-11-28" title="노인 일자리 사업 모집 공고 업데이트" status="완료" user="관리자A" />
              <ReportRow date="2025-11-27" title="기초연금 수급액 인상안 발표" status="완료" user="관리자B" />
            </tbody>
          </table>
        </div>

        {/* 3. 실시간 서버 로그 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>실시간 서버 로그</h3>
          <div style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: '8px', padding: '16px', color: '#22c55e', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.6' }}>
            <div>[INFO] 14:20:01 Fetch API Called - /api/policy/update</div>
            <div style={{ color: '#3b82f6' }}>[DEBUG] 14:20:02 AI Summary Generation Started</div>
            <div>[INFO] 14:20:05 AI Response Success (Latency: 300ms)</div>
            <div style={{ color: '#eab308' }}>[WARN] 14:21:00 High Memory Usage Detected (78%)</div>
            <div>[INFO] 14:22:30 Batch Job Completed</div>
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