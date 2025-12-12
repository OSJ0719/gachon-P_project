package AI_Secretary.domain;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(
        name = "daily_weather_cache",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_daily_weather_region_date",
                        columnNames = {"region_code", "base_date"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class DailyWeatherCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 우리 서비스 내부의 지역 코드 (행정동 코드 등)
    @Column(name = "region_code", nullable = false, length = 50)
    private String regionCode;

    // 기준 일자 (보통 LocalDate.now())
    @Column(name = "base_date", nullable = false)
    private LocalDate baseDate;

    @Column(name = "temp_current")
    private BigDecimal tempCurrent;

    @Column(name = "temp_min")
    private BigDecimal tempMin;

    @Column(name = "temp_max")
    private BigDecimal tempMax;

    @Column(name = "humidity")
    private Integer humidity;

    @Column(name = "precip_chance")
    private Integer precipChance;

    @Column(name = "sky_condition", length = 50)
    private String skyCondition;

    @Column(name = "weather_summary", length = 255)
    private String weatherSummary;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}