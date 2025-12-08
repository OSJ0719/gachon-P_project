package AI_Secretary.DTO.SearchDTO;

import java.time.LocalDateTime;
import java.util.List;

public record PolicyAiDto(
        String easyText,          // 쉬운 설명(문장 단순화)
        String summary,           // 요약
        List<String> keyPoints,   // 핵심 포인트 리스트
        List<PolicyFaqDto> faq,   // Q&A 템플릿
        LocalDateTime analyzedAt
) {
}
