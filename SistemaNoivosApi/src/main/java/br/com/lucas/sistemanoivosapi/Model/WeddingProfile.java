package br.com.lucas.sistemanoivosapi.Model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wedding_profiles")
public class WeddingProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double budgetThreshold;

    // Geral (image_35bf58.png)
    @Column(name = "bride_name", nullable = false)
    private String brideName;

    @Column(name = "groom_name", nullable = false)
    private String groomName;

    @Column(nullable = false)
    private String email;

    @Column(name = "wedding_date")
    private String weddingDate;

    @Column(name = "wedding_location")
    private String weddingLocation;

    @Column(name = "event_style")
    private String eventStyle;

    // Notificações (image_35bf60.png)
    @Column(name = "whatsapp_notifications")
    private boolean whatsappNotifications;

    @Column(name = "weekly_report")
    private boolean weeklyReport;

    @Column(name = "budget_alerts")
    private boolean budgetAlerts;

    public WeddingProfile() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBrideName() { return brideName; }
    public void setBrideName(String brideName) { this.brideName = brideName; }

    public String getGroomName() { return groomName; }
    public void setGroomName(String groomName) { this.groomName = groomName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWeddingDate() { return weddingDate; }
    public void setWeddingDate(String weddingDate) { this.weddingDate = weddingDate; }

    public String getWeddingLocation() { return weddingLocation; }
    public void setWeddingLocation(String weddingLocation) { this.weddingLocation = weddingLocation; }

    public String getEventStyle() { return eventStyle; }
    public void setEventStyle(String eventStyle) { this.eventStyle = eventStyle; }

    public boolean isWhatsappNotifications() { return whatsappNotifications; }
    public void setWhatsappNotifications(boolean whatsappNotifications) { this.whatsappNotifications = whatsappNotifications; }

    public boolean isWeeklyReport() { return weeklyReport; }
    public void setWeeklyReport(boolean weeklyReport) { this.weeklyReport = weeklyReport; }

    public boolean isBudgetAlerts() { return budgetAlerts; }
    public void setBudgetAlerts(boolean budgetAlerts) { this.budgetAlerts = budgetAlerts; }

    public Double getBudgetThreshold() { return budgetThreshold; }
    public void setBudgetThreshold(Double budgetThreshold) { this.budgetThreshold = budgetThreshold; }
}