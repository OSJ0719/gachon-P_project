package AI_Secretary.repository.search;

import AI_Secretary.domain.policyData.DocumentAiResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocumentAiResultRepository extends JpaRepository<DocumentAiResult, Long> {

    /**
     * 정책 ID 기준으로 가장 최근(생성일 최신) AI 분석 결과 1건 조회
     * DocumentAiResult.document.policy.id 를 따라 들어가는 메서드 네이밍
     */
    Optional<DocumentAiResult> findTopByDocument_Policy_IdOrderByCreatedAtDesc(Long policyId);
}
