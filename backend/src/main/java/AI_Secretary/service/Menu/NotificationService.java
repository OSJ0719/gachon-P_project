package AI_Secretary.service.Menu;

import AI_Secretary.DTO.AlarmDto.NotificationDetailResponse;
import AI_Secretary.DTO.AlarmDto.NotificationSummaryDto;
import AI_Secretary.DTO.AlarmDto.PolicyChangeReportForUserDto;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.subMenus.Notification;
import AI_Secretary.domain.subMenus.PolicyChangeReport;
import AI_Secretary.domain.user.users;
import AI_Secretary.repository.Alarm.NotificationRepository;
import AI_Secretary.repository.Alarm.PolicyChangeReportRepository;
import AI_Secretary.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PolicyChangeReportRepository policyChangeReportRepository;
    private static final DateTimeFormatter DATE_TIME_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    /**
     * ✅ 내 알림 목록 조회
     */
    @Transactional(readOnly = true)
    public List<NotificationSummaryDto> getMyNotifications(Long userId) {
        List<Notification> list = notificationRepository
                .findByUser_IdOrderByCreatedAtDesc(userId);

        return list.stream()
                .map(this::toSummaryDto)
                .toList();
    }

    private NotificationSummaryDto toSummaryDto(Notification n) {
        boolean hasReport = (n.getPolicyChangeReport() != null);
        Long reportId = hasReport ? n.getPolicyChangeReport().getId() : null;

        String preview = n.getMessage();
        if (preview != null && preview.length() > 40) {
            preview = preview.substring(0, 40) + "...";
        }

        return new NotificationSummaryDto(
                n.getId(),
                n.getType() != null ? n.getType().name() : null,
                n.getTitle(),
                preview,
                n.isRead(),
                n.getCreatedAt() != null ? n.getCreatedAt().format(DATE_TIME_FMT) : null,
                hasReport,
                n.getPolicyId(),
                reportId
        );
    }
    /**
     * ✅ 알림 상세 조회 (+변경 레포트 포함)
     *    - 여기에서 읽음 처리까지 같이 해버리는 버전
     */
    @Transactional
    public NotificationDetailResponse getNotificationDetail(Long userId, Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다. id=" + notificationId));

        if (!n.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("다른 사용자의 알림에 접근할 수 없습니다.");
        }

        // 읽음 처리
        if (!n.isRead()) {
            n.markAsRead(); // or n.setRead(true); n.setReadAt(LocalDateTime.now());
        }

        PolicyChangeReportForUserDto reportDto =
                n.getPolicyChangeReport() != null ? toUserReportDto(n.getPolicyChangeReport()) : null;

        return new NotificationDetailResponse(
                n.getId(),
                n.getType() != null ? n.getType().name() : null,
                n.getTitle(),
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt() != null ? n.getCreatedAt().format(DATE_TIME_FMT) : null,
                n.getReadAt() != null ? n.getReadAt().format(DATE_TIME_FMT) : null,
                reportDto
        );
    }

    /**
     * ✅ 읽음 처리만 따로 하는 API용
     */
    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        Notification n = notificationRepository.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다. id=" + notificationId));
        n.markAsRead();
    }

    private PolicyChangeReportForUserDto toUserReportDto(PolicyChangeReport r) {
        PolicyData p = r.getPolicy();

        return new PolicyChangeReportForUserDto(
                r.getId(),
                p != null ? p.getId() : null,
                p != null ? p.getName() : null,
                r.getSummary(),
                r.getWhatChanged(),
                r.getFromWhen(),
                r.getActionGuide(),
                r.getImpactType() != null ? r.getImpactType().name() : null,
                r.getUserImpactSummary(),
                r.getBeforeSummary(),
                r.getAfterSummary()
        );
    }
    @Transactional
    public Notification createNotification(Long userId,
                                           String type,   // 예: "CHANGE_POLICY"
                                           String title,
                                           String message,
                                           Long reportId) // null 가능
    {
        // 1) 유저 엔티티 조회
        users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id=" + userId));

        // 2) 타입 enum 변환 (NotificationType 같은 enum을 쓰고 있다고 가정)
        Notification.NotificationType notificationType = Notification.NotificationType.valueOf(type);

        // 3) 변경 레포트 연결 (선택)
        PolicyChangeReport report = null;
        if (reportId != null) {
            // PolicyChangeReportRepository 를 주입해두고 사용
            report = policyChangeReportRepository.findById(reportId)
                    .orElseThrow(() -> new IllegalArgumentException("레포트를 찾을 수 없습니다. id=" + reportId));
        }

        // 4) 알림 엔티티 생성
        Notification notification = Notification.builder()
                .user(user)
                .type(notificationType)
                .title(title)
                .message(message)
                .read(false)
                .policyChangeReport(report)
                .build();

        // createdAt은 BaseTimeEntity @PrePersist 에서 자동 설정될 가능성이 큼
        return notificationRepository.save(notification);
    }
}
