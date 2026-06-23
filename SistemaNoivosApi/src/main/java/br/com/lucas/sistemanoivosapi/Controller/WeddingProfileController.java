package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Model.WeddingProfile;
import br.com.lucas.sistemanoivosapi.Service.WeddingProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings/profile")
@CrossOrigin(origins = "*")
public class WeddingProfileController {

    @Autowired
    private WeddingProfileService profileService;

    // Forçamos o ID 1 por enquanto enquanto o sistema não possui login multi-inquilino
    @GetMapping
    public ResponseEntity<WeddingProfile> getActiveProfile() {
        return profileService.getProfile(1L)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new WeddingProfile())); // Evita quebra se a tabela estiver limpa
    }

    @PutMapping
    public ResponseEntity<WeddingProfile> saveProfile(@RequestBody WeddingProfile details) {
        return ResponseEntity.ok(profileService.updateProfile(1L, details));
    }
}