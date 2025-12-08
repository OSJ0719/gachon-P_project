package AI_Secretary.controller;

import AI_Secretary.DTO.SearchDTO.PolicyDetailResponse;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.domain.user.UserProfile;
import AI_Secretary.repository.User.UserProfileRepository;
import AI_Secretary.service.PolicyQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyQueryService policyQueryService;
    private final UserProfileRepository userProfileRepository;  // 🔥 추가

    @GetMapping("/recommended")
    public ResponseEntity<?> getRecommended(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Long userId = userDetails.getUserId();

        // 🔥 Security에 들고 있던 user에서 profile을 꺼내지 말고, 레포지토리로 다시 조회
        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(null);

        String regionCtpv = (profile != null) ? profile.getRegionCode() : null;

        var policies = policyQueryService.getRecommendedPolicies(
                userId,
                limit
        );
        return ResponseEntity.ok(policies);
    }

    // 검색바용
    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(required = false) String keyword
    ) {
        var list = policyQueryService.searchPolicies(keyword);
        return ResponseEntity.ok(list);
    }

    //상세 내용 출력
    @GetMapping("/{policyId}")
    public PolicyDetailResponse getPolicyDetail(
            @PathVariable Long policyId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails != null ? userDetails.getUserId() : null;
        return policyQueryService.getPolicyDetail(policyId, userId);
    }
}