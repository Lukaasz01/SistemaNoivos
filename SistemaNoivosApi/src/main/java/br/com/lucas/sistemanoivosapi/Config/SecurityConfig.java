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
                // Desabilita o CSRF para permitir POST/PUT/DELETE locais do Angular
                .csrf(csrf -> csrf.disable())
                // Libera todas as requisições para a nossa API de convidados sem exigir login na URL
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/guests/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}