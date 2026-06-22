package br.com.lucas.sistemanoivosapi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "guests")
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "guest_group")
    private String group;

    private Integer companions;
    private String status;
    private String phone;
    private String dietaryRestrictions;

    // 💡 CONSTRUTORES (Opcional, mas bom ter o padrão vazio)
    public Guest() {
    }

    // 💡 GETTERS E SETTERS (Eles resolvem o erro de compilação)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public Integer getCompanions() {
        return companions;
    }

    public void setCompanions(Integer companions) {
        this.companions = companions;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDietaryRestrictions() {
        return dietaryRestrictions;
    }

    public void setDietaryRestrictions(String dietaryRestrictions) {
        this.dietaryRestrictions = dietaryRestrictions;
    }
}