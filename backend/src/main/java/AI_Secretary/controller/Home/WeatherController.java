package AI_Secretary.controller.Home;

import AI_Secretary.DTO.MainPageDTO.Weather.WeatherSummaryDto;
import AI_Secretary.service.Menu.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    /**
     * 예시: /api/v1/weather/today?regionCode=11110&regionName=서울중구
     * 실제론 GPS → regionCode/regionName 매핑 후 FE에서 보내주면 됨
     */
    @GetMapping("/today")
    public ResponseEntity<WeatherSummaryDto> getTodayWeather(
            @RequestParam String regionCode,
            @RequestParam String regionName
    ) {
        WeatherSummaryDto dto = weatherService.getTodayWeather(regionCode, regionName);
        return ResponseEntity.ok(dto);
    }
}