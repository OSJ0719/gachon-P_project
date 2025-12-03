// - 안드로이드 에뮬레이터 사용 시: "http://10.0.2.2:8080"
// - 실제 스마트폰 사용 시: "http://192.168.x.x:8080" (컴퓨터의 IP주소)
const BASE_URL = "http://10.0.2.2:8080"; 

/**
 * 공통 API 요청 처리 함수
 * - 모든 요청에 대한 헤더 설정, 에러 처리, JSON 파싱을 담당합니다.
 */
const request = async (endpoint, options = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`📡 [API 요청] ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // 필요하다면 여기에 인증 토큰 추가: 'Authorization': `Bearer ${token}`
      },
      ...options,
    });

    // 응답 바디가 비어있거나 JSON이 아닐 경우를 대비한 안전한 파싱
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    // 상태 코드가 200~299가 아니면 실패로 간주
    if (!response.ok) {
      console.warn(`⚠️ [API 에러] ${response.status}:`, data);
      return { 
        success: false, 
        status: response.status, 
        error: data,
        message: data.message || '서버 오류가 발생했습니다.'
      };
    }

    // 성공
    return { success: true, data };
  } catch (error) {
    console.error(`🚨 [네트워크 에러] ${endpoint}:`, error);
    return { success: false, message: '서버와 연결할 수 없습니다.\n네트워크 상태를 확인해주세요.' };
  }
};

// =================================================================
// 1. 인증 (Auth) 관련 API
// =================================================================

// 로그인
export const loginAPI = async (username, password) => {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

// 회원가입
export const signupAPI = async (userData) => {
  // userData 구조: { username, password, name }
  return request('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// 로그아웃
export const logoutAPI = async () => {
  return request('/api/v1/auth/logout', {
    method: 'POST',
  });
};

// 내 정보 조회
export const getUserProfileAPI = async () => {
  return request('/api/v1/users/me', { method: 'GET' });
};

// 내 정보 수정 (초기 설정 포함)
export const updateUserProfileAPI = async (data) => {
  return request('/api/v1/users/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 아이디 찾기 (추후 구현 시 사용)
export const findIdAPI = async (name, phone) => {
  return request('/api/v1/auth/find-id', {
    method: 'POST',
    body: JSON.stringify({ name, phone }),
  });
};

// 비밀번호 재설정 (임시 비번 발송 등)
export const resetPasswordAPI = async (name, phone, username) => {
  return request('/api/v1/auth/reset-pw', {
    method: 'POST',
    body: JSON.stringify({ name, phone, username }),
  });
};

// =================================================================
// 2. 홈 화면 및 기능 데이터 API
// =================================================================

// 메인 화면 요약 정보 (날씨, AI 멘트 등)
export const getHomeSummaryAPI = async () => {
  return request('/api/v1/home/summary', { method: 'GET' });
};

// 일정 목록 조회
export const getSchedulesAPI = async (date) => {
  // 예: /api/v1/calendar/events?date=2025-12-05
  return request(`/api/v1/calendar/events?date=${date}`, { method: 'GET' });
};

// 일정 추가
export const createScheduleAPI = async (date, time, title) => {
  return request('/api/v1/calendar/events', {
    method: 'POST',
    body: JSON.stringify({ date, time, title })
  });
};

// 북마크 목록 조회
export const getBookmarksAPI = async () => {
  return request('/api/v1/bookmarks', { method: 'GET' });
};

// 추천 복지 목록 조회
export const getRecommendationsAPI = async () => {
  return request('/api/v1/recommendations', { method: 'GET' }); 
};

// =================================================================
// 3. 검색 및 상세 조회 API
// =================================================================

// 정책 검색 (키워드)
export const getPoliciesAPI = async (keyword) => {
  return request(`/api/v1/policies?q=${keyword}`, { method: 'GET' });
};

// 정책 상세 정보 조회
export const getPolicyDetailAPI = async (policyId) => {
  return request(`/api/v1/policies/${policyId}`, { method: 'GET' });
};

// 정책 AI 분석 결과 조회 (신청 도우미용)
export const getPolicyAIResultAPI = async (policyId) => {
  return request(`/api/v1/policies/${policyId}/ai-result`, { method: 'GET' });
};