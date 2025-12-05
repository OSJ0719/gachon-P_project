const BASE_URL = "http://localhost:8080"; // 웹은 에뮬레이터 IP 대신 localhost 사용

export const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json(); // 성공 시 데이터 반환
  } catch (e) {
    console.error(e);
    return { success: false, message: e.message };
  }
};

// 정책 목록 조회
export const getPolicies = () => request('/api/v1/policies/search?keyword=');

// 정책 삭제 (예시)
export const deletePolicy = (id) => request(`/api/v1/policies/${id}`, { method: 'DELETE' });