package br.com.lucas.sistemanoivosapi.Service;

import br.com.lucas.sistemanoivosapi.Model.WeddingProfile;
import br.com.lucas.sistemanoivosapi.Repository.WeddingProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class WeddingProfileService {

    @Autowired
    private WeddingProfileRepository profileRepository;

    public Optional<WeddingProfile> getProfile(Long id) {
        return profileRepository.findById(id);
    }

    public WeddingProfile updateProfile(Long id, WeddingProfile details) {
        WeddingProfile profile = profileRepository.findById(id)
                .orElse(new WeddingProfile()); // Cria se não existir para o tenant inicial

        profile.setBrideName(details.getBrideName());
        profile.setGroomName(details.getGroomName());
        profile.setEmail(details.getEmail());
        profile.setWeddingDate(details.getWeddingDate());
        profile.setWeddingLocation(details.getWeddingLocation());
        profile.setEventStyle(details.getEventStyle());
        profile.setWhatsappNotifications(details.isWhatsappNotifications());
        profile.setWeeklyReport(details.isWeeklyReport());
        profile.setBudgetAlerts(details.isBudgetAlerts());

        return profileRepository.save(profile);
    }
}