package AI_Secretary.controller.user;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.MyInfoResponse;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.SettingsResponse;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.UpdateUserProfileRequest;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.UserProfileResponse;
import AI_Secretary.DTO.MainPageDTO.UpdateSettingsRequest;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.service.User.UserOnboardingService;
import AI_Secretary.service.User.UserProfileService;
import AI_Secretary.service.User.UserQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserQueryService userQueryService;
    private final UserProfileService userProfileService;      // 🔥 프로필/온보딩용
    private final UserOnboardingService userOnboardingService; // (관심사 저장 이미 구현되어 있다면)

    // 1) 내 기본 정보
    @GetMapping("/me")
    public ResponseEntity<MyInfoResponse> getMyInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        MyInfoResponse response = userQueryService.getMyInfo(userId);
        return ResponseEntity.ok(response);
    }

    // 2) 내 설정 조회
    @GetMapping("/settings")
    public ResponseEntity<SettingsResponse> getSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        SettingsResponse response = userQueryService.getSettings(userId);
        return ResponseEntity.ok(response);
    }

    // 3) 내 설정 수정
    @PutMapping("/settings")
    public ResponseEntity<SettingsResponse> updateSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateSettingsRequest request
    ) {
        Long userId = userDetails.getUserId();
        SettingsResponse response = userQueryService.updateSettings(userId, request);
        return ResponseEntity.ok(response);
    }

    // 4) 🔥 온보딩/마이페이지 - 내 프로필 조회
    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getUserId();
        UserProfileResponse response = userProfileService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    // 5) 🔥 온보딩/마이페이지 - 내 프로필 + 관심사 수정
    @PutMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateUserProfileRequest request
    ) {
        Long userId = userDetails.getUserId();
        // 여기 안에서 userProfileService가:
        // - UserProfile 업데이트
        // - UserInterests (categoryCodes) 업데이트
        // - onboardingCompleted 플래그 true로 세팅
        UserProfileResponse response = userProfileService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }
}