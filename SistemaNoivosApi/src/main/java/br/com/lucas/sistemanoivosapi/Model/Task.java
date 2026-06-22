package br.com.lucas.sistemanoivosapi.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // 👈 O atributo faltante foi adicionado aqui!
    private String date;
    private String category;
    private String categoryTheme;
    private boolean completed;

    @Column(name = "is_overdue")
    private boolean isOverdue;

    public Task() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryTheme() { return categoryTheme; }
    public void setCategoryTheme(String categoryTheme) { this.categoryTheme = categoryTheme; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { this.isOverdue = overdue; }
}