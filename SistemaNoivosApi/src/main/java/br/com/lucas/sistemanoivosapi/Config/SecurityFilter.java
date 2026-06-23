package br.com.lucas.sistemanoivosapi.Config;

import br.com.lucas.sistemanoivosapi.Model.User;
import br.com.lucas.sistemanoivosapi.Repository.UserRepository;
import br.com.lucas.sistemanoivosapi.Service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = this.recoverToken(request);

        if (token != null) {
            String login = tokenService.validateToken(token);

            if (!login.isEmpty()) {
                User user = userRepository.findByEmail(login)
                        .orElseThrow(() -> new RuntimeException("Usuário do Token não encontrado"));

                // Transforma o cargo do usuário em uma autoridade do Spring Security
                var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

                var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);

                // Salva a autenticação no contexto do Spring para essa requisição
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // Segue o fluxo normal da requisição
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.replace("Bearer ", "");
    }
}