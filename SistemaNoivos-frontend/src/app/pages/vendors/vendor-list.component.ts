import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { VendorService } from './vendor.service';
import { VendorStatus } from '../../models/wedding.model';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css'
})
export class VendorListComponent {
  vendorService = inject(VendorService);

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.vendorService.setSearchQuery(input.value);
  }

  toggleFavorite(event: Event, id: number) {
    event.stopPropagation();
    this.vendorService.toggleFavorite(id);
  }

  changeStatus(event: Event, id: number, newStatus: VendorStatus) {
    event.preventDefault();
    this.vendorService.changeStatus(id, newStatus);
  }

  getStatusClasses(status: VendorStatus): string {
    switch (status) {
      case 'Contratado': return 'bg-success bg-opacity-10 text-success fw-semibold';
      case 'Em Negociação': return 'bg-warning bg-opacity-10 text-warning fw-semibold';
      case 'Orçando': return 'bg-light border border-secondary-subtle text-secondary';
    }
  }
}
