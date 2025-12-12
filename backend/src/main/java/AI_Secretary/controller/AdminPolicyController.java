package AI_Secretary.controller;

import AI_Secretary.DTO.AdminDTO.AdminPolicyDetailDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicySummaryDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicyUpdateRequest;
import AI_Secretary.service.Admin.AdminPolicyManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin/policies")
@RequiredArgsConstructor
public class AdminPolicyController {

    private final AdminPolicyManagementService adminPolicyManagementService;

    /**
     * 관리자 - 정책 목록 (키워드 검색)
     *  GET /api/admin/policies
     *  GET /api/admin/policies?keyword=일자리
     */
    @GetMapping
    public ResponseEntity<List<AdminPolicySummaryDto>> getPolicyList(
            @RequestParam(required = false) String keyword
    ) {
        var list = adminPolicyManagementService.getPolicyList(keyword);
        return ResponseEntity.ok(list);
    }

    /**
     * 관리자 - 정책 상세
     *  GET /api/admin/policies/{policyId}
     */
    @GetMapping("/{policyId}")
    public ResponseEntity<AdminPolicyDetailDto> getPolicyDetail(
            @PathVariable Long policyId
    ) {
        var dto = adminPolicyManagementService.getPolicyDetail(policyId);
        return ResponseEntity.ok(dto);
    }

    /**
     * 관리자 - 정책 수정
     *  PUT /api/admin/policies/{policyId}
     */
    @PutMapping("/{policyId}")
    public ResponseEntity<AdminPolicyDetailDto> updatePolicy(
            @PathVariable Long policyId,
            @RequestBody AdminPolicyUpdateRequest request
    ) {
        var dto = adminPolicyManagementService.updatePolicy(policyId, request);
        return ResponseEntity.ok(dto);
    }
}