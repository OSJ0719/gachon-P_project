package AI_Secretary.repository.search;

import AI_Secretary.domain.policyData.PolicyRequiredDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolicyRequiredDocumentRepository extends JpaRepository<PolicyRequiredDocument, Long> {

    /**
     * 정책 ID 기준으로 필수 서류 목록 조회
     * sortOrder 기준 정렬
     */
    List<PolicyRequiredDocument> findByPolicy_IdOrderBySortOrderAsc(Long policyId);
}