package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.MyInfoResponse;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.SettingsResponse;
import AI_Secretary.DTO.MainPageDTO.UpdateSettingsRequest;
import AI_Secretary.domain.user.UserProfile;
import AI_Secretary.domain.user.UserSettings;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.User.UserInterestsRepository;
import AI_Secretary.repository.User.UserProfileRepository;
import AI_Secretary.repository.User.UserRepository;
import AI_Secretary.repository.User.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserQueryService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserInterestsRepository userInterestsRepository;
    private final UserSettingsRepository userSettingsRepository;

    @Transactional(readOnly = true)
    public MyInfoResponse getMyInfo(Long userId) {
        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found: " + userId));

        UserProfile profile = userProfileRepository.findById(userId).orElse(null);

        // 관심 카테고리 코드 목록
        List<String> interests = userInterestsRepository.findByUser_Id(userId)
                .stream()
                .map(ui -> ui.getCategory().getCode())
                .toList();

        String phone = (profile != null) ? profile.getPhone() : null;
        Integer age  = (profile != null) ? profile.getAge()  : null;
        Boolean onboardingCompleted = (profile != null) ? profile.getOnboardingCompleted() : null;

        MyInfoResponse.RegionDto regionDto = null;
        if (profile != null) {
            regionDto = new MyInfoResponse.RegionDto(
                    profile.getRegionCtpv(),  // city
                    profile.getRegionSgg(),   // district
                    profile.getRegionDong()   // dong
            );
        }

        return new MyInfoResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                phone,
                age,
                regionDto,
                onboardingCompleted,
                interests
        );
    }
    @Transactional(readOnly = true)
    public SettingsResponse getSettings(Long userId) {
        return userSettingsRepository.findByUser_Id(userId)
                .map(s -> new SettingsResponse(
                        s.getNotifyPolicyChanges(),
                        s.getNotifyCalendarAlerts(),
                        s.getNotifyMarketing()
                ))
                .orElseGet(() -> new SettingsResponse(
                        true,
                        true,
                        false
                ));
    }

    @Transactional
    public SettingsResponse updateSettings(Long userId, UpdateSettingsRequest request) {

        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found: " + userId));

        UserSettings settings = userSettingsRepository.findByUser_Id(userId)
                .orElse(null);

        if (settings == null) {
            settings = UserSettings.createDefault(
                    user,
                    request.notifyPolicyChanges(),
                    request.notifyCalendarAlerts(),
                    request.notifyMarketing()
            );
        } else {
            settings.updateFrom(
                    request.notifyPolicyChanges(),
                    request.notifyCalendarAlerts(),
                    request.notifyMarketing()
            );
        }

        UserSettings saved = userSettingsRepository.save(settings);

        return new SettingsResponse(
                saved.getNotifyPolicyChanges(),
                saved.getNotifyCalendarAlerts(),
                saved.getNotifyMarketing()
        );
    }
}