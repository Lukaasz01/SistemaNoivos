import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestService } from './guest.service';
import { RsvpStatus } from '../../models/wedding.model';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})
export class GuestListComponent {
  guestService = inject(GuestService);

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.guestService.setSearchQuery(input.value);
  }

  changeStatus(event: Event, id: number, newStatus: RsvpStatus) {
    event.preventDefault();
    this.guestService.changeStatus(id, newStatus);
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
