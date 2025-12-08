package AI_Secretary.domain.policyData;

import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "document",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_document_policy_source", columnNames = {"policy_id", "source_type"})
        }
)
public class Document extends BaseTimeEntity {

    public enum SourceType {
        PUBLIC_API, PUBLIC_WEB, PRIVATE_JSON,USER_UPLOAD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private PolicyData policy;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 20)
    private SourceType sourceType;

    @Column(name = "source_external_id", length = 100)
    private String sourceExternalId;

    @Column(name = "source_url", length = 1000)
    private String sourceUrl;

    @Column(name = "content_html", columnDefinition = "MEDIUMTEXT")
    private String contentHtml;

    @Column(name = "content_text", columnDefinition = "MEDIUMTEXT")
    private String contentText;

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private DocumentAiResult aiResult;
}
