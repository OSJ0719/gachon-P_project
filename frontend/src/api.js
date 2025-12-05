import AsyncStorage from '@react-native-async-storage/async-storage';
// - 안드로이드 에뮬레이터 사용 시: "http://10.0.2.2:8080"
// - 실제 스마트폰 사용 시: "http://192.168.x.x:8080" (컴퓨터의 IP주소)
const BASE_URL = "http://10.0.2.2:8080"; 

/**
 * 공통 API 요청 처리 함수
 */
const request = async (endpoint, options = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`📡 [API 요청] ${options.method || 'GET'} ${url}`);

    const token = await AsyncStorage.getItem('userToken');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      console.warn(`⚠️ [API 에러] ${response.status}:`, data);
      return { 
        success: false, 
        status: response.status, 
        error: data,
        message: data.message || '서버 오류가 발생했습니다.'
      };
    }

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

// 비밀번호 변경
export const changePasswordAPI = async (currentPassword, newPassword) => {
  return request('/api/v1/auth/password/change', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

// 아이디 찾기
export const findIdAPI = async (name, phone) => {
  return request('/api/v1/auth/find-id', {
    method: 'POST',
    body: JSON.stringify({ name, phone }),
  });
};

// 비밀번호 재설정
export const resetPasswordAPI = async (name, phone, username) => {
  return request('/api/v1/auth/reset-pw', {
    method: 'POST',
    body: JSON.stringify({ name, phone, username }),
  });
};

// =================================================================
// 2. 사용자 (User) 및 설정 API
// =================================================================

// 내 정보 조회
export const getUserProfileAPI = async () => {
  return request('/api/v1/users/me', { method: 'GET' });
};

// 알림 설정 조회
export const getSettingsAPI = async () => {
  return request('/api/v1/users/settings', { method: 'GET' });
};

// 알림 설정 수정
export const updateSettingsAPI = async (settingsData) => {
  return request('/api/v1/users/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
};

// 관심 카테고리 설정
export const setInterestCategoriesAPI = async (categoryCodes) => {
  return request('/api/v1/onboarding/interests', {
    method: 'POST',
    body: JSON.stringify({ categoryCodes }),
  });
};

// 내 정보 통합 수정
export const updateUserProfileAPI = async (data) => {
  return request('/api/v1/users/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// =================================================================
// 3. 홈 화면 및 정책(Policy) API
// =================================================================

// 홈 화면 요약 정보 (날씨, 일정, 추천 정책)
export const getHomeSummaryAPI = async () => {
  return request('/api/v1/home/summary', { method: 'GET' });
};

// 사용자 기반 추천 정책 조회 (Updated)
export const getRecommendationsAPI = async () => {
  return request('/api/v1/policies/recommended', { method: 'GET' }); 
};

// 정책 검색 (키워드)
export const getPoliciesAPI = async (keyword) => {
  return request(`/api/v1/policies/search?keyword=${encodeURIComponent(keyword)}`, { method: 'GET' });
};

// 정책 상세 조회
export const getPolicyDetailAPI = async (policyId) => {
  return request(`/api/v1/policies/${policyId}`, { method: 'GET' });
};

// 정책 AI 분석 결과 조회
export const getPolicyAIResultAPI = async (policyId) => {
  return request(`/api/v1/policies/${policyId}/ai-result`, { method: 'GET' });
};

// =================================================================
// 4. 캘린더 및 북마크 API
// =================================================================

// 일정 목록 조회
export const getSchedulesAPI = async (date) => {
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