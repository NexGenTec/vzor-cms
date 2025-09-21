import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksFilterService {
  searchField = signal<string>('');
  priorityField = signal<string>('');
  statusField = signal<string>('');
  orderField = signal<string>('');

  constructor() {}
}
