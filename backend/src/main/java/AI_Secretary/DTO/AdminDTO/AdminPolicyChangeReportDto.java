package AI_Secretary.DTO.AdminDTO;

public record AdminPolicyChangeReportDto(
        Long id,
        Long policyId,
        String policyName,

        String title,
        String summary,
        String whatChanged,
        String whoAffected,
        String fromWhen,
        String actionGuide,

        String reportType,        // NEW_POLICY / CHANGE_POLICY
        String status,            // DRAFT / APPROVED
        String impactType,        // POSITIVE / NEGATIVE / NEUTRAL (nullable)

        String userImpactSummary, // "현재 나이 만 72세 → 신청 불가" 등
        String beforeSummary,
        String afterSummary,

        String createdAt
) {
}
