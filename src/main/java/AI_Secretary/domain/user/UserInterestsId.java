package AI_Secretary.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class UserInterestsId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "category_code", length = 50)
    private String categoryCode;
}
