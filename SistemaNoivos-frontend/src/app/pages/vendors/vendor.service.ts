import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Vendor, VendorStatus } from '../../models/wedding.model';
import { environment } from '../../../environments/environment';

export type VendorFilterType = 'all' | 'Contratado' | 'Em Negociação' | 'Favorites';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vendors`; // A rota que criaremos no Java

  // O estado agora nasce vazio e reativo!
  vendors = signal<Vendor[]>([]);
  currentFilter = signal<VendorFilterType>('all');
  searchQuery = signal<string>('');

  // --- ESTATÍSTICAS COMPUTADAS ---
  stats = computed(() => {
    const list = this.vendors();
    const totalCount = list.length;
    const contractedCount = list.filter(v => v.status === 'Contratado').length;
    const pendingCount = list.filter(v => v.status !== 'Contratado').length;

    const totalSpent = list
      .filter(v => v.status === 'Contratado')
      .reduce((sum, v) => sum + v.cost, 0);

    const contractedPercentage = totalCount > 0 ? Math.round((contractedCount / totalCount) * 100) : 0;

    return { totalCount, contractedCount, pendingCount, totalSpent, contractedPercentage };
  });

  filteredVendors = computed(() => {
    let result = this.vendors();
    const filter = this.currentFilter();
    const query = this.searchQuery().toLowerCase();

    if (filter === 'Contratado') result = result.filter(v => v.status === 'Contratado');
    else if (filter === 'Em Negociação') result = result.filter(v => v.status === 'Em Negociação');
    else if (filter === 'Favorites') result = result.filter(v => v.isFavorite);

    if (query) {
      result = result.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.contactName.toLowerCase().includes(query)
      );
    }

    return result;
  });

  setFilter(filter: VendorFilterType) {
    this.currentFilter.set(filter);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  // --- INTEGRAÇÃO COM O BACK-END (JAVA) ---

  getAllVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.apiUrl).pipe(
      tap(dados => this.vendors.set(dados))
    );
  }

  addVendor(vendorData: Omit<Vendor, 'id'>): Observable<Vendor> {
    return this.http.post<Vendor>(this.apiUrl, vendorData).pipe(
      tap(newVendor => {
        this.vendors.update(list => [newVendor, ...list]);
      })
    );
  }

  updateVendor(id: number, updatedData: Partial<Vendor>): Observable<Vendor> {
    const currentVendor = this.vendors().find(v => v.id === id);
    if (!currentVendor) throw new Error('Fornecedor não encontrado localmente');

    const vendorToSave = { ...currentVendor, ...updatedData };

    return this.http.put<Vendor>(`${this.apiUrl}/${id}`, vendorToSave).pipe(
      tap(updatedVendor => {
        this.vendors.update(list => list.map(v => v.id === id ? updatedVendor : v));
      })
    );
  }

  toggleFavorite(id: number): Observable<Vendor> {
    const currentVendor = this.vendors().find(v => v.id === id);
    if (!currentVendor) throw new Error('Fornecedor não encontrado localmente');

    const updatedVendor = { ...currentVendor, isFavorite: !currentVendor.isFavorite };

    return this.http.put<Vendor>(`${this.apiUrl}/${id}`, updatedVendor).pipe(
      tap(savedVendor => {
        this.vendors.update(list => list.map(v => v.id === id ? savedVendor : v));
      })
    );
  }

  changeStatus(id: number, newStatus: VendorStatus): Observable<Vendor> {
    const currentVendor = this.vendors().find(v => v.id === id);
    if (!currentVendor) throw new Error('Fornecedor não encontrado localmente');

    const updatedVendor = { ...currentVendor, status: newStatus };

    return this.http.put<Vendor>(`${this.apiUrl}/${id}`, updatedVendor).pipe(
      tap(savedVendor => {
        this.vendors.update(list => list.map(v => v.id === id ? savedVendor : v));
      })
    );
  }

  deleteVendor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.vendors.update(list => list.filter(v => v.id !== id)))
    );
  }
}
