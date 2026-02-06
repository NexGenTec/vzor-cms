import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Partner } from '../../../../models/partner.model';

@Component({
    selector: '[app-partner-row]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './partner-row.component.html',
    styleUrl: './partner-row.component.scss'
})
export class PartnerRowComponent {
    @Input() partner!: Partner;
    @Output() editPartner = new EventEmitter<Partner>();
    @Output() deletePartner = new EventEmitter<string>();
    @Output() viewPartner = new EventEmitter<Partner>();

    onEdit(): void {
        this.editPartner.emit(this.partner);
    }

    onView(): void {
        this.viewPartner.emit(this.partner);
    }

    onDelete(): void {
        if (confirm('¿Estás seguro de que quieres eliminar este socio?')) {
            this.deletePartner.emit(this.partner.id);
        }
    }
}
