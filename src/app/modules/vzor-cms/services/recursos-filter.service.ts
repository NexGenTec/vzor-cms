import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecursosFilterService {
  searchField = signal<string>('');
  categoryField = signal<string>('Todas');
  typeField = signal<string>('Todas');

  constructor() {}
}
