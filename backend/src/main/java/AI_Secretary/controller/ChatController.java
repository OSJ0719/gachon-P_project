package AI_Secretary.controller;

import AI_Secretary.DTO.AiDTO.ChatRequest;
import AI_Secretary.DTO.AiDTO.ChatResponse;
import AI_Secretary.service.Ai.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askWelfare(
            // @AuthenticationPrincipal CustomUserPrincipal user,
            @RequestBody @Valid ChatRequest request
    ) {
        // Long userId = user.getId(); // 프로젝트 보안 설정에 맞게 수정
        ChatResponse response = chatService.chat(request/*, userId*/);
        return ResponseEntity.ok(response);
    }
}