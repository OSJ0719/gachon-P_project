package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.CalendarEventDto;
import AI_Secretary.repository.sideService.CalendarEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CalendarQueryService {

    private final CalendarEventRepository calendarEventRepository;

    @Transactional(readOnly = true)
    public List<CalendarEventDto> getEvents(Long userId, LocalDate date) {
        return calendarEventRepository
                .findByUserIdAndDateOrderByStartTimeAsc(userId, date)
                .stream()
                .map(e -> new CalendarEventDto(
                        e.getId(),
                        e.getDate(),
                        e.getTitle(),
                        e.getMemo(),
                        e.getStartTime(),
                        e.getEndTime(),
                        e.getPolicy() != null ? e.getPolicy().getId() : null,
                        e.getDocument() != null ? e.getDocument().getId() : null
                ))
                .toList();
    }
}
