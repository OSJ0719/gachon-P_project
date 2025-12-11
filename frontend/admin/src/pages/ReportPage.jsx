import React, { useState, useEffect } from 'react';
import { getChangeLogs, getChangeLogDetail } from '../api';

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    getChangeLogs().then(res => {
      if (Array.isArray(res)) {
        setReports(res);
        if (res.length > 0) handleSelectReport(res[0].id); // 첫 번째 항목 자동 선택
      }
    });
  }, []);

  const handleSelectReport = async (id) => {
    // 목록 데이터에서 기본 정보 찾기
    const basic = reports.find(r => r.id === id);
    // 상세 정보 API 호출 (AI 요약 등 상세 내용이 필요할 경우)
    const detail = await getChangeLogDetail(id);
    
    // 기본 정보와 상세 정보를 합쳐서 상태 업데이트
    setSelectedReport({ ...basic, ...detail });
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>변경 이력 리포트 관리</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: 'calc(100vh - 180px)' }}>
        {/* 좌측 리포트 목록 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>리포트 목록</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map((report) => (
              <div key={report.id} onClick={() => handleSelectReport(report.id)}>
                <ReportCard 
                  date={report.date} 
                  status={report.status} 
                  title={report.title}
                  desc={report.summary || '상세 내용을 확인하세요.'} // 리스트에 요약이 있으면 표시
                  active={selectedReport?.id === report.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 우측 리포트 상세 검토 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          {selectedReport ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>리포트 상세 검토</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '8px 16px', border: '1px solid #cbd5e1', backgroundColor: 'white', borderRadius: '6px', color: '#475569', cursor: 'pointer', fontWeight: 'bold' }}>반려</button>
                  <button style={{ padding: '8px 16px', border: 'none', backgroundColor: '#ea580c', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>승인 및 배포</button>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>제목</label>
                <div style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                  {selectedReport.title}
                </div>

                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>AI 생성 요약 (수정 가능)</label>
                <textarea 
                  style={{ width: '100%', height: '300px', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', lineHeight: '1.6', color: '#334155', resize: 'none' }}
                  defaultValue={selectedReport.aiSummary || selectedReport.content || "요약 내용이 없습니다."}
                />
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              리포트를 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ReportCard = ({ date, status, title, desc, active }) => {
  const isPending = status === '검토필요';
  return (
    <div style={{ 
      border: active ? '2px solid #ea580c' : '1px solid #e2e8f0', 
      borderRadius: '8px', padding: '16px', cursor: 'pointer',
      backgroundColor: active ? '#fff7ed' : 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>{date}</span>
        <span style={{ 
          backgroundColor: isPending ? '#fef3c7' : '#dcfce7', 
          color: isPending ? '#d97706' : '#16a34a',
          padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' 
        }}>{status}</span>
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#1e293b' }}>{title}</div>
      <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {desc}
      </div>
    </div>
  );
};