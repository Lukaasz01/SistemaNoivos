package br.com.lucas.sistemanoivosapi.Service;

import br.com.lucas.sistemanoivosapi.Model.Collaborator;
import br.com.lucas.sistemanoivosapi.Model.WeddingProfile;
import br.com.lucas.sistemanoivosapi.Repository.CollaboratorRepository;
import br.com.lucas.sistemanoivosapi.Repository.WeddingProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CollaboratorService {

    @Autowired
    private CollaboratorRepository collaboratorRepository;

    @Autowired
    private WeddingProfileRepository profileRepository;

    public List<Collaborator> getCollaboratorsByProfile(Long profileId) {
        return collaboratorRepository.findByWeddingProfileId(profileId);
    }

    public Collaborator addCollaborator(Long profileId, Collaborator collaborator) {
        WeddingProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Perfil do casamento principal não encontrado."));

        collaborator.setWeddingProfile(profile);
        return collaboratorRepository.save(collaborator);
    }

    public Collaborator updateRole(Long id, String newRole) {
        Collaborator collaborator = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Colaborador não encontrado."));

        collaborator.setRole(br.com.lucas.sistemanoivosapi.Model.AccessRole.valueOf(newRole.toUpperCase()));
        return collaboratorRepository.save(collaborator);
    }

    public void removeCollaborator(Long id) {
        collaboratorRepository.deleteById(id);
    }
}