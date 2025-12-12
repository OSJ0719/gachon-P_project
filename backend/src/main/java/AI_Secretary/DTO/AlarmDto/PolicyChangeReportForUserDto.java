package AI_Secretary.DTO.AlarmDto;

public record PolicyChangeReportForUserDto(
        Long reportId,
        Long policyId,
        String policyName,
        String summary,          // 변경 요약 (카드 본문)
        String whatChanged,      // 구체적인 변경 내용
        String fromWhen,         // 언제부터 적용
        String actionGuide,      // 사용자가 지금 뭘 하면 되는지
        String impactType,       // POSITIVE/NEGATIVE/NEUTRAL
        String userImpactSummary,// "현재 나이 ~ → 신청 불가" 식 요약
        String beforeSummary,    // 전/후 비교용
        String afterSummary
) {
}
