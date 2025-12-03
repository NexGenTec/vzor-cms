import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-partner-action',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './partner-action.component.html',
    styleUrl: './partner-action.component.scss'
})
export class PartnerActionComponent {
    @Input() totalPartners = 0;
    @Output() searchChange = new EventEmitter<string>();
    @Output() statusChange = new EventEmitter<string>();

    onSearchChange(event: any) {
        this.searchChange.emit(event.target.value);
    }

    onStatusChange(event: any) {
        this.statusChange.emit(event.target.value);
    }
}
