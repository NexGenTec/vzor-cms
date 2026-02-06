import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SolutionTabFilterService {
  searchField = signal<string>('');

  constructor() { }
}


