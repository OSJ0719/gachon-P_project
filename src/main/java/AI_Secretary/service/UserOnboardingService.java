package AI_Secretary.service;

import java.util.List;

import AI_Secretary.DTO.MainPageDTO.UpdateInterestsRequest;
import AI_Secretary.domain.categories;
import AI_Secretary.domain.user.UserInterests;
import AI_Secretary.domain.user.UserInterestsId;
import AI_Secretary.domain.user.UserProfile;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.search.CategoryRepository;
import AI_Secretary.repository.User.UserInterestsRepository;
import AI_Secretary.repository.User.UserProfileRepository;
import AI_Secretary.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserOnboardingService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserInterestsRepository userInterestRepository;
    private final CategoryRepository categoryRepository;

    public void updateInterests(Long userId, UpdateInterestsRequest request) {
        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 1) 기존 관심사 전부 삭제
        userInterestRepository.deleteByUserId(userId);

        // 2) 신규 관심사 등록
        if (request.categoryCodes() != null && !request.categoryCodes().isEmpty()) {
            List<categories> categories = categoryRepository.findByCodeIn(request.categoryCodes());

            // (선택) 존재하지 않는 코드가 있으면 예외를 던지고 싶다면 여기서 검증 가능
            // Set<String> foundCodes = categories.stream().map(categories::getCode).collect(Collectors.toSet());
            // ...

            for (categories category : categories) {
                UserInterests interest = UserInterests.builder()
                        .id(new UserInterestsId(userId, category.getCode()))
                        .user(user)
                        .category(category)
                        .build();
                userInterestRepository.save(interest);
            }
        }

        // 3) 온보딩 완료 플래그 세팅 (기존 프로필 유지)
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> {
                    // 프로필이 아직 없으면 최소 정보로 생성
                    UserProfile p = UserProfile.builder()
                            .id(user.getId())
                            .user(user)
                            .build();
                    return userProfileRepository.save(p);
                });

        profile.markOnboardingCompleted();
        // 별도 save 호출 불필요: @Transactional + JPA 더티체킹으로 플러시됨
    }
}