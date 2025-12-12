package AI_Secretary.service.Admin;

import AI_Secretary.DTO.AdminDTO.DashboardChangeReportDto;
import AI_Secretary.DTO.AdminDTO.DashboardLogLineDto;
import AI_Secretary.DTO.AdminDTO.DashboardSummaryResponse;
import AI_Secretary.domain.policyData.PolicyChangeLog;
import AI_Secretary.repository.Alarm.PolicyChangeLogRepository;
import AI_Secretary.repository.Alarm.PolicyChangeReportRepository;
import AI_Secretary.repository.search.PolicyDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardAdminService {

    private final PolicyDataRepository policyDataRepository;
    private final PolicyChangeLogRepository policyChangeLogRepository;
    private final PolicyChangeReportRepository policyChangeReportRepository;
    // 🔸 AI 요청수 / 시스템 로그를 DB에 적재하는 구조가 생기면 repo 추가

    public DashboardSummaryResponse getSummary() {

        // 1) 카드용 지표들
        long totalPolicies = policyDataRepository.count();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.plusDays(1).atStartOfDay();

        long todayReports =
                policyChangeReportRepository.countByCreatedAtBetween(startOfToday, endOfToday);

        // 서버 상태 / AI 호출 수는 일단 하드코딩 or TODO
        String serverStatus = "정상";   // 나중에 Actuator/Health 체크로 교체
        long todayAiApiCalls = 0L;      // 나중에 ai_request_log 등으로 대체

        // 2) 최근 변경 이력 N개
        List<PolicyChangeLog> recentLogs =
                policyChangeLogRepository
                        .findTop10ByOrderByChangedAtDesc();   // repo에 메서드 하나 추가 필요

        List<DashboardChangeReportDto> recentChangeReports = recentLogs.stream()
                .map(log -> new DashboardChangeReportDto(
                        log.getId(),
                        log.getChangedAt(),
                        log.getPolicy().getName(),       // 제목: 일단 정책명으로
                        log.getChangeType(),
                        "AI Bot"                         // 담당자: 추후 필드 생기면 교체
                ))
                .toList();

        // 3) 시스템 로그 (지금은 빈 리스트, 나중에 파일/DB 기반으로 채우기)
        List<DashboardLogLineDto> recentSystemLogs = List.of();

        return new DashboardSummaryResponse(
                totalPolicies,
                todayReports,
                serverStatus,
                todayAiApiCalls,
                recentChangeReports,
                recentSystemLogs
        );
    }

}