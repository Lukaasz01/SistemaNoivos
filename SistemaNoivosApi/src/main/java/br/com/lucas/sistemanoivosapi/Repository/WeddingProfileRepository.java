package br.com.lucas.sistemanoivosapi.Repository;

import br.com.lucas.sistemanoivosapi.Model.WeddingProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeddingProfileRepository extends JpaRepository<WeddingProfile, Long> {
}