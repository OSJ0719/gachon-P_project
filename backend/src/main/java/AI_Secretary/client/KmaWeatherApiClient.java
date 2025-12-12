package AI_Secretary.client;


import AI_Secretary.DTO.MainPageDTO.Weather.KmaUltraNowcastResponse;
import AI_Secretary.DTO.MainPageDTO.Weather.WeatherSummaryDto;
import AI_Secretary.config.KmaWeatherProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Slf4j
@Component
@Primary // Stub 대신 이 구현이 기본으로 주입되게 설정
@RequiredArgsConstructor
public class KmaWeatherApiClient implements KmaWeatherClient {

    private final RestTemplate weatherRestTemplate;
    private final KmaWeatherProperties properties;

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");

    @Override
    public WeatherSummaryDto fetchTodayWeather(String regionCode, String regionName, LocalDate date) {
        if (!properties.isEnabled()) {
            log.warn("KMA weather client is disabled by configuration, returning null");
            return null;
        }

        // TODO: regionCode → nx, ny 변환 로직 (지금은 임시값)
        int nx = 60;
        int ny = 127;

        String baseDate = date.format(DateTimeFormatter.BASIC_ISO_DATE);
        String baseTime = resolveBaseTime();

        URI uri = UriComponentsBuilder
                .fromHttpUrl(properties.getBaseUrl() + "/getUltraSrtNcst")
                .queryParam("serviceKey", properties.getServiceKey())
                .queryParam("pageNo", 1)
                .queryParam("numOfRows", 100)
                .queryParam("dataType", "JSON")
                .queryParam("base_date", baseDate)
                .queryParam("base_time", baseTime)
                .queryParam("nx", nx)
                .queryParam("ny", ny)
                .build(true)
                .toUri();

        log.info("Calling KMA UltraNowcast API: {}", uri);

        try {
            KmaUltraNowcastResponse response =
                    weatherRestTemplate.getForObject(uri, KmaUltraNowcastResponse.class);

            if (response == null ||
                    response.getResponse() == null ||
                    response.getResponse().getBody() == null ||
                    response.getResponse().getBody().getItems() == null ||
                    response.getResponse().getBody().getItems().getItem() == null ||
                    response.getResponse().getBody().getItems().getItem().isEmpty()) {

                log.warn("KMA ultra nowcast returned empty body");
                return null;
            }

            return mapToSummary(regionCode, regionName, date, response);
        } catch (Exception e) {
            log.error("Failed to call KMA UltraNowcast API", e);
            return null; // WeatherService에서 null 처리 후 fallback
        }
    }

    /**
     * 초단기실황 base_time 계산 (정시 단위, hh:10 이후 호출 가정)
     */
    private String resolveBaseTime() {
        LocalDateTime now = LocalDateTime.now(KOREA_ZONE);
        int hour = now.getHour();

        // 정시 단위로 내림 (예: 10:23 -> 10:00)
        return String.format("%02d00", hour);
    }

    private WeatherSummaryDto mapToSummary(
            String regionCode,
            String regionName,
            LocalDate date,
            KmaUltraNowcastResponse response
    ) {
        Double tempCurrent = null;
        Integer humidity = null;
        String skyCondition = "알 수 없음";
        Integer precipChance = null;

        for (KmaUltraNowcastResponse.Item item
                : response.getResponse().getBody().getItems().getItem()) {

            String cat = item.getCategory() != null
                    ? item.getCategory().toUpperCase(Locale.ROOT)
                    : "";

            String value = item.getObsrValue();

            switch (cat) {
                case "T1H" -> {
                    try {
                        tempCurrent = Double.valueOf(value);
                    } catch (NumberFormatException ignored) {}
                }
                case "REH" -> {
                    try {
                        humidity = Integer.valueOf(value);
                    } catch (NumberFormatException ignored) {}
                }
                case "PTY" -> {
                    skyCondition = mapPtyToSky(value);
                    precipChance = guessPrecipChanceFromPty(value);
                }
                case "RN1" -> {
                    // 1시간 강수량도 강수 가능성 보정에 사용할 수 있음
                    try {
                        double rn1 = Double.parseDouble(value);
                        if (rn1 > 0 && (precipChance == null || precipChance < 60)) {
                            precipChance = 60;
                        }
                    } catch (NumberFormatException ignored) {}
                }
                default -> {
                    // 다른 카테고리(WSD, VEC 등)는 지금은 사용 안 함
                }
            }
        }

        // 강수 확률이 여전히 null이면, 단순히 강수 없음으로 가정
        if (precipChance == null) {
            precipChance = 0;
        }

        String summary = buildSummary(regionName, tempCurrent, humidity, skyCondition, precipChance);

        return new WeatherSummaryDto(
                regionCode,
                regionName,
                date,
                tempCurrent,
                null,       // 초단기 실황만 쓰므로 일단 min/max는 null
                null,
                humidity,
                precipChance,
                skyCondition,
                summary
        );
    }

    private String mapPtyToSky(String ptyCode) {
        // PTY: 0 없음, 1 비, 2 비/눈, 3 눈, 4 소나기, 5 빗방울, 6 빗방울눈날림, 7 눈날림 등
        return switch (ptyCode) {
            case "0" -> "맑음";
            case "1", "5" -> "비";
            case "2", "6" -> "비 또는 눈";
            case "3", "7" -> "눈";
            case "4" -> "소나기";
            default -> "알 수 없음";
        };
    }

    private Integer guessPrecipChanceFromPty(String ptyCode) {
        return switch (ptyCode) {
            case "0" -> 0;
            case "1", "5" -> 80;
            case "2", "6" -> 70;
            case "3", "7" -> 60;
            case "4" -> 70;
            default -> 30;
        };
    }

    private String buildSummary(
            String regionName,
            Double tempCurrent,
            Integer humidity,
            String skyCondition,
            Integer precipChance
    ) {
        StringBuilder sb = new StringBuilder();

        sb.append(regionName != null ? regionName : "현재 위치")
                .append("의 날씨는 ").append(skyCondition).append("입니다.");

        if (tempCurrent != null) {
            sb.append(" 기온은 약 ").append(Math.round(tempCurrent)).append("도이고");
        }

        if (humidity != null) {
            sb.append(" 습도는 ").append(humidity).append("%입니다.");
        }

        if (precipChance != null && precipChance > 0) {
            sb.append(" 강수 가능성은 약 ").append(precipChance).append("%입니다.");
        }

        return sb.toString();
    }
}