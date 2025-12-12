package AI_Secretary.controller.Home;


import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.CalendarEventDto;
import AI_Secretary.DTO.MainPageDTO.SideMenuDTO.CalendarEventRequest;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.service.Menu.CalendarCommandService;
import AI_Secretary.service.Menu.CalendarQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/calendar")
public class CalendarController {
    private final CalendarQueryService calendarQueryService;
    private final CalendarCommandService calendarCommandService;

    @GetMapping("/events")
    public ResponseEntity<?> getEvents(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        var events = calendarQueryService.getEvents(userDetails.getUserId(), date);
        return ResponseEntity.ok(events);
    }
    @PostMapping("/events")
    public CalendarEventDto upsertEvent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CalendarEventRequest request
    ) {
        Long userId = userDetails.getUserId();
        return calendarCommandService.upsertEvent(userId, request);
    }

    // 삭제: 칸을 비우면 FE가 GET으로 eventId 넘겨서 삭제
    @GetMapping("/events/delete")
    public void deleteEvent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String date   // "2025-12-05"
    ) {
        Long userId = userDetails.getUserId();
        calendarCommandService.deleteEvent(userId, date);
    }
}
