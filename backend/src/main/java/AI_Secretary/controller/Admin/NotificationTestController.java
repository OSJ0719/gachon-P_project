package AI_Secretary.controller.Admin;

import AI_Secretary.DTO.AdminDTO.CreateNotificationRequestDto;
import AI_Secretary.domain.subMenus.Notification;
import AI_Secretary.service.Menu.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test/notifications")
@RequiredArgsConstructor
public class NotificationTestController { private final NotificationService notificationService;


    @PostMapping("/create")
    public ResponseEntity<CreateNotificationRequestDto> createTestNotification(@RequestParam Long userId) {
        Notification n = notificationService.createNotification(
                userId,
                "CHANGE_POLICY",
                "테스트 알림 제목",
                "테스트 알림 내용입니다.",
                null
        );

        CreateNotificationRequestDto dto = new CreateNotificationRequestDto(
                n.getId(),
                n.getType() != null ? n.getType().name() : null,
                n.getTitle()
        );

        return ResponseEntity.ok(dto);
    }
}
