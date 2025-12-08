package AI_Secretary.repository.User;

import AI_Secretary.domain.subMenus.UserChecklist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserChecklistRepository extends JpaRepository<UserChecklist, Long> {

    List<UserChecklist> findByUserIdAndPolicyIdOrderBySortOrderAsc(Long userId, Long policyId);

    Optional<UserChecklist> findByIdAndUserId(Long id, Long userId);

    void deleteByIdAndUserId(Long id, Long userId);

    long countByUserIdAndPolicyId(Long userId, Long policyId);
}
