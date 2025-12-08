package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.UpdateUserProfileRequest;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.UserProfileResponse;
import AI_Secretary.domain.categories;
import AI_Secretary.domain.user.UserInterests;
import AI_Secretary.domain.user.UserInterestsId;
import AI_Secretary.domain.user.UserProfile;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.User.UserInterestsRepository;
import AI_Secretary.repository.User.UserProfileRepository;
import AI_Secretary.repository.User.UserRepository;
import AI_Secretary.repository.search.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserInterestsRepository userInterestsRepository;
    private final CategoryRepository categoryRepository;

    /**
     * 온보딩/마이페이지에서 내 프로필 + 관심사 + 복지정보 업데이트
     */
    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateUserProfileRequest req) {

        // 1) 유저 조회
        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 2) 프로필 조회 or 생성
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> userProfileRepository.save(
                        UserProfile.builder()
                                .id(user.getId())
                                .user(user)
                                .build()
                ));

        // 3) 나이
        if (req.age() != null) {
            profile.updateAge(req.age());
        }

        // 4) 지역 정보 (regionCtpv / regionSgg / regionDong)
        if (req.regionCtpv() != null || req.regionSgg() != null || req.regionDong() != null) {
            profile.updateRegion(
                    req.regionCtpv(),
                    req.regionSgg(),
                    req.regionDong()
            );
        }

        // 5) 복지 정보 (incomeLevel / hasDisability / livingAlone)
        if (req.incomeLevel() != null
                || req.hasDisability() != null
                || req.livingAlone() != null) {

            profile.updateWelfareInfo(
                    req.incomeLevel(),
                    Boolean.TRUE.equals(req.hasDisability()),
                    Boolean.TRUE.equals(req.livingAlone())
            );
        }

        // 6) 관심 카테고리 재설정
        //    🔥 리포지토리 메서드 이름에 맞춰서 사용
        userInterestsRepository.deleteByUserId(userId);   // 또는 deleteByUserId(userId);

        List<String> codesFromReq = (req.interestCodes() != null)
                ? req.interestCodes()
                : List.of();

        if (!codesFromReq.isEmpty()) {
            // code IN (...)으로 카테고리 엔티티 조회
            List<categories> categoryEntities = categoryRepository.findByCodeIn(codesFromReq);

            List<UserInterests> newInterests = categoryEntities.stream()
                    .map(cat -> UserInterests.builder()
                            .id(new UserInterestsId(userId, cat.getCode()))
                            .user(user)
                            .category(cat)
                            .build()
                    )
                    .toList();

            userInterestsRepository.saveAll(newInterests);
        }

        // 7) 온보딩 완료 플래그
        profile.markOnboardingCompleted();

        // 8) 실제 DB에 들어간 관심 코드들 다시 읽어서 응답 구성
        List<UserInterests> interests = userInterestsRepository.findByUser_Id(userId);
        List<String> finalCodes = interests.stream()
                .map(i -> i.getCategory().getCode())
                .toList();

        return new UserProfileResponse(
                profile.getAge(),
                profile.getRegionCtpv(),
                profile.getRegionSgg(),
                profile.getRegionDong(),
                finalCodes,
                Boolean.TRUE.equals(profile.getOnboardingCompleted())
        );
    }
    /**
     * 내 프로필 조회 (마이페이지 진입 시)
     */
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {

        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("프로필이 존재하지 않습니다."));

        List<UserInterests> interests = userInterestsRepository.findByUser_Id(userId);
        List<String> codes = interests.stream()
                .map(i -> i.getCategory().getCode())
                .toList();

        return new UserProfileResponse(
                profile.getAge(),
                profile.getRegionCtpv(),
                profile.getRegionSgg(),
                profile.getRegionDong(),
                codes,
                Boolean.TRUE.equals(profile.getOnboardingCompleted())
        );
    }
}