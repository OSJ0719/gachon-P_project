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

// 아이디 찾기 (추후 구현 시 사용)
export const findIdAPI = async (name, phone) => {
  return request('/api/v1/auth/find-id', {
    method: 'POST',
    body: JSON.stringify({ name, phone }),
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

// 북마크 목록 조회
export const getBookmarksAPI = async () => {
  return request('/api/v1/bookmarks', { method: 'GET' });
};

// 추천 복지 목록 조회
export const getRecommendationsAPI = async () => {
  // /api/v1/policies/recommendations 로 가정
  return request('/api/v1/policies/recommendations', { method: 'GET' }); 
};

// 사용자 초기 설정 저장 (관심사, 지역, 복지 정보)
export const updateUserProfileAPI = async (profileData) => {
  // profileData 구조: { categories, region, welfareInfo }
  // region 예시: { city: '서울', district: '강남구', dong: '역삼동' }
  // welfareInfo 예시: { disability: true, incomeLevel: 'basic_livelihood' }
  
  return request('/api/v1/users/me/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};