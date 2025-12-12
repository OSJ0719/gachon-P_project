package AI_Secretary.DTO.AiDTO;

public record AiChangeReportRequest(
        String policyName,
        String beforeSnapshot,
        String afterSnapshot
) {
}
