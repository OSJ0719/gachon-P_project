// 로컬 테스트(에뮬레이터): "http://10.0.2.2:8080"
// 실제 폰 테스트: "http://본인컴퓨터IP:8080"
const BASE_URL = "http://10.0.2.2:8080"; 

/**
 * 공통 API 요청 함수
 * 모든 요청에 대한 에러 처리와 JSON 파싱을 담당합니다.
 */
const request = async (endpoint, options = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`📡 API 요청: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // 필요 시 토큰 추가: 'Authorization': `Bearer ${token}`
      },
      ...options,
    });

    // 응답 바디가 비어있을 경우를 대비한 처리
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    // 200~299 상태 코드가 아니면 에러로 간주
    if (!response.ok) {
      return { 
        success: false, 
        status: response.status, 
        error: data,
        message: data.message || '서버 오류 발생'
      };
    }

    // 성공
    return { success: true, data };
  } catch (error) {
    console.error(`🚨 통신 에러 (${endpoint}):`, error);
    return { success: false, message: '네트워크 연결 실패' };
  }
};

// =================================================================
// 1. 인증 (Auth)
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
  // userData: { username, password, name }
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

// 아이디 찾기 (추가 구현 필요 시 사용)
export const findIdAPI = async (name, phone) => {
  return request('/api/v1/auth/find-id', {
    method: 'POST',
    body: JSON.stringify({ name, phone }),
  });
};

// =================================================================
// 2. 홈 화면 데이터
// =================================================================

// 메인 요약 정보 (날씨, 멘트)
export const getHomeSummaryAPI = async () => {
  return request('/api/v1/home/summary', { method: 'GET' });
};

// 일정 목록 조회
export const getSchedulesAPI = async (date) => {
  return request(`/api/v1/calendar/events?date=${date}`, { method: 'GET' });
};

// 북마크 목록 조회
export const getBookmarksAPI = async () => {
  return request('/api/v1/bookmarks', { method: 'GET' });
};

// 추천 복지 목록 조회
export const getRecommendationsAPI = async () => {
  return request('/api/v1/recommendations', { method: 'GET' });
};