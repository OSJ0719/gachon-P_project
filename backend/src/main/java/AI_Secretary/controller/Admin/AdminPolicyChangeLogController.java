package AI_Secretary.controller.Admin;

import AI_Secretary.DTO.AdminDTO.AdminPolicyLogDetailDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicyLogSummaryDto;
import AI_Secretary.service.Admin.PolicyChangeLogAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/policy-changes/logs")
@RequiredArgsConstructor
public class AdminPolicyChangeLogController {

    private final PolicyChangeLogAdminService policyChangeLogAdminService;

    /**
     * ✅ 관리자 - 최근 변경 로그 목록
     *   - 예: GET /api/admin/policy-changes/logs
     *   - 예: GET /api/admin/policy-changes/logs?limit=50
     */
    @GetMapping
    public ResponseEntity<List<AdminPolicyLogSummaryDto>> getRecentLogs(
            @RequestParam(name = "limit", required = false) Integer limit
    ) {
        var list = policyChangeLogAdminService.getRecentLogs(limit);
        return ResponseEntity.ok(list);
    }

    /**
     * ✅ 관리자 - 단일 변경 로그 상세
     *   - 예: GET /api/admin/policy-changes/logs/{logId}
     */
    @GetMapping("/{logId}")
    public ResponseEntity<AdminPolicyLogDetailDto> getLogDetail(
            @PathVariable Long logId
    ) {
        var dto = policyChangeLogAdminService.getLogDetail(logId);
        return ResponseEntity.ok(dto);
    }
}
