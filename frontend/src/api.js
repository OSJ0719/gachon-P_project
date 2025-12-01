const BASE_URL = 'http://your-api-server.com'; // 실제 서버 주소로 변경 필요

// P2: 로그인 (JWT 발급)
export const loginAPI = async (id, password) => {
  console.log(`[API] 로그인 요청: ${id}`);
  // 실제 연동 시:
  // const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ id, password }),
  // });
  // return response.json();

  // Mock 응답
  return new Promise((resolve) => {
    setTimeout(() => {
      if (id && password) resolve({ success: true, token: 'dummy-jwt-token', user: { name: '박성민' } });
      else resolve({ success: false, message: '아이디와 비밀번호를 확인해주세요.' });
    }, 500);
  });
};

// P1: 회원가입
export const signupAPI = async (userData) => {
  console.log(`[API] 회원가입 요청:`, userData);
  // POST /api/v1/auth/signup
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

// P3: 로그아웃
export const logoutAPI = async () => {
  console.log(`[API] 로그아웃 요청`);
  // POST /api/v1/auth/logout
  return true;
};