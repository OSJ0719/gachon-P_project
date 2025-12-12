package AI_Secretary.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class AiServerConfig {

    @Value("${ai.server.base-url:https://cherlyn-unforeboded-unmarvellously.ngrok-free.dev}")
    private String aiBaseUrl;

    @Value("${ai.server.timeout-ms:15000}")
    private long timeoutMs;

    @Bean
    public WebClient aiWebClient(WebClient.Builder builder) {
        System.out.println("### AI BASE URL = " + aiBaseUrl);
        return builder
                .baseUrl(aiBaseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(
                        new ReactorClientHttpConnector(
                                HttpClient.create()
                                        .responseTimeout(Duration.ofMillis(timeoutMs))
                        )
                )
                .build();
    }
}