import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../../models/client.model';
import { ConfirmModalComponent } from '../../../../components/confirm-modal/confirm-modal.component';

@Component({
    selector: '[app-client-row]',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmModalComponent],
    templateUrl: './client-row.component.html',
    styleUrl: './client-row.component.scss'
})
export class ClientRowComponent {
    @Input() client!: Client;
    @Output() editClient = new EventEmitter<Client>();
    @Output() deleteClient = new EventEmitter<string>();
    @Output() viewClient = new EventEmitter<Client>();

    showDeleteModal = false;

    onEdit(): void {
        this.editClient.emit(this.client);
    }

    onView(): void {
        this.viewClient.emit(this.client);
    }

    onDelete(): void {
        this.showDeleteModal = true;
    }

    confirmDelete(): void {
        this.deleteClient.emit(this.client.id);
        this.showDeleteModal = false;
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
    }

    getFormattedDate(date: any): Date | null {
        if (!date) return null;
        try {
            if (date instanceof Date) return date;
            if (date && typeof date === 'object' && date.toDate) return date.toDate();
            if (date && typeof date === 'object' && date.seconds) return new Date(date.seconds * 1000);
            if (typeof date === 'string' || typeof date === 'number') return new Date(date);
            return null;
        } catch (error) {
            return null;
        }
    }
}
