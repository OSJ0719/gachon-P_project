package AI_Secretary.domain;

import AI_Secretary.domain.publicImplement.BaseTimeEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "daily_weather_cache",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_daily_weather_region_date",
                        columnNames = {"region_code", "base_date"})
        }
)
public class DailyWeatherCache{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "region_code", nullable = false, length = 20)
    private String regionCode;

    @Column(name = "base_date", nullable = false)
    private LocalDate baseDate;

    @Column(name = "temp_current", precision = 4, scale = 1)
    private BigDecimal tempCurrent;

    @Column(name = "temp_min", precision = 4, scale = 1)
    private BigDecimal tempMin;

    @Column(name = "temp_max", precision = 4, scale = 1)
    private BigDecimal tempMax;

    @Column
    private Integer humidity;

    @Column(name = "precip_chance")
    private Integer precipChance;

    @Column(name = "sky_condition", length = 50)
    private String skyCondition;

    @Column(name = "weather_summary", length = 255)
    private String weatherSummary;

    @Column(name = "raw_json", columnDefinition = "MEDIUMTEXT")
    private String rawJson;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}