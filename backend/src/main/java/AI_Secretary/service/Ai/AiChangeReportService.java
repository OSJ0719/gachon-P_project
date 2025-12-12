package AI_Secretary.service.Ai;

import AI_Secretary.DTO.AiDTO.AiChangeReportRequest;
import AI_Secretary.DTO.AiDTO.AiChangeReportResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class AiChangeReportService {

    private final WebClient aiWebClient;

    /**
     * 정책 변경 전/후 스냅샷을 기반으로
     * AI에게 '정책 변경 보고서 초안'을 생성해 달라고 요청
     */
    public AiChangeReportResponse generateChangeReportDraft(AiChangeReportRequest request) {

        AiChangeReportResponse response = aiWebClient.post()
                .uri("/change-report")   // ⬅ FastAPI에서 맞춰줄 엔드포인트
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AiChangeReportResponse.class)
                .block(); // 필요하면 timeout, onErrorResume 등 추가 가능

        if (response == null) {
            // 완전 실패 시 최소 fallback
            return new AiChangeReportResponse(
                    "[자동 생성 실패] 정책 변경 보고서",
                    "AI 서버와 통신에 실패했습니다. 관리자께서 직접 내용을 입력해 주세요.",
                    null, null, null, null,
                    "NEUTRAL",
                    null, null, null
            );
        }
        return response;
    }
}
