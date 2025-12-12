package AI_Secretary.repository.sideService;

import java.util.List;

import AI_Secretary.domain.subMenus.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByPolicy_Id(Long policyId);

    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndPolicyId(Long userId, Long policyId);

    void deleteByUserIdAndPolicyId(Long userId, Long policyId);
}