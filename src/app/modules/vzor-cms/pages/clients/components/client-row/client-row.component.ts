import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../../models/client.model';

@Component({
    selector: '[app-client-row]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './client-row.component.html',
    styleUrl: './client-row.component.scss'
})
export class ClientRowComponent {
    @Input() client!: Client;
    @Output() editClient = new EventEmitter<Client>();
    @Output() deleteClient = new EventEmitter<string>();
    @Output() viewClient = new EventEmitter<Client>();

    onEdit(): void {
        this.editClient.emit(this.client);
    }

    onView(): void {
        this.viewClient.emit(this.client);
    }

    onDelete(): void {
        if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            this.deleteClient.emit(this.client.id);
        }
    }
}
