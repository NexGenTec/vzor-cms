import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[app-faq-header]',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './faq-header.component.html',
    styleUrl: './faq-header.component.scss'
})
export class FAQHeaderComponent {
    @Output() onCheck = new EventEmitter<boolean>();

    onCheckChange(event: any): void {
        this.onCheck.emit(event.target.checked);
    }
}
