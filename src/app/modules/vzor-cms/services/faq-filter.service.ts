import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FAQFilterService {
    searchField = signal<string>('');
    categoryField = signal<string>('Todas');
    statusField = signal<string>('Todas');

    constructor() { }
}
