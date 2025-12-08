package AI_Secretary.DTO.AuthDTO;

import jakarta.validation.constraints.*;

public record SignupRequest(
        @NotBlank
        @Size(min = 3, max = 100)
        String username,   // 로그인 ID

        @NotBlank
        @Size(min = 2, max = 100)
        String name,       // 사용자 이름

        @NotBlank
        @Size(min = 8, max = 100)
        String password    // 비밀번호
) {
}
