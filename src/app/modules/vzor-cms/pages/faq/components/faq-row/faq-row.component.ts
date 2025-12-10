import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FAQ } from '../../../../models/faq.model';
import { ConfirmModalComponent } from '../../../../components/confirm-modal/confirm-modal.component';

@Component({
    selector: '[app-faq-row]',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmModalComponent],
    templateUrl: './faq-row.component.html',
    styleUrl: './faq-row.component.scss'
})
export class FAQRowComponent {
    @Input() faq!: FAQ;
    @Output() editFAQ = new EventEmitter<FAQ>();
    @Output() deleteFAQ = new EventEmitter<string>();
    @Output() viewFAQ = new EventEmitter<FAQ>();

    showDeleteModal = false;

    onEdit(): void {
        this.editFAQ.emit(this.faq);
    }

    onView(): void {
        this.viewFAQ.emit(this.faq);
    }

    onDelete(): void {
        this.showDeleteModal = true;
    }

    confirmDelete(): void {
        this.deleteFAQ.emit(this.faq.id);
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
