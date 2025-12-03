import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[app-platform-header]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './platform-header.component.html',
    styleUrl: './platform-header.component.scss'
})
export class PlatformHeaderComponent {
    @Output() onCheck = new EventEmitter<boolean>();

    onCheckChange(event: any): void {
        this.onCheck.emit(event.target.checked);
    }
}
