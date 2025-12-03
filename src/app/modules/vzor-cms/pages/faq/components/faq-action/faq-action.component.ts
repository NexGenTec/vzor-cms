import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-faq-action',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq-action.component.html',
    styleUrl: './faq-action.component.scss'
})
export class FAQActionComponent {
    @Input() totalFAQs = 0;
    @Output() searchChange = new EventEmitter<string>();
    @Output() categoryChange = new EventEmitter<string>();
    @Output() statusChange = new EventEmitter<string>();

    onSearchChange(event: any) {
        this.searchChange.emit(event.target.value);
    }

    onCategoryChange(event: any) {
        this.categoryChange.emit(event.target.value);
    }

    onStatusChange(event: any) {
        this.statusChange.emit(event.target.value);
    }
}
