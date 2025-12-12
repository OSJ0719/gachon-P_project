package AI_Secretary.service.Menu;

import AI_Secretary.DTO.MainPageDTO.Weather.WeatherSummaryDto;
import AI_Secretary.client.KmaWeatherClient;
import AI_Secretary.domain.DailyWeatherCache;
import AI_Secretary.repository.sideService.DailyWeatherCacheRepository;
import AI_Secretary.util.KmaGridConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WeatherService {

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");

    private final DailyWeatherCacheRepository dailyWeatherCacheRepository;
    private final KmaWeatherClient kmaWeatherClient;

    // TODO: 나중에 유저별 기본값으로 교체
    private static final String DEFAULT_REGION_CODE = "55_127";   // 예: 서울 중구 격자 (예시)
    private static final String DEFAULT_REGION_NAME = "서울중구";

    /**
     * regionCode / regionName 기준으로 "오늘" 초단기 실황 요약을 조회.
     * 1) 오늘 캐시 있으면 재사용
     * 2) 없으면 KMA 초단기실황 호출 후 캐시 저장
     * 3) 실패 시 최소 요약 정보만 채운 fallback 반환
     */
    @Transactional(readOnly = true)
    public WeatherSummaryDto getTodayWeatherWithLocation(
            Double lat,
            Double lon,
            String userRegionCode,
            String userRegionName
    ) {
        String effectiveRegionCode;
        String effectiveRegionName;

        if (lat != null && lon != null) {
            // 1) GPS가 들어온 경우 → 격자로 변환해서 regionCode 생성
            KmaGridConverter.GridPoint grid = KmaGridConverter.toGrid(lat, lon);
            effectiveRegionCode = grid.regionCode();
            // regionName은 역지오코딩을 안 하니까 일단 "현재 위치" 또는 유저 설정값 재사용
            effectiveRegionName = (userRegionName != null && !userRegionName.isBlank())
                    ? userRegionName
                    : "현재 위치";
        } else if (userRegionCode != null && !userRegionCode.isBlank()) {
            // 2) GPS는 없고, 사용자 기본 지역이 있는 경우
            effectiveRegionCode = userRegionCode;
            effectiveRegionName = (userRegionName != null && !userRegionName.isBlank())
                    ? userRegionName
                    : "기본 지역";
        } else {
            // 3) 둘 다 없으면 시스템 기본값 사용
            effectiveRegionCode = DEFAULT_REGION_CODE;
            effectiveRegionName = DEFAULT_REGION_NAME;
        }

        return getTodayWeather(effectiveRegionCode, effectiveRegionName);
    }
    @Transactional
    public WeatherSummaryDto getTodayWeather(String regionCode, String regionName) {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        // 1. 캐시 조회
        Optional<DailyWeatherCache> cacheOpt =
                dailyWeatherCacheRepository.findByRegionCodeAndBaseDate(regionCode, today);

        if (cacheOpt.isPresent()) {
            return toDto(cacheOpt.get(), regionName);
        }

        // 2. 외부 API 호출
        WeatherSummaryDto fromApi = null;
        try {
            fromApi = kmaWeatherClient.fetchTodayWeather(regionCode, regionName, today);
        } catch (Exception e) {
            // 서비스 죽지 않게 예외 삼킴 (로그는 Client에서 남김)
        }

        if (fromApi == null) {
            // 3. API도 실패 → fallback
            return new WeatherSummaryDto(
                    regionCode,
                    regionName,
                    today,
                    null,
                    null,
                    null,
                    null,
                    null,
                    "정보 없음",
                    "날씨 정보를 불러오지 못했습니다."
            );
        }

        // 4. API 결과 캐시에 저장
        DailyWeatherCache saved = dailyWeatherCacheRepository.save(
                DailyWeatherCache.builder()
                        .regionCode(regionCode)
                        .baseDate(fromApi.baseDate())
                        .tempCurrent(toBigDecimal(fromApi.tempCurrent()))
                        .tempMin(toBigDecimal(fromApi.tempMin()))
                        .tempMax(toBigDecimal(fromApi.tempMax()))
                        .humidity(fromApi.humidity())
                        .precipChance(fromApi.precipChance())
                        .skyCondition(fromApi.skyCondition())
                        .weatherSummary(fromApi.summary())
                        .build()
        );

        return toDto(saved, regionName);
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private WeatherSummaryDto toDto(DailyWeatherCache cache, String regionName) {
        return new WeatherSummaryDto(
                cache.getRegionCode(),
                regionName,
                cache.getBaseDate(),
                cache.getTempCurrent() != null ? cache.getTempCurrent().doubleValue() : null,
                cache.getTempMin() != null ? cache.getTempMin().doubleValue() : null,
                cache.getTempMax() != null ? cache.getTempMax().doubleValue() : null,
                cache.getHumidity(),
                cache.getPrecipChance(),
                cache.getSkyCondition(),
                cache.getWeatherSummary()
        );
    }
}
