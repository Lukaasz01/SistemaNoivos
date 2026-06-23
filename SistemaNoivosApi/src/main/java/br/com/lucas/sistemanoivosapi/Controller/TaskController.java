package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Model.Task;
import br.com.lucas.sistemanoivosapi.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService; // 👈 Agora usamos a Service!

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskService.getTaskById(id)
                .map(task -> {
                    task.setTitle(taskDetails.getTitle());
                    task.setDate(taskDetails.getDate());
                    task.setCategory(taskDetails.getCategory());
                    task.setCategoryTheme(taskDetails.getCategoryTheme());
                    task.setCompleted(taskDetails.isCompleted());
                    task.setOverdue(taskDetails.isOverdue());

                    Task updatedTask = taskService.saveTask(task);
                    return ResponseEntity.ok(updatedTask);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(task -> {
                    taskService.deleteTask(id);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}