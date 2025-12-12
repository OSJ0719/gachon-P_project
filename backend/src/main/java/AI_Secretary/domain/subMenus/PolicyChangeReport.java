package AI_Secretary.domain.subMenus;

import AI_Secretary.domain.policyData.PolicyData;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "policy_change_report")
public class PolicyChangeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private PolicyData policy;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String summary;

    @Column(name = "what_changed", columnDefinition = "MEDIUMTEXT")
    private String whatChanged;

    @Column(name = "who_affected", columnDefinition = "MEDIUMTEXT")
    private String whoAffected;

    @Column(name = "from_when", length = 100)
    private String fromWhen;

    @Column(name = "action_guide", columnDefinition = "MEDIUMTEXT")
    private String actionGuide;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public enum ReportType {
        NEW_POLICY,   // 새 복지 사업 등록 (보라색 카드)
        CHANGE_POLICY // 기존 사업 변경 (주황/파랑 카드)
    }

    public enum ReportStatus {
        DRAFT,
        APPROVED
    }

    public enum ImpactType {
        POSITIVE, NEGATIVE, NEUTRAL
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", length = 20, nullable = false)
    private ReportType reportType; // NEW_POLICY / CHANGE_POLICY

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private ReportStatus status;   // DRAFT / APPROVED

    @Enumerated(EnumType.STRING)
    @Column(name = "impact_type", length = 20)
    private ImpactType impactType; // 카드 색 구분용 (GREEN/RED/GRAY)

    @Column(name = "user_impact_summary", columnDefinition = "MEDIUMTEXT")
    private String userImpactSummary; // "현재 나이 만 72세 → 신청 불가" 같은 설명

    // 선택: 변경 전/후 요약 텍스트 (카드 상단의 좌/우 블록)
    @Column(name = "before_summary", columnDefinition = "MEDIUMTEXT")
    private String beforeSummary;

    @Column(name = "after_summary", columnDefinition = "MEDIUMTEXT")
    private String afterSummary;

    @PrePersist
    public void onPersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ReportStatus.DRAFT;
        }
        if (reportType == null) {
            reportType = ReportType.CHANGE_POLICY;
        }
    }
}