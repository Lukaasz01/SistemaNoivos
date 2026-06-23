import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from './vendor.service';
import { Vendor, VendorStatus } from '../../models/wedding.model';
import { PhoneMaskDirective } from '../../shared/directives/phone-mask'; // 👈 Reutilizando a máscara!

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ReactiveFormsModule, PhoneMaskDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css'
})
export class VendorListComponent implements OnInit {
  vendorService = inject(VendorService);
  private fb = inject(FormBuilder);

  vendorForm!: FormGroup;
  editingVendorId: number | null = null;

  ngOnInit(): void {
    this.vendorService.getAllVendors().subscribe({
      error: (err) => console.error('Erro ao buscar fornecedores:', err)
    });
    this.initForm();
  }

  initForm() {
    this.vendorForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Espaço', Validators.required],
      contactName: ['', Validators.required],
      phone: ['', Validators.required],
      status: ['Orçando', Validators.required],
      cost: [0, [Validators.required, Validators.min(0)]],
      rating: [5, [Validators.min(1), Validators.max(5)]]
    });
  }

  // Define um ícone automático baseado na categoria
  getIconByCategory(category: string): string {
    switch(category) {
      case 'Espaço': return 'fa-tree';
      case 'Buffet': return 'fa-utensils';
      case 'Fotografia': return 'fa-camera';
      case 'Música': return 'fa-music';
      case 'Decoração': return 'fa-wand-magic-sparkles';
      case 'Trajes': return 'fa-shirt';
      case 'Assessoria': return 'fa-gem';
      default: return 'fa-store';
    }
  }

  resetForm() {
    this.editingVendorId = null;
    this.vendorForm.reset({
      category: 'Espaço',
      status: 'Orçando',
      cost: 0,
      rating: 5
    });
  }

  openEditModal(vendor: Vendor) {
    this.editingVendorId = vendor.id;
    this.vendorForm.patchValue({
      name: vendor.name,
      category: vendor.category,
      contactName: vendor.contactName,
      phone: vendor.phone,
      status: vendor.status,
      cost: vendor.cost,
      rating: vendor.rating
    });

    const modalElement = document.getElementById('addVendorModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  deleteVendor(id: number) {
    if (confirm('Deseja realmente excluir este fornecedor?')) {
      this.vendorService.deleteVendor(id).subscribe({
        error: (err) => {
          console.error('Erro ao deletar:', err);
          alert('❌ Erro ao deletar fornecedor do banco de dados.');
        }
      });
    }
  }

  onSubmit() {
    if (this.vendorForm.valid) {
      const formValues = this.vendorForm.value;
      const vendorData = {
        ...formValues,
        icon: this.getIconByCategory(formValues.category),
        isFavorite: false // Por padrão, nasce sem ser favorito
      };

      if (this.editingVendorId) {
        // Ignora atualizar o isFavorite aqui para não resetar o coração sem querer
        delete vendorData.isFavorite;

        this.vendorService.updateVendor(this.editingVendorId, vendorData).subscribe({
          next: () => this.closeModal(),
          error: (err) => {
            console.error('Erro ao editar:', err);
            alert('❌ Erro ao editar fornecedor!');
          }
        });
      } else {
        this.vendorService.addVendor(vendorData).subscribe({
          next: () => this.closeModal(),
          error: (err) => {
            console.error('Erro ao criar:', err);
            alert('❌ Erro ao criar fornecedor!');
          }
        });
      }
    } else {
      this.vendorForm.markAllAsTouched();
      alert('⚠️ Preencha todos os campos corretamente antes de salvar.');
    }
  }

  closeModal() {
    this.resetForm();
    const modalElement = document.getElementById('addVendorModal');
    if (modalElement) {
      let modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (!modal) modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();

      document.body.classList.remove('modal-open');
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => b.remove());
    }
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.vendorService.setSearchQuery(input.value);
  }

  toggleFavorite(event: Event, id: number) {
    event.stopPropagation();
    this.vendorService.toggleFavorite(id).subscribe({
      error: (err) => console.error('Erro ao favoritar:', err)
    });
  }

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
