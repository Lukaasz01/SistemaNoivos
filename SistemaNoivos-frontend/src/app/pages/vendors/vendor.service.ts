import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Vendor, VendorStatus } from '../../models/wedding.model';
import { environment } from '../../../environments/environment';

export type VendorFilterType = 'all' | 'Contratado' | 'Em Negociação' | 'Favorites';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vendors`;

  vendors = signal<Vendor[]>([]);
  currentFilter = signal<VendorFilterType>('all');
  searchQuery = signal<string>('');

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

    getAllVendors(): Observable<Vendor[]> {
      return this.http.get<any[]>(this.apiUrl).pipe(
        map(dados => dados.map(v => ({ ...v, isFavorite: v.favorite }))),
        tap(dadosFormatados => this.vendors.set(dadosFormatados))
      );
    }

    addVendor(vendorData: Omit<Vendor, 'id'>): Observable<Vendor> {
      const vendorToSend = {
        ...vendorData,
        favorite: false
      };
      return this.http.post<any>(this.apiUrl, vendorToSend).pipe(
        map(v => ({ ...v, isFavorite: v.favorite })),
        tap(newVendor => {
          this.vendors.update(list => [newVendor, ...list]);
        })
      );
    }

    updateVendor(id: number, updatedData: Partial<Vendor>): Observable<Vendor> {
      const currentVendor = this.vendors().find(v => v.id === id);
      if (!currentVendor) throw new Error('Fornecedor não encontrado localmente');

      const vendorToSave = {
        ...currentVendor,
        ...updatedData,
        favorite: currentVendor.isFavorite
      };

      return this.http.put<any>(`${this.apiUrl}/${id}`, vendorToSave).pipe(
        map(v => ({ ...v, isFavorite: v.favorite })),
        tap(updatedVendor => {
          this.vendors.update(list => list.map(v => v.id === id ? updatedVendor : v));
        })
      );
    }

    toggleFavorite(id: number): Observable<Vendor> {
      const currentVendor = this.vendors().find(v => v.id === id);
      if (!currentVendor) throw new Error('Fornecedor não encontrado localmente');

      const vendorToSend = {
        ...currentVendor,
        favorite: !currentVendor.isFavorite
      };

      return this.http.put<any>(`${this.apiUrl}/${id}`, vendorToSend).pipe(
        map(v => ({ ...v, isFavorite: v.favorite })),
        tap(savedVendor => {
          this.vendors.update(list => list.map(v => v.id === id ? savedVendor : v));
        })
      );
    }

    changeStatus(id: number, newStatus: VendorStatus): Observable<Vendor> {
      const currentVendor = this.vendors().find(v => v.id === id);
      if (!currentVendor) throw new Error('Fornecedor não encontrado localmente');

      const vendorToSend = {
        ...currentVendor,
        status: newStatus,
        favorite: currentVendor.isFavorite
      };

      return this.http.put<any>(`${this.apiUrl}/${id}`, vendorToSend).pipe(
        map(v => ({ ...v, isFavorite: v.favorite })),
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
