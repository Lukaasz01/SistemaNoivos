package br.com.lucas.sistemanoivosapi.Service;

import br.com.lucas.sistemanoivosapi.Model.Guest;
import br.com.lucas.sistemanoivosapi.Repository.GuestRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GuestService {

    private final GuestRepository guestRepository;
    private final NotificationService notificationService; // 👈 Injetado o gerenciador de notificações

    // Construtor unificado atualizado
    public GuestService(GuestRepository guestRepository, NotificationService notificationService) {
        this.guestRepository = guestRepository;
        this.notificationService = notificationService;
    }

    public List<Guest> findAll() {
        return guestRepository.findAll();
    }

    public Optional<Guest> findById(Long id) {
        return guestRepository.findById(id);
    }

    public Guest save(Guest guest) {
        return guestRepository.save(guest);
    }

    // ⚡ NOVA FUNÇÃO CENTRALIZADA DE ATUALIZAÇÃO REATIVA
    public Optional<Guest> update(Long id, Guest guestDetails) {
        return guestRepository.findById(id).map(guest -> {
            guest.setName(guestDetails.getName());
            guest.setGroup(guestDetails.getGroup());
            guest.setCompanions(guestDetails.getCompanions());
            guest.setStatus(guestDetails.getStatus());
            guest.setPhone(guestDetails.getPhone());
            guest.setDietaryRestrictions(guestDetails.getDietaryRestrictions());

            Guest updatedGuest = guestRepository.save(guest);

            // 📱 GATILHO: Dispara o alerta se a chave de notificações do WhatsApp estiver ligada!
            notificationService.triggerWhatsappRsvpAlert(updatedGuest.getName(), updatedGuest.getStatus());

            return updatedGuest;
        });
    }

    public void deleteById(Long id) {
        guestRepository.deleteById(id);
    }
}