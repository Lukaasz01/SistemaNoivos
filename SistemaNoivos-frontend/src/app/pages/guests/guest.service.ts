import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// 1. Importa do seu modelo oficial
import { Guest, RsvpStatus } from '../../models/wedding.model';
// 2. Importa a URL base do ambiente
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/guests`;

    guests = signal<Guest[]>([]);
    searchQuery = signal<string>('');
    currentFilter = signal<'all' | 'confirmed' | 'pending'>('all');

    stats = computed(() => {
      const todos = this.guests();
      return {
        totalPeople: todos.reduce((soma, g) => soma + 1 + (g.companions || 0), 0),
        confirmed: todos.filter(g => g.status === 'confirmed').length,
        pending: todos.filter(g => g.status === 'pending').length,
        declined: todos.filter(g => g.status === 'declined').length
      };
    });

    filteredGuests = computed(() => {
      let result = this.guests();
      const filter = this.currentFilter();
      const query = this.searchQuery().toLowerCase();

      if (filter === 'confirmed') result = result.filter(g => g.status === 'confirmed');
      else if (filter === 'pending') result = result.filter(g => g.status === 'pending');

      if (query) {
        result = result.filter(g =>
          g.name.toLowerCase().includes(query) || g.phone.includes(query)
        );
      }
      return result;
    });

  getAllGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.apiUrl).pipe(
      tap(dados => this.guests.set(dados))
    );
  }

  createGuest(newGuest: Guest): Observable<Guest> {
    return this.http.post<Guest>(this.apiUrl, newGuest).pipe(
      tap(guestSalvoNoBanco => {
        this.guests.update(lista => [...lista, guestSalvoNoBanco]);
      })
    );
  }

  deleteGuest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.guests.update(lista => lista.filter(g => g.id !== id)))
    );
  }

  changeStatus(id: number, newStatus: RsvpStatus): Observable<Guest> {
    const guestToUpdate = this.guests().find(g => g.id === id);
    if (!guestToUpdate) throw new Error('Convidado não encontrado localmente');

    const updatedGuest = { ...guestToUpdate, status: newStatus };

    return this.http.put<Guest>(`${this.apiUrl}/${id}`, updatedGuest).pipe(
      tap(guestSalvoNoBanco => {
        this.guests.update(lista => lista.map(g => g.id === id ? guestSalvoNoBanco : g));
      })
    );
  }

  setFilter(filter: 'all' | 'confirmed' | 'pending') {
    this.currentFilter.set(filter);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }
}
