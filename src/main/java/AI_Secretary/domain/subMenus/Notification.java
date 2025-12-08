package AI_Secretary.domain.subMenus;

import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import AI_Secretary.domain.user.users;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private users user;

    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType;   // ex) POLICY_CHANGE, GENERAL ...

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "message", columnDefinition = "MEDIUMTEXT")
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_change_report_id")
    private PolicyChangeReport policyChangeReport;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;
}
