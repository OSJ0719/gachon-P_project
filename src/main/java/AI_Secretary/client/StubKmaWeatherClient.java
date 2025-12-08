package AI_Secretary.client;

import AI_Secretary.DTO.MainPageDTO.WeatherSummaryDto;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class StubKmaWeatherClient implements KmaWeatherClient {
    @Override
    public WeatherSummaryDto fetchTodayWeather(String regionCode, String regionName, LocalDate date) {
        // TODO: 나중에 실제 기상청 API 연동으로 교체
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
                "테스트용 더미 날씨입니다."  // summary
        );
    }
}
