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

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    // ✅ endpoint 기준으로 auth URL 판별
    const isAuthUrl = endpoint.startsWith('/api/v1/auth/');

    // ✅ auth URL이 아닐 때만 토큰 부착
    if (!isAuthUrl) {
      const token = await AsyncStorage.getItem('userToken'); // 🔑 키 이름 통일
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
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
        data,
        message: data?.message || '서버 오류가 발생했습니다.',
      };
    }

    return { 
      success: true, 
      status: response.status,
      data,
      message: data?.message
    };
  } catch (error) {
    console.error(`🚨 [네트워크 에러] ${endpoint}:`, error);
    return { 
      success: false, 
      status: 0,
      data: null,
      message: '서버와 연결할 수 없습니다.\n네트워크 상태를 확인해주세요.' 
    };
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
  // userData: { username, password, name, phone }
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
// lat, lon 파라미터를 받아 쿼리 스트링으로 전달하도록 변경
export const getHomeSummaryAPI = async (lat, lon) => {
  let url = '/api/v1/home/summary';
  
  // 위도, 경도 정보가 있다면 쿼리 파라미터로 추가
  if (lat && lon) {
    url += `?lat=${lat}&lon=${lon}`;
  }

  return request(url, { method: 'GET' });
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
    body: JSON.stringify({
      date,
      title,
      memo: null,       // or ''
      startTime: time,  // "HH:mm"
      endTime: null,
      policyId: null,
      documentId: null,
    }),
  });
};

// 북마크 목록 조회
export const getBookmarksAPI = async () => {
  return request('/api/v1/bookmarks', { method: 'GET' });
};
// 북마크 추가
export const createBookmarkAPI = async (policyId, shortNote = null) => {
  return request('/api/v1/bookmarks', {
    method: 'POST',
    body: JSON.stringify({
      policyId,
      shortNote,   // 한 줄 메모가 아직 없으면 null 유지
    }),
  });
};

// 북마크 해제
export const deleteBookmarkAPI = async (policyId) => {
  return request(`/api/v1/bookmarks/${policyId}`, {
    method: 'DELETE',
  });
};
// =================================================================
// 5. 알림 및 변경 내역 API
// =================================================================

// 알림 목록 조회 (임의 구현)
export const getNotificationsAPI = async () => {
  // 백엔드: List<NotificationSummaryDto> 반환
  const res = await request('/api/v1/notifications', { method: 'GET' });

  // 기본적으로 request()는 { success, status, data, message } 형태를 반환
  if (!res.success || !Array.isArray(res.data)) {
    // 에러거나 데이터가 배열이 아닐 경우, 기존 형식 유지하면서 빈 배열
    return {
      ...res,
      data: [],
    };
  }

  const mapped = res.data.map((item) => ({
    id: item.id,
    type: item.type,                 // CHANGE_POLICY / DEADLINE / INFO ...
    title: item.title,
    message: item.messagePreview,    // ✅ messagePreview → FE에서 쓰는 message
    date: item.createdAt
      ? String(item.createdAt).slice(0, 10) // '2025-12-11T…' → '2025-12-11'
      : '',
    read: item.isRead ?? item.read ?? false, // ✅ isRead → read (혹시 read로 내려와도 대응)
    changes: [],                      // Summary에는 diff 없음 → 상세 API에서 채울 예정
    hasReport: item.hasReport ?? false,
    policyId: item.policyId ?? null,
    reportId: item.reportId ?? null,
  }));

  return {
    ...res,
    data: mapped,
  };
};
export const getNotificationDetailAPI = async (notificationId) => {
  const res = await request(`/api/v1/notifications/${notificationId}`, {
    method: 'GET',
  });

  if (!res.success || !res.data) {
    // 에러거나 데이터 없으면 그대로 리턴
    return res;
  }

  const item = res.data; // NotificationDetailResponse

  const mapped = {
    id: item.id,
    type: item.type,
    title: item.title,
    message: item.message,
    date: item.createdAt ? String(item.createdAt).slice(0, 10) : '',
    createdAt: item.createdAt ?? null,
    read: item.isRead ?? item.read ?? false,
    readAt: item.readAt ?? null,
    hasReport: !!item.report,
    report: item.report ?? null, // PolicyChangeReportForUserDto 그대로 전달
  };

  return {
    ...res,
    data: mapped,
  };
};
export const readNotificationAPI = async (notificationId) => {
  return request(`/api/v1/notifications/${notificationId}/read`, {
    method: 'POST',
  });
};
// =================================================================
// 6. 챗봇 API (New)
// =================================================================

// 챗봇 메시지 전송 및 응답 수신
export const sendChatbotMessageAPI = async (message) => {
  // [실제 API 구현 시]:
  /*
  return request('/api/v1/chatbot/ask', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  */

  // [임시 Mock 구현]: 키워드에 따라 응답 생성
  return new Promise((resolve) => {
    setTimeout(() => {
      let botResponse = "제가 잘 모르는 내용이에요. 다시 말씀해 주시겠어요?";

      if (message.includes('자격')) {
        botResponse = "신청 자격은 만 65세 이상이시며, 소득 인정액이 선정 기준액 이하인 분들이 대상입니다. 기초연금 수급자라면 대부분 해당됩니다.";
      } else if (message.includes('서류')) {
        botResponse = "필요한 서류는 '신분증'과 '통장 사본'입니다. 주민센터에 방문하시면 담당자가 출력을 도와드릴 수 있습니다.";
      } else if (message.includes('대리인')) {
        botResponse = "네, 가능합니다! 자녀분이나 배우자분이 신분증과 위임장을 지참하시면 대신 신청하실 수 있습니다.";
      } else if (message.includes('안녕')) {
        botResponse = "안녕하세요! 오늘도 건강하고 행복한 하루 되세요. 😊";
      }

      resolve({
        success: true,
        data: {
          response: botResponse
        }
      });
    }, 1000); // 1초 뒤 응답
  });
};