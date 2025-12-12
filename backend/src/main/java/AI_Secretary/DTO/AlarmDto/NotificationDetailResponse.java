package AI_Secretary.DTO.AlarmDto;

public record NotificationDetailResponse(
        Long id,
        String type,
        String title,
        String message,
        boolean isRead,
        String createdAt,
        String readAt,
        PolicyChangeReportForUserDto report  // null 가능
) {
}
