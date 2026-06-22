package br.com.lucas.sistemanoivosapi.Repository;

import br.com.lucas.sistemanoivosapi.Model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
}