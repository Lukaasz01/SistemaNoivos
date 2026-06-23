package br.com.lucas.sistemanoivosapi.Model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "collaborators")
public class Collaborator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessRole role; // 👈 O Java vai buscar esse cara no arquivo separado automaticamente

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wedding_profile_id")
    @JsonIgnore
    private WeddingProfile weddingProfile;

    public Collaborator() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public AccessRole getRole() { return role; }
    public void setRole(AccessRole role) { this.role = role; }

    public WeddingProfile getWeddingProfile() { return weddingProfile; }
    public void setWeddingProfile(WeddingProfile weddingProfile) { this.weddingProfile = weddingProfile; }
}