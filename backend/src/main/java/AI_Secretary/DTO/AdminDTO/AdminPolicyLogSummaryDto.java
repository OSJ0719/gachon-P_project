package AI_Secretary.DTO.AdminDTO;

public record AdminPolicyLogSummaryDto(
        Long id,
        Long policyId,
        String policyName,
        String changeType,   // "NEW", "UPDATE", "DELETE"
        String changedAt
) {
}
