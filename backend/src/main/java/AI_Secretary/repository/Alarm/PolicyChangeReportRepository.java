package AI_Secretary.repository.Alarm;

import AI_Secretary.domain.subMenus.PolicyChangeReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PolicyChangeReportRepository extends JpaRepository<PolicyChangeReport,Long> {
    // 예) 최근 생성 순으로 전체 조회
    // 전체를 생성일 역순으로
    List<PolicyChangeReport> findAllByOrderByCreatedAtDesc();

    // 상태(DRAFT / APPROVED)로 필터 + 생성일 역순
    List<PolicyChangeReport> findByStatusOrderByCreatedAtDesc(PolicyChangeReport.ReportStatus status);

    // 특정 정책에 대한 모든 리포트
    List<PolicyChangeReport> findByPolicy_IdOrderByCreatedAtDesc(Long policyId);

    // 특정 정책 + 상태로 필터
    List<PolicyChangeReport> findByPolicy_IdAndStatusOrderByCreatedAtDesc(
            Long policyId,
            PolicyChangeReport.ReportStatus status
    );
    // 오늘 생성된 레포트 수 계산용
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}

