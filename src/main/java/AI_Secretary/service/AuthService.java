package AI_Secretary.service;

import AI_Secretary.DTO.AuthDTO.AuthResponse;
import AI_Secretary.DTO.AuthDTO.ChangePasswordRequest;
import AI_Secretary.DTO.AuthDTO.LoginRequest;
import AI_Secretary.DTO.AuthDTO.SignupRequest;
import AI_Secretary.domain.user.UserProfile;
import AI_Secretary.domain.user.users;
import AI_Secretary.jwt.JwtTokenProvider;
import AI_Secretary.repository.search.CategoryRepository;
import AI_Secretary.repository.User.UserInterestsRepository;
import AI_Secretary.repository.User.UserProfileRepository;
import AI_Secretary.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserInterestsRepository userInterestRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 1) 사용자 생성 (이름 + 아이디 + 비밀번호)
        users user = users.builder()
                .username(request.username())
                .name(request.name())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role("USER")
                .build();
        user = userRepository.save(user);

        // 2) 프로필은 비어 있는 상태로 생성 (age/region은 추후 온보딩에서 설정)
        UserProfile profile = UserProfile.builder()
                .user(user)
                .age(null)
                .regionCode(null)
                .regionName(null)
                .build();
        userProfileRepository.save(profile);

        // 3) 관심 카테고리는 온보딩 단계에서 따로 설정하므로 여기선 X

        // 4) JWT 발급
        String token = jwtTokenProvider.generateToken(user.getUsername());
        long expiresIn = jwtTokenProvider.getAccessTokenValidityInMs() / 1000;

        return AuthResponse.of(token, expiresIn);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        users user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.generateToken(user.getUsername());
        long expiresIn = jwtTokenProvider.getAccessTokenValidityInMs() / 1000;

        return AuthResponse.of(token, expiresIn);
    }

    @Transactional
    public void changePassword(users user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        user.changePassword(passwordEncoder.encode(request.newPassword()));
        // user는 영속 상태라 별도 save() 안 해도 flush 시점에 반영됨
    }
}