package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Dto.LoginRequestDTO;
import br.com.lucas.sistemanoivosapi.Dto.LoginResponseDTO;
import br.com.lucas.sistemanoivosapi.Model.User;
import br.com.lucas.sistemanoivosapi.Repository.UserRepository;
import br.com.lucas.sistemanoivosapi.Service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO data) {
        User user = userRepository.findByEmail(data.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Compara a senha digitada com o hash criptografado do banco
        if (passwordEncoder.matches(data.password(), user.getPassword())) {
            String token = tokenService.generateToken(user);

            return ResponseEntity.ok(new LoginResponseDTO(
                    user.getEmail(),
                    user.getRole().name(),
                    user.getWeddingProfileId(),
                    token
            ));
        }

        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}