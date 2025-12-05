import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Server, LogOut, User } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: '대시보드', icon: <LayoutDashboard size={20} /> },
    { path: '/policies', label: '등록된 사업 관리', icon: <FileText size={20} /> },
    { path: '/reports', label: '변경 이력 리포트', icon: <BarChart3 size={20} /> },
    { path: '/server', label: '서버 관리', icon: <Server size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* 사이드바 (Dark Theme) */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column' }}>
        {/* 로고 영역 */}
        <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c', margin: 0 }}>AI 비서 Admin</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>관리자 전용 페이지</p>
        </div>

        {/* 메뉴 영역 */}
        <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                  borderRadius: '8px', textDecoration: 'none',
                  backgroundColor: isActive ? '#334155' : 'transparent',
                  color: isActive ? 'white' : '#cbd5e1',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'background 0.2s'
                }}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 로그아웃 버튼 */}
        <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px' }}>
            <LogOut size={18} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 상단 헤더 */}
        <header style={{ height: '64px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>
             {menuItems.find(m => m.path === location.pathname)?.label || '시스템 현황'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>박관리</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Super Admin</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#64748b" />
            </div>
          </div>
        </header>

        {/* 콘텐츠 스크롤 영역 */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}