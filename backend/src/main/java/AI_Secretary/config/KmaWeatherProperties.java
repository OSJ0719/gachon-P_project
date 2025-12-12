package AI_Secretary.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "kma.weather")
public class KmaWeatherProperties {

    /**
     * ex) https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0
     * 초단기실황(getUltraSrtNcst)도 같은 서비스 하위
     */
    private String baseUrl;

    /**
     * 기상청 서비스 키
     */
    private String serviceKey;

    /**
     * 타임아웃(ms)
     */
    private int timeoutMs = 3000;

    /**
     * 연동 on/off 플래그 (문제 생기면 false로 돌려두고 Stub 사용)
     */
    private boolean enabled = true;
}