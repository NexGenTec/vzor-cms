import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Platform } from '../../../../models/platform.model';

@Component({
    selector: '[app-platform-row]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './platform-row.component.html',
    styleUrl: './platform-row.component.scss'
})
export class PlatformRowComponent {
    @Input() platform!: Platform;
    @Output() editPlatform = new EventEmitter<Platform>();
    @Output() deletePlatform = new EventEmitter<string>();
    @Output() viewPlatform = new EventEmitter<Platform>();

    onEdit(): void {
        this.editPlatform.emit(this.platform);
    }

    onView(): void {
        this.viewPlatform.emit(this.platform);
    }

    onDelete(): void {
        if (confirm('¿Estás seguro de que quieres eliminar esta plataforma?')) {
            this.deletePlatform.emit(this.platform.id);
        }
    }
}
