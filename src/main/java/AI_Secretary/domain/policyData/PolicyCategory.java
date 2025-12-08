package AI_Secretary.domain.policyData;

import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import AI_Secretary.domain.categories;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "policy_categories")
public class PolicyCategory {

    @EmbeddedId
    private PolicyCategoryId id;

    @MapsId("policyId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private PolicyData policy;

    @MapsId("categoryCode")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_code", nullable = false)
    private categories category;
}
