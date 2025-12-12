import React, { useEffect, useState } from 'react';
import {
  approveReport,
  createDraftFromChangeLog,
  createReport,
  deleteReport,
  getChangeLogs,
  getReportDetail,
  getReports,
  updateReport
} from '../api';

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 🔹 ChangeLog 모달 관련 상태
  const [showChangeLogModal, setShowChangeLogModal] = useState(false);
  const [changeLogs, setChangeLogs] = useState([]);
  const [loadingChangeLogs, setLoadingChangeLogs] = useState(false);
  const [selectedChangeLogId, setSelectedChangeLogId] = useState(null);

  // =========================
  // 레포트 목록 로딩
  // =========================
  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const res = await getReports();  // 필요 시 params 추가 가능
      if (res.success && Array.isArray(res.data)) {
        setReports(res.data);
        if (res.data.length > 0) {
          handleSelectReport(res.data[0].id, res.data);
        } else {
          setSelectedReport(null);
        }
      } else {
        setReports([]);
        setSelectedReport(null);
      }
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // =========================
  // 레포트 선택 + 상세 로딩
  // =========================
  const handleSelectReport = async (id, listOverride) => {
    setLoadingDetail(true);
    const baseList = listOverride ?? reports;
    const basic = baseList.find(r => r.id === id);

    try {
      const res = await getReportDetail(id);
      if (res.success && res.data) {
        const detail = res.data;
        const merged = { ...basic, ...detail };
        setSelectedReport(merged);
        setTitleDraft(merged.title || '');
        setSummaryDraft(
          merged.summary || merged.userImpactSummary || ''
        );
      } else {
        setSelectedReport(basic || null);
        setTitleDraft(basic?.title || '');
        setSummaryDraft(basic?.summary || '');
        console.error('레포트 상세 로드 실패', res);
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  // =========================
  // 반려 처리
  // =========================
  const handleDelete = async () => {
  if (!selectedReport) return;
  const confirmed = window.confirm('이 레포트를 삭제하시겠습니까?');
  if (!confirmed) return;

  const res = await deleteReport(selectedReport.id);

  if (res.success) {
    alert('레포트가 삭제되었습니다.');
    await loadReports();
    setSelectedReport(null);
  } else {
    alert(`삭제 실패: ${res.message || '알 수 없는 오류'}`);
  }
};

  // =========================
  // 승인 + 배포 (알림 발송)
  // =========================
  const handleApprove = async () => {
    if (!selectedReport) return;
    const confirmed = window.confirm(
      '승인 및 배포하시겠습니까?\n(해당 정책을 북마크한 사용자에게 알림이 발송됩니다.)'
    );
    if (!confirmed) return;

    // 1) 요약 수정사항 저장
    const payload = {
      ...selectedReport,
       title: titleDraft,
      summary: summaryDraft
    };
    await updateReport(selectedReport.id, payload);
    // 2) 승인 + 알림 발송
    const res = await approveReport(selectedReport.id);
    if (res.success) {
      alert('승인 및 배포가 완료되었습니다.');
      await loadReports();
    } else {
      alert(`승인 실패: ${res.message || '알 수 없는 오류'}`);
    }
  };

  // =========================
  // 수동 새 레포트 생성
  // =========================
  const createEmptyReport = async () => {
    const policyId = window.prompt('어느 정책(policyId)의 레포트를 생성하시겠습니까?');
    if (!policyId) return;

    const payload = {
      policyId: Number(policyId),
      title: '',
      summary: '',
      whatChanged: '',
      whoAffected: '',
      fromWhen: '',
      actionGuide: '',
      reportType: 'CHANGE_POLICY',
      status: 'DRAFT',
    };

    const res = await createReport(payload);
    if (res.success && res.data) {
      alert('새 레포트가 생성되었습니다.');
      await loadReports();
      handleSelectReport(res.data.id);
    } else {
      alert(`레포트 생성 실패: ${res.message || '알 수 없는 오류'}`);
    }
  };

  // =========================
  // ChangeLog 모달 열기
  // =========================
  const openChangeLogModal = async () => {
    setShowChangeLogModal(true);
    setLoadingChangeLogs(true);
    setChangeLogs([]);
    setSelectedChangeLogId(null);

    try {
      const res = await getChangeLogs(); // 필요하면 기간/타입 필터 추가 가능
      if (res.success && Array.isArray(res.data)) {
        setChangeLogs(res.data);
      } else {
        setChangeLogs([]);
      }
    } finally {
      setLoadingChangeLogs(false);
    }
  };

  const closeChangeLogModal = () => {
    setShowChangeLogModal(false);
    setSelectedChangeLogId(null);
  };

  // =========================
  // 선택된 ChangeLog 기반 AI 초안 생성
  // =========================
  const handleCreateDraftFromChangeLog = async () => {
    if (!selectedChangeLogId) {
      alert('변경 로그를 선택해주세요.');
      return;
    }

    const confirmed = window.confirm(
      `선택한 변경 로그(ID: ${selectedChangeLogId}) 기반으로 AI 초안 레포트를 생성하시겠습니까?`
    );
    if (!confirmed) return;

    const res = await createDraftFromChangeLog(selectedChangeLogId);
    if (res.success && res.data) {
      alert('AI 초안 레포트가 생성되었습니다.');
      closeChangeLogModal();
      await loadReports();
      handleSelectReport(res.data.id);
    } else {
      alert(`초안 생성 실패: ${res.message || '알 수 없는 오류'}`);
    }
  };

  return (
    <div>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '24px',
        }}
      >
        정책 변경 레포트 관리
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          height: 'calc(100vh - 180px)',
        }}
      >
        {/* ================= 좌측: 레포트 목록 ================= */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              레포트 목록
            </h3>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={createEmptyReport}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                }}
              >
                새 레포트 작성
              </button>
              <button
                onClick={openChangeLogModal}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#0891b2',
                  color: 'white',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                }}
              >
                변경 로그로 AI 초안
              </button>
            </div>
          </div>

          {loadingReports && (
            <div style={{ color: '#94a3b8', fontSize: 14 }}>불러오는 중...</div>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => handleSelectReport(report.id)}
              >
                <ReportCard
                  date={report.createdAt}
                  status={report.status}
                  title={report.title}
                  desc={report.summary || '상세 내용을 확인하세요.'}
                  active={selectedReport?.id === report.id}
                />
              </div>
            ))}
            {!loadingReports && reports.length === 0 && (
              <div style={{ color: '#94a3b8', fontSize: 14 }}>
                등록된 레포트가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* ================= 우측: 레포트 상세 ================= */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedReport ? (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  리포트 상세 검토
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                    onClick={handleDelete}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    삭제
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      backgroundColor: '#ea580c',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                    onClick={handleApprove}
                  >
                    승인 및 배포
                  </button>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#64748b',
                    marginBottom: '8px',
                  }}
                >
                  제목
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    fontSize: '15px',
                  }}
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                />
                <div
                  style={{
                    padding: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                  }}
                >
                  {selectedReport.title}
                </div>

                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#64748b',
                    marginBottom: '8px',
                  }}
                >
                  AI 생성 요약 (수정 가능)
                </label>
                <textarea
                  style={{
                    width: '100%',
                    height: '300px',
                    padding: '16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: '#334155',
                    resize: 'none',
                  }}
                  value={summaryDraft}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                />

                {loadingDetail && (
                  <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 13 }}>
                    상세 정보 불러오는 중...
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
              }}
            >
              레포트를 선택해주세요.
            </div>
          )}
        </div>
      </div>

      {/* ================= ChangeLog 선택 모달 ================= */}
      {showChangeLogModal && (
        <ChangeLogModal
          loading={loadingChangeLogs}
          changeLogs={changeLogs}
          selectedId={selectedChangeLogId}
          onSelect={setSelectedChangeLogId}
          onClose={closeChangeLogModal}
          onConfirm={handleCreateDraftFromChangeLog}
        />
      )}
    </div>
  );
}

