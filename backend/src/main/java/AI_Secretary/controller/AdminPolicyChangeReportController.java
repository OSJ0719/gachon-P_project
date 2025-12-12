package AI_Secretary.controller;

import AI_Secretary.DTO.AdminDTO.AdminPolicyChangeReportDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicyChangeReportSummaryDto;
import AI_Secretary.service.Admin.PolicyChangeReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class AdminPolicyChangeReportController {

    private final PolicyChangeReportService policyChangeReportService;

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
}
