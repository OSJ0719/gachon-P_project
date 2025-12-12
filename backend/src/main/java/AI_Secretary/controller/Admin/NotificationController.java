package AI_Secretary.controller.Admin;

import AI_Secretary.DTO.AlarmDto.NotificationDetailResponse;
import AI_Secretary.DTO.AlarmDto.NotificationSummaryDto;
import AI_Secretary.Security.CustomUserDetails;
import AI_Secretary.service.Menu.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationSummaryDto>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        var list = notificationService.getMyNotifications(user.getUserId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationDetailResponse> getNotificationDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        var dto = notificationService.getNotificationDetail(user.getUserId(), id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        notificationService.getNotificationDetail(user.getUserId(), id); // 안에서 읽음 처리
        return ResponseEntity.ok().build();
    }
}