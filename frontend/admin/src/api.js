// ⚠️ [테스트용] Mock API - 실제 서버와 통신하지 않습니다.
const BASE_URL = "http://localhost:8080";
// 0.5초 딜레이를 주는 헬퍼 함수
const mockDelay = (data) => new Promise(resolve => setTimeout(() => resolve(data), 500));

// =================================================================
// 1. 대시보드
// =================================================================
export const getDashboardSummary = () => mockDelay({
  totalPolicies: 1240,
  dailyReports: 12,
  serverStatus: '정상',
  aiApiCount: 8542
});

// =================================================================
// 2. 등록된 사업 관리 (정책)
// =================================================================
export const getPolicies = (keyword = '', category = '') => {
  console.log(`[Mock] 검색: ${keyword}, 카테고리: ${category}`);
  return mockDelay([
    { id: 1001, title: '2025년 어르신 난방비 지원 사업 1', agency: '보건복지부', date: '2025-11-28' },
    { id: 1002, title: '2025년 어르신 난방비 지원 사업 2', agency: '보건복지부', date: '2025-11-28' },
    { id: 1003, title: '2025년 어르신 난방비 지원 사업 3', agency: '보건복지부', date: '2025-11-28' },
    { id: 1004, title: '2025년 어르신 난방비 지원 사업 4', agency: '보건복지부', date: '2025-11-28' },
    { id: 1005, title: '2025년 어르신 난방비 지원 사업 5', agency: '보건복지부', date: '2025-11-28' },
  ]);
};

export const getPolicyDetail = (policyId) => mockDelay({}); // 상세 조회(생략)

export const createPolicy = (data) => {
  console.log('[Mock] 사업 등록:', data);
  return mockDelay({ success: true });
};

export const updatePolicy = (policyId, data) => {
  console.log('[Mock] 사업 수정:', policyId, data);
  return mockDelay({ success: true });
};

export const deletePolicy = (policyId) => {
  console.log('[Mock] 사업 삭제:', policyId);
  return mockDelay({ success: true });
};

// =================================================================
// 3. 변경 이력 리포트
// =================================================================
export const getChangeLogs = () => mockDelay([
  { 
    id: 1, date: '2025-11-28', status: '검토필요', manager: 'AI Bot', 
    title: '동절기 에너지바우처 지원 금액 변경',
    summary: '산업통상자원부 공고 제2025-123호에 의거하여 지원 금액이 가구당 5만원 인상되었습니다.'
  },
  { 
    id: 2, date: '2025-11-28', status: '완료', manager: '관리자A', 
    title: '노인 일자리 사업 모집 공고 업데이트',
    summary: '2025년도 신규 모집 인원이 확정되어 공고문이 업데이트되었습니다.'
  },
  { 
    id: 3, date: '2025-11-27', status: '완료', manager: '관리자B', 
    title: '기초연금 수급액 인상안 발표',
    summary: '물가상승률을 반영하여 기초연금 수급액이 3.3% 인상됩니다.'
  }
]);

export const getChangeLogDetail = (logId) => mockDelay({
  id: logId,
  title: '동절기 에너지바우처 지원 금액 변경',
  aiSummary: `[변경 사항]\n기존: 1인 가구 248,200원\n변경: 1인 가구 298,200원 (+50,000원)\n\n[AI 분석]\n물가 상승을 고려하여 동절기 난방비 지원 단가가 인상되었습니다. 기존 수급자는 별도 신청 없이 자동으로 인상된 금액이 적용됩니다.`
});

export const checkAiSummary = (data) => mockDelay({ success: true });

// =================================================================
// 4. 서버 관리
// =================================================================
export const getServerMetrics = () => mockDelay({
  apiUptime: '14d 2h 15m',
  aiLatency: '120ms',
  dbConnections: '45/100'
});

export const getServerLogs = () => mockDelay([
  "[INFO] 14:20:01 Fetch API Called - /api/policy/update",
  "[DEBUG] 14:20:02 AI Summary Generation Started",
  "[INFO] 14:20:05 AI Response Success (Latency: 300ms)",
  "[WARN] 14:21:00 High Memory Usage Detected (78%)",
  "[INFO] 14:22:30 Batch Job Completed"
]);