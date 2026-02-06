import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ClientFilterService {
    searchField = signal<string>('');
    statusField = signal<string>('Todas');

    constructor() { }
}
