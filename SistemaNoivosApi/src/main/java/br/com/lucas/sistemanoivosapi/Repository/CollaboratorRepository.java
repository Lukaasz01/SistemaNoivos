package br.com.lucas.sistemanoivosapi.Repository;

import br.com.lucas.sistemanoivosapi.Model.Collaborator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CollaboratorRepository extends JpaRepository<Collaborator, Long> {
    // Busca os acessos atrelados de forma isolada para alimentar a terceira aba
    List<Collaborator> findByWeddingProfileId(Long profileId);
}