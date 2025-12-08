package AI_Secretary.DTO.MainPageDTO;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.CalendarEventDto;
import AI_Secretary.DTO.SearchDTO.PolicySummaryDto;

import java.util.List;

public record HomeSummaryResponse(
        WeatherSummaryDto weather,
        List<CalendarEventDto> todayEvents,
        List<PolicySummaryDto> recommendedPolicies
){}
