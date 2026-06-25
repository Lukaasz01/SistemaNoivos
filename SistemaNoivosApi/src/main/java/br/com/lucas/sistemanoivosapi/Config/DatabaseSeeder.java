package br.com.lucas.sistemanoivosapi.Config;

import br.com.lucas.sistemanoivosapi.Model.User;
import br.com.lucas.sistemanoivosapi.Model.WeddingProfile;
import br.com.lucas.sistemanoivosapi.Repository.UserRepository;
import br.com.lucas.sistemanoivosapi.Repository.WeddingProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeddingProfileRepository weddingProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String emailMestre = "noivos@casamento.com.br";

        // Procura se o usuário já existe
        var userOptional = userRepository.findByEmail(emailMestre);

        if (userOptional.isEmpty()) {
            // Se não existir, cria o cenário do zero
            WeddingProfile profile = new WeddingProfile();
            profile.setGroomName("Lucas");
            profile.setBrideName("Laura");
            profile.setEmail(emailMestre);
            profile.setBudgetThreshold(50000.0);
            WeddingProfile savedProfile = weddingProfileRepository.save(profile);

            User defaultUser = new User();
            defaultUser.setEmail(emailMestre);
            defaultUser.setPassword(passwordEncoder.encode("senha123")); // Encripta
            defaultUser.setRole(br.com.lucas.sistemanoivosapi.Model.AccessRole.PROPRIETARIO);
            defaultUser.setWeddingProfile(savedProfile);
            userRepository.save(defaultUser);

            System.out.println("\n🔥 SEEDER: Novo usuário master criado: " + emailMestre);
        } else {
            // 🟢 SE JÁ EXISTIR: Força a re-criptografia da senha para garantir que não está corrompida!
            User existente = userOptional.get();
            existente.setPassword(passwordEncoder.encode("senha123"));
            userRepository.save(existente);

            System.out.println("\n🔄 SEEDER: Senha do usuário master redefinida e garantida!");
        }
    }
}