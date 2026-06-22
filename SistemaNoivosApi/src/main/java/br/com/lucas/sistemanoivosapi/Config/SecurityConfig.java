package br.com.lucas.sistemanoivosapi.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desativa proteção CSRF para chamadas de API
                .cors(cors -> cors.configure(http)) // Permite o Cross-Origin (CORS) que configuramos no Controller
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // 👈 Libera todas as rotas (sem exigir senha)
                );

        return http.build();
    }
}