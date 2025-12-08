package AI_Secretary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories
public class AI_SecretaryApplication {
    public static void main(String args[]){
        SpringApplication.run(AI_SecretaryApplication.class);
    }
}
