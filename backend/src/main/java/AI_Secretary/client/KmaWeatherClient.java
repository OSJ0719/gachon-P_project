package AI_Secretary.client;

import AI_Secretary.DTO.MainPageDTO.Weather.WeatherSummaryDto;

import java.time.LocalDate;

public interface KmaWeatherClient {
    WeatherSummaryDto fetchTodayWeather(String regionCode, String regionName, LocalDate date);
}