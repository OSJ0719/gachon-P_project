import React from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function PolicyPage() {
  const policies = [
    { id: '#1001', title: '2025년 어르신 난방비 지원 사업 1', agency: '보건복지부', date: '2025-11-28' },
    { id: '#1002', title: '2025년 어르신 난방비 지원 사업 2', agency: '보건복지부', date: '2025-11-28' },
    { id: '#1003', title: '2025년 어르신 난방비 지원 사업 3', agency: '보건복지부', date: '2025-11-28' },
    { id: '#1004', title: '2025년 어르신 난방비 지원 사업 4', agency: '보건복지부', date: '2025-11-28' },
    { id: '#1005', title: '2025년 어르신 난방비 지원 사업 5', agency: '보건복지부', date: '2025-11-28' },
    { id: '#1006', title: '2025년 어르신 난방비 지원 사업 6', agency: '보건복지부', date: '2025-11-28' },
    { id: '#1007', title: '2025년 어르신 난방비 지원 사업 7', agency: '보건복지부', date: '2025-11-28' },
    { id: '#1008', title: '2025년 어르신 난방비 지원 사업 8', agency: '보건복지부', date: '2025-11-28' },
  ];

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* 상단 헤더 영역 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>등록된 사업 관리</h2>
        <button style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <Plus size={18} /> 신규 사업 등록
        </button>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div style={{ 
        flex: 1, 
        width: '100%', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden' 
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
          
          <div style={{ width: '380px', position: 'relative' }}> 
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="사업명 또는 기관명 검색" 
              style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px' }} 
            />
          </div>

          <select style={{ width: '160px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#1e293b', outline: 'none', fontSize: '15px', cursor: 'pointer', backgroundColor: 'white' }}>
            <option>전체 카테고리</option>
            <option>건강/의료</option>
            <option>일자리</option>
          </select>

        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', width: '10%' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', width: '45%' }}>사업명</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', width: '15%' }}>담당 기관</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', width: '15%' }}>등록일</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', width: '15%' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '15px' }}>
                  <td style={{ padding: '16px', color: '#64748b' }}>{p.id}</td>
                  <td style={{ padding: '16px', fontWeight: '500', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.title}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', color: '#1e293b', whiteSpace: 'nowrap' }}>{p.agency}</td>
                  <td style={{ padding: '16px', textAlign: 'center', color: '#64748b', whiteSpace: 'nowrap' }}>{p.date}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                        <Edit size={16} />
                      </button>
                      <button style={{ background: 'none', border: '1px solid #fee2e2', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}