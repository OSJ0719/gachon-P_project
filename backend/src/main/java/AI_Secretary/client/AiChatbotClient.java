package AI_Secretary.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiChatbotClient {

    private final WebClient aiWebClient; // AiServerConfig 에서 주입

    /**
     * FastAPI /chatbot 엔드포인트 호출
     * 요청: { "question": "..." }
     * 응답: String (LLM 답변)
     */
    public String ask(String question) {
        try {
            Map<String, Object> body = Map.of("question", question);

            String docs = aiWebClient.get()
                    .uri("/docs")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(5));

            System.out.println("### /docs length = " + (docs != null ? docs.length() : -1));

//            Map<String, Object> body = Map.of("question", question);
//
//            return aiWebClient.post()
//                    .uri("/chatbot")
//                    .bodyValue(body)
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    .block(Duration.ofSeconds(15));
            return aiWebClient.post()
                    .uri("/chatbot")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(15)); // 필요하면 timeout 조정
        } catch (Exception e) {
            log.error("Failed to call /chatbot", e);
            return "현재는 상담이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.";
        }
    }
}