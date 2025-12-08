package AI_Secretary.controller;

import AI_Secretary.DTO.MainPageDTO.HomeSummaryResponse;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
public class HomeController {
    private final HomeService homeService;

    @GetMapping("/summary")
    public ResponseEntity<HomeSummaryResponse> getHomeSummary(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(homeService.getHomeSummary(userDetails));
    }
}
