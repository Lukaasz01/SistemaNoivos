package br.com.lucas.sistemanoivosapi.Service;

import br.com.lucas.sistemanoivosapi.Model.Expense;
import br.com.lucas.sistemanoivosapi.Model.WeddingProfile;
import br.com.lucas.sistemanoivosapi.Repository.WeddingProfileRepository;
import br.com.lucas.sistemanoivosapi.Repository.TaskRepository; // Ajuste se seu repo de tarefas tiver outro nome
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private WeddingProfileRepository profileRepository;

    // Supõe-se que você tenha um TaskRepository para buscar tarefas pendentes
    // @Autowired
    // private TaskRepository taskRepository;

    // 🟢 FUNCTION 1: Alerta de WhatsApp (Disparado quando um convidado confirma RSVP)
    public void triggerWhatsappRsvpAlert(String guestName, String status) {
        // Buscamos as configuracoes do perfil 1
        profileRepository.findById(1L).ifPresent(profile -> {
            if (profile.isWhatsappNotifications()) {
                // Aqui entraria a integracao com a API do WhatsApp (ex: Twilio, Z-API)
                // Por enquanto, deixamos o log preparado e funcional para provar a execucao
                System.out.println("📱 [WHATSAPP NOTIFICATION] Enviando para " + profile.getEmail() +
                        ": Olá! O convidado " + guestName + " alterou o status para: " + status);
            }
        });
    }

    // 🟡 FUNCTION 2: Alerta de Orçamento (Disparado se atingir 90% do planejado)
    public void checkBudgetThreshold(Expense expense) {
        profileRepository.findById(1L).ifPresent(profile -> {
            if (profile.isBudgetAlerts()) {
                double estimated = expense.getEstimatedCost();
                double actual = expense.getActualCost();

                if (estimated > 0 && (actual / estimated) >= 0.90) {
                    System.out.println("⚠️ [BUDGET ALERT] Atenção! A despesa '" + expense.getDescription() +
                            "' atingiu " + Math.round((actual / estimated) * 100) +
                            "% do valor estimado. Limite de 90% ultrapassado!");
                }
            }
        });
    }

    // 🔵 FUNCTION 3: Cronograma do Relatório Semanal (Roda de forma automática)
    // Agendado via Expressão CRON: Roda toda segunda-feira às 08:00 da manhã
    @Scheduled(cron = "0 0 8 * * MON")
    public void sendWeeklyReport() {
        profileRepository.findById(1L).ifPresent(profile -> {
            if (profile.isWeeklyReport()) {
                System.out.println("📧 [WEEKLY REPORT] Gerando resumo de tarefas pendentes para o e-mail: " + profile.getEmail());
                // Aqui você faria um find no TaskRepository buscando tarefas onde completed = false
                // E dispararia o e-mail formatado via JavaMailSender
            }
        });
    }
}