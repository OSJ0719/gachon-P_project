package AI_Secretary.domain.policyData;

import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import AI_Secretary.domain.categories;


@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "policy_data",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_policy_source", columnNames = {"provider_type", "external_id"})
        }
)
public class PolicyData extends BaseTimeEntity {

    public enum ProviderType {
        CENTRAL, LOCAL, PRIVATE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_type", nullable = false, length = 10)
    private ProviderType providerType;

    @Column(name = "external_id", nullable = false, length = 100)
    private String externalId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "interest_theme", length = 255)
    private String interestTheme;

    @Column(name = "life_cycle", length = 255)
    private String lifeCycle;

    @Column(name = "region_ctpv", length = 100)
    private String regionCtpv;

    @Column(name = "region_sgg", length = 100)
    private String regionSgg;

    @Column(name = "dept_name", length = 255)
    private String deptName;

    @Column(name = "support_cycle", length = 100)
    private String supportCycle;

    @Column(name = "onap_possible", length = 1)
    private String onapPossible;

    @Column(name = "detail_url", length = 1000)
    private String detailUrl;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_category_code")
    private categories mainCategory;

    @Column(name = "last_modified_at")
    private LocalDateTime lastModifiedAt;

    @Column(name = "has_crawled", nullable = false)
    private Boolean hasCrawled;

    @Column(name = "last_crawled_at")
    private LocalDateTime lastCrawledAt;

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PolicyCategory> categories;

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PolicyRequiredDocument> requiredDocuments;

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Document> documents;
}
