package AI_Secretary.service;

import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.CalendarEventDto;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.CalendarEventRequest;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.subMenus.CalendarEvent;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.User.UserRepository;
import AI_Secretary.repository.search.DocumentRepository;
import AI_Secretary.repository.search.PolicyDataRepository;
import AI_Secretary.repository.sideService.CalendarEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional
public class CalendarCommandService {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;

    public CalendarEventDto upsertEvent(Long userId, CalendarEventRequest req) {

        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        LocalDate date = LocalDate.parse(req.date());

        // ← ★ 포인트: 날짜 기준으로 기존 일정 찾기
        CalendarEvent event = calendarEventRepository
                .findByUserIdAndDate(userId, date)
                .orElse(null);

        // 없으면 생성
        if (event == null) {
            event = CalendarEvent.builder()
                    .user(user)
                    .date(date)
                    .build();
        }

        // 내용 업데이트
        event.setTitle(req.title());
        event.setMemo(req.memo());

        if (req.startTime() != null && !req.startTime().isBlank()) {
            event.setStartTime(LocalTime.parse(req.startTime()));
        } else {
            event.setStartTime(null);
        }

        if (req.endTime() != null && !req.endTime().isBlank()) {
            event.setEndTime(LocalTime.parse(req.endTime()));
        } else {
            event.setEndTime(null);
        }

        CalendarEvent saved = calendarEventRepository.save(event);

        return new CalendarEventDto(
                saved.getId(),
                saved.getDate(),
                saved.getTitle(),
                saved.getMemo(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getPolicy() != null ? saved.getPolicy().getId() : null,
                saved.getDocument() != null ? saved.getDocument().getId() : null
        );
    }

    public void deleteEvent(Long userId, String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        calendarEventRepository.deleteByUserIdAndDate(userId, date);
    }
}