package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Dto.LoginRequestDTO;
import br.com.lucas.sistemanoivosapi.Dto.LoginResponseDTO;
import br.com.lucas.sistemanoivosapi.Model.User;
import br.com.lucas.sistemanoivosapi.Repository.UserRepository;
import br.com.lucas.sistemanoivosapi.Service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // 🟢 Mudado aqui
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder; // 🟢 Injeta o Bean oficial do SecurityConfig

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        // 🔍 RASTRO NO CONSOLE: Exibe o que o Angular acabou de enviar
        System.out.println("\n📥 REQUISIÇÃO DE LOGIN RECEBIDA!");
        System.out.println("📧 E-mail enviado pelo Angular: [" + data.email() + "]");
        System.out.println("🔑 Senha enviada pelo Angular: [" + data.password() + "]");

        var userOptional = userRepository.findByEmail(data.email());

        if (userOptional.isEmpty()) {
            System.out.println("❌ Erro: E-mail não encontrado no banco de dados.");
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }

        User user = userOptional.get();

        // Compara a senha digitada com o hash criptografado do banco
        if (passwordEncoder.matches(data.password(), user.getPassword())) {
            String token = tokenService.generateToken(user);
            System.out.println("✅ Sucesso: Usuário autenticado! Gerando token...");

            return ResponseEntity.ok(new LoginResponseDTO(
                    user.getEmail(),
                    user.getRole().name(),
                    user.getWeddingProfileId(),
                    token
            ));
        }

        System.out.println("❌ Erro: Senha incorreta para o usuário " + data.email());
        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}