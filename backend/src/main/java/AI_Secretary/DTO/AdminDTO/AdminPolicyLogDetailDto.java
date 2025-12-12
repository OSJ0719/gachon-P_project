package AI_Secretary.DTO.AdminDTO;

public record AdminPolicyLogDetailDto(
        Long id,
        Long policyId,
        String policyName,
        String changeType,
        String changedAt,
        String beforeValue,   // JSON 문자열 (null 가능)
        String afterValue
) {
}
