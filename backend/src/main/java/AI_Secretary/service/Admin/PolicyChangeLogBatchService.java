package AI_Secretary.service.Admin;

import AI_Secretary.domain.policyData.PolicyChangeLog;
import AI_Secretary.domain.policyData.PolicyData;
import AI_Secretary.repository.Alarm.PolicyChangeLogRepository;
import AI_Secretary.repository.search.PolicyDataRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PolicyChangeLogBatchService {

    private final PolicyDataRepository policyDataRepository;
    private final PolicyChangeLogRepository policyChangeLogRepository;
    private final ObjectMapper objectMapper;

    /**
     * 매일 새벽 3시 정책 변경 감지
     * cron = "초 분 시 일 월 요일"
     *  → 0 0 3 * * *  = 매일 03:00:00
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void detectPolicyChanges() {
        log.info("[PolicyChangeLogBatch] 정책 변경 감지 배치 시작");

        // 1) 마지막으로 로그를 쌓았던 시점
        LocalDateTime lastLoggedAt = policyChangeLogRepository.findMaxChangedAt()
                // 한 번도 로그가 없으면, 전날 0시 기준으로
                .orElse(LocalDateTime.now().minusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0));

        log.info("[PolicyChangeLogBatch] lastLoggedAt = {}", lastLoggedAt);

        // 2) 그 이후에 변경된 정책들 조회
        List<PolicyData> changedPolicies = policyDataRepository.findChangedSince(lastLoggedAt);

        if (changedPolicies.isEmpty()) {
            log.info("[PolicyChangeLogBatch] 변경된 정책 없음. 종료.");
            return;
        }

        log.info("[PolicyChangeLogBatch] 변경 감지 정책 수 = {}", changedPolicies.size());

        for (PolicyData policy : changedPolicies) {
            try {
                createChangeLogForPolicy(policy, lastLoggedAt);
            } catch (Exception e) {
                log.error("[PolicyChangeLogBatch] 정책 변경 로그 생성 실패. policyId={}", policy.getId(), e);
            }
        }

        log.info("[PolicyChangeLogBatch] 정책 변경 감지 배치 종료");
    }

    /**
     * 개별 정책에 대해 ChangeLog 한 건을 생성
     * - NEW vs UPDATE 판정은 "정책의 createdAt 이 lastLoggedAt 이후인지"로 단순 판단
     * - beforeValue는 일단 null, afterValue에 현재 상태 스냅샷 저장
     *   (나중에 이전 스냅샷을 별도 테이블로 관리하면 beforeValue도 채울 수 있음)
     */
    private void createChangeLogForPolicy(PolicyData policy, LocalDateTime lastLoggedAt) throws Exception {
        PolicyChangeLog.ChangeType changeType;

        // 정책이 언제 생성됐는지 기준으로 새 정책인지/수정인지 대략 판별
        if (policy.getCreatedAt() != null && policy.getCreatedAt().isAfter(lastLoggedAt)) {
            changeType = PolicyChangeLog.ChangeType.NEW;
        } else {
            changeType = PolicyChangeLog.ChangeType.UPDATE;
        }

        // 정책 현재 상태를 JSON으로 스냅샷
        String afterJson = objectMapper.writeValueAsString(buildPolicySnapshot(policy));

        PolicyChangeLog logEntity = PolicyChangeLog.builder()
                .policy(policy)
                .changeType(changeType)
                .beforeValue(null)         // 이전 값은 지금 구조상 알 수 없으니 일단 null
                .afterValue(afterJson)
                .changedAt(LocalDateTime.now())
                .build();

        policyChangeLogRepository.save(logEntity);

        log.info("[PolicyChangeLogBatch] 로그 생성 완료. policyId={}, type={}", policy.getId(), changeType);
    }

    /**
     * 정책의 주요 필드만 뽑아서 JSON으로 저장하기 위한 스냅샷 맵 구성
     * (어떤 필드를 넣을지는 필요에 따라 추가/수정 가능)
     */
    private Map<String, Object> buildPolicySnapshot(PolicyData p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("name", p.getName());
        map.put("summary", p.getSummary());
        map.put("lifeCycle", p.getLifeCycle());
        map.put("regionCtpv", p.getRegionCtpv());
        map.put("regionSgg", p.getRegionSgg());
        map.put("supportCycle", p.getSupportCycle());
        map.put("deptName", p.getDeptName());
        map.put("startDate", p.getStartDate());
        map.put("endDate", p.getEndDate());
        map.put("lastModifiedAt", p.getLastModifiedAt());
        // 필요하면 mainCategory 코드/이름 등 더 추가 가능
        if (p.getMainCategory() != null) {
            map.put("mainCategoryCode", p.getMainCategory().getCode());
            map.put("mainCategoryName", p.getMainCategory().getName());
        }
        return map;
    }

}
