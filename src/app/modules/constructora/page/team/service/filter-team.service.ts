import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterTeamService {
  searchField = signal<string>('');
  departmentField = signal<string>('');
  statusField = signal<string>('');
  orderField = signal<string>('');

  constructor() {}

  setSearchField(value: string) {
    this.searchField.set(value);
  }

  setDepartmentField(value: string) {
    this.departmentField.set(value);
  }

  setStatusField(value: string) {
    this.statusField.set(value);
  }

  setOrderField(value: string) {
    this.orderField.set(value);
  }
} 