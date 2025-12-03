import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FAQ } from '../../../../models/faq.model';

@Component({
    selector: '[app-faq-row]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './faq-row.component.html',
    styleUrl: './faq-row.component.scss'
})
export class FAQRowComponent {
    @Input() faq!: FAQ;
    @Output() editFAQ = new EventEmitter<FAQ>();
    @Output() deleteFAQ = new EventEmitter<number>();

    onEdit(): void {
        this.editFAQ.emit(this.faq);
    }

    onDelete(): void {
        if (confirm('¿Estás seguro de que quieres eliminar esta FAQ?')) {
            this.deleteFAQ.emit(this.faq.id);
        }
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
