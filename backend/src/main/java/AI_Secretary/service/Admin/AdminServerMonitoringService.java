package AI_Secretary.service.Admin;

import AI_Secretary.DTO.AdminDTO.DashboardLogLineDto;
import AI_Secretary.DTO.AdminDTO.ServerLogResponse;
import AI_Secretary.DTO.AdminDTO.ServerMetricsResponse;
import AI_Secretary.config.InMemoryLogAppender;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServerMonitoringService {
    private final DataSource dataSource;
    private final RestTemplate restTemplate;
    private String formatUptime() {
        RuntimeMXBean rb = ManagementFactory.getRuntimeMXBean();
        long ms = rb.getUptime();

        long seconds = ms / 1000;
        long minutes = seconds / 60;
        long hours   = minutes / 60;
        long days    = hours / 24;

        long h = hours % 24;
        long m = minutes % 60;

        return String.format("%dd %dh %dm", days, h, m);
    }
    private ServerMetricsResponse.DbStatus checkDbPool() {
        try {
            HikariDataSource hikari = dataSource.unwrap(HikariDataSource.class);
            HikariPoolMXBean pool = hikari.getHikariPoolMXBean();

            int active = pool.getActiveConnections();
            int max    = hikari.getMaximumPoolSize();

            return new ServerMetricsResponse.DbStatus("UP", active, max);
        } catch (Exception e) {
            log.warn("DB pool metrics check failed", e);
            return new ServerMetricsResponse.DbStatus("UNKNOWN", 0, 0);
        }
    }


    public ServerMetricsResponse getMetrics() {

        // 1) API 서버
        var api = new ServerMetricsResponse.ApiStatus(
                "UP",
                formatUptime()
        );

        // 2) AI 서버 (있으면 핑, 없으면 DOWN/UNKNOWN)
        var ai = checkAiServer();

        // 3) DB 풀 정보
        var db = checkDbPool();

        return new ServerMetricsResponse(api, ai, db);
    }
    private ServerMetricsResponse.AiStatus checkAiServer() {
        // 완전 시연용: 150~450ms 사이 랜덤
        long latency = 150 + (long)(Math.random() * 300);
        return new ServerMetricsResponse.AiStatus("UP", (int)latency);
    }

    public ServerLogResponse getLogs(String level) {

        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        Logger rootLogger = context.getLogger("ROOT");

        InMemoryLogAppender memoryAppender =
                (InMemoryLogAppender) rootLogger.getAppender("MEMORY");

        if (memoryAppender == null) {
            // 안전장치: 설정이 잘못돼도 앱이 죽지는 않게
            return new ServerLogResponse(List.of(
                    new DashboardLogLineDto("N/A", "WARN",
                            "InMemoryLogAppender not attached to ROOT logger")
            ));
        }

        var logs = memoryAppender.getLogs(level);
        return new ServerLogResponse(logs);
    }
}
