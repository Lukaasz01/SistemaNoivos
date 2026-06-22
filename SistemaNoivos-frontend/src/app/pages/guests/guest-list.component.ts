import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuestService } from './guest.service';
import { RsvpStatus, Guest } from '../../models/wedding.model';
import { PhoneMaskDirective } from '../../shared/directives/phone-mask';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PhoneMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})
export class GuestListComponent implements OnInit {
  guestService = inject(GuestService);
  private fb = inject(FormBuilder);

  guestForm!: FormGroup;

  ngOnInit(): void {
    this.loadGuests();
    this.initForm();
  }

  initForm() {
    this.guestForm = this.fb.group({
      name: ['', Validators.required],
      group: ['Família Noiva', Validators.required],
      companions: [0, [Validators.required, Validators.min(0)]],
      phone: ['', Validators.required],
      status: ['pending', Validators.required],
      dietaryRestrictions: ['']
    });
  }

  onSubmit() {
    if (this.guestForm.valid) {
      const newGuest: Guest = this.guestForm.value;

      this.guestService.createGuest(newGuest).subscribe({
        next: () => {
          this.guestForm.reset({ group: 'Família Noiva', status: 'pending', companions: 0 });

          const modalElement = document.getElementById('addGuestModal');
          if (modalElement) {
             const modal = (window as any).bootstrap.Modal.getInstance(modalElement) || new (window as any).bootstrap.Modal(modalElement);
             modal.hide();
          }
        },
        error: (err) => console.error('Erro ao salvar convidado:', err)
      });
    } else {
      this.guestForm.markAllAsTouched();
    }
  }

  loadGuests() {
    this.guestService.getAllGuests().subscribe({
      error: (err) => console.error('Erro ao conectar com a API Java:', err)
    });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.guestService.setSearchQuery(input.value);
  }

  changeStatus(event: Event, id: number, newStatus: RsvpStatus) {
    event.preventDefault();
    this.guestService.changeStatus(id, newStatus).subscribe({
      error: (err) => console.error('Erro ao atualizar status no banco:', err)
    });
  }

  deleteGuest(id: number) {
    if (confirm('Deseja realmente remover este convidado do casamento?')) {
      this.guestService.deleteGuest(id).subscribe({
        error: (err) => console.error('Erro ao deletar convidado:', err)
      });
    }
  }

  getStatusLabel(status: RsvpStatus): string {
    switch(status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'declined': return 'Recusado';
    }
  }

  getStatusClasses(status: RsvpStatus): string {
    switch(status) {
      case 'confirmed': return 'bg-success bg-opacity-10 text-success fw-semibold';
      case 'pending': return 'bg-light border border-secondary-subtle text-secondary';
      case 'declined': return 'bg-danger bg-opacity-10 text-danger text-decoration-line-through';
    }
  }

  getStatusIcon(status: RsvpStatus): string {
    switch(status) {
      case 'confirmed': return 'fa-check';
      case 'pending': return 'fa-clock';
      case 'declined': return 'fa-xmark';
    }
  }

  getAvatarColor(name: string): string {
    const colors = ['#D4B8B1', '#A3B19B', '#B38B82', '#9BB1B1', '#C6A9B5', '#8C9A8E'];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  }
}
