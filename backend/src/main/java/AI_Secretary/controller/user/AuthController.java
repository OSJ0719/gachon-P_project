package AI_Secretary.controller.user;

import AI_Secretary.DTO.AuthDTO.AuthResponse;
import AI_Secretary.DTO.AuthDTO.ChangePasswordRequest;
import AI_Secretary.DTO.AuthDTO.LoginRequest;
import AI_Secretary.DTO.AuthDTO.SignupRequest;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.domain.user.users;
import AI_Secretary.service.Menu.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody @Valid SignupRequest request
    ) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/password/change")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid ChangePasswordRequest request
    ) {
        users user = userDetails.getUser();
        authService.changePassword(user, request);
        return ResponseEntity.noContent().build();
    }
}