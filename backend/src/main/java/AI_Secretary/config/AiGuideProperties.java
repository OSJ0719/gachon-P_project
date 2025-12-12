package AI_Secretary.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "ai.guide")
public class AiGuideProperties {

    /**
     * ex) http://localhost:8000
     */
    private String baseUrl;

    /**
     * ex) /api/v1/guide/welfare
     */
    private String path;

    /**
     * 타임아웃(ms)
     */
    private int timeoutMs = 15000;

    /**
     * 장애 시 기능 일시 비활성화 용
     */
    private boolean enabled = true;
}