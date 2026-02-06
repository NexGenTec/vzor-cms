import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[app-client-header]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './client-header.component.html',
    styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent {
    @Output() onCheck = new EventEmitter<boolean>();

    onCheckChange(event: any): void {
        this.onCheck.emit(event.target.checked);
    }
}
