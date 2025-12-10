import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { Recurso } from '../../../../models/recursos.model';
import { ConfirmModalComponent } from '../../../../components/confirm-modal/confirm-modal.component';

@Component({
    selector: '[app-recursos-row]',
    standalone: true,
    imports: [CommonModule, FormsModule, AngularSvgIconModule, ConfirmModalComponent],
    templateUrl: './recursos-row.component.html',
    styleUrl: './recursos-row.component.scss'
})
export class RecursosRowComponent {
    @Input() recurso!: Recurso;
    @Output() editRecurso = new EventEmitter<Recurso>();
    @Output() deleteRecurso = new EventEmitter<number>();

    showDeleteModal = false;

    constructor(private router: Router) { }

    onEdit(): void {
        this.editRecurso.emit(this.recurso);
    }

    onDelete(): void {
        this.showDeleteModal = true;
    }

    confirmDelete(): void {
        this.deleteRecurso.emit(this.recurso.id);
        this.showDeleteModal = false;
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
    }

    viewRecurso(id: number): void {
        this.router.navigate(['/layout/vzor-cms/recursos', id]);
        toast.info(`Viendo recurso: ${this.recurso.title}`);
    }

    getTypeIcon(type: string): string {
        const icons: Record<string, string> = {
            'Documento': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            'Imagen': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
            'Video': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
        };
        return icons[type] || icons['Documento'];
    }

    getTypeColor(type: string): string {
        const colors: Record<string, string> = {
            'Documento': 'blue',
            'Imagen': 'green',
            'Video': 'purple'
        };
        return colors[type] || 'gray';
    }

    getFormattedDate(date: any): Date | null {
        if (!date) return null;

        try {
            if (date instanceof Date) {
                return date;
            } else if (date && typeof date === 'object' && date.toDate) {
                return date.toDate();
            } else if (date && typeof date === 'object' && date.seconds) {
                return new Date(date.seconds * 1000);
            } else if (typeof date === 'string' || typeof date === 'number') {
                return new Date(date);
            }
            return null;
        } catch (error) {
            console.warn('Error converting date:', date, error);
            return null;
        }
    }
}
