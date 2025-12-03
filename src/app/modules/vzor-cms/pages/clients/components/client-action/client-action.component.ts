import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-client-action',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './client-action.component.html',
    styleUrl: './client-action.component.scss'
})
export class ClientActionComponent {
    @Input() totalClients = 0;
    @Output() searchChange = new EventEmitter<string>();
    @Output() statusChange = new EventEmitter<string>();

    onSearchChange(event: any) {
        this.searchChange.emit(event.target.value);
    }

    onStatusChange(event: any) {
        this.statusChange.emit(event.target.value);
    }
}
