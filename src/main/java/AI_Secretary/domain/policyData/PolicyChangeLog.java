package AI_Secretary.domain.policyData;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "policy_change_log")
public class PolicyChangeLog {

    public enum ChangeType {
        NEW, UPDATE, DELETE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private PolicyData policy;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_type", nullable = false, length = 20)
    private ChangeType changeType;

    @Column(name = "before_value", columnDefinition = "JSON")
    private String beforeValue;   // JSON 문자열로 저장

    @Column(name = "after_value", columnDefinition = "JSON")
    private String afterValue;    // JSON 문자열로 저장

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @PrePersist
    public void onPersist() {
        if (changedAt == null) {
            changedAt = LocalDateTime.now();
        }
    }
}