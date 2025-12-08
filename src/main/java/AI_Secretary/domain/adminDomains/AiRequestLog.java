package AI_Secretary.domain.adminDomains;

import AI_Secretary.domain.policyData.Document;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.user.users;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ai_request_log")
public class AiRequestLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_type", nullable = false, length = 50)
    private String requestType; // DOCUMENT_ANALYSIS, CHATBOT, WEATHER_ADVICE 등

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_policy_id")
    private PolicyData targetPolicy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_document_id")
    private Document targetDocument;

    @Column(nullable = false, length = 20)
    private String status; // SUCCESS/ERROR 등

    @Column(name = "latency_ms")
    private Integer latencyMs;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}