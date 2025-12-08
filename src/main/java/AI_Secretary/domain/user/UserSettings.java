package AI_Secretary.domain.user;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_settings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // 🔥 이제 독립 PK

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private users user;

    @Column(name = "notify_policy_changes", nullable = false)
    private Boolean notifyPolicyChanges;

    @Column(name = "notify_calendar_alerts", nullable = false)
    private Boolean notifyCalendarAlerts;

    @Column(name = "notify_marketing", nullable = false)
    private Boolean notifyMarketing;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public static UserSettings createDefault(
            users user,
            boolean notifyPolicyChanges,
            boolean notifyCalendarAlerts,
            boolean notifyMarketing
    ) {
        UserSettings s = new UserSettings();
        s.user = user;
        s.notifyPolicyChanges  = notifyPolicyChanges;
        s.notifyCalendarAlerts = notifyCalendarAlerts;
        s.notifyMarketing      = notifyMarketing;
        return s;
    }

    public void updateFrom(
            boolean notifyPolicyChanges,
            boolean notifyCalendarAlerts,
            boolean notifyMarketing
    ) {
        this.notifyPolicyChanges  = notifyPolicyChanges;
        this.notifyCalendarAlerts = notifyCalendarAlerts;
        this.notifyMarketing      = notifyMarketing;
    }
}