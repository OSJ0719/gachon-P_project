package AI_Secretary.DTO.SearchDTO;

import java.util.List;

public record PolicyDetailResponse(
        PolicyBasicDto policy,
        PolicyAiDto ai,
        List<PolicyRequiredDocumentDto> requiredDocuments,
        PolicyUserContextDto userContext // 로그인 안 되어 있으면 null
) {
}
