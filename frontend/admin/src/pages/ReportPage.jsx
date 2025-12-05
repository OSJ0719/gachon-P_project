import React from 'react';

export default function ReportPage() {
  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px' }}>변경 이력 리포트 관리</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: 'calc(100vh - 180px)' }}>
        {/* 1. 좌측 리포트 목록 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>리포트 목록</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ReportCard 
              date="2025-11-28" status="검토필요" active={true}
              title="동절기 에너지바우처 지원 금액 변경"
              desc="산업통상자원부 공고 제2025-123호에 의거하여 지원 금액이 가구당 5만원 인상되었습니다."
            />
            <ReportCard 
              date="2025-11-28" status="완료"
              title="동절기 에너지바우처 지원 금액 변경"
              desc="산업통상자원부 공고 제2025-123호에 의거하여 지원 금액이 가구당 5만원 인상되었습니다."
            />
             <ReportCard 
              date="2025-11-28" status="완료"
              title="동절기 에너지바우처 지원 금액 변경"
              desc="기존 지원 사업 기간 연장에 따른 업데이트 건입니다."
            />
          </div>
        </div>

        {/* 2. 우측 리포트 상세 검토 */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column' }}>
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
              동절기 에너지바우처 지원 금액 변경
            </div>

            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>AI 생성 요약 (수정 가능)</label>
            <textarea 
              style={{ width: '100%', height: '300px', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', lineHeight: '1.6', color: '#334155', resize: 'none' }}
              defaultValue={`[변경 사항]\n기존: 1인 가구 248,200원\n변경: 1인 가구 298,200원 (+50,000원)\n\n[AI 분석]\n물가 상승을 고려하여 동절기 난방비 지원 단가가 인상되었습니다. 기존 수급자는 별도 신청 없이 자동으로 인상된 금액이 적용됩니다.\n\n[적용 대상]\n생계/의료급여 수급자 중 노인, 장애인, 영유아 포함 가구`}
            />
          </div>
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
      <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.4' }}>{desc}</div>
    </div>
  );
};