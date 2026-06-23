import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
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
export class VendorListComponent implements OnInit {
  vendorService = inject(VendorService);

  ngOnInit(): void {
    // Busca os fornecedores do banco de dados quando a página carrega!
    this.vendorService.getAllVendors().subscribe({
      error: (err) => console.error('Erro ao buscar fornecedores:', err)
    });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.vendorService.setSearchQuery(input.value);
  }

  // Agora chama o serviço e se inscreve no Observable
  toggleFavorite(event: Event, id: number) {
    event.stopPropagation();
    this.vendorService.toggleFavorite(id).subscribe({
      error: (err) => console.error('Erro ao favoritar:', err)
    });
  }

  // Agora chama o serviço e se inscreve no Observable
  changeStatus(event: Event, id: number, newStatus: VendorStatus) {
    event.preventDefault();
    this.vendorService.changeStatus(id, newStatus).subscribe({
      error: (err) => console.error('Erro ao mudar status:', err)
    });
  }

  getStatusClasses(status: VendorStatus): string {
    switch (status) {
      case 'Contratado': return 'bg-success bg-opacity-10 text-success fw-semibold';
      case 'Em Negociação': return 'bg-warning bg-opacity-10 text-warning fw-semibold';
      case 'Orçando': return 'bg-light border border-secondary-subtle text-secondary';
    }
  }
}
