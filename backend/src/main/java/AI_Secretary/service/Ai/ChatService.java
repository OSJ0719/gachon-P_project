package AI_Secretary.service.Ai;

import AI_Secretary.DTO.AiDTO.ChatRequest;
import AI_Secretary.DTO.AiDTO.ChatResponse;
import AI_Secretary.DTO.AiDTO.WelfareAnswer;
import AI_Secretary.client.AiChatbotClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final AiChatbotClient aiChatbotClient;

    public ChatResponse chat(ChatRequest request /*, Long userId */) {
        String question = request.question();

        // FastAPI /chatbot 호출
        String answer = aiChatbotClient.ask(question);

        // 지금은 일반 자유 챗봇이니까 keyPoints/nextActions 는 비워둔다
        return new ChatResponse(
                answer,
                List.of(),  // keyPoints 없음
                List.of()   // nextActions 없음
        );
    }
}