package AI_Secretary.repository.Alarm;

import AI_Secretary.domain.policyData.PolicyChangeLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyChangeLogRepository extends JpaRepository<PolicyChangeLog, Long> {


    @Query("select max(l.changedAt) from PolicyChangeLog l")
    Optional<LocalDateTime> findMaxChangedAt();

    long countByChangedAtBetween(LocalDateTime from, LocalDateTime to);

    List<PolicyChangeLog> findTop10ByOrderByChangedAtDesc();
    Page<PolicyChangeLog> findAllByOrderByChangedAtDesc(Pageable pageable);
}