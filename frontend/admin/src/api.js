<<<<<<< HEAD
import axios from 'axios';

// 백엔드 서버 기본 URL
// - 로컬 개발 시: http://localhost:8080
// - 배포 시: 실제 서버 주소로 교체
const ADMIN_BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: ADMIN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 공통 요청 래퍼
const request = async (url, options = {}) => {
  const { method = 'GET', params, data } = options;

=======
const BASE_URL = "http://localhost:8080"; // 백엔드 서버 주소

const request = async (endpoint, options = {}) => {
>>>>>>> ca6d91913bd473678d8f7e37f37286ee52ffcb6b
  try {
    const res = await instance.request({
      url,
      method,
      params,
      data,
    });
<<<<<<< HEAD
    return {
      success: true,
      data: res.data,
      status: res.status,
    };
  } catch (error) {
    console.error('[ADMIN API ERROR]', method, url, error);

    const status = error.response?.status ?? 0;
    const resData = error.response?.data;

    return {
      success: false,
      status,
      data: resData,
      message:
        resData?.message ||
        resData?.error ||
        '서버 요청 중 오류가 발생했습니다.',
    };
  }
};

// ======================================================================
// 1. 대시보드 (AdminDashboardController /api/admin/dashboard/...)
// ======================================================================

// 요약 카드 + 최근 변경 이력
export const getDashboardSummary = () =>
  request('/api/admin/dashboard', {
    method: 'GET',
  });


// ======================================================================
// 2. 정책 관리 (AdminPolicyController /api/admin/policies)
// ======================================================================

/**
 * 정책 검색 / 목록 조회
 *  - 백엔드: GET /api/admin/policies
 *  - 쿼리 파라미터 예시:
 *      ?keyword=노인&categoryCode=E0101&regionCtpv=서울특별시
 */
export const getPolicies = (params) =>
  request('/api/admin/policies', {
    method: 'GET',
    params,
  });

/**
 * 정책 상세 조회
 *  - GET /api/admin/policies/{id}
 */
export const getPolicyDetail = (id) =>
  request(`/api/admin/policies/${id}`, {
    method: 'GET',
  });

/**
 * 정책 수정
 *  - PUT /api/admin/policies/{id}
 *  - body: AdminPolicyUpdateRequest
 */
export const updatePolicy = (id, data) =>
  request(`/api/admin/policies/${id}`, {
    method: 'PUT',
    data,
  });

  export const deletePolicy = (policyId) => 
  request(`/admin/policies/${policyId}`, { method: 'DELETE' });


// ======================================================================
// 3. 변경 로그 / 변경 내역 레포트
//    - ChangeLog: /api/admin/change-logs
//    - Report   : /api/admin/reports
// ======================================================================

/**
 * 변경 로그 목록
 *  - GET /api/admin/change-logs
 *  - params 예시: { fromDate, toDate, changeType, policyId }
 */
export const getChangeLogs = (params) =>{
  request('/api/admin/policy-changes/logs', {
    method: 'GET',
    params
  }
)};

/**
 * 변경 로그 상세
 *  - GET /api/admin/change-logs/{id}
 */
export const getChangeLogDetail = (id) =>
  request(`/api/admin/policy-changes/logs/${id}`, {
    method: 'GET',
  });

/**
 * 변경 내역 레포트 목록
 *  - GET /api/admin/reports
 *  - ?policyId=123 (선택)
 */
export const getReports = (params) =>
  request('/api/admin/reports', {
    method: 'GET',
    params,
  });

/**
 * 변경 내역 레포트 상세
 *  - GET /api/admin/reports/{id}
 */
export const getReportDetail = (id) =>
  request(`/api/admin/reports/${id}`, {
    method: 'GET',
  });

/**
 * 변경 내역 레포트 생성
 *  - POST /api/admin/reports
 *  - body: AdminPolicyChangeReportDto
 */
export const createReport = (data) =>
  request('/api/admin/reports', {
    method: 'POST',
    data,
  });

/**
 * 변경 내역 레포트 수정
 *  - PUT /api/admin/reports/{id}
 */
export const updateReport = (id, data) =>
  request(`/api/admin/reports/${id}`, {
    method: 'PUT',
    data,
  });

/**
 * 변경 내역 레포트 승인 + 사용자 알림 발송
 *  - POST /api/admin/reports/{id}/approve
 */
export const approveReport = (id) =>
  request(`/api/admin/reports/${id}/approve`, {
    method: 'POST',
  });

/**
 * 변경 로그 기반 AI 초안 생성
 *  - POST /api/admin/reports/auto-draft/from-change-log/{changeLogId}
 */
export const createDraftFromChangeLog = (changeLogId) =>
  request(
    `/api/admin/reports/auto-draft/from-change-log/${changeLogId}`,
    {
      method: 'POST',
    }
  );

// ======================================================================
// 4. AI, 서버 모니터링 (/api/admin/ai/..., /api/admin/server/...)
// ======================================================================

/**
 * AI 요약 상태 점검 (있다면)
 *  - GET /api/admin/ai/summary/check
 *  - 아직 백엔드 미구현이면 FE에서 사용하지 않거나 주석 처리
 */
export const checkAiSummaryStatus = () =>
  request('/api/admin/ai/summary/check', {
    method: 'GET',
  });

/**
 * 서버 상태 / 메트릭
 *  - GET /api/admin/server/metrics
 */
export const getServerMetrics = () =>
  request('/api/admin/server/metrics', {
    method: 'GET',
  });

/**
 * 서버 로그 조회
 *  - GET /api/admin/server/logs
 */
export const getServerLogs = (params) =>
  request('/api/admin/server/logs', {
    method: 'GET',
    params,
  });
=======
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    // 응답이 없는 경우(DELETE 등)를 대비
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (e) {
    console.error(`API Request Failed: ${endpoint}`, e);
    return { success: false, message: e.message }; // 에러 처리
  }
};

// =================================================================
// 1. 대시보드
// =================================================================
export const getDashboardSummary = () => request('/admin/dashboard/summary');

// =================================================================
// 2. 등록된 사업 관리 (정책)
// =================================================================
export const getPolicies = (keyword = '', category = '') => 
  request(`/admin/policies?keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(category)}`);

export const getPolicyDetail = (policyId) => request(`/admin/policies/${policyId}`);

export const createPolicy = (data) => 
  request('/admin/policies', { method: 'POST', body: JSON.stringify(data) });

export const updatePolicy = (policyId, data) => 
  request(`/admin/policies/${policyId}`, { method: 'PUT', body: JSON.stringify(data) });

export const deletePolicy = (policyId) => 
  request(`/admin/policies/${policyId}`, { method: 'DELETE' });

// =================================================================
// 3. 변경 이력 리포트
// =================================================================
export const getChangeLogs = () => request('/admin/policy-change-logs');

export const getChangeLogDetail = (logId) => request(`/admin/policy-change-logs/${logId}`);

// AI 요약 검증/재생성 (리포트 페이지 기능)
export const checkAiSummary = (data) => 
  request('/admin/ai/summary/check', { method: 'POST', body: JSON.stringify(data) });

// =================================================================
// 4. 서버 관리
// =================================================================
export const getServerMetrics = () => request('/admin/server/metrics');

export const getServerLogs = () => request('/admin/server/logs');
>>>>>>> ca6d91913bd473678d8f7e37f37286ee52ffcb6b
