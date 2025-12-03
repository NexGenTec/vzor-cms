import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-platform-action',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './platform-action.component.html',
    styleUrl: './platform-action.component.scss'
})
export class PlatformActionComponent {
    @Input() totalPlatforms = 0;
    @Output() searchChange = new EventEmitter<string>();
    @Output() statusChange = new EventEmitter<string>();

    onSearchChange(event: any) {
        this.searchChange.emit(event.target.value);
    }

    onStatusChange(event: any) {
        this.statusChange.emit(event.target.value);
    }
}
