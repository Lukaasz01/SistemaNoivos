import { Injectable, signal, computed } from '@angular/core';
import { Vendor, VendorStatus } from '../../models/wedding.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  currentFilter = signal<'all' | 'Contratado' | 'Em Negociação' | 'Favorites'>('all');
  searchQuery = signal<string>('');

  vendors = signal<Vendor[]>([
    { id: 1, name: 'Fazenda Santa Bárbara', category: 'Espaço', contactName: 'Juliana Torres', phone: '(11) 99999-1111', status: 'Contratado', cost: 15000, rating: 5, isFavorite: true, icon: 'fa-tree' },
    { id: 2, name: 'Fasano Gourmet', category: 'Buffet', contactName: 'Chef Vinicius', phone: '(11) 99999-2222', status: 'Em Negociação', cost: 22000, rating: 5, isFavorite: false, icon: 'fa-utensils' },
    { id: 3, name: 'Studio Luz Foto & Vídeo', category: 'Fotografia', contactName: 'Marcos Santos', phone: '(11) 99999-3333', status: 'Contratado', cost: 8200, rating: 4, isFavorite: true, icon: 'fa-camera' },
    { id: 4, name: 'Banda Viva Festa', category: 'Música', contactName: 'Rafa & Banda', phone: '(11) 99999-4444', status: 'Em Negociação', cost: 5000, rating: 4, isFavorite: false, icon: 'fa-music' },
    { id: 5, name: 'Casamento dos Sonhos Decorações', category: 'Decoração', contactName: 'Clara Mello', phone: '(11) 99999-5555', status: 'Contratado', cost: 14000, rating: 5, isFavorite: true, icon: 'fa-wand-magic-sparkles' },
    { id: 6, name: 'Ateliê Blush & Silk', category: 'Trajes', contactName: 'Estilista Helena', phone: '(11) 99999-6666', status: 'Orçando', cost: 5500, rating: 3, isFavorite: false, icon: 'fa-shirt' },
    { id: 7, name: 'Amor & Detalhes Assessoria', category: 'Assessoria', contactName: 'Patrícia Cerimonial', phone: '(11) 99999-7777', status: 'Contratado', cost: 4500, rating: 5, isFavorite: true, icon: 'fa-gem' },
  ]);

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

  setFilter(filter: 'all' | 'Contratado' | 'Em Negociação' | 'Favorites') {
    this.currentFilter.set(filter);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  toggleFavorite(id: number) {
    this.vendors.update(list =>
      list.map(vendor => vendor.id === id ? { ...vendor, isFavorite: !vendor.isFavorite } : vendor)
    );
  }

  changeStatus(id: number, newStatus: VendorStatus) {
    this.vendors.update(list =>
      list.map(vendor => vendor.id === id ? { ...vendor, status: newStatus } : vendor)
    );
  }
}
