package AI_Secretary.domain.policyData;

import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;


    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    @AllArgsConstructor
    @Builder
    @Entity
    @Table(name = "policy_required_documents")
    public class PolicyRequiredDocument extends BaseTimeEntity {

        public enum SourceType {
            FORM, GUIDE, LAW, OTHER
        }

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "policy_id", nullable = false)
        private PolicyData policy;

        @Enumerated(EnumType.STRING)
        @Column(name = "source_type", length = 20)
        private SourceType sourceType;

        @Column(name = "doc_name", length = 500)
        private String docName;

        @Column(name = "file_uri", length = 500)
        private String fileUri;

        @Column(name = "sort_order")
        private Integer sortOrder;
    }
