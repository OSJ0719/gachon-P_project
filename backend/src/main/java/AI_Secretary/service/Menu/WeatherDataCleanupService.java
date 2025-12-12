package AI_Secretary.service.Menu;

import AI_Secretary.repository.sideService.DailyWeatherCacheRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeatherDataCleanupService {

    private final DailyWeatherCacheRepository dailyWeatherCacheRepository;

    /**
     * 매일 새벽 4시(KST)에 3일 지난 캐시 삭제
     */
    @Scheduled(cron = "0 0 4 * * *", zone = "Asia/Seoul")
    public void cleanupOldWeatherData() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(3);
        long deleted = dailyWeatherCacheRepository.deleteByCreatedAtBefore(threshold);

        if (deleted > 0) {
            log.info("Deleted {} DailyWeatherCache rows older than {}", deleted, threshold);
        } else {
            log.debug("No DailyWeatherCache rows to delete (threshold={})", threshold);
        }
    }
}