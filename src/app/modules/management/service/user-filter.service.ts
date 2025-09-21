import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserFilterService {

  searchField = signal<string>('');  // Búsqueda por nombre o correo
  roleField = signal<string>('');    // Filtrar por rol del usuario
  orderField = signal<string>('1');   // Ordenar la lista de usuarios

  constructor() {}

  setSearch(value: string) {
    this.searchField.set(value);
  }

  setRole(value: string) {
    this.roleField.set(value);
  }

  setOrder(value: string) {
    this.orderField.set(value);
  }
}
