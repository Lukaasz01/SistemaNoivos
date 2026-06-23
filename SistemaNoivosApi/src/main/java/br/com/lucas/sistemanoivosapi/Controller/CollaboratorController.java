package br.com.lucas.sistemanoivosapi.Controller;

import br.com.lucas.sistemanoivosapi.Model.Collaborator;
import br.com.lucas.sistemanoivosapi.Service.CollaboratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/settings/collaborators")
@CrossOrigin(origins = "*")
public class CollaboratorController {

    @Autowired
    private CollaboratorService collaboratorService;

    @GetMapping
    public ResponseEntity<List<Collaborator>> listTeam() {
        return ResponseEntity.ok(collaboratorService.getCollaboratorsByProfile(1L));
    }

    @PostMapping
    public ResponseEntity<Collaborator> inviteMember(@RequestBody Collaborator collaborator) {
        return ResponseEntity.ok(collaboratorService.addCollaborator(1L, collaborator));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Collaborator> changeRole(@PathVariable Long id, @RequestParam String role) {
        return ResponseEntity.ok(collaboratorService.updateRole(id, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeMember(@PathVariable Long id) {
        collaboratorService.removeCollaborator(id);
        return ResponseEntity.ok().build();
    }
}