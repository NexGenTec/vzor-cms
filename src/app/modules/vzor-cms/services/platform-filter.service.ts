import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PlatformFilterService {
    searchField = signal<string>('');
    statusField = signal<string>('Todas');

    constructor() { }
}
