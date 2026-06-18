import { Injectable, signal, computed } from '@angular/core';
import { Guest, RsvpStatus } from '../../models/wedding.model';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  guests = signal<Guest[]>([
    { id: 1, name: 'Madrinha Beatriz Silva', group: 'Família Noiva', companions: 1, status: 'confirmed', phone: '(11) 98888-1111' },
    { id: 2, name: 'Tio Roberto e Tia Ana', group: 'Família Noivo', companions: 2, status: 'pending', phone: '(11) 97777-2222', dietaryRestrictions: 'Vegetariano' },
    { id: 3, name: 'Carla Dias', group: 'Amigos', companions: 0, status: 'confirmed', phone: '(11) 96666-3333' },
    { id: 4, name: 'Marcos Almeida (Colega)', group: 'Trabalho', companions: 1, status: 'declined', phone: '(11) 95555-4444' },
    { id: 5, name: 'Avó Maria', group: 'Família Noiva', companions: 0, status: 'confirmed', phone: '(11) 94444-5555', dietaryRestrictions: 'Diabética' },
    { id: 6, name: 'João e Família', group: 'Amigos', companions: 3, status: 'pending', phone: '(11) 93333-6666' },
  ]);

  currentFilter = signal<'all' | 'confirmed' | 'pending'>('all');
  searchQuery = signal<string>('');

  stats = computed(() => {
    const all = this.guests();
    let totalPeople = 0, confirmed = 0, pending = 0, declined = 0;

    all.forEach(g => {
      const headCount = 1 + g.companions;
      totalPeople += headCount;
      if (g.status === 'confirmed') confirmed += headCount;
      else if (g.status === 'pending') pending += headCount;
      else if (g.status === 'declined') declined += headCount;
    });

    return { totalPeople, confirmed, pending, declined };
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

  setFilter(filter: 'all' | 'confirmed' | 'pending') {
    this.currentFilter.set(filter);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  changeStatus(id: number, newStatus: RsvpStatus) {
    this.guests.update(list =>
      list.map(guest => guest.id === id ? { ...guest, status: newStatus } : guest)
    );
  }
}
