import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[app-partner-header]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './partner-header.component.html',
    styleUrl: './partner-header.component.scss'
})
export class PartnerHeaderComponent {
    @Output() onCheck = new EventEmitter<boolean>();

    onCheckChange(event: any): void {
        this.onCheck.emit(event.target.checked);
    }
}
