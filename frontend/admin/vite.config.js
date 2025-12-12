import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081, // package.json의 dev 스크립트와 일치
    proxy: {
      // '/api'로 시작하는 요청을 백엔드 서버로 보냅니다.
      '/api': {
        target: 'http://localhost:8080', // 백엔드 주소
        changeOrigin: true, // CORS 문제 회피를 위해 필수
        secure: false, 
      },
    },
  },
});