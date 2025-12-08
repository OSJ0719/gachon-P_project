package AI_Secretary.DTO.MainPageDTO.SideMenuDTO;

import java.time.LocalDate;
import java.time.LocalTime;

public record CalendarEventDto(Long id,
                               LocalDate date,
                               String title,
                               String memo,
                               LocalTime startTime,
                               LocalTime endTime,
                               Long policyId,
                               Long documentId
)
{}
