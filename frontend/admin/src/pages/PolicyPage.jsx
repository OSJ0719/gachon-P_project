import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { deletePolicy, getPolicies } from '../api';

export default function PolicyPage() {
  const [policies, setPolicies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('전체 카테고리');

  // 데이터 로드 함수
  const loadData = async () => {
    // 🌟 1. 파라미터를 하나의 객체로 묶습니다.
    const params = {
        keyword: keyword,
        categoryCode: category === '전체 카테고리' ? '' : category // 백엔드 파라미터명과 맞춰줍니다.
    };
    // 🌟 2. getPolicies 호출 시, 이 객체(params) 하나만 전달합니다.
    const res = await getPolicies(params); // 👈 이렇게 수정해야 합니다!
  
    if (res.success && Array.isArray(res.data)) {
      setPolicies(res.data);
      console.log("정책 데이터 로드 성공:", res.data);
    } else if (res.success && res.data && Array.isArray(res.data.content)) {
      setPolicies(res.data.content);
      console.log("정책 데이터 로드 성공 (Pageable):", res.data.content);
    } else {
      setPolicies([]);
      console.error("정책 데이터 로드 실패 또는 데이터 구조 불일치", res);
    }
  };

  // 초기 로드 및 검색조건 변경 시 실행
  useEffect(() => {
    loadData();
  }, [category,keyword]); // 카테고리 변경 시 즉시 조회

  const handleSearch = (e) => {
    if (e.key === 'Enter') loadData(); // 엔터 키 입력 시 조회
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 이 사업 정보를 삭제하시겠습니까?')) {
      const res = await deletePolicy(id);
      if (res && res.success !== false) {
        alert('삭제되었습니다.');
        loadData(); // 목록 새로고침
      } else {
        alert('삭제 실패: ' + res.message);
      }
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>등록된 사업 관리</h2>
        <button style={{ backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <Plus size={18} /> 신규 사업 등록
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ flex: 1, width: '100%', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* 검색 및 필터 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
          <div style={{ width: '380px', position: 'relative' }}> 
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="사업명 또는 기관명 검색 (Enter)" 
              style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px' }} 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <select 
            style={{ width: '160px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#1e293b', outline: 'none', fontSize: '15px', cursor: 'pointer', backgroundColor: 'white' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>전체 카테고리</option>
            <option>건강/의료</option>
            <option>일자리</option>
            <option>생활지원</option>
          </select>
        </div>

        {/* 테이블 */}
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
              {policies.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>등록된 사업이 없습니다.</td></tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '15px' }}>
                    <td style={{ padding: '16px', color: '#64748b' }}>#{p.id}</td>
                    {/* 1. 사업명: p.title -> p.name 으로 변경 */}
                    <td style={{ padding: '16px', fontWeight: '500', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</td>
                    {/* 2. 담당 기관: p.agency -> p.provider 로 변경 */}
                    <td style={{ padding: '16px', textAlign: 'center', color: '#1e293b', whiteSpace: 'nowrap' }}>{p.provider}</td>
                    {/* 3. 등록일: p.date -> p.lastModifiedAt 로 변경 (또는 실제 등록일 필드 사용) */}
                    <td style={{ padding: '16px', textAlign: 'center', color: '#64748b', whiteSpace: 'nowrap' }}>{p.lastModifiedAt}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: '#64748b', display: 'flex' }}><Edit size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: '1px solid #fee2e2', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: '#ef4444', display: 'flex' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}