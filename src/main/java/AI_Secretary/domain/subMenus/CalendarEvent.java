package AI_Secretary.domain.subMenus;

import AI_Secretary.domain.policyData.Document;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import AI_Secretary.domain.user.users;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "calendar_event")
public class CalendarEvent extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private users user;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "memo", length = 500)
    private String memo;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private PolicyData policy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;
}