package AI_Secretary.controller.user;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.ChecklistItemRequest;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.ChecklistItemResponse;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.PolicyChecklistResponse;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.service.User.UserChecklistCommandService;
import AI_Secretary.service.User.UserChecklistQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/policies/{policyId}/checklist")
@RequiredArgsConstructor
public class UserChecklistController {

    private final UserChecklistQueryService queryService;
    private final UserChecklistCommandService commandService;

    // 정책별 체크리스트 조회
    @GetMapping
    public ResponseEntity<PolicyChecklistResponse> getChecklist(
            @AuthenticationPrincipal CustomUserDetails authUser,
            @PathVariable Long policyId
    ) {
        Long userId = authUser.getUserId();
        var response = queryService.getChecklistForPolicy(userId, policyId);
        return ResponseEntity.ok(response);
    }

    // 항목 생성
    @PostMapping("/items")
    public ResponseEntity<ChecklistItemResponse> createItem(
            @AuthenticationPrincipal CustomUserDetails authUser,
            @PathVariable Long policyId,
            @RequestBody ChecklistItemRequest request
    ) {
        Long userId = authUser.getUserId();
        var response = commandService.createItem(userId, policyId, request);
        return ResponseEntity.ok(response);
    }

    // 항목 수정
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ChecklistItemResponse> updateItem(
            @AuthenticationPrincipal CustomUserDetails authUser,
            @PathVariable Long policyId,
            @PathVariable Long itemId,
            @RequestBody ChecklistItemRequest request
    ) {
        Long userId = authUser.getUserId();
        var response = commandService.updateItem(userId, policyId, itemId, request);
        return ResponseEntity.ok(response);
    }

    // 체크/해제 토글
    @PatchMapping("/items/{itemId}/toggle")
    public ResponseEntity<ChecklistItemResponse> toggleItem(
            @AuthenticationPrincipal CustomUserDetails authUser,
            @PathVariable Long policyId,
            @PathVariable Long itemId
    ) {
        Long userId = authUser.getUserId();
        var response = commandService.toggleItem(userId, policyId, itemId);
        return ResponseEntity.ok(response);
    }

    // 항목 삭제
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteItem(
            @AuthenticationPrincipal CustomUserDetails authUser,
            @PathVariable Long policyId,
            @PathVariable Long itemId
    ) {
        Long userId = authUser.getUserId();
        commandService.deleteItem(userId, policyId, itemId);
        return ResponseEntity.noContent().build();
    }
}
