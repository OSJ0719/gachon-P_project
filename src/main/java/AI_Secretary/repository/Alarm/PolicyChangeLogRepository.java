package AI_Secretary.repository.Alarm;

import AI_Secretary.domain.policyData.PolicyChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyChangeLogRepository extends JpaRepository<PolicyChangeLog, Long> {

    // 아직 리포트/알림에 사용 안 된 로그만 가져오고 싶으면,
    // isReported 같은 컬럼 추가 후 이렇게 확장 가능:
    // List<PolicyChangeLog> findByIsReportedFalse();
}