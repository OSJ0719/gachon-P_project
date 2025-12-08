package AI_Secretary.domain.subMenus;


import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.domain.policyData.PolicyRequiredDocument;
import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import AI_Secretary.domain.user.users;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_checklist")
public class UserChecklist extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private users user;

    // 정책
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private PolicyData policy;

    // (선택) 이 항목이 연결된 필수 서류
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "required_document_id")
    private PolicyRequiredDocument requiredDocument;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "is_checked", nullable = false)
    private boolean checked;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    // === 편의 메서드 ===

    public void update(String itemName, boolean checked, int sortOrder) {
        this.itemName = itemName;
        this.checked = checked;
        this.sortOrder = sortOrder;
    }

    public void toggleChecked() {
        this.checked = !this.checked;
    }

    public void changeRequiredDocument(PolicyRequiredDocument requiredDocument) {
        this.requiredDocument = requiredDocument;
    }
}