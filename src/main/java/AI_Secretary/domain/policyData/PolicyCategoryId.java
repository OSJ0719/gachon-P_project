package AI_Secretary.domain.policyData;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class PolicyCategoryId implements Serializable {

    @Column(name = "policy_id")
    private Long policyId;

    @Column(name = "category_code", length = 50)
    private String categoryCode;
}