// ======================================
// 레포트 카드
// ======================================
const ReportCard = ({ date, status, title, desc, active }) => {
  const isPending =
    status === 'DRAFT' || status === 'PENDING' || status === '검토필요';

  return (
    <div
      style={{
        border: active ? '2px solid #ea580c' : '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        backgroundColor: active ? '#fff7ed' : 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: 'bold',
          }}
        >
          {date}
        </span>
        <span
          style={{
            backgroundColor: isPending ? '#fef3c7' : '#dcfce7',
            color: isPending ? '#d97706' : '#16a34a',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          {status}
        </span>
      </div>
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '16px',
          marginBottom: '8px',
          color: '#1e293b',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#64748b',
          lineHeight: '1.4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {desc}
      </div>
    </div>
  );
};

// ======================================
// ChangeLog 선택 모달
// ======================================
const ChangeLogModal = ({
  loading,
  changeLogs,
  selectedId,
  onSelect,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: '800px',
          maxHeight: '80vh',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            alignItems: 'center',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
            변경 로그 선택 (AI 초안 생성용)
          </h3>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
          }}
        >
          {loading && (
            <div style={{ color: '#94a3b8', fontSize: 14 }}>
              변경 로그 불러오는 중...
            </div>
          )}

          {!loading && changeLogs.length === 0 && (
            <div style={{ color: '#94a3b8', fontSize: 14 }}>
              사용 가능한 변경 로그가 없습니다.
            </div>
          )}

          {!loading &&
            changeLogs.map((log) => {
              const active = selectedId === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => onSelect(log.id)}
                  style={{
                    border: active
                      ? '2px solid #0ea5e9'
                      : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    backgroundColor: active ? '#f0f9ff' : 'white',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#64748b',
                      }}
                    >
                      {log.changedAt || log.createdAt}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontWeight: 'bold',
                      }}
                    >
                      {log.changeType}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '2px',
                    }}
                  >
                    {log.policyName || `정책 ID: ${log.policyId}`}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                    }}
                  >
                    {log.summary ||
                      '변경된 정책의 상세 내용은 레포트 생성 후 확인할 수 있습니다.'}
                  </div>
                </div>
              );
            })}
        </div>

        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: 'white',
              color: '#475569',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedId}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedId ? '#0ea5e9' : '#bae6fd',
              color: 'white',
              cursor: selectedId ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            이 변경 로그로 AI 초안 생성
          </button>
        </div>
      </div>
    </div>
  );
};