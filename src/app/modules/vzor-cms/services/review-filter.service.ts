import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewFilterService {
  searchField = signal<string>('');
  projectTypeField = signal<string>('Todas');
  ratingField = signal<string>('Todas');

  constructor() {}
}
