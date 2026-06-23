package br.com.lucas.sistemanoivosapi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessRole role; // CASAL, ADMIN, APENAS_LEITURA

    @Column(name = "wedding_profile_id")
    private Long weddingProfileId; // Liga o usuário ao painel do casamento certo

    public User() {}

    // Getters e Setters
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
}