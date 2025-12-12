package AI_Secretary.service.Admin;

import AI_Secretary.DTO.AdminDTO.AdminPolicyLogDetailDto;
import AI_Secretary.DTO.AdminDTO.AdminPolicyLogSummaryDto;
import AI_Secretary.domain.policyData.PolicyChangeLog;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.repository.Alarm.PolicyChangeLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PolicyChangeLogAdminService {

    private final PolicyChangeLogRepository policyChangeLogRepository;

    private static final DateTimeFormatter DATE_TIME_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    /**
     * ✅ 관리자용 - 최근 변경 로그 목록
     *   - /api/admin/policy-changes/logs?limit=50
     */
    @Transactional(readOnly = true)
    public List<AdminPolicyLogSummaryDto> getRecentLogs(Integer limit) {
        int size = (limit == null ? 50 : limit);
        if (size <= 0) size = 10;
        if (size > 200) size = 200; // 과도한 요청 방지

        Page<PolicyChangeLog> page =
                policyChangeLogRepository.findAllByOrderByChangedAtDesc(PageRequest.of(0, size));

        return page.stream()
                .map(this::toSummaryDto)
                .toList();
    }

    /**
     * ✅ 관리자용 - 단일 변경 로그 상세
     *   - /api/admin/policy-changes/logs/{logId}
     */
    @Transactional(readOnly = true)
    public AdminPolicyLogDetailDto getLogDetail(Long logId) {
        PolicyChangeLog log = policyChangeLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("변경 로그를 찾을 수 없습니다. id=" + logId));

        return toDetailDto(log);
    }

    private AdminPolicyLogSummaryDto toSummaryDto(PolicyChangeLog log) {
        PolicyData p = log.getPolicy();
        return new AdminPolicyLogSummaryDto(
                log.getId(),
                p != null ? p.getId() : null,
                p != null ? p.getName() : null,
                log.getChangeType() != null ? log.getChangeType().name() : null,
                log.getChangedAt() != null ? log.getChangedAt().format(DATE_TIME_FMT) : null
        );
    }

    private AdminPolicyLogDetailDto toDetailDto(PolicyChangeLog log) {
        PolicyData p = log.getPolicy();
        return new AdminPolicyLogDetailDto(
                log.getId(),
                p != null ? p.getId() : null,
                p != null ? p.getName() : null,
                log.getChangeType() != null ? log.getChangeType().name() : null,
                log.getChangedAt() != null ? log.getChangedAt().format(DATE_TIME_FMT) : null,
                log.getBeforeValue(),
                log.getAfterValue()
        );
    }
}
