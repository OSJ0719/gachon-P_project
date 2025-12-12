package AI_Secretary.controller.user;

import AI_Secretary.DTO.MainPageDTO.UpdateInterestsRequest;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.service.User.UserOnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/onboarding")
@RequiredArgsConstructor
public class UserOnboardingController {

    private final UserOnboardingService onboardingService;

    @PostMapping("/interests")
    public ResponseEntity<Void> updateInterests(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid UpdateInterestsRequest request
    ) {
        onboardingService.updateInterests(userDetails.getUserId(), request);
        return ResponseEntity.noContent().build();
    }
}