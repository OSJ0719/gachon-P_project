package AI_Secretary.domain.subMenus;

import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import AI_Secretary.domain.user.users;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookmark")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Bookmark extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 여기 타입 반드시 User 엔티티로
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private PolicyData policy;

    @Column(name = "short_note", length = 500)
    private String shortNote;
}