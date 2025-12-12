package AI_Secretary.DTO.AlarmDto;

public record NotificationSummaryDto(
        Long id,
        String type,          // CHANGE_POLICY / DEADLINE / INFO ...
        String title,
        String messagePreview,
        boolean isRead,
        String createdAt,
        boolean hasReport,
        Long policyId,// 정책 변경 레포트 연결 여부
        Long reportId
) {
}
