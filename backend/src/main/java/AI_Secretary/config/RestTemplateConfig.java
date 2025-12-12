package AI_Secretary.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
public class RestTemplateConfig {

    private final KmaWeatherProperties kmaWeatherProperties;
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    @Bean
    public RestTemplate weatherRestTemplate(RestTemplateBuilder builder){
        return builder
                .setConnectTimeout(Duration.ofMillis(kmaWeatherProperties.getTimeoutMs()))
                .setReadTimeout(Duration.ofMillis(kmaWeatherProperties.getTimeoutMs()))
                .build();
    }
}
