package AI_Secretary.DTO.MainPageDTO.Weather;

import java.time.LocalDate;

public record WeatherSummaryDto(
        String regionCode,
        String regionName,
        LocalDate baseDate,
        Double tempCurrent,     // 현재 기온
        Double tempMin,         // (초단기 실황만 쓸 땐 null 허용)
        Double tempMax,         // (초단기 실황만 쓸 땐 null 허용)
        Integer humidity,       // 현재 습도
        Integer precipChance,   // 강수 확률(초단기에서는 heuristic으로 계산)
        String skyCondition,    // 맑음/비/눈 등 텍스트
        String summary          // 한 줄 요약 문장 (AI가 나중에 붙여도 됨)
) {

    /**
     * 개발/테스트용 더미 생성기
     */
    public static WeatherSummaryDto dummy(String regionCode, String regionName, LocalDate date) {
        return new WeatherSummaryDto(
                regionCode,
                regionName,
                date,
                20.0,   // tempCurrent
                18.0,   // tempMin
                25.0,   // tempMax
                60,     // humidity
                10,     // precipChance
                "맑음",  // skyCondition
                "테스트용 더미 날씨입니다."
        );
    }
}