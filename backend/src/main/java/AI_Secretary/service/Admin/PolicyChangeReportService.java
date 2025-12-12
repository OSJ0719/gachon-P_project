package AI_Secretary.service.Admin;

import AI_Secretary.DTO.AdminDTO.AdminPolicyChangeReportDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicyChangeReportSummaryDto;
import AI_Secretary.DTO.AiDTO.AiChangeReportRequest;
import AI_Secretary.DTO.AiDTO.AiChangeReportResponse;
import AI_Secretary.domain.policyData.PolicyChangeLog;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.subMenus.Bookmark;
import AI_Secretary.domain.subMenus.Notification;
import AI_Secretary.domain.subMenus.PolicyChangeReport;
import AI_Secretary.domain.user.UserSettings;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.Alarm.NotificationRepository;
import AI_Secretary.repository.Alarm.PolicyChangeLogRepository;
import AI_Secretary.repository.Alarm.PolicyChangeReportRepository;
import AI_Secretary.repository.User.UserSettingsRepository;
import AI_Secretary.repository.search.PolicyBookmarkRepository;
import AI_Secretary.repository.search.PolicyDataRepository;
import AI_Secretary.repository.sideService.BookmarkRepository;
import AI_Secretary.service.Ai.AiChangeReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class PolicyChangeReportService {

    private final PolicyChangeReportRepository reportRepository;
    private final PolicyDataRepository policyDataRepository;
    private final PolicyChangeLogRepository policyChangeLogRepository;
    private final AiChangeReportService aiChangeReportService;

    // ❗ 여기서는 "사용자 북마크(Bookmark 엔티티)"를 써야 하므로 sideService.BookmarkRepository 사용
    private final BookmarkRepository bookmarkRepository;

    private final UserSettingsRepository userSettingsRepository;
    private final NotificationRepository notificationRepository;

    private static final DateTimeFormatter DATE_TIME_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    // --------------------------------------------------------------------
    // 1. 목록 / 상세 조회
    // --------------------------------------------------------------------

    /**
     * 관리자 목록 화면용: 전체 보고서를 최신순으로 반환
     *  - policyId 주면 해당 정책 기준으로 필터
     */
    @Transactional(readOnly = true)
    public List<AdminPolicyChangeReportSummaryDto> getReportList(Long policyIdOrNull) {

        List<PolicyChangeReport> list;

        if (policyIdOrNull != null) {
            list = reportRepository.findByPolicy_IdOrderByCreatedAtDesc(policyIdOrNull);
        } else {
            list = reportRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream()
                .map(this::toSummaryDto)
                .toList();
    }

    /**
     * 관리자 상세 화면용: 단일 보고서 조회
     */
    @Transactional(readOnly = true)
    public AdminPolicyChangeReportDto getReportDetail(Long reportId) {
        PolicyChangeReport r = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("보고서를 찾을 수 없습니다. id=" + reportId));

        return toDetailDto(r);
    }

    private AdminPolicyChangeReportSummaryDto toSummaryDto(PolicyChangeReport r) {
        PolicyData p = r.getPolicy();
        return new AdminPolicyChangeReportSummaryDto(
                r.getId(),
                p != null ? p.getId() : null,
                p != null ? p.getName() : null,
                r.getTitle(),
                r.getSummary(),
                r.getReportType() != null ? r.getReportType().name() : null,
                r.getStatus() != null ? r.getStatus().name() : null,
                r.getImpactType() != null ? r.getImpactType().name() : null,
                r.getCreatedAt() != null ? r.getCreatedAt().format(DATE_TIME_FMT) : null
        );
    }

    private AdminPolicyChangeReportDto toDetailDto(PolicyChangeReport r) {
        PolicyData p = r.getPolicy();
        return new AdminPolicyChangeReportDto(
                r.getId(),
                p != null ? p.getId() : null,
                p != null ? p.getName() : null,

                r.getTitle(),
                r.getSummary(),
                r.getWhatChanged(),
                r.getWhoAffected(),
                r.getFromWhen(),
                r.getActionGuide(),

                r.getReportType() != null ? r.getReportType().name() : null,
                r.getStatus() != null ? r.getStatus().name() : null,
                r.getImpactType() != null ? r.getImpactType().name() : null,

                r.getUserImpactSummary(),
                r.getBeforeSummary(),
                r.getAfterSummary(),

                r.getCreatedAt() != null ? r.getCreatedAt().format(DATE_TIME_FMT) : null
        );
    }

    // --------------------------------------------------------------------
    // 2. 생성 / 수정
    // --------------------------------------------------------------------

    /**
     * 관리자 - 새로운 정책 변경 보고서 작성
     *  - request.id 는 무시 (신규 생성)
     *  - policyId 필수
     */
    @Transactional
    public AdminPolicyChangeReportDto createReport(AdminPolicyChangeReportDto request) {
        if (request.policyId() == null) {
            throw new IllegalArgumentException("policyId는 필수입니다.");
        }

        PolicyData policy = policyDataRepository.findById(request.policyId())
                .orElseThrow(() -> new IllegalArgumentException("정책을 찾을 수 없습니다. id=" + request.policyId()));

        PolicyChangeReport report = PolicyChangeReport.builder()
                .policy(policy)
                .title(request.title())
                .summary(request.summary())
                .whatChanged(request.whatChanged())
                .whoAffected(request.whoAffected())
                .fromWhen(request.fromWhen())
                .actionGuide(request.actionGuide())
                .createdAt(LocalDateTime.now())
                .reportType(PolicyChangeReport.ReportType.CHANGE_POLICY)          // 기본값
                .status(PolicyChangeReport.ReportStatus.DRAFT)                    // 최초 상태: DRAFT
                .impactType(null)                                                 // 필요 시 나중에 설정
                .userImpactSummary(null)
                .beforeSummary(null)
                .afterSummary(null)
                .build();

        PolicyChangeReport saved = reportRepository.save(report);
        return toDetailDto(saved);
    }

    /**
     * 관리자 - 기존 정책 변경 보고서 수정
     *  - 보통 DRAFT 상태에서만 수정 가능하게 쓰면 좋음 (정책에 따라 제한 가능)
     */
    @Transactional
    public AdminPolicyChangeReportDto updateReport(Long reportId, AdminPolicyChangeReportDto request) {
        PolicyChangeReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("보고서를 찾을 수 없습니다. id=" + reportId));

        // 필요하다면: APPROVED 이후에는 수정 금지
        if (report.getStatus() == PolicyChangeReport.ReportStatus.APPROVED) {
            throw new IllegalStateException("이미 승인된 보고서는 수정할 수 없습니다.");
        }

        // policyId 변경 허용 여부는 정책에 따라 선택
        if (request.policyId() != null &&
                (report.getPolicy() == null ||
                        !request.policyId().equals(report.getPolicy().getId()))) {

            PolicyData policy = policyDataRepository.findById(request.policyId())
                    .orElseThrow(() -> new IllegalArgumentException("정책을 찾을 수 없습니다. id=" + request.policyId()));
            report.setPolicy(policy); // ❗ PolicyChangeReport에 setPolicy 추가 필요
        }

        // 기본 필드 수정
        report.setTitle(request.title());
        report.setSummary(request.summary());
        report.setWhatChanged(request.whatChanged());
        report.setWhoAffected(request.whoAffected());
        report.setFromWhen(request.fromWhen());
        report.setActionGuide(request.actionGuide());
        report.setImpactType(parseImpactType(request.impactType()));
        report.setUserImpactSummary(request.userImpactSummary());
        report.setBeforeSummary(request.beforeSummary());
        report.setAfterSummary(request.afterSummary());

        // impactType, before/afterSummary 등은 추후 확장 시 여기에 추가

        return toDetailDto(report);
    }

    // --------------------------------------------------------------------
    // 3. 승인 + 알림 발송
    // --------------------------------------------------------------------

    /**
     * ✅ 관리자 "승인 및 배포" 눌렀을 때:
     *  - 이 정책을 북마크한 유저들 중
     *  - 정책 변경 알림 허용한 사람들에게
     *  - notification 테이블에 레코드 생성
     */
    @Transactional
    public void approveAndNotify(Long reportId) {
        log.info("### [approveAndNotify] called reportId={}", reportId);

        PolicyChangeReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("보고서를 찾을 수 없습니다. id=" + reportId));

        log.info("### [approveAndNotify] report.status={} policyId={}",
                report.getStatus(),
                report.getPolicy() != null ? report.getPolicy().getId() : null
        );

        if (report.getStatus() == PolicyChangeReport.ReportStatus.APPROVED) {
            log.info("### [approveAndNotify] already APPROVED, skip");
            return;
        }

        report.setStatus(PolicyChangeReport.ReportStatus.APPROVED);

        PolicyData policy = report.getPolicy();
        if (policy == null) {
            log.warn("### [approveAndNotify] policy is null for reportId={}", reportId);
            return;
        }

        List<Bookmark> bookmarks = bookmarkRepository.findByPolicy_Id(policy.getId());
        log.info("### [approveAndNotify] bookmarks.size={} for policyId={}", bookmarks.size(), policy.getId());

        for (Bookmark bm : bookmarks) {
            users user = bm.getUser();
            log.info("### [approveAndNotify] candidate userId={} username={}", user.getId(), user.getUsername());

            UserSettings settings = userSettingsRepository.findByUser_Id(user.getId())
                    .orElse(null);

            if (settings != null && !settings.getNotifyPolicyChanges()) {
                log.info("### [approveAndNotify] skip userId={} (notifyPolicyChanges=false)", user.getId());
                continue;
            }

            Notification notification = Notification.builder()
                    .user(user)
                    .type(Notification.NotificationType.CHANGE_POLICY)
                    .title(report.getTitle())
                    .message(report.getSummary())
                    .policyChangeReport(report)
                    .read(false)
                    .build();

            notificationRepository.save(notification);
            log.info("### [approveAndNotify] notification saved for userId={}", user.getId());
        }
    }
    //AI 레포트 제작에 사용
    @Transactional
    public AdminPolicyChangeReportDto createDraftFromChangeLog(Long changeLogId) {
        PolicyChangeLog log = policyChangeLogRepository.findById(changeLogId)
                .orElseThrow(() -> new IllegalArgumentException("변경 로그를 찾을 수 없습니다. id=" + changeLogId));

        PolicyData policy = log.getPolicy();

        // 1) AI에 보낼 request 구성
        String beforeSnapshot = log.getBeforeValue(); // JSON 통째로
        String afterSnapshot  = log.getAfterValue();

        // 필요하면 사람이 읽기 좋은 전/후 텍스트를 만들 수도 있음
        AiChangeReportRequest req = new AiChangeReportRequest(
                policy.getName(),
                beforeSnapshot,
                afterSnapshot
        );

        // 2) AI 서버 호출 → 초안 필드 생성
        AiChangeReportResponse aiRes = aiChangeReportService.generateChangeReportDraft(req);

        // 3) 초안 Report 엔티티 생성 (status = DRAFT)
        PolicyChangeReport report = PolicyChangeReport.builder()
                .policy(policy)
                .title(aiRes.title())
                .summary(aiRes.summary())
                .whatChanged(aiRes.whatChanged())
                .whoAffected(aiRes.whoAffected())
                .fromWhen(aiRes.fromWhen())
                .actionGuide(aiRes.actionGuide())
                .impactType(parseImpactType(aiRes.impactType()))
                .userImpactSummary(aiRes.userImpactSummary())
                .beforeSummary(aiRes.beforeSummary())
                .afterSummary(aiRes.afterSummary())
                .status(PolicyChangeReport.ReportStatus.DRAFT)
                .reportType(PolicyChangeReport.ReportType.CHANGE_POLICY)
                .build();

        reportRepository.save(report);

        // 4) 관리자 상세 DTO로 반환 → FE에서 바로 편집 화면 띄울 수 있게
        return toDetailDto(report);
    }
    @Transactional
    public void delete(Long reportId) {
        PolicyChangeReport r = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리포트"));

        reportRepository.delete(r);
    }
    /**
     * AI가 내려준 impactType 문자열 → enum 매핑
     */
    private PolicyChangeReport.ImpactType parseImpactType(String raw) {
        if (raw == null) return null;
        try {
            return PolicyChangeReport.ImpactType.valueOf(raw.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; // 매핑 실패 시 그냥 null 처리
        }
    }
}