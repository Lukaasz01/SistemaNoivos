package br.com.lucas.sistemanoivosapi.Repository;

import br.com.lucas.sistemanoivosapi.Model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}