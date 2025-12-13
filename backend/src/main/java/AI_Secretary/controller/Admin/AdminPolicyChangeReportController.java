package AI_Secretary.controller.Admin;

import AI_Secretary.DTO.AdminDTO.AdminPolicyChangeReportDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicyChangeReportSummaryDto;
import AI_Secretary.DTO.AiDTO.ManualChangeLogDraftRequest;
import AI_Secretary.domain.policyData.PolicyChangeLog;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.repository.Alarm.PolicyChangeLogRepository;
import AI_Secretary.repository.search.PolicyDataRepository;
import AI_Secretary.service.Admin.AdminPolicyManagementService;
import AI_Secretary.service.Admin.PolicyChangeReportService;
import AI_Secretary.service.Ai.AiChangeReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AdminPolicyChangeReportController {

    private final PolicyChangeReportService policyChangeReportService;
    private final AiChangeReportService aiChangeReportService;
    private final PolicyDataRepository policyDataRepository;
    /**
     * ✅ 관리자 - 정책 변경 보고서 목록
     *   - 전체 or 특정 정책 기준 필터
     *   - 예: GET /api/admin/reports
     *        GET /api/admin/reports?policyId=123
     */
    @GetMapping
    public ResponseEntity<List<AdminPolicyChangeReportSummaryDto>> getReportList(
            @RequestParam(required = false) Long policyId
    ) {
        var list = policyChangeReportService.getReportList(policyId);
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ 관리자 - 단일 보고서 상세 조회
     *   - 예: GET /api/admin/reports/10
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<AdminPolicyChangeReportDto> getReportDetail(
            @PathVariable Long reportId
    ) {
        var dto = policyChangeReportService.getReportDetail(reportId);
        return ResponseEntity.ok(dto);
    }

    /**
     * ✅ 관리자 - 보고서 생성
     *   - 예: POST /api/admin/reports
     */
    @PostMapping
    public ResponseEntity<AdminPolicyChangeReportDto> createReport(
            @RequestBody AdminPolicyChangeReportDto request
    ) {
        var created = policyChangeReportService.createReport(request);
        return ResponseEntity.ok(created);
    }

    /**
     * ✅ 관리자 - 보고서 수정
     *   - 예: PUT /api/admin/reports/10
     */
    @PutMapping("/{reportId}")
    public ResponseEntity<AdminPolicyChangeReportDto> updateReport(
            @PathVariable Long reportId,
            @RequestBody AdminPolicyChangeReportDto request
    ) {
        var updated = policyChangeReportService.updateReport(reportId, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * ✅ 관리자 - 보고서 승인 및 배포(알림 발송)
     *   - 예: POST /api/admin/reports/10/approve
     */
    @PostMapping("/{reportId}/approve")
    public ResponseEntity<Void> approveReport(
            @PathVariable Long reportId
    ) {
        policyChangeReportService.approveAndNotify(reportId);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/auto-draft/from-change-log/{changeLogId}")
    public ResponseEntity<AdminPolicyChangeReportDto> createDraftFromChangeLog(
            @PathVariable Long changeLogId
    ) {
        var dto = policyChangeReportService.createDraftFromChangeLog(changeLogId);
        return ResponseEntity.ok(dto);
    }
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> delete(@PathVariable Long reportId) {
        policyChangeReportService.delete(reportId);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/auto-draft/manual")
    public ResponseEntity<AdminPolicyChangeReportDto> createDraftFromManualChange(
            @RequestBody ManualChangeLogDraftRequest request
    ) {
        log.info("### [auto-draft/manual] request={}", request);

        PolicyData policy = policyDataRepository.findById(request.policyId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "정책을 찾을 수 없습니다. id=" + request.policyId()
                ));

        // 1) 수동 변경 로그 생성
        PolicyChangeLog log = aiChangeReportService.createManualLogForDemo(
                policy,
                request.changeType(),
                request.beforeText(),
                request.afterText(),
                request.adminNote()
        );

        // 2) 기존 로직 재사용: 로그 기반 AI 초안 생성
        AdminPolicyChangeReportDto draft =
                policyChangeReportService.createDraftFromChangeLog(log.getId());

        return ResponseEntity.ok(draft);
    }
}

