package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Model.Guest;
import br.com.lucas.sistemanoivosapi.Service.GuestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "http://localhost:4200") // Libera o Angular acessar localmente
public class GuestController {

    private final GuestService guestService;

    public GuestController(GuestService guestService) {
        this.guestService = guestService;
    }

    // GET: http://localhost:9001/api/guests (Listar todos)
    @GetMapping
    public List<Guest> getAllGuests() {
        return guestService.findAll();
    }

    // POST: http://localhost:9001/api/guests (Criar novo convidado)
    @PostMapping
    public Guest createGuest(@RequestBody Guest guest) {
        return guestService.save(guest);
    }

    // PUT: http://localhost:9001/api/guests/{id} (Atualizar convidado existente)
    @PutMapping("/{id}")
    public ResponseEntity<Guest> updateGuest(@PathVariable Long id, @RequestBody Guest guestDetails) {
        // Delega todo o trabalho pesado e reativo para a Service
        return guestService.update(id, guestDetails).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: http://localhost:9001/api/guests/{id} (Deletar convidado)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        return guestService.findById(id).map(guest -> {
            guestService.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}