import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterProjectService {
  searchField = signal<string>('');
  categoryField = signal<string>('');
  statusField = signal<string>('');
  orderField = signal<string>('');

  constructor() {}

  setSearchField(value: string) {
    this.searchField.set(value);
  }

  setCategoryField(value: string) {
    this.categoryField.set(value);
  }

  setStatusField(value: string) {
    this.statusField.set(value);
  }

  setOrderField(value: string) {
    this.orderField.set(value);
  }
}
