package AI_Secretary.domain.subMenus;

import AI_Secretary.domain.policyData.PolicyData;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Getter
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
}