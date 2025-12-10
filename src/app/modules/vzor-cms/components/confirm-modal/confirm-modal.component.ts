import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-modal.component.html',
    styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
    @Input() isOpen = false;
    @Input() title = 'Confirmar eliminación';
    @Input() message = '¿Estás seguro de que quieres eliminar este elemento?';
    @Input() confirmText = 'Eliminar';
    @Input() cancelText = 'Cancelar';
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
        this.isOpen = false;
    }

    onCancel(): void {
        this.cancel.emit();
        this.isOpen = false;
    }

    onBackdropClick(): void {
        this.onCancel();
    }
}

