package AI_Secretary.DTO.MainPageDTO;

import java.time.LocalDate;

public record WeatherSummaryDto (
        String regionCode,
        String regionName,
        LocalDate baseDate,
        Double tempCurrent,
        Double tempMin,
        Double tempMax,
        Integer humidity,
        Integer precipChance,
        String skyCondition,
        String summary
)
{}
