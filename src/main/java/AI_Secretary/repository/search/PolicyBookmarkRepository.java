package AI_Secretary.repository.search;

import AI_Secretary.domain.subMenus.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyBookmarkRepository extends JpaRepository<Bookmark,Long> {
    boolean existsByUserIdAndPolicyId(Long userId, Long policyId);
}
