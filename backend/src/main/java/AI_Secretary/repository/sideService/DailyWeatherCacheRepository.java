package AI_Secretary.repository.sideService;

import AI_Secretary.domain.DailyWeatherCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DailyWeatherCacheRepository extends JpaRepository<DailyWeatherCache, Long> {

    // (region_code, base_date) 유니크라서 한 건만 반환됨
    Optional<DailyWeatherCache> findByRegionCodeAndBaseDate(
            String regionCode,
            LocalDate baseDate
    );

    // 등록 시점 기준 3일 지난 데이터 삭제용
    long deleteByCreatedAtBefore(LocalDateTime threshold);
}