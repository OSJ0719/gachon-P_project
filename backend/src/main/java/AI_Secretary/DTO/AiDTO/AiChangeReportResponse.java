package AI_Secretary.DTO.AiDTO;

public record AiChangeReportResponse(
        String title,
        String summary,
        String whatChanged,
        String whoAffected,
        String fromWhen,
        String actionGuide,
        String impactType,        // "POSITIVE" / "NEGATIVE" / "NEUTRAL"
        String userImpactSummary,
        String beforeSummary,
        String afterSummary
) {
}
