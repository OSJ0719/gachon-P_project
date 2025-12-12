package AI_Secretary.service.Menu;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.CalendarEventDto;
import AI_Secretary.DTO.MainPageDTO.HomeSummaryResponse;
import AI_Secretary.DTO.SearchDTO.PolicySummaryDto;
import AI_Secretary.DTO.MainPageDTO.Weather.WeatherSummaryDto;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.domain.subMenus.CalendarEvent;
import AI_Secretary.domain.user.UserProfile;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.sideService.CalendarEventRepository;
import AI_Secretary.repository.User.UserProfileRepository;
import AI_Secretary.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final WeatherService weatherService;
    private final CalendarEventRepository calendarEventRepository;
    private final PolicyQueryService policyQueryService;
    private static final String DEFAULT_REGION_CODE = "55_127";   // 서울 중구 격자 예시
    private static final String DEFAULT_REGION_NAME = "서울중구";

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");

    @Transactional
    public HomeSummaryResponse getHomeSummary(CustomUserDetails userDetails, Double lat, Double lon) {

        // 0) Security에서 꺼낸 엔티티는 "id만" 쓰고, 진짜 엔티티는 다시 조회
        Long userId = userDetails.getUser().getId();

        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found: " + userId));

        // 🔥 프로필은 LAZY 연관을 타지 말고, repo로 직접 조회
        UserProfile profile = userProfileRepository.findById(userId)
                .orElse(null);

        String regionCode =
                (profile != null && profile.getRegionCode() != null && !profile.getRegionCode().isBlank())
                        ? profile.getRegionCode()
                        : DEFAULT_REGION_CODE;

        String regionName =
                (profile != null && profile.getRegionName() != null && !profile.getRegionName().isBlank())
                        ? profile.getRegionName()
                        : DEFAULT_REGION_NAME;
        Integer age      = profile != null ? profile.getAge()        : null;

        LocalDate today = LocalDate.now(KOREA_ZONE);

        // 1) 오늘 날씨 (users 통째로 넘기지 말고, 필요한 정보만 넘긴다)
        WeatherSummaryDto weather = weatherService.getTodayWeatherWithLocation(lat,lon,regionCode,regionName);

        // 2) 오늘 일정
        List<CalendarEvent> events = calendarEventRepository
                .findByUserIdAndDateOrderByStartTimeAsc(userId, today);

        List<CalendarEventDto> eventDtos = events.stream()
                .map(e -> new CalendarEventDto(
                        e.getId(),
                        e.getDate(),
                        e.getTitle(),
                        e.getMemo(),
                        e.getStartTime(),
                        e.getEndTime(),
                        // 여기서는 어차피 id만 쓰니까 LAZY라도 문제 없음
                        e.getPolicy() != null ? e.getPolicy().getId() : null,
                        e.getDocument() != null ? e.getDocument().getId() : null
                ))
                .toList();

        // 3) 추천 정책
        //    regionCode를 regionCtpv 처럼 쓸지, 실제 정책의 region_ctpv와 맞출지는 규칙에 따라
        List<PolicySummaryDto> recommended =
                policyQueryService.getRecommendedPolicies(userId, 5);
        List<PolicySummaryDto> policyDtos = recommended;

        return new HomeSummaryResponse(weather, eventDtos, policyDtos);
    }
}