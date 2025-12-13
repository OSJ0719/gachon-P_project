package AI_Secretary.DTO.AiDTO;

public record ManualChangeLogDraftRequest
        (
                Long policyId,       // 어떤 정책에 대한 변경인지
                String changeType,   // "NEW", "UPDATE", "DELETE" 중 하나
                String beforeText,   // (옵션) 변경 전 설명/요약
                String afterText,    // (옵션) 변경 후 설명/요약
                String adminNote
        ){
}
