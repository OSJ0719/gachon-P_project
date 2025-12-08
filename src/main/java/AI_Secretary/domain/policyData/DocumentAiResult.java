package AI_Secretary.domain.policyData;

import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "document_ai_result")
public class DocumentAiResult extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "summary_text", columnDefinition = "MEDIUMTEXT")
    private String summaryText;

    @Column(name = "easy_explanation_text", columnDefinition = "MEDIUMTEXT")
    private String easyExplanationText;

    @Column(name = "keywords_json", columnDefinition = "TEXT")
    private String keywordsJson;

    @Column(name = "qa_template_json", columnDefinition = "TEXT")
    private String qaTemplateJson;
}
