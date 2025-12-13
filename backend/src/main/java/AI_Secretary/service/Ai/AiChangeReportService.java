package AI_Secretary.service.Ai;

import AI_Secretary.DTO.AiDTO.AiChangeReportRequest;
import AI_Secretary.DTO.AiDTO.AiChangeReportResponse;
import AI_Secretary.domain.policyData.PolicyChangeLog;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.repository.Alarm.PolicyChangeLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiChangeReportService {

    private final WebClient aiWebClient;
    private final PolicyChangeLogRepository changeLogRepository;
    private final ObjectMapper objectMapper;
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
    @Transactional
    public PolicyChangeLog createManualLogForDemo(
            PolicyData policy,
            String changeType,
            String beforeText,
            String afterText,
            String adminNote
    ) {
        PolicyChangeLog.ChangeType type =
                PolicyChangeLog.ChangeType.valueOf(changeType);

        // before_value / after_value 를 간단한 JSON으로 구성
        ObjectNode beforeJson = objectMapper.createObjectNode();
        beforeJson.put("summary", beforeText != null ? beforeText : "");
        beforeJson.put("adminNote", adminNote != null ? adminNote : "");

        ObjectNode afterJson = objectMapper.createObjectNode();
        afterJson.put("summary", afterText != null ? afterText : "");
        afterJson.put("adminNote", adminNote != null ? adminNote : "");

        try {
            String beforeJsonStr = objectMapper.writeValueAsString(beforeJson);
            String afterJsonStr  = objectMapper.writeValueAsString(afterJson);

            PolicyChangeLog changeLog = PolicyChangeLog.builder()
                    .policy(policy)
                    .changeType(type)
                    .beforeValue(beforeJsonStr)  // ← String으로 넣기
                    .afterValue(afterJsonStr)    // ← String으로 넣기
                    .changedAt(LocalDateTime.now())
                    .build();

            PolicyChangeLog saved = changeLogRepository.save(changeLog);
            log.info("### [createManualLogForDemo] saved manual log id={} policyId={}",
                    saved.getId(), policy.getId());

            return saved;
        } catch (JsonProcessingException e) {
            // 필요하면 더 깔끔한 커스텀 예외로 감싸도 됨
            throw new RuntimeException("변경 로그 JSON 직렬화 실패", e);
        }
    }
}
