package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.WeatherSummaryDto;
import AI_Secretary.client.KmaWeatherClient;
import AI_Secretary.domain.DailyWeatherCache;
import AI_Secretary.repository.sideService.DailyWeatherCacheRepository;
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

    private final DailyWeatherCacheRepository cacheRepository;
    private final KmaWeatherClient kmaWeatherClient;

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");

    @Transactional(readOnly = true)
    public WeatherSummaryDto getTodayWeather(String regionCode, String regionName) {
        LocalDate today = LocalDate.now(KOREA_ZONE);

        if (regionCode == null || regionCode.isBlank()) {
            // 지역 정보 없으면 그냥 null 또는 기본값 반환 (정책은 너가 결정)
            return null;
        }

        // 1) 캐시 조회
        Optional<DailyWeatherCache> cacheOpt =
                cacheRepository.findByRegionCodeAndBaseDate(regionCode, today);

        if (cacheOpt.isPresent()) {
            DailyWeatherCache cache = cacheOpt.get();
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

        // 2) 캐시에 없으면 KMA에서 가져와서 저장 (StubKmaWeatherClient든 진짜든)
        WeatherSummaryDto fromApi = kmaWeatherClient.fetchTodayWeather(regionCode, regionName, today);

        DailyWeatherCache saved = cacheRepository.save(
                DailyWeatherCache.builder()
                        .regionCode(regionCode)
                        .baseDate(today)
                        .tempCurrent(fromApi.tempCurrent() != null
                                ? BigDecimal.valueOf(fromApi.tempCurrent())
                                : null)
                        .tempMin(fromApi.tempMin() != null
                                ? BigDecimal.valueOf(fromApi.tempMin())
                                : null)
                        .tempMax(fromApi.tempMax() != null
                                ? BigDecimal.valueOf(fromApi.tempMax())
                                : null)
                        .humidity(fromApi.humidity())
                        .precipChance(fromApi.precipChance())
                        .skyCondition(fromApi.skyCondition())
                        .weatherSummary(fromApi.summary())
                        .expiresAt(LocalDateTime.now().plusHours(3))
                        .build()
        );

        return new WeatherSummaryDto(
                saved.getRegionCode(),
                regionName,
                saved.getBaseDate(),
                saved.getTempCurrent() != null ? saved.getTempCurrent().doubleValue() : null,
                saved.getTempMin() != null ? saved.getTempMin().doubleValue() : null,
                saved.getTempMax() != null ? saved.getTempMax().doubleValue() : null,
                saved.getHumidity(),
                saved.getPrecipChance(),
                saved.getSkyCondition(),
                saved.getWeatherSummary()
        );
    }
}