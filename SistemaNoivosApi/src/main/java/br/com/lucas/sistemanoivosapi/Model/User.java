package br.com.lucas.sistemanoivosapi.Model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails { // 🟢 Contrato assinado com o Spring Security

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wedding_profile_id")
    private WeddingProfile weddingProfile;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessRole role; // CASAL, ADMIN, APENAS_LEITURA

    @Column(name = "wedding_profile_id", insertable = false, updatable = false)
    private Long weddingProfileId; // Liga o usuário ao painel do casamento certo

    public User() {}

    // =========================================================================
    // 🟢 MÉTODOS OBRIGATÓRIOS DO USERDETAILS (Contrato do Spring Security)
    // =========================================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Mapeia o seu Enum AccessRole para o formato que o Spring Security entende
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    public String getUsername() {
        // 🚨 O PULO DO GATO: Avisa ao Spring que o seu "Username" é o campo "email"
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Conta não expirada
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Conta não bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Senha não expirada
    }

    @Override
    public boolean isEnabled() {
        return true; // Usuário ativo
    }

    // =========================================================================
    // SEUS GETTERS E SETTERS ORIGINAIS (Mantidos intactos)
    // =========================================================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public AccessRole getRole() { return role; }
    public void setRole(AccessRole role) { this.role = role; }

    public Long getWeddingProfileId() { return weddingProfileId; }
    public void setWeddingProfileId(Long weddingProfileId) { this.weddingProfileId = weddingProfileId; }

    public WeddingProfile getWeddingProfile() { return weddingProfile; }
    public void setWeddingProfile(WeddingProfile weddingProfile) { this.weddingProfile = weddingProfile; }
}