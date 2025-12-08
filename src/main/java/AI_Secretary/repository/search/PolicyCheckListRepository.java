package AI_Secretary.repository.search;

import AI_Secretary.domain.subMenus.UserChecklist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyCheckListRepository extends JpaRepository<UserChecklist,Long> {
    boolean existsByUserIdAndPolicyId(Long userId, Long policyId);
}